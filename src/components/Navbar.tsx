import React from 'react';
import { FrostlabLogo } from './FrostlabLogo';
import { ShoppingBag, Sparkles } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onNavigateToSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onNavigateToSection,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b0d10]/85 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00f2fe]"
        >
          <FrostlabLogo iconSize={32} />
        </a>

        {/* Zone 2: Clean 4-5 Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <button
            onClick={() => onNavigateToSection('viewer3d')}
            className="hover:text-white transition-colors relative py-1 hover:underline underline-offset-8 decoration-[#00f2fe]"
          >
            3D Viewer
          </button>
          <button
            onClick={() => onNavigateToSection('collection')}
            className="hover:text-white transition-colors relative py-1 hover:underline underline-offset-8 decoration-[#00f2fe]"
          >
            Thermal Gear
          </button>
          <button
            onClick={() => onNavigateToSection('science')}
            className="hover:text-white transition-colors relative py-1 hover:underline underline-offset-8 decoration-[#00f2fe]"
          >
            The Science
          </button>
          <button
            onClick={() => onNavigateToSection('editorial')}
            className="hover:text-white transition-colors relative py-1 hover:underline underline-offset-8 decoration-[#00f2fe]"
          >
            Alpine Lookbook
          </button>
          <button
            onClick={() => onNavigateToSection('reviews')}
            className="hover:text-white transition-colors relative py-1 hover:underline underline-offset-8 decoration-[#00f2fe]"
          >
            Field Notes
          </button>
        </nav>

        {/* Zone 3: Primary Actions (Cart + Quick Shop) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateToSection('collection')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00f2fe]" />
            <span>Drop 01</span>
          </button>

          <button
            onClick={onOpenCart}
            aria-label={`Shopping Cart with ${cartCount} items`}
            className="relative flex items-center justify-center p-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-white border border-white/15 transition-all active:scale-95"
          >
            <ShoppingBag className="w-4 h-4 text-slate-200" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold font-mono-nums text-black bg-[#00f2fe] rounded-full shadow-md">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
