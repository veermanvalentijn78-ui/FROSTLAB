import React, { useState } from 'react';
import { FrostlabLogo } from './FrostlabLogo';
import { Check, Mail, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
  };

  return (
    <footer className="bg-[#080a0d] border-t border-white/10 text-slate-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <FrostlabLogo iconSize={32} />
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              FROSTLABS develops high-performance thermal-reactive technical apparel for alpine skiing, backcountry freeride, and cold-weather mountain expeditions.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono-nums text-slate-500">
              <span>Zermatt // Chamonix // Tokyo</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-mono-nums font-semibold uppercase tracking-wider text-white">
              Archive
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#viewer3d" className="hover:text-white transition-colors">
                  3D Thermal Viewer
                </a>
              </li>
              <li>
                <a href="#collection" className="hover:text-white transition-colors">
                  Thermo Balaclavas
                </a>
              </li>
              <li>
                <a href="#collection" className="hover:text-white transition-colors">
                  Apex Blizzard Goggles
                </a>
              </li>
              <li>
                <a href="#science" className="hover:text-white transition-colors">
                  Leuco Crystal Science
                </a>
              </li>
            </ul>
          </div>

          {/* Expedition & Care */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-mono-nums font-semibold uppercase tracking-wider text-white">
              Ski Care & Fit
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Thermal Wash Instructions
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Helmet Compatibility Fit
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Alpine Ski-Drop Delivery
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  30-Day Mountain Swap
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup for Drop 02 */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-mono-nums font-semibold uppercase tracking-wider text-white">
              Expedition Dispatches
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Early access notification for Drop 02 and limited alpine colorways.
            </p>
            {subscribed ? (
              <div className="p-3 bg-emerald-950/40 border border-emerald-800/40 rounded-lg text-emerald-400 text-xs font-mono-nums flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>You're enlisted for Drop 02 release alerts.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="email"
                    placeholder="skier@alpine.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs font-mono-nums bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#00f2fe]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-2 text-xs font-bold font-mono-nums uppercase text-black bg-[#00f2fe] hover:bg-[#38f9d7] rounded-lg transition-colors whitespace-nowrap"
                >
                  Enlist
                </button>
              </form>
            )}
            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono-nums pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero spam · Alpine drops only</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono-nums text-slate-400">
          <p>© 2026 FROSTLABS INC. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Alpine Service</span>
            <span className="hover:text-white cursor-pointer transition-colors">Mountain Guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
