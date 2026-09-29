import React, { useState } from 'react';
import { ArrowLeft, Check, CreditCard, Lock, ShieldCheck, Truck, X } from 'lucide-react';
import { CartItem, Order, ShippingAddress, ShippingMethod, ShippingSpeed } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  appliedDiscount: { code: string; percent: number } | null;
  onOrderComplete: (order: Order) => void;
}

const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 'standard',
    name: 'Standard Alpine Ski-Drop',
    description: 'Ground courier to ski base station or chalet locker',
    price: 0,
    estimatedDays: '2–3 Business Days',
  },
  {
    id: 'express',
    name: 'Alpine Heli-Express Priority',
    description: 'Priority resort dispatch via direct mountain courier',
    price: 18,
    estimatedDays: 'Next Day Morning (Before 08:30)',
  },
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  appliedDiscount,
  onOrderComplete,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState<ShippingAddress>({
    firstName: 'Valentijn',
    lastName: 'Veerman',
    email: 'veermanvalentijn78@gmail.com',
    phone: '+31 6 1234 5678',
    street: 'Promenade du Mont-Blanc 14',
    apartment: 'Chalet Frost Alpine 4B',
    city: 'Chamonix',
    state: 'Haute-Savoie',
    postalCode: '74400',
    country: 'France',
  });

  const [selectedShipping, setSelectedShipping] = useState<ShippingSpeed>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'google_pay' | 'klarna'>('card');
  const [cardNumber, setCardNumber] = useState<string>('4532 •••• •••• 8921');
  const [cardExpiry, setCardExpiry] = useState<string>('12/28');
  const [cardCvc, setCardCvc] = useState<string>('842');
  const [nameOnCard, setNameOnCard] = useState<string>('Valentijn Veerman');

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = appliedDiscount ? (subtotal * appliedDiscount.percent) / 100 : 0;
  const currentShippingMethod = SHIPPING_METHODS.find((m) => m.id === selectedShipping)!;
  const shippingFee = currentShippingMethod.price;
  const tax = (subtotal - discountAmount) * 0.08; // 8% VAT
  const total = Math.max(0, subtotal - discountAmount + shippingFee + tax);

  // Quick Preset Autofill for user convenience
  const applyPreset = (preset: 'chamonix' | 'aspen' | 'zermatt') => {
    if (preset === 'chamonix') {
      setFormData({
        firstName: 'Valentijn',
        lastName: 'Veerman',
        email: 'veermanvalentijn78@gmail.com',
        phone: '+33 4 50 53 00 00',
        street: '14 Chemin des Glaciers',
        apartment: 'Chalet Mont-Blanc #3',
        city: 'Chamonix-Mont-Blanc',
        state: 'Haute-Savoie',
        postalCode: '74400',
        country: 'France',
      });
    } else if (preset === 'zermatt') {
      setFormData({
        firstName: 'Valentijn',
        lastName: 'Veerman',
        email: 'veermanvalentijn78@gmail.com',
        phone: '+41 27 966 81 00',
        street: 'Bahnhofstrasse 22',
        apartment: 'Matterhorn Peak Lodge',
        city: 'Zermatt',
        state: 'Valais',
        postalCode: '3920',
        country: 'Switzerland',
      });
    } else {
      setFormData({
        firstName: 'Valentijn',
        lastName: 'Veerman',
        email: 'veermanvalentijn78@gmail.com',
        phone: '+1 970 925 1220',
        street: '675 E Durant Ave',
        apartment: 'Snowmass Residence Suite 10',
        city: 'Aspen',
        state: 'Colorado',
        postalCode: '81611',
        country: 'United States',
      });
    }
  };

  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate realistic payment gateway processing
    setTimeout(() => {
      setIsProcessing(false);
      const newOrder: Order = {
        orderId: `FL-${Math.floor(100000 + Math.random() * 900000)}`,
        createdAt: new Date().toISOString(),
        items,
        subtotal,
        discount: discountAmount,
        discountCode: appliedDiscount?.code,
        shippingFee,
        tax,
        total,
        address: formData,
        shippingMethod: currentShippingMethod,
        paymentMethod,
        status: 'Confirmed',
      };
      onOrderComplete(newOrder);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-5xl bg-[#0f131a] border border-white/15 rounded-2xl shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-[#0b0e14]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#00f2fe]/20 text-[#00f2fe] flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-display font-bold text-white">
                FROSTLAB Alpine Checkout
              </h2>
              <p className="text-[11px] font-mono-nums text-slate-400">
                Encrypted 256-bit Direct Ski-Drop Protocol
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[540px]">
          {/* Left Flow Column: Shipping & Payment Steps (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 overflow-y-auto max-h-[75vh]">
            {/* Step Selector Tabs */}
            <div className="flex items-center gap-2 p-1 bg-white/5 rounded-xl border border-white/10 mb-6">
              <button
                type="button"
                onClick={() => setStep('shipping')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  step === 'shipping'
                    ? 'bg-[#00f2fe] text-black shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>1. Resort & Shipping</span>
              </button>
              <button
                type="button"
                onClick={() => setStep('payment')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  step === 'payment'
                    ? 'bg-[#00f2fe] text-black shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>2. Payment & Drop</span>
              </button>
            </div>

            {step === 'shipping' ? (
              /* STEP 1: RESORT & SHIPPING ADDRESS */
              <div className="space-y-5">
                {/* Quick Auto-Fill Demo Shortcuts */}
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between text-[11px] font-mono-nums text-slate-400 mb-2">
                    <span>Quick Fill Alpine Delivery Address:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => applyPreset('chamonix')}
                      className="px-2.5 py-1 text-[11px] font-mono-nums rounded bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-colors"
                    >
                      🏔️ Chamonix Chalet
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset('zermatt')}
                      className="px-2.5 py-1 text-[11px] font-mono-nums rounded bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-colors"
                    >
                      🎿 Zermatt Peak
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset('aspen')}
                      className="px-2.5 py-1 text-[11px] font-mono-nums rounded bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-colors"
                    >
                      ❄️ Aspen Lodge
                    </button>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">First Name</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#00f2fe]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Last Name</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#00f2fe]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Email for Dispatch Tracking</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#00f2fe]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Alpine SMS Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#00f2fe]"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="block text-slate-300 font-medium mb-1">Street Address / Resort Road</label>
                  <input
                    type="text"
                    value={formData.street}
                    onChange={(e) => handleInputChange('street', e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#00f2fe]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">City / Resort</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#00f2fe]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Postal Code</label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#00f2fe]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Country</label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#00f2fe]"
                    />
                  </div>
                </div>

                {/* Delivery Method Options */}
                <div className="pt-2">
                  <label className="block text-slate-300 font-medium text-xs mb-2">
                    Select Ski-Drop Speed:
                  </label>
                  <div className="space-y-2">
                    {SHIPPING_METHODS.map((method) => (
                      <div
                        key={method.id}
                        onClick={() => setSelectedShipping(method.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          selectedShipping === method.id
                            ? 'bg-white/10 border-[#00f2fe] shadow-sm'
                            : 'bg-white/5 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Truck className="w-4 h-4 text-[#00f2fe]" />
                          <div>
                            <p className="text-xs font-semibold text-white">{method.name}</p>
                            <p className="text-[11px] text-slate-400">{method.description} · {method.estimatedDays}</p>
                          </div>
                        </div>
                        <span className="text-xs font-mono-nums font-bold text-white">
                          {method.price === 0 ? 'FREE' : `$${method.price.toFixed(2)}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Next Step Button */}
                <button
                  type="button"
                  onClick={() => setStep('payment')}
                  className="w-full mt-4 py-3 px-6 rounded-xl font-bold text-xs uppercase tracking-wider text-black bg-[#00f2fe] hover:bg-[#38f9d7] shadow-lg shadow-[#00f2fe]/20 transition-all"
                >
                  Continue to Payment →
                </button>
              </div>
            ) : (
              /* STEP 2: PAYMENT */
              <form onSubmit={handleCompleteOrder} className="space-y-5">
                {/* Payment Method Selector */}
                <div>
                  <label className="block text-slate-300 font-medium text-xs mb-2">
                    Payment Method:
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-2.5 rounded-lg border text-xs font-medium transition-all flex flex-col items-center gap-1 ${
                        paymentMethod === 'card'
                          ? 'bg-white/15 text-white border-[#00f2fe]'
                          : 'text-slate-400 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-[#00f2fe]" />
                      <span>Card</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('apple_pay')}
                      className={`p-2.5 rounded-lg border text-xs font-medium transition-all flex flex-col items-center gap-1 ${
                        paymentMethod === 'apple_pay'
                          ? 'bg-white/15 text-white border-[#00f2fe]'
                          : 'text-slate-400 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <span className="text-sm">Pay</span>
                      <span>Apple Pay</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('google_pay')}
                      className={`p-2.5 rounded-lg border text-xs font-medium transition-all flex flex-col items-center gap-1 ${
                        paymentMethod === 'google_pay'
                          ? 'bg-white/15 text-white border-[#00f2fe]'
                          : 'text-slate-400 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <span className="text-sm">GPay</span>
                      <span>Google Pay</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('klarna')}
                      className={`p-2.5 rounded-lg border text-xs font-medium transition-all flex flex-col items-center gap-1 ${
                        paymentMethod === 'klarna'
                          ? 'bg-white/15 text-white border-[#00f2fe]'
                          : 'text-slate-400 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <span className="text-sm font-bold text-pink-400">Klarna</span>
                      <span>3 x ${(total / 3).toFixed(2)}</span>
                    </button>
                  </div>
                </div>

                {paymentMethod === 'card' ? (
                  <div className="space-y-3 p-4 rounded-xl bg-white/5 border border-white/10 text-xs">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Card Number</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          required
                          className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white font-mono-nums focus:outline-none focus:border-[#00f2fe]"
                        />
                        <div className="absolute right-3 top-2.5 flex items-center gap-1">
                          <span className="w-5 h-3 bg-blue-600 rounded-sm inline-block" />
                          <span className="w-5 h-3 bg-amber-500 rounded-sm inline-block" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-300 font-medium mb-1">Expiration</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          required
                          className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white font-mono-nums focus:outline-none focus:border-[#00f2fe]"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-medium mb-1">CVC Code</label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          required
                          className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white font-mono-nums focus:outline-none focus:border-[#00f2fe]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Name on Card</label>
                      <input
                        type="text"
                        value={nameOnCard}
                        onChange={(e) => setNameOnCard(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#00f2fe]"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center">
                    <p className="text-sm font-semibold text-white">
                      Instant One-Click Authorization
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      You will confirm the alpine payment securely via your biometric credential.
                    </p>
                  </div>
                )}

                {/* Back to Shipping button */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('shipping')}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Shipping</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="py-3 px-8 rounded-xl font-bold text-xs uppercase tracking-wider text-black bg-[#00f2fe] hover:bg-[#38f9d7] shadow-lg shadow-[#00f2fe]/25 transition-all flex items-center gap-2 active:scale-98 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <span>Authorizing Alpine Drop...</span>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Pay ${total.toFixed(2)}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Order Summary & Review (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 bg-[#0a0d12] flex flex-col justify-between space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">
                Order Review ({items.length} unique items)
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 text-xs">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-lg object-cover bg-black/40 shrink-0 border border-white/10"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate">{item.name}</p>
                      <p className="text-[11px] font-mono-nums text-slate-400">
                        Qty: {item.quantity} · Size: {item.size}
                      </p>
                    </div>
                    <span className="font-mono-nums font-bold text-white shrink-0">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Delivery destination preview */}
              <div className="mt-6 p-3 rounded-lg bg-white/5 border border-white/5 text-[11px] font-mono-nums text-slate-300">
                <span className="text-slate-400 block mb-0.5">Alpine Drop Location:</span>
                <p className="text-white truncate">
                  {formData.firstName} {formData.lastName}
                </p>
                <p className="text-slate-400 truncate">
                  {formData.street}, {formData.city}, {formData.country}
                </p>
              </div>

              {/* Price Calculations */}
              <div className="mt-6 pt-4 border-t border-white/10 space-y-2 text-xs font-mono-nums text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Subtotal:</span>
                  <span className="text-white">${subtotal.toFixed(2)}</span>
                </div>
                {appliedDiscount && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount ({appliedDiscount.code}):</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-400">Ski-Drop Service:</span>
                  <span>{shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Alpine VAT / Tax (8%):</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-white/10">
                  <span>Grand Total:</span>
                  <span className="text-[#00f2fe]">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Alpine Guarantee Trust */}
            <div className="pt-4 border-t border-white/10 flex items-center gap-3 text-[11px] text-slate-400">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <p>
                30-Day Mountain Trial: Test on snow. If unsatisfied or size is imperfect, return for full refund or swap.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
