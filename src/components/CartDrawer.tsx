import React, { useState } from 'react';
import { ArrowRight, Check, ShieldCheck, ShoppingBag, Trash2, X } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: () => void;
  appliedDiscount: { code: string; percent: number } | null;
  onApplyDiscount: (code: string) => boolean;
  onRemoveDiscount: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  appliedDiscount,
  onApplyDiscount,
  onRemoveDiscount,
}) => {
  const [promoInput, setPromoInput] = useState<string>('');
  const [promoError, setPromoError] = useState<string | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = appliedDiscount ? (subtotal * appliedDiscount.percent) / 100 : 0;
  const freeShippingThreshold = 100;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - (subtotal - discountAmount));
  const shippingFee = subtotal === 0 || amountToFreeShipping === 0 ? 0 : 9.5;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const ok = onApplyDiscount(promoInput.trim());
    if (ok) {
      setPromoInput('');
      setPromoError(null);
    } else {
      setPromoError('Invalid code. Try "FROST15" or "ALPINELAB"');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0e1218] border-l border-white/10 shadow-2xl flex flex-col justify-between">
          {/* Drawer Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#00f2fe]" />
              <h2 className="text-lg font-display font-bold text-white">Your Ski Bag</h2>
              <span className="text-xs font-mono-nums text-slate-400">
                ({items.reduce((acc, i) => acc + i.quantity, 0)} items)
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-6 py-3 bg-[#131822] border-b border-white/5 text-xs">
            {amountToFreeShipping === 0 ? (
              <div className="flex items-center gap-2 text-emerald-400 font-mono-nums font-semibold">
                <Check className="w-4 h-4" />
                <span>You've unlocked Free Alpine Ski-Drop Express!</span>
              </div>
            ) : (
              <div>
                <div className="flex justify-between text-slate-300 font-mono-nums mb-1.5">
                  <span>Add ${amountToFreeShipping.toFixed(2)} for Free Shipping</span>
                  <span className="text-[#00f2fe]">{Math.round((subtotal / freeShippingThreshold) * 100)}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#00f2fe] to-[#4facfe] transition-all duration-300"
                    style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-slate-500 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-base font-semibold text-white">Your ski bag is empty</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Equip yourself with heat-reactive thermochromic gear for your next alpine expedition.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 px-4 py-2 text-xs font-semibold text-black bg-[#00f2fe] hover:bg-[#38f9d7] rounded-lg transition-all"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 transition-all"
                >
                  {/* Thumbnail with thermo swatch */}
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-black/40 shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1 right-1 flex gap-0.5 p-0.5 bg-black/70 rounded">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.coldHex }} />
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.warmHex }} />
                    </div>
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-xs font-semibold text-white leading-tight">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] font-mono-nums text-slate-400 mt-0.5">
                        Size: {item.size} · {item.thermoColor}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center bg-black/40 border border-white/10 rounded-md">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="w-6 h-6 flex items-center justify-center text-xs text-slate-300 hover:text-white"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-xs font-mono-nums text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="w-6 h-6 flex items-center justify-center text-xs text-slate-300 hover:text-white"
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <span className="text-xs font-bold font-mono-nums text-white">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Financial Summary */}
          {items.length > 0 && (
            <div className="p-6 bg-[#090b0e] border-t border-white/10 space-y-4">
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="space-y-1">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Discount code (e.g. FROST15)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    className="flex-1 px-3 py-1.5 text-xs font-mono-nums bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#00f2fe]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 rounded-lg border border-white/10 transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoError && (
                  <p className="text-[11px] text-rose-400 font-mono-nums">{promoError}</p>
                )}
                {appliedDiscount && (
                  <div className="flex items-center justify-between text-[11px] font-mono-nums text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2 py-1 rounded">
                    <span>Code {appliedDiscount.code} applied (-{appliedDiscount.percent}%)</span>
                    <button
                      type="button"
                      onClick={onRemoveDiscount}
                      className="text-slate-400 hover:text-white underline text-[10px]"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </form>

              {/* Subtotal, Shipping, Discount, Total */}
              <div className="space-y-1.5 text-xs font-mono-nums text-slate-300 pt-2 border-t border-white/5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Subtotal:</span>
                  <span className="text-white">${subtotal.toFixed(2)}</span>
                </div>
                {appliedDiscount && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount:</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-400">Ski-Drop Delivery:</span>
                  <span>{shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
                  <span>Total Due:</span>
                  <span className="text-[#00f2fe]">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider text-black bg-[#00f2fe] hover:bg-[#38f9d7] shadow-lg shadow-[#00f2fe]/20 transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <span>Proceed to Alpine Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 text-center font-mono-nums">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-bit Encrypted Alpine Checkout · 30-Day Mountain Guarantee</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
