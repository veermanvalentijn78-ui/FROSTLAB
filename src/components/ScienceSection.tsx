import React, { useState } from 'react';
import { Eye, Flame, Layers, ShieldCheck, Thermometer, Wind } from 'lucide-react';

export const ScienceSection: React.FC = () => {
  const [sliderPos, setSliderPos] = useState<number>(50);

  return (
    <section id="science" className="relative py-20 bg-[#0d1016] border-y border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-mono-nums text-[#00f2fe]">
            <span>THERMAL TEXTILE ENGINEERING</span>
            <span aria-hidden="true" className="text-white/20">·</span>
            <span>PHASE TRANSITION DYNAMICS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white mt-2 leading-tight">
            The science behind temperature-reactive apparel.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed font-light">
            Each Frostlab balaclava is woven with micro-encapsulated liquid crystals and chiral nematic dyes. At resting sub-zero temperatures, the molecules absorb light wavelengths in dark charcoal frequencies. The moment human skin or palm warmth crosses 28°C (82°F), the crystal helix untwists, reflecting hyper-vivid thermal bands.
          </p>
        </div>

        {/* Interactive Interactive Cold vs Hot Split Slider */}
        <div className="mt-12 relative rounded-2xl overflow-hidden border border-white/15 bg-black/60 shadow-2xl">
          <div className="relative h-80 sm:h-96 w-full select-none overflow-hidden">
            {/* Cold State (Left) */}
            <div className="absolute inset-0 bg-[#161a22] flex items-center justify-center">
              <img
                src="/src/assets/images/frostlab_thermo_product_1790684324606.jpg"
                alt="Cold Resting Balaclava"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover filter brightness-[0.7] grayscale-[0.8]"
              />
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 text-xs font-mono-nums text-slate-300">
                <span>❄️ Resting Mountain State (-15°C)</span>
              </div>
            </div>

            {/* Warm Heat State (Right) with clip-path based on sliderPos */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
            >
              <img
                src="/src/assets/images/frostlab_thermo_product_1790684324606.jpg"
                alt="Heat Reactive Balaclava"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover filter contrast-[1.15]"
              />
              <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#00f2fe]/40 text-xs font-mono-nums text-[#00f2fe]">
                <span>✋ Human Touch Reaction (+37°C)</span>
              </div>
            </div>

            {/* Split Divider Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-[#00f2fe] cursor-ew-resize flex items-center justify-center shadow-[0_0_15px_rgba(0,242,254,0.8)]"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-[#00f2fe] text-black font-bold flex items-center justify-center shadow-lg text-xs">
                ⇄
              </div>
            </div>

            {/* Native Slider Input Overlay */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={(e) => setSliderPos(parseInt(e.target.value))}
              aria-label="Thermal comparison slider"
              className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full"
            />
          </div>

          <div className="p-4 bg-[#0a0d12] flex items-center justify-between text-xs font-mono-nums text-slate-400">
            <span>Slide left/right to compare Sub-Zero vs Touch Reaction</span>
            <span className="text-[#00f2fe]">Split: {sliderPos}%</span>
          </div>
        </div>

        {/* 3 Technical Architecture Columns */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-[#12161f] border border-white/10 hover:border-white/20 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#00f2fe]/10 text-[#00f2fe] flex items-center justify-center mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">
              01. 4-Layer Composite Weave
            </h3>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              Constructed with a DWR hydrophobic exterior shell, an embedded micro-pigment transfer membrane, a thermal windbreak middle layer, and brushed skin-contact hypoallergenic merino fleece.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#12161f] border border-white/10 hover:border-white/20 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#00f2fe]/10 text-[#00f2fe] flex items-center justify-center mb-4">
              <Thermometer className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">
              02. 90-Second Heat Retention
            </h3>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              A touch or hand pressed onto the fabric leaves a distinctive high-definition thermal imprint that persists for up to 90 seconds before cooling naturally back into deep mountain shadows.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#12161f] border border-white/10 hover:border-white/20 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#00f2fe]/10 text-[#00f2fe] flex items-center justify-center mb-4">
              <Wind className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">
              03. Anti-Fog Respiration Port
            </h3>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              Micro laser-cut geometric vents across the mouth and nasal bridge deflect warm exhalations downward and away from your ski goggle lens seal, eliminating condensation at speeds up to 95 km/h.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
