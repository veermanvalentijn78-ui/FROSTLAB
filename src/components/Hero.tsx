import React from 'react';
import { ArrowDown, Flame, ShieldCheck, ThermometerSnowflake, Wind } from 'lucide-react';
import { RESORT_CONDITIONS } from '../data/products';

interface HeroProps {
  onExplore3D: () => void;
  onShopNow: () => void;
  selectedResortIndex: number;
  onSelectResort: (index: number) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExplore3D,
  onShopNow,
  selectedResortIndex,
  onSelectResort,
}) => {
  const currentResort = RESORT_CONDITIONS[selectedResortIndex];

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-between overflow-hidden pt-8 pb-12">
      {/* Background Hero Image with Measured High-Contrast Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/frostlab_ski_hero_1790684312428.jpg"
          alt="Alpine skier wearing Frostlab storm balaclava atop snowy peak"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter brightness-[0.72] contrast-[1.08] scale-[1.02]"
        />
        {/* Gradient overlays to maintain WCAG AA text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d10] via-[#0b0d10]/60 to-[#0b0d10]/40" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#0b0d10]/40 to-[#0b0d10]/90" />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-8 md:pt-16">
        {/* Anti-Slop Clean Unboxed Metadata */}
        <div className="flex items-center gap-2 text-xs font-mono-nums text-[#00f2fe] tracking-wide mb-4">
          <span>DROP 01 // WINTER ARCHIVE</span>
          <span aria-hidden="true" className="text-white/30">·</span>
          <span>THERMAL COLOR-SHIFT APPAREL</span>
          <span aria-hidden="true" className="text-white/30">·</span>
          <span>ACTIVATES @ 28°C (82°F)</span>
        </div>

        {/* Main Display Headline (using text-wrap balance) */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold text-white tracking-tight leading-[1.05] max-w-4xl text-balance">
          Sub-zero ski apparel that transforms with human warmth.
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl font-light leading-relaxed">
          Engineered with micro-encapsulated thermochromic pigments that react to touch, breath, and body heat. Leaving vivid neon thermal prints that cool back into deep alpine camouflage.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            onClick={onExplore3D}
            className="px-6 py-3.5 text-sm font-bold text-black bg-[#00f2fe] hover:bg-[#38f9d7] rounded-xl shadow-xl shadow-[#00f2fe]/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
          >
            <span>Touch in 3D Visualizer</span>
            <ThermometerSnowflake className="w-4 h-4" />
          </button>

          <button
            onClick={onShopNow}
            className="px-6 py-3.5 text-sm font-semibold text-white bg-white/10 hover:bg-white/15 rounded-xl border border-white/20 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            <span>Shop Thermal Balaclavas</span>
            <ArrowDown className="w-4 h-4 text-slate-300" />
          </button>
        </div>

        {/* Real Mountain Specs Badges */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl pt-8 border-t border-white/10 text-xs">
          <div className="flex items-center gap-3 text-slate-300">
            <Flame className="w-4 h-4 text-[#00f2fe] shrink-0" />
            <div>
              <p className="font-semibold text-white">Thermochromic</p>
              <p className="text-[11px] text-slate-400">Heat-activated memory</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-slate-300">
            <Wind className="w-4 h-4 text-[#00f2fe] shrink-0" />
            <div>
              <p className="font-semibold text-white">Windbreak 380 GSM</p>
              <p className="text-[11px] text-slate-400">Zero goggle fogging</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-[#00f2fe] shrink-0" />
            <div>
              <p className="font-semibold text-white">Tested in Chamonix</p>
              <p className="text-[11px] text-slate-400">Rated down to -30°C</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-slate-300">
            <ThermometerSnowflake className="w-4 h-4 text-[#00f2fe] shrink-0" />
            <div>
              <p className="font-semibold text-white">DWR Finish</p>
              <p className="text-[11px] text-slate-400">Hydrophobic snow-shed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mountain Conditions Ticker / Switcher Bar */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-10">
        <div className="bg-[#0e1218]/90 backdrop-blur-md border border-white/10 rounded-xl p-3 sm:p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono-nums font-semibold uppercase tracking-wider text-slate-300">
              Live Alpine Telemetry:
            </span>
          </div>

          {/* Resort Selector Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {RESORT_CONDITIONS.map((item, idx) => (
              <button
                key={item.resort}
                onClick={() => onSelectResort(idx)}
                className={`px-3 py-1.5 text-xs font-mono-nums rounded-lg transition-all ${
                  selectedResortIndex === idx
                    ? 'bg-[#00f2fe]/20 text-[#00f2fe] border border-[#00f2fe]/40 font-semibold'
                    : 'text-slate-400 hover:text-white bg-white/5 border border-transparent'
                }`}
              >
                <span>{item.resort}</span>
                <span className="ml-1.5 opacity-70">
                  {item.temp > 0 ? `+${item.temp}°C` : `${item.temp}°C`}
                </span>
              </button>
            ))}
          </div>

          {/* Current selected resort detail */}
          <div className="text-xs font-mono-nums text-slate-400 flex items-center gap-3">
            <span>Alt: {currentResort.altitude}</span>
            <span aria-hidden="true" className="text-white/20">·</span>
            <span>Snow: {currentResort.snow}</span>
            <span aria-hidden="true" className="text-white/20">·</span>
            <span className="text-emerald-400 font-medium">{currentResort.status}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
