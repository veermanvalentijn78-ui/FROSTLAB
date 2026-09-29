import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ThreeBalaclavaViewer } from './components/ThreeBalaclavaViewer';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ScienceSection } from './components/ScienceSection';
import { EditorialGallery } from './components/EditorialGallery';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { Footer } from './components/Footer';
import { PRODUCTS } from './data/products';
import { CartItem, Order, Product, Size } from './types';
import { Sparkles, SlidersHorizontal, Check } from 'lucide-react';

export default function App() {
  // Cart & Checkout State
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'cart-init-1',
      productId: PRODUCTS[0].id,
      name: PRODUCTS[0].name,
      price: PRODUCTS[0].price,
      baseColor: PRODUCTS[0].baseColor,
      thermoColor: PRODUCTS[0].thermoColor,
      coldHex: PRODUCTS[0].coldHex,
      warmHex: PRODUCTS[0].warmHex,
      size: 'S/M',
      quantity: 1,
      image: PRODUCTS[0].primaryImage,
    },
  ]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percent: number } | null>({
    code: 'FROST15',
    percent: 15,
  });

  // Selected 3D Product & Modals
  const [selectedProduct3D, setSelectedProduct3D] = useState<Product>(PRODUCTS[0]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Filters & Mountain Weather
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'balaclava' | 'goggles'>('all');
  const [selectedResortIndex, setSelectedResortIndex] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Cart operations
  const handleAddToCart = (product: Product, size: Size = 'S/M', quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id && item.size === size);
      if (existing) {
        return prev.map((item) =>
          item.id === existing.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random()}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        baseColor: product.baseColor,
        thermoColor: product.thermoColor,
        coldHex: product.coldHex,
        warmHex: product.warmHex,
        size,
        quantity,
        image: product.primaryImage,
      };
      return [...prev, newItem];
    });

    showToast(`Added ${product.name} (${size}) to Ski Bag`);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleApplyDiscount = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'FROST15') {
      setAppliedDiscount({ code: 'FROST15', percent: 15 });
      showToast('Code FROST15 applied: 15% discount!');
      return true;
    }
    if (clean === 'ALPINELAB') {
      setAppliedDiscount({ code: 'ALPINELAB', percent: 20 });
      showToast('Code ALPINELAB applied: 20% discount!');
      return true;
    }
    if (clean === 'FREESHIP') {
      setAppliedDiscount({ code: 'FREESHIP', percent: 10 });
      showToast('Code FREESHIP applied: 10% discount!');
      return true;
    }
    return false;
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
  };

  // Inspect 3D
  const handleInspect3D = (product: Product) => {
    setSelectedProduct3D(product);
    const viewerElement = document.getElementById('viewer3d');
    if (viewerElement) {
      viewerElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const filteredProducts = PRODUCTS.filter((p) => {
    if (categoryFilter === 'all') return true;
    return p.category === categoryFilter;
  });

  const cartTotalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0d10] text-[#e8ecf1] flex flex-col font-sans selection:bg-[#00f2fe]/30 selection:text-white">
      {/* Top Banner: Limited Ski Drop Notification */}
      <div className="bg-[#111622] border-b border-white/10 px-4 py-2 text-center text-xs font-mono-nums text-slate-300 flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#00f2fe] animate-pulse" />
        <span>DROP 01 LIVE: Thermal micro-encapsulated ski hoods now shipping to all Alpine resorts.</span>
        <span className="text-white/30 hidden sm:inline">·</span>
        <span className="text-[#00f2fe] font-semibold hidden sm:inline">Use code FROST15 for 15% off</span>
      </div>

      {/* Global Navigation Bar */}
      <Navbar
        cartCount={cartTotalItemsCount}
        onOpenCart={() => setIsCartOpen(true)}
        onNavigateToSection={scrollToSection}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section with Ski Resort Conditions */}
        <Hero
          onExplore3D={() => scrollToSection('viewer3d')}
          onShopNow={() => scrollToSection('collection')}
          selectedResortIndex={selectedResortIndex}
          onSelectResort={(idx) => setSelectedResortIndex(idx)}
        />

        {/* 3D Interactive WebGL Visualizer Section */}
        <section id="viewer3d" className="py-16 md:py-24 bg-[#080a0d] border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono-nums text-[#00f2fe]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>3D REAL-TIME THERMO VISUALIZER</span>
                  <span aria-hidden="true" className="text-white/20">·</span>
                  <span>TOUCH & HEAT SIMULATION</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white mt-2">
                  Inspect the thermal shift in 3D.
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md">
                Rotate 360° to view fabric ergonomics. Drag or tap directly onto the 3D balaclava to leave glowing thermal handprints at 37°C.
              </p>
            </div>

            {/* 3D Viewport Component */}
            <ThreeBalaclavaViewer
              selectedProduct={selectedProduct3D}
              onSelectProduct={(p) => setSelectedProduct3D(p)}
              availableProducts={PRODUCTS}
              onAddToCart={(p) => handleAddToCart(p)}
            />
          </div>
        </section>

        {/* Product Collection Section */}
        <section id="collection" className="py-20 bg-[#0b0d10] border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Collection Header & Interactive Filter Tabs */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono-nums text-[#00f2fe]">
                  <span>TECHNICAL SKI & STORM ARCHIVE</span>
                  <span aria-hidden="true" className="text-white/20">·</span>
                  <span>DROP 01</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white mt-2">
                  Thermal-reactive collection.
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl">
                  Hover or tap any product card to simulate palm contact and reveal the thermochromic color transformation.
                </p>
              </div>

              {/* Functional Segmented Filter Buttons */}
              <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/10 self-start md:self-auto">
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    categoryFilter === 'all'
                      ? 'bg-[#00f2fe] text-black shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  All Gear ({PRODUCTS.length})
                </button>
                <button
                  onClick={() => setCategoryFilter('balaclava')}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    categoryFilter === 'balaclava'
                      ? 'bg-[#00f2fe] text-black shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Thermal Balaclavas
                </button>
                <button
                  onClick={() => setCategoryFilter('goggles')}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    categoryFilter === 'goggles'
                      ? 'bg-[#00f2fe] text-black shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Blizzard Goggles
                </button>
              </div>
            </div>

            {/* 3-Column Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={(p) => setQuickViewProduct(p)}
                  onInspect3D={(p) => handleInspect3D(p)}
                  onAddToCart={(p, size) => handleAddToCart(p, size)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* The Science & Tech Section */}
        <ScienceSection />

        {/* Editorial Action Photography & Testimonials */}
        <EditorialGallery />
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        appliedDiscount={appliedDiscount}
        onApplyDiscount={handleApplyDiscount}
        onRemoveDiscount={handleRemoveDiscount}
      />

      {/* Complete Multi-Step Alpine Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        appliedDiscount={appliedDiscount}
        onOrderComplete={(order) => {
          setCompletedOrder(order);
          setCartItems([]); // clear cart on purchase
        }}
      />

      {/* Order Confirmation & Alpine Tracking Modal */}
      <OrderSuccessModal
        order={completedOrder}
        onClose={() => setCompletedOrder(null)}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={(p, size, qty) => handleAddToCart(p, size, qty)}
        onInspect3D={(p) => handleInspect3D(p)}
      />

      {/* Floating Action / Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#121620] border border-[#00f2fe]/40 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-mono-nums animate-bounce">
          <div className="w-5 h-5 rounded-full bg-[#00f2fe] text-black flex items-center justify-center font-bold">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <span>{toastMessage}</span>
          <button
            onClick={() => setIsCartOpen(true)}
            className="ml-2 text-[#00f2fe] underline font-semibold hover:text-white"
          >
            View Bag
          </button>
        </div>
      )}
    </div>
  );
}
