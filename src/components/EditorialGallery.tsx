import React from 'react';
import { Camera, MapPin } from 'lucide-react';

export const EditorialGallery: React.FC = () => {
  return (
    <section id="editorial" className="py-20 bg-[#0b0d10]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-nums text-[#00f2fe]">
              <Camera className="w-3.5 h-3.5" />
              <span>WINTER FIELD ARCHIVE 2026</span>
              <span aria-hidden="true" className="text-white/20">·</span>
              <span>LOOKBOOK</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white mt-2">
              Tested on steep alpine faces.
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md">
            Documented across deep powder couloirs in the Swiss and French Alps. Every stitch engineered for maximum storm insulation and seamless helmet integration.
          </p>
        </div>

        {/* Editorial Photo Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Card 1: Large Action Shot (7 cols) */}
          <div className="md:col-span-7 relative group rounded-2xl overflow-hidden bg-[#12161f] border border-white/10 aspect-[16/10]">
            <img
              src="/src/assets/images/frostlab_editorial_action_1790684349052.jpg"
              alt="Skier carving powder in the Swiss Alps wearing Frostlab balaclava"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white">
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono-nums text-[#00f2fe] mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Grand Montets Couloir, Chamonix (3,275m)</span>
                </div>
                <h3 className="text-lg font-bold">Sub-Zero Powder Descent</h3>
                <p className="text-xs text-slate-300 max-w-sm mt-0.5">
                  Full speed wind tunnel testing under -18°C ambient mountain chill.
                </p>
              </div>
              <span className="text-xs font-mono-nums px-2.5 py-1 rounded bg-black/60 border border-white/20">
                Shot on 35mm
              </span>
            </div>
          </div>

          {/* Card 2: Studio Macro Detail (5 cols) */}
          <div className="md:col-span-5 relative group rounded-2xl overflow-hidden bg-[#12161f] border border-white/10 aspect-[16/10] md:aspect-auto">
            <img
              src="/src/assets/images/frostlab_camo_product_1790684335956.jpg"
              alt="Thermal jacquard camo hood with heat handprint"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <div className="flex items-center gap-1.5 text-[11px] font-mono-nums text-[#00f2fe] mb-1">
                <span>LAB SPECIMEN #02</span>
              </div>
              <h3 className="text-lg font-bold">Jacquard Camo to Toxic Lime</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Macro weave detail displaying reactive dye dispersion upon fingertip contact.
              </p>
            </div>
          </div>
        </div>

        {/* Freeride Athlete Quotes / Field Notes */}
        <div id="reviews" className="mt-16 pt-16 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs font-mono-nums text-slate-400 mb-6">
            <span>ATHLETE TEST LOGS</span>
            <span aria-hidden="true" className="text-white/20">·</span>
            <span>VERIFIED ALPINE RUNNERS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "The thermochromic shift is unreal on the mountain. My goggles stay 100% fog-free through backcountry bootpacks, and the fabric memory when you touch your face mask is unlike anything in skiing."
              </p>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-white">Lukas Lindqvist</p>
                  <p className="text-[11px] text-slate-400 font-mono-nums">Freeride World Tour Competitor</p>
                </div>
                <span className="text-[11px] font-mono-nums text-[#00f2fe]">St. Anton, AT</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "We guided 14 days in -25°C storms on Zermatt. The fit under the helmet is frictionless and the thermal collar blocks all neck draft. Plus, touching the mask to leave a glowing handprint blows everyone's mind on the lift."
              </p>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-white">Élodie Marchand</p>
                  <p className="text-[11px] text-slate-400 font-mono-nums">Chamonix High Mountain Guide</p>
                </div>
                <span className="text-[11px] font-mono-nums text-[#00f2fe]">Chamonix, FR</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "The Phantom Camo is the holy grail. In powder tree runs in Hokkaido, the mask stays completely dry thanks to the DWR finish, and the instant thermal reaction is vibrant even through heavy gloves."
              </p>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-white">Kenji Takahashi</p>
                  <p className="text-[11px] text-slate-400 font-mono-nums">Powder Snowboarder</p>
                </div>
                <span className="text-[11px] font-mono-nums text-[#00f2fe]">Niseko, JP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
