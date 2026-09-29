import React, { useState } from 'react';
import { Box, Check, Flame, ShieldAlert, ShoppingBag, X } from 'lucide-react';
import { Product, Size } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: Size, quantity: number) => void;
  onInspect3D: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onInspect3D,
}) => {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<Size>(product.sizes[0] || 'S/M');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isThermoActive, setIsThermoActive] = useState<boolean>(false);
  const [isAdded, setIsAdded] = useState<boolean>(false);

  const images = [
    { url: product.primaryImage, title: 'Studio Flat' },
    { url: product.modelImage || product.primaryImage, title: 'Alpine Field Test' },
  ];

  const handleAdd = () => {
    onAddToCart(product, selectedSize, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
      <div
        className="relative w-full max-w-4xl bg-[#12161f] border border-white/15 rounded-2xl shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 hover:bg-black text-slate-300 hover:text-white border border-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Visual Gallery + Interactive Thermo Switcher */}
          <div className="relative bg-[#0d1016] p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10">
            {/* Main Stage */}
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black/40">
              <img
                src={images[activeImageIndex].url}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-all duration-300"
              />

              {/* Thermal Heat Simulation Layer */}
              <div
                className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
                  isThermoActive ? 'opacity-90' : 'opacity-0'
                }`}
                style={{
                  background: `radial-gradient(circle at 50% 65%, ${product.warmHex} 0%, ${product.warmHex}80 40%, transparent 75%)`,
                  mixBlendMode: 'color-dodge',
                }}
              />

              {/* Thermal activation pill */}
              {isThermoActive && (
                <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-[#00f2fe]/40 text-[#00f2fe] text-xs font-mono-nums flex items-center gap-1.5 shadow-lg">
                  <Flame className="w-3.5 h-3.5" />
                  <span>37°C Thermal Handprint Active</span>
                </div>
              )}
            </div>

            {/* Interactive Color Shift Simulation Controls */}
            <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between text-xs font-mono-nums text-slate-300 mb-2">
                <span>Thermo Simulation:</span>
                <span className="text-[#00f2fe]">{isThermoActive ? 'Warm (+37°C)' : 'Sub-Zero (-10°C)'}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setIsThermoActive(false)}
                  className={`py-1.5 text-xs font-medium rounded-lg border transition-all ${
                    !isThermoActive
                      ? 'bg-white/15 text-white border-white/30'
                      : 'text-slate-400 border-white/10 hover:border-white/20'
                  }`}
                >
                  ❄️ Resting Cold
                </button>
                <button
                  onClick={() => setIsThermoActive(true)}
                  className={`py-1.5 text-xs font-medium rounded-lg border transition-all ${
                    isThermoActive
                      ? 'bg-[#00f2fe]/20 text-[#00f2fe] border-[#00f2fe]/50'
                      : 'text-slate-400 border-white/10 hover:border-white/20'
                  }`}
                >
                  ✋ Apply Handprint
                </button>
              </div>
            </div>

            {/* Inspect in 3D Button */}
            <button
              onClick={() => {
                onClose();
                onInspect3D(product);
              }}
              className="mt-3 w-full py-2.5 px-4 text-xs font-semibold text-white bg-white/10 hover:bg-white/15 rounded-xl border border-white/15 transition-all flex items-center justify-center gap-2"
            >
              <Box className="w-4 h-4 text-[#00f2fe]" />
              <span>Launch in 3D Interactive Lab</span>
            </button>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div>
              {/* Category / Code */}
              <div className="flex items-center gap-2 text-xs font-mono-nums text-[#00f2fe]">
                <span>{product.code}</span>
                <span className="text-white/20">·</span>
                <span className="text-slate-400 uppercase">{product.category}</span>
              </div>

              {/* Title & Tagline */}
              <h2 className="mt-1 text-2xl font-display font-bold text-white">
                {product.name}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {product.tagline}
              </p>

              {/* Price & Rating */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-2xl font-bold font-mono-nums text-white">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-sm font-mono-nums text-slate-500 line-through">
                    ${product.originalPrice}
                  </span>
                )}
                <span className="text-xs font-mono-nums text-emerald-400 ml-auto">
                  ✓ In Stock & Ready for Ski-Drop
                </span>
              </div>

              {/* Description */}
              <p className="mt-4 text-xs text-slate-300 leading-relaxed">
                {product.description}
              </p>

              {/* Size Selector */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-300 font-medium">Select Alpine Size:</span>
                  <span className="text-slate-400 text-[11px]">Unisex Anatomical Fit</span>
                </div>
                <div className="flex gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`flex-1 py-2 text-xs font-mono-nums rounded-lg border transition-all ${
                        selectedSize === size
                          ? 'bg-white/20 text-white border-[#00f2fe] shadow-sm'
                          : 'text-slate-400 border-white/10 hover:border-white/20'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Technical Specifications Matrix */}
              <div className="mt-6 pt-4 border-t border-white/10 text-[11px] font-mono-nums space-y-1.5 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Temp Range:</span>
                  <span className="text-white">{product.specs.temperatureRange}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Thermal Threshold:</span>
                  <span className="text-[#00f2fe]">{product.tempThreshold}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Weatherproof:</span>
                  <span className="text-white">{product.specs.weatherproof}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Weight:</span>
                  <span className="text-white">{product.specs.weight}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions: Quantity + Add to Cart */}
            <div className="pt-4 border-t border-white/10 flex items-center gap-3">
              {/* Quantity Stepper */}
              <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-white"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-mono-nums text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-white"
                >
                  +
                </button>
              </div>

              {/* Buy CTA */}
              <button
                onClick={handleAdd}
                className={`flex-1 py-3 px-6 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  isAdded
                    ? 'bg-emerald-500 text-black'
                    : 'bg-[#00f2fe] hover:bg-[#38f9d7] text-black shadow-lg shadow-[#00f2fe]/20 active:scale-98'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Added to Ski Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag · ${(product.price * quantity).toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
