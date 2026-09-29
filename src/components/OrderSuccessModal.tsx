import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Download, PackageCheck, PlaneTakeoff, Sparkles, Truck, X } from 'lucide-react';
import { Order } from '../types';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  useEffect(() => {
    // Fire festive icy confetti blast
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00f2fe', '#ffffff', '#4facfe', '#38ef7d'],
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleDownloadReceipt = () => {
    const text = `
=============================================
FROSTLABS // ALPINE THERMAL APPAREL RECEIPT
Order ID: ${order.orderId}
Date: ${new Date(order.createdAt).toLocaleString()}
Drop Location: ${order.address.firstName} ${order.address.lastName}
${order.address.street}, ${order.address.city}, ${order.address.country}
---------------------------------------------
ITEMS:
${order.items.map((i) => `· ${i.name} (Size: ${i.size}) x${i.quantity} — $${(i.price * i.quantity).toFixed(2)}`).join('\n')}

Subtotal: $${order.subtotal.toFixed(2)}
Discount: -$${order.discount.toFixed(2)}
Ski-Drop Delivery: $${order.shippingFee.toFixed(2)}
Tax: $${order.tax.toFixed(2)}
TOTAL PAID: $${order.total.toFixed(2)}
Payment: Authorized via ${order.paymentMethod.toUpperCase()}
Status: ${order.status}
=============================================
Thank you for equipping FROSTLABS for your alpine expedition.
`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FROSTLAB-RECEIPT-${order.orderId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-2xl bg-[#0f131a] border border-white/15 rounded-2xl shadow-2xl overflow-hidden my-auto p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Success Badge */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-[#00f2fe]/20 text-[#00f2fe] flex items-center justify-center mb-4 ring-8 ring-[#00f2fe]/10">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="flex items-center gap-2 text-xs font-mono-nums text-[#00f2fe]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PAYMENT AUTHORIZED & EXPEDITION LOGGED</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white mt-1">
            Order {order.orderId} Confirmed
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-md">
            Confirmation email with live alpine GPS dispatch link dispatched to{' '}
            <span className="text-white font-mono-nums">{order.address.email}</span>.
          </p>
        </div>

        {/* Real-time Alpine Delivery Timeline Simulation */}
        <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10">
          <h4 className="text-xs font-semibold text-white mb-4 flex items-center justify-between">
            <span>Alpine Logistics Status:</span>
            <span className="text-[#00f2fe] font-mono-nums text-[11px]">Est. Delivery: 2 Days</span>
          </h4>

          <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono-nums">
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-7 h-7 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold">
                ✓
              </div>
              <span className="text-white font-medium">Order Placed</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-7 h-7 rounded-full bg-[#00f2fe] text-black flex items-center justify-center font-bold animate-pulse">
                <PackageCheck className="w-3.5 h-3.5" />
              </div>
              <span className="text-[#00f2fe] font-medium">Thermo QC</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-7 h-7 rounded-full bg-white/10 text-slate-400 flex items-center justify-center">
                <PlaneTakeoff className="w-3.5 h-3.5" />
              </div>
              <span className="text-slate-400">Resort Dispatch</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-7 h-7 rounded-full bg-white/10 text-slate-400 flex items-center justify-center">
                <Truck className="w-3.5 h-3.5" />
              </div>
              <span className="text-slate-400">Ski-Drop Locker</span>
            </div>
          </div>
        </div>

        {/* Order Details Brief */}
        <div className="mt-6 border-t border-white/10 pt-4 space-y-2 text-xs font-mono-nums">
          <div className="flex justify-between text-slate-300">
            <span className="text-slate-400">Drop Address:</span>
            <span className="text-white text-right">
              {order.address.street}, {order.address.city}, {order.address.country}
            </span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span className="text-slate-400">Selected Service:</span>
            <span className="text-white">{order.shippingMethod.name}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span className="text-slate-400">Total Billed:</span>
            <span className="text-[#00f2fe] font-bold">${order.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleDownloadReceipt}
            className="flex-1 py-3 px-4 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/20 transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 text-slate-300" />
            <span>Download Packing Slip</span>
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-[#00f2fe] hover:bg-[#38f9d7] shadow-lg shadow-[#00f2fe]/20 transition-all flex items-center justify-center"
          >
            Continue Exploring FROSTLAB
          </button>
        </div>
      </div>
    </div>
  );
};
