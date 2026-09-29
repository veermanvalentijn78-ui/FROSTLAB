import React, { useState } from 'react';
import { Box, Check, Eye, Flame, ShoppingBag } from 'lucide-react';
import { Product, Size } from '../types';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onInspect3D: (product: Product) => void;
  onAddToCart: (product: Product, size: Size) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onInspect3D,
  onAddToCart,
}) => {
  const [isHeating, setIsHeating] = useState<boolean>(false);
  const [selectedSize, setSelectedSize] = useState<Size>(product.sizes[0] || 'S/M');
  const [addedJustNow, setAddedJustNow] = useState<boolean>(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, selectedSize);
    setAddedJustNow(true);
    setTimeout(() => setAddedJustNow(false), 1600);
  };

  return (
    <div
      onClick={() => onQuickView(product)}
      className="group relative flex flex-col rounded-2xl bg-[#12161f] border border-white/10 hover:border-white/25 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/60 cursor-pointer"
    >
      {/* Product Image Stage (65-70% height) with interactive Heat Hover */}
      <div
        className="relative w-full aspect-[4/3] bg-[#0d1016] overflow-hidden select-none"
        onMouseEnter={() => setIsHeating(true)}
        onMouseLeave={() => setIsHeating(false)}
        onTouchStart={() => setIsHeating(true)}
        onTouchEnd={() => setIsHeating(false)}
      >
        {/* Base Image */}
        <img
          src={product.primaryImage}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />

        {/* Dynamic Thermochromic Heat Simulation Overlay on Hover/Touch */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${
            isHeating ? 'opacity-85' : 'opacity-0'
          }`}
        >
          {/* Simulated heat handprint & thermal luminescence */}
          <div
            className="absolute inset-0 mix-blend-color-dodge transition-all duration-500"
            style={{
              background: `radial-gradient(circle at 50% 65%, ${product.warmHex} 0%, ${product.warmHex}80 35%, transparent 70%)`,
            }}
          />
          {/* Handprint Icon Glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-1 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 shadow-lg">
              <Flame className="w-4 h-4 text-[#00f2fe] animate-bounce" />
              <span className="text-[10px] font-mono-nums font-semibold tracking-wider text-white uppercase">
                Body Heat Active · 37°C
              </span>
            </div>
          </div>
        </div>

        {/* Subtle Top Tags */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
          {product.badge ? (
            <span className="text-[10px] font-mono-nums font-semibold tracking-wider uppercase px-2 py-1 rounded bg-black/60 backdrop-blur-sm text-[#00f2fe] border border-[#00f2fe]/30">
              {product.badge}
            </span>
          ) : (
            <span />
          )}

          {/* Colorway Transition Indicator */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-black/60 backdrop-blur-sm border border-white/10">
            <span
              className="w-2.5 h-2.5 rounded-full border border-black/50"
              style={{ backgroundColor: product.coldHex }}
              title={`Cold: ${product.baseColor}`}
            />
            <span className="text-[10px] text-slate-400">→</span>
            <span
              className="w-2.5 h-2.5 rounded-full border border-black/50 shadow-xs"
              style={{ backgroundColor: product.warmHex }}
              title={`Warmed: ${product.thermoColor}`}
            />
          </div>
        </div>

        {/* Quick Action Floating Hover Overlay */}
        <div className="absolute bottom-3 inset-x-3 flex items-center justify-between gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onInspect3D(product);
            }}
            className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-black/75 hover:bg-black backdrop-blur-md rounded-lg border border-white/20 transition-colors flex items-center justify-center gap-1.5"
          >
            <Box className="w-3.5 h-3.5 text-[#00f2fe]" />
            <span>Inspect in 3D</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="p-2 text-white bg-black/75 hover:bg-black backdrop-blur-md rounded-lg border border-white/20 transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4 text-slate-300" />
          </button>
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="flex flex-col p-5 flex-1 justify-between">
        <div>
          {/* Clean Unboxed Metadata */}
          <div className="flex items-center gap-2 text-[11px] font-mono-nums text-slate-400">
            <span className="uppercase">{product.baseColor}</span>
            <span aria-hidden="true" className="text-white/20">/</span>
            <span className="text-[#00f2fe]">{product.thermoColor}</span>
          </div>

          {/* Product Title */}
          <h3 className="mt-1.5 text-base font-semibold text-white group-hover:text-[#00f2fe] transition-colors leading-snug">
            {product.name}
          </h3>

          <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {product.tagline}
          </p>
        </div>

        {/* Purchase Module: Size Selector + Price + Add to Bag */}
        <div className="mt-4 pt-4 border-t border-white/10">
          {/* Sizes */}
          {product.sizes.length > 1 && (
            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-[11px] text-slate-400 mr-1">Size:</span>
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSize(size);
                  }}
                  className={`px-2 py-0.5 text-[11px] font-mono-nums rounded border transition-colors ${
                    selectedSize === size
                      ? 'bg-white/20 text-white border-[#00f2fe]'
                      : 'text-slate-400 border-white/10 hover:border-white/30'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between gap-3">
            {/* Price with Tabular Numerals */}
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold font-mono-nums text-white">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xs font-mono-nums text-slate-500 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>

            {/* Quick Add Button */}
            <button
              onClick={handleAdd}
              disabled={!product.inStock}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                addedJustNow
                  ? 'bg-emerald-500 text-black'
                  : 'bg-white/10 hover:bg-[#00f2fe] text-white hover:text-black border border-white/20 hover:border-transparent active:scale-95'
              }`}
            >
              {addedJustNow ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Bag</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
