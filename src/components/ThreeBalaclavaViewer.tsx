import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Product } from '../types';

interface ThreeBalaclavaViewerProps {
  selectedProduct: Product;
  onSelectProduct?: (product: Product) => void;
  availableProducts: Product[];
  onAddToCart?: (product: Product) => void;
}

export const ThreeBalaclavaViewer: React.FC<ThreeBalaclavaViewerProps> = ({
  selectedProduct,
  onSelectProduct,
  availableProducts,
  onAddToCart,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [ambientTemp, setAmbientTemp] = useState<number>(-8); // Alpine sub-zero default
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [showSnow, setShowSnow] = useState<boolean>(true);
  const [heatStrength, setHeatStrength] = useState<number>(0);
  const [lastPunched, setLastPunched] = useState<string>('Drag or click anywhere on the 3D mask to apply body heat');
  const [viewAngle, setViewAngle] = useState<'front' | 'angle' | 'side'>('angle');

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const balaclavaMeshRef = useRef<THREE.Group | null>(null);
  const snowParticlesRef = useRef<THREE.Points | null>(null);
  const thermoCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const thermoTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const isPointerDownRef = useRef<boolean>(false);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());

  // Setup offscreen canvas for dynamic thermochromic heat painting
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = selectedProduct.coldHex;
      ctx.fillRect(0, 0, 512, 512);
    }
    thermoCanvasRef.current = canvas;
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    thermoTextureRef.current = texture;
  }, []);

  // Update canvas background when colorway or temperature changes
  const redrawThermoTexture = (heatBoost = 0) => {
    const canvas = thermoCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check effective temp: baseline ambient + heat boost
    const effectiveTemp = ambientTemp + heatBoost * 35;
    const transitionRatio = Math.min(Math.max((effectiveTemp - 15) / 15, 0), 1);

    // Interpolate base background color
    const coldColor = new THREE.Color(selectedProduct.coldHex);
    const warmColor = new THREE.Color(selectedProduct.warmHex);
    const currentColor = coldColor.clone().lerp(warmColor, transitionRatio);

    // Soft fade previous heat drawings
    ctx.fillStyle = `rgba(${Math.round(currentColor.r * 255)}, ${Math.round(currentColor.g * 255)}, ${Math.round(currentColor.b * 255)}, 0.05)`;
    ctx.fillRect(0, 0, 512, 512);

    // If camo pattern, draw subtle technical pattern overlay
    if (selectedProduct.texturePattern === 'camo') {
      ctx.save();
      ctx.globalAlpha = 0.15;
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;
      for (let i = 0; i < 15; i++) {
        const x = (i * 37) % 512;
        const y = (i * 53) % 512;
        ctx.beginPath();
        ctx.arc(x, y, 25, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }

    if (thermoTextureRef.current) {
      thermoTextureRef.current.needsUpdate = true;
    }
  };

  // Stamp a thermal heat handprint / finger touch on texture
  const paintHeatOnUV = (u: number, v: number, intensity = 1.0) => {
    const canvas = thermoCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const x = u * 512;
    const y = (1 - v) * 512;

    const warmHex = selectedProduct.warmHex;

    // Create radial heat gradient (mimicking real thermo handprint)
    const gradient = ctx.createRadialGradient(x, y, 4, x, y, 65);
    gradient.addColorStop(0, warmHex);
    gradient.addColorStop(0.3, warmHex);
    gradient.addColorStop(0.7, `${warmHex}99`);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.save();
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, 65, 0, Math.PI * 2);
    ctx.fill();

    // Secondary smaller heat imprint (like palm + fingers)
    const fingerG = ctx.createRadialGradient(x + 25, y - 25, 2, x + 25, y - 25, 30);
    fingerG.addColorStop(0, warmHex);
    fingerG.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = fingerG;
    ctx.beginPath();
    ctx.arc(x + 25, y - 25, 30, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    if (thermoTextureRef.current) {
      thermoTextureRef.current.needsUpdate = true;
    }
  };

  // Full reset / cool down balaclava to ambient
  const coolDownMask = () => {
    const canvas = thermoCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = selectedProduct.coldHex;
    ctx.fillRect(0, 0, 512, 512);

    if (thermoTextureRef.current) {
      thermoTextureRef.current.needsUpdate = true;
    }
    setHeatStrength(0);
    setLastPunched('Sub-zero freeze applied. Fabric cooled to ' + ambientTemp + '°C');
  };

  // Apply full thermal handprint
  const applyHandprintPreset = () => {
    paintHeatOnUV(0.5, 0.42, 1);
    paintHeatOnUV(0.48, 0.58, 1);
    paintHeatOnUV(0.55, 0.38, 1);
    setHeatStrength(1);
    setLastPunched('37°C Thermal Handprint imprinted! Micro-crystals activated.');
  };

  // Three.js Scene Initialization
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 560;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2('#0b0d10', 0.04);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.3, 4.2);
    cameraRef.current = camera;

    // 3. Renderer with high DPR and shadows
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Studio Lighting (Key, Fill, Rim)
    const ambientLight = new THREE.AmbientLight('#a0aec0', 0.8);
    scene.add(ambientLight);

    // Warm Key Light
    const keyLight = new THREE.DirectionalLight('#ffffff', 1.8);
    keyLight.position.set(3, 4, 4);
    scene.add(keyLight);

    // Cool Alpine Fill Light
    const fillLight = new THREE.DirectionalLight('#7dd3fc', 1.0);
    fillLight.position.set(-4, -1, 3);
    scene.add(fillLight);

    // Crisp Blue/Cyan Rim Light (separates dark techwear from background)
    const rimLight = new THREE.DirectionalLight('#00f2fe', 2.2);
    rimLight.position.set(0, 3, -4);
    scene.add(rimLight);

    // Top Down Light
    const topLight = new THREE.PointLight('#ffffff', 1.2, 10);
    topLight.position.set(0, 4, 1);
    scene.add(topLight);

    // 5. Build High-End 3D Balaclava Group
    const balaclavaGroup = new THREE.Group();
    balaclavaMeshRef.current = balaclavaGroup;
    scene.add(balaclavaGroup);

    // Material with thermo texture
    const balaclavaMaterial = new THREE.MeshStandardMaterial({
      map: thermoTextureRef.current,
      roughness: 0.72,
      metalness: 0.12,
      bumpScale: 0.05,
    });
    materialRef.current = balaclavaMaterial;

    // A. Head Dome & Face Sculpt (lathe/sphere anatomical profile)
    const headGeom = new THREE.SphereGeometry(1.0, 48, 48);
    // Deform sphere to create human cranial and jaw form
    const pos = headGeom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);

      // Elongate vertically slightly and taper chin
      const yNorm = (y + 1.0) / 2.0;
      let newX = x * (0.88 + yNorm * 0.15);
      let newY = y * 1.18;
      let newZ = z * (0.92 + (1.0 - yNorm) * 0.1);

      // Chin and jaw protrusion
      if (y < -0.2 && z > 0) {
        newZ += 0.15 * Math.sin(Math.abs(y));
        newX *= 0.85;
      }
      // Eye recess
      if (y > 0.05 && y < 0.35 && z > 0.6) {
        newZ -= 0.08 * (1.0 - Math.abs(x) * 1.5);
      }

      pos.setXYZ(i, newX, newY, newZ);
    }
    headGeom.computeVertexNormals();
    const headMesh = new THREE.Mesh(headGeom, balaclavaMaterial);
    headMesh.name = 'head-mask';
    balaclavaGroup.add(headMesh);

    // B. Neck & Chest Drape (Cowl Collar)
    const neckGeom = new THREE.CylinderGeometry(0.85, 1.35, 1.2, 48, 16, true);
    const neckPos = neckGeom.attributes.position;
    for (let i = 0; i < neckPos.count; i++) {
      const x = neckPos.getX(i);
      const y = neckPos.getY(i);
      const z = neckPos.getZ(i);

      // Flare out at chest
      const flare = Math.max(0, -y);
      neckPos.setXYZ(i, x * (1 + flare * 0.3), y, z * (1 + flare * 0.45));
    }
    neckGeom.computeVertexNormals();
    const neckMesh = new THREE.Mesh(neckGeom, balaclavaMaterial);
    neckMesh.position.y = -1.2;
    balaclavaGroup.add(neckMesh);

    // C. Iconic Ski Balaclava Eye Port Aperture (Dark interior cavity & trim)
    const eyeRimGeom = new THREE.TorusGeometry(0.38, 0.045, 16, 48, Math.PI * 1.1);
    const rimMat = new THREE.MeshStandardMaterial({
      color: '#0d0f12',
      roughness: 0.5,
      metalness: 0.3,
    });
    const eyeRimMesh = new THREE.Mesh(eyeRimGeom, rimMat);
    eyeRimMesh.position.set(0, 0.22, 0.94);
    eyeRimMesh.rotation.x = Math.PI * 0.08;
    eyeRimMesh.scale.set(1.5, 0.65, 1);
    balaclavaGroup.add(eyeRimMesh);

    // Eye Slit Cavity Interior (recessed black shadow mesh)
    const eyeCavityGeom = new THREE.BoxGeometry(0.9, 0.28, 0.1);
    const eyeCavityMat = new THREE.MeshBasicMaterial({ color: '#050709' });
    const eyeCavityMesh = new THREE.Mesh(eyeCavityGeom, eyeCavityMat);
    eyeCavityMesh.position.set(0, 0.22, 0.9);
    balaclavaGroup.add(eyeCavityMesh);

    // D. Subtle Technical Seam Ribs (flatlock stitched seams along center forehead and neck)
    const seamGeom = new THREE.TorusGeometry(1.02, 0.015, 8, 48, Math.PI * 0.8);
    const seamMat = new THREE.MeshStandardMaterial({ color: '#16191f', roughness: 0.8 });
    const seamMesh = new THREE.Mesh(seamGeom, seamMat);
    seamMesh.rotation.y = Math.PI / 2;
    seamMesh.position.y = 0.1;
    balaclavaGroup.add(seamMesh);

    // E. 3D Snow Particle Storm Atmosphere
    const snowCount = 450;
    const snowGeom = new THREE.BufferGeometry();
    const snowPositions = new Float32Array(snowCount * 3);
    const snowVelocities = new Float32Array(snowCount * 3);

    for (let i = 0; i < snowCount; i++) {
      snowPositions[i * 3] = (Math.random() - 0.5) * 8;
      snowPositions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      snowPositions[i * 3 + 2] = (Math.random() - 0.5) * 8;

      snowVelocities[i * 3] = -0.005 - Math.random() * 0.01;
      snowVelocities[i * 3 + 1] = -0.015 - Math.random() * 0.02;
      snowVelocities[i * 3 + 2] = -0.005 - Math.random() * 0.01;
    }

    snowGeom.setAttribute('position', new THREE.BufferAttribute(snowPositions, 3));
    const snowMat = new THREE.PointsMaterial({
      color: '#ffffff',
      size: 0.035,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const snowParticles = new THREE.Points(snowGeom, snowMat);
    snowParticlesRef.current = snowParticles;
    scene.add(snowParticles);

    // Initial positioning
    balaclavaGroup.position.y = 0.1;
    balaclavaGroup.rotation.y = -Math.PI * 0.15;

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Subtle breathing float
      if (balaclavaGroup) {
        if (isRotating && !isPointerDownRef.current) {
          balaclavaGroup.rotation.y += delta * 0.45;
        }
        balaclavaGroup.position.y = 0.1 + Math.sin(clock.getElapsedTime() * 1.5) * 0.03;
      }

      // Snow particle movement
      if (snowParticles && showSnow) {
        const positions = snowParticles.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < snowCount; i++) {
          positions[i * 3 + 1] -= 0.02; // fall down
          positions[i * 3] += 0.004 * Math.sin(clock.getElapsedTime() + i); // drift

          if (positions[i * 3 + 1] < -4) {
            positions[i * 3 + 1] = 4;
            positions[i * 3] = (Math.random() - 0.5) * 8;
          }
        }
        snowParticles.geometry.attributes.position.needsUpdate = true;
      }

      // Smooth camera interpolation
      if (cameraRef.current) {
        let targetX = 0;
        let targetY = 0.2;
        let targetZ = 4.2;

        if (viewAngle === 'side') {
          targetX = 3.2;
          targetZ = 2.4;
        } else if (viewAngle === 'front') {
          targetX = 0;
          targetZ = 3.8;
        } else if (viewAngle === 'angle') {
          targetX = 1.4;
          targetZ = 4.0;
        }

        cameraRef.current.position.x += (targetX - cameraRef.current.position.x) * 0.05;
        cameraRef.current.position.y += (targetY - cameraRef.current.position.y) * 0.05;
        cameraRef.current.position.z += (targetZ - cameraRef.current.position.z) * 0.05;
        cameraRef.current.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight || 560;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    // WebGL Context Lost / Restored Protection
    const canvasElement = renderer.domElement;
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      console.warn('WebGL Context Lost. Awaiting restoration...');
    };
    const handleContextRestored = () => {
      console.info('WebGL Context Restored.');
    };
    canvasElement.addEventListener('webglcontextlost', handleContextLost);
    canvasElement.addEventListener('webglcontextrestored', handleContextRestored);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvasElement.removeEventListener('webglcontextlost', handleContextLost);
      canvasElement.removeEventListener('webglcontextrestored', handleContextRestored);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update material map & colors when selected product changes
  useEffect(() => {
    redrawThermoTexture();
  }, [selectedProduct, ambientTemp]);

  // Pointer drag & touch heat painting handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isPointerDownRef.current = true;
    handlePointerMove(e);
  };

  const handlePointerUp = () => {
    isPointerDownRef.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!mountRef.current || !cameraRef.current || !sceneRef.current) return;
    const rect = mountRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    mouseRef.current.set(x, y);
    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);

    if (balaclavaMeshRef.current) {
      const intersects = raycasterRef.current.intersectObjects(
        balaclavaMeshRef.current.children,
        true
      );

      if (intersects.length > 0) {
        const hit = intersects[0];
        if (hit.uv) {
          paintHeatOnUV(hit.uv.x, hit.uv.y, 0.8);
          setHeatStrength((prev) => Math.min(prev + 0.1, 1));
          setLastPunched(
            `Thermal Contact at (${Math.round(hit.point.x * 100)}cm, ${Math.round(
              hit.point.y * 100
            )}cm) — Micro-encapsulated Dye Activated`
          );
        }
      } else if (isPointerDownRef.current) {
        // Drag to orbit if pointer is dragging in empty space
        balaclavaMeshRef.current.rotation.y += e.movementX * 0.01;
      }
    }
  };

  return (
    <div className="relative w-full rounded-2xl bg-gradient-to-b from-[#12161e] via-[#0d1016] to-[#080a0d] border border-white/10 overflow-hidden shadow-2xl">
      {/* Top HUD: Title, Status, and Colorway Selector */}
      <div className="absolute top-0 inset-x-0 z-20 flex flex-wrap items-center justify-between gap-4 p-4 md:p-6 bg-gradient-to-b from-[#0b0d10]/90 to-transparent backdrop-blur-xs pointer-events-none">
        <div className="pointer-events-auto">
          <div className="flex items-center gap-2 text-xs font-mono-nums text-[#00f2fe]">
            <span className="inline-block w-2 h-2 rounded-full bg-[#00f2fe] animate-pulse" />
            <span>3D INTERACTIVE THERMAL LAB</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400">WebGL 2.0</span>
          </div>
          <h2 className="text-xl md:text-2xl font-display font-extrabold text-white mt-1">
            {selectedProduct.name}
          </h2>
          <p className="text-xs text-slate-400 max-w-md mt-0.5">
            Touch or drag across the 3D hood to imprint body warmth. Micro-capsules react at {selectedProduct.tempThreshold}.
          </p>
        </div>

        {/* Quick Colorway Switcher */}
        <div className="flex items-center gap-2 pointer-events-auto bg-black/40 backdrop-blur-md p-1.5 rounded-xl border border-white/10">
          {availableProducts.slice(0, 5).map((prod) => (
            <button
              key={prod.id}
              onClick={() => onSelectProduct && onSelectProduct(prod)}
              title={`${prod.name} (${prod.baseColor} to ${prod.thermoColor})`}
              className={`group relative p-1.5 rounded-lg transition-all ${
                selectedProduct.id === prod.id
                  ? 'bg-white/15 ring-2 ring-[#00f2fe]'
                  : 'hover:bg-white/5 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center gap-1">
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-xs"
                  style={{ backgroundColor: prod.coldHex }}
                />
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-xs"
                  style={{ backgroundColor: prod.warmHex }}
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main 3D Canvas Mount */}
      <div
        ref={mountRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
        className="w-full h-[520px] md:h-[620px] cursor-grab active:cursor-grabbing touch-none select-none"
      />

      {/* Interactive Floating Thermo Controls HUD */}
      <div className="absolute bottom-4 inset-x-4 md:inset-x-6 z-20 flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/10">
        {/* Left: Real-time Thermo Simulation Sliders */}
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          {/* Ambient Temperature Slider */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono-nums text-slate-400 whitespace-nowrap">
              Alpine Temp:
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono-nums text-[#00f2fe] font-semibold w-12">
                {ambientTemp > 0 ? `+${ambientTemp}°C` : `${ambientTemp}°C`}
              </span>
              <input
                type="range"
                min="-20"
                max="35"
                value={ambientTemp}
                onChange={(e) => setAmbientTemp(parseInt(e.target.value))}
                className="w-24 md:w-32 accent-[#00f2fe] cursor-pointer"
              />
            </div>
          </div>

          <div className="h-4 w-[1px] bg-white/10 hidden md:block" />

          {/* Quick Heat / Freeze Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={applyHandprintPreset}
              className="px-3 py-1.5 text-xs font-medium text-white bg-white/10 hover:bg-white/20 rounded-lg border border-white/10 transition-colors flex items-center gap-1.5"
            >
              <span>✋ Apply Handprint</span>
            </button>
            <button
              onClick={coolDownMask}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors flex items-center gap-1.5"
            >
              <span>❄️ Freeze (-15°C)</span>
            </button>
          </div>
        </div>

        {/* Center: Live feedback micro-ticker */}
        <div className="text-[11px] font-mono-nums text-slate-300 truncate max-w-xs text-center hidden lg:block">
          {lastPunched}
        </div>

        {/* Right: Camera Angles, Snow Storm Toggle & Add to Bag CTA */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {/* Angle buttons */}
          <div className="flex items-center p-1 bg-white/5 rounded-lg border border-white/10 text-xs">
            <button
              onClick={() => setViewAngle('front')}
              className={`px-2 py-1 rounded transition-colors ${
                viewAngle === 'front' ? 'bg-[#00f2fe] text-black font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Front
            </button>
            <button
              onClick={() => setViewAngle('angle')}
              className={`px-2 py-1 rounded transition-colors ${
                viewAngle === 'angle' ? 'bg-[#00f2fe] text-black font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              3/4
            </button>
            <button
              onClick={() => setViewAngle('side')}
              className={`px-2 py-1 rounded transition-colors ${
                viewAngle === 'side' ? 'bg-[#00f2fe] text-black font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Profile
            </button>
          </div>

          {/* Blizzard Snow Toggle */}
          <button
            onClick={() => setShowSnow(!showSnow)}
            title="Toggle Blizzard Atmosphere"
            className={`p-2 rounded-lg border transition-colors ${
              showSnow ? 'border-[#00f2fe]/40 text-[#00f2fe] bg-[#00f2fe]/10' : 'border-white/10 text-slate-400 bg-white/5'
            }`}
          >
            ❄️
          </button>

          {/* Quick Add To Bag from 3D Viewport */}
          {onAddToCart && (
            <button
              onClick={() => onAddToCart(selectedProduct)}
              className="px-4 py-2 text-xs font-semibold text-black bg-[#00f2fe] hover:bg-[#38f9d7] rounded-lg shadow-lg shadow-[#00f2fe]/20 transition-all transform active:scale-95 whitespace-nowrap"
            >
              Buy {selectedProduct.name.split(' ')[0]} · ${selectedProduct.price}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
