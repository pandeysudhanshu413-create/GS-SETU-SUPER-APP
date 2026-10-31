/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { FoodProduct, CartItem, Order, ServiceCategory } from './types';
import { SUPER_APP_SERVICES } from './data/servicesData';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LocationModal } from './components/LocationModal';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';

// Views
import { HomeView } from './views/HomeView';
import { ServicesView } from './views/ServicesView';
import { ServiceDetailComingSoon } from './views/ServiceDetailComingSoon';
import { FoodMarketplaceView } from './views/FoodMarketplaceView';
import { CheckoutView } from './views/CheckoutView';
import { OrderTrackingView } from './views/OrderTrackingView';
import { SellerPartnerView } from './views/SellerPartnerView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { ContactView } from './views/ContactView';

export default function App() {
  // Navigation View State
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedService, setSelectedService] = useState<ServiceCategory | null>(null);

  // Products from Database API
  const [products, setProducts] = useState<FoodProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState<boolean>(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  // Cart State (Persisted in localStorage)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('gs_setu_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Selected Location (Persisted in localStorage)
  const [selectedLocation, setSelectedLocation] = useState<string>(() => {
    return localStorage.getItem('gs_setu_location') || 'Rohania Village, Varanasi';
  });

  // Recent Placed Orders for this customer session
  const [recentOrderIds, setRecentOrderIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('gs_setu_recent_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [trackingOrderId, setTrackingOrderId] = useState<string>('');

  // Modals
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<FoodProduct | null>(null);

  // Search query
  const [searchQuery, setSearchQuery] = useState('');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Check URL parameters for ?admin=true or ?order=GSS-XXXX
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      setCurrentView('admin');
    }
    const orderIdParam = params.get('order');
    if (orderIdParam) {
      setTrackingOrderId(orderIdParam);
      setCurrentView('tracking');
    }
  }, []);

  // Sync Cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('gs_setu_cart', JSON.stringify(cartItems));
    } catch (err) {
      console.error('Failed to save cart to localStorage', err);
    }
  }, [cartItems]);

  // Sync Location to localStorage
  const handleSelectLocation = (loc: string) => {
    setSelectedLocation(loc);
    localStorage.setItem('gs_setu_location', loc);
    showToast(`Delivery location set to: ${loc}`);
  };

  // Fetch Products from Backend API with resilient fallback
  const fetchProducts = async () => {
    setProductsLoading(true);
    setProductsError(null);
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products);
          try {
            localStorage.setItem('gs_setu_products_cache', JSON.stringify(data.products));
          } catch {}
          return;
        }
      }
    } catch {
      // Graceful fallback to cached or default products
    } finally {
      // Check cache if products empty
      if (products.length === 0) {
        try {
          const cached = localStorage.getItem('gs_setu_products_cache');
          if (cached) {
            setProducts(JSON.parse(cached));
          }
        } catch {}
      }
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Cart operations
  const handleAddToCart = (product: FoodProduct) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`Added ${product.name} to cart!`);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
      );
    }
  };

  const handleClearCart = () => {
    setCartItems([]);
    showToast('Cart cleared');
  };

  // Cart totals
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const deliveryFee = cartSubtotal >= 150 || cartSubtotal === 0 ? 0 : 20;
  const cartTotal = cartSubtotal + deliveryFee;

  // Map of product id -> quantity in cart
  const cartQuantities = cartItems.reduce((acc, item) => {
    acc[item.product.id] = item.quantity;
    return acc;
  }, {} as Record<string, number>);

  // On successful order placement
  const handleOrderSuccess = (order: Order) => {
    // Save to recent orders
    const updated = [order.id, ...recentOrderIds.filter((id) => id !== order.id)].slice(0, 5);
    setRecentOrderIds(updated);
    try {
      localStorage.setItem('gs_setu_recent_orders', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
    // Clear cart
    setCartItems([]);
  };

  // Handlers for switching views
  const handleSelectService = (service: ServiceCategory) => {
    setSelectedService(service);
    setCurrentView('service-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToTracking = (orderId: string) => {
    setTrackingOrderId(orderId);
    setCurrentView('tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-bold animate-in fade-in slide-in-from-top duration-200 border border-emerald-500/30 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        cartCount={cartCount}
        openCart={() => setIsCartOpen(true)}
        selectedLocation={selectedLocation}
        openLocationModal={() => setIsLocationModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSubmit={() => setCurrentView('food')}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView
            products={products}
            cartQuantities={cartQuantities}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            onOpenProductDetails={(prod) => setSelectedProductForDetail(prod)}
            onSelectService={handleSelectService}
            setCurrentView={setCurrentView}
            selectedLocation={selectedLocation}
            openLocationModal={() => setIsLocationModalOpen(true)}
          />
        )}

        {currentView === 'services' && (
          <ServicesView
            onSelectService={handleSelectService}
            setCurrentView={setCurrentView}
          />
        )}

        {currentView === 'service-detail' && selectedService && (
          <ServiceDetailComingSoon
            service={selectedService}
            onBack={() => setCurrentView('services')}
            onGoToPartner={() => setCurrentView('seller')}
            onGoToFood={() => setCurrentView('food')}
          />
        )}

        {currentView === 'food' && (
          <FoodMarketplaceView
            products={products}
            loading={productsLoading}
            error={productsError}
            onRefreshProducts={fetchProducts}
            cartQuantities={cartQuantities}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            onOpenProductDetails={(prod) => setSelectedProductForDetail(prod)}
            openCart={() => setIsCartOpen(true)}
            cartCount={cartCount}
            cartTotal={cartTotal}
            selectedLocation={selectedLocation}
            openLocationModal={() => setIsLocationModalOpen(true)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutView
            cartItems={cartItems}
            selectedLocation={selectedLocation}
            onOrderSuccess={handleOrderSuccess}
            onBackToMenu={() => setCurrentView('food')}
            onGoToTracking={handleGoToTracking}
          />
        )}

        {currentView === 'tracking' && (
          <OrderTrackingView
            initialOrderId={trackingOrderId}
            recentOrderIds={recentOrderIds}
            onGoToFood={() => setCurrentView('food')}
          />
        )}

        {currentView === 'seller' && (
          <SellerPartnerView
            initialTab="seller"
            setCurrentView={setCurrentView}
          />
        )}

        {currentView === 'partner' && (
          <SellerPartnerView
            initialTab="delivery"
            setCurrentView={setCurrentView}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboardView
            onBackToApp={() => setCurrentView('home')}
            products={products}
            onRefreshProducts={fetchProducts}
          />
        )}

        {currentView === 'contact' && (
          <ContactView setCurrentView={setCurrentView} />
        )}
      </main>

      {/* Footer */}
      <Footer
        setCurrentView={setCurrentView}
        openAdmin={() => {
          setCurrentView('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setCurrentView('checkout');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onBrowseFood={() => {
          setIsCartOpen(false);
          setCurrentView('food');
        }}
      />

      {/* Location Selector Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocation={selectedLocation}
        onSelectLocation={handleSelectLocation}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProductForDetail}
        onClose={() => setSelectedProductForDetail(null)}
        cartQuantity={selectedProductForDetail ? cartQuantities[selectedProductForDetail.id] || 0 : 0}
        onAddToCart={handleAddToCart}
        onUpdateQuantity={handleUpdateQuantity}
      />
    </div>
  );
}
