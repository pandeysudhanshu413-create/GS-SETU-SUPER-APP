import React, { useState } from 'react';
import {
  MapPin,
  Search,
  ShoppingBag,
  Menu,
  X,
  ShieldCheck,
  UtensilsCrossed,
  Sparkles,
  Layers,
  Store,
  Bike,
  Clock,
  PhoneCall
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  cartCount: number;
  openCart: () => void;
  selectedLocation: string;
  openLocationModal: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSearchSubmit?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  cartCount,
  openCart,
  selectedLocation,
  openLocationModal,
  searchQuery,
  setSearchQuery,
  onSearchSubmit
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view: string) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (currentView !== 'food') {
        setCurrentView('food');
      }
      if (onSearchSubmit) onSearchSubmit();
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top micro banner */}
      <div className="bg-[#0B4626] text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium tracking-wide">
              GS Setu: Connecting Local Needs with Local Opportunities
            </span>
            <span className="hidden md:inline text-emerald-200">|</span>
            <span className="hidden md:inline text-emerald-200">Founder: Sudhanshu Pandey</span>
          </div>
          <div className="flex items-center gap-4 text-emerald-100 text-xs">
            <span className="hidden sm:inline">🚀 Food Ordering Pilot is LIVE</span>
            <button
              onClick={() => handleNavClick('admin')}
              className="hover:text-white flex items-center gap-1 font-semibold transition-colors cursor-pointer text-emerald-300"
              title="Admin Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-3 md:gap-6">
          {/* Logo & Brand */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 cursor-pointer select-none group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#168548] to-[#0B4626] flex items-center justify-center text-white shadow-md shadow-emerald-900/20 group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-xl tracking-tighter">GS</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl md:text-2xl font-black tracking-tight text-[#0B4626]">
                  GS SETU
                </span>
                <span className="bg-[#EAF7EE] text-[#168548] text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider border border-emerald-200">
                  Super App
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide hidden sm:block">
                Local Seva | Local Growth
              </p>
            </div>
          </div>

          {/* Location Selector (Button) */}
          <button
            onClick={openLocationModal}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-[#EAF7EE] border border-slate-200 hover:border-emerald-300 transition-colors text-left max-w-[210px] shrink-0 cursor-pointer"
            title="Change Delivery Location"
          >
            <MapPin className="w-4 h-4 text-[#168548] shrink-0" />
            <div className="truncate">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Location
              </div>
              <div className="text-xs font-semibold text-slate-800 truncate">
                {selectedLocation || 'Select Location'}
              </div>
            </div>
          </button>

          {/* Search bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-md relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search Maggi, pasta, snacks, or super app services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#168548]/30 focus:border-[#168548] transition-all"
            />
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-1">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                currentView === 'home'
                  ? 'text-[#168548] bg-[#EAF7EE]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('services')}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                currentView === 'services'
                  ? 'text-[#168548] bg-[#EAF7EE]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              All Services
            </button>
            <button
              onClick={() => handleNavClick('food')}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors relative cursor-pointer ${
                currentView === 'food'
                  ? 'text-[#168548] bg-[#EAF7EE]'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <UtensilsCrossed className="w-4 h-4 text-[#168548]" />
                Food
                <span className="bg-[#168548] text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                  Live
                </span>
              </span>
            </button>
            <button
              onClick={() => handleNavClick('seller')}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                currentView === 'seller'
                  ? 'text-[#168548] bg-[#EAF7EE]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Become a Seller
            </button>
            <button
              onClick={() => handleNavClick('partner')}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                currentView === 'partner'
                  ? 'text-[#168548] bg-[#EAF7EE]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Become a Partner
            </button>
            <button
              onClick={() => handleNavClick('tracking')}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                currentView === 'tracking'
                  ? 'text-[#168548] bg-[#EAF7EE]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              My Orders
            </button>
          </nav>

          {/* Right Action Icons: Cart & Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* Location selector compact for mobile */}
            <button
              onClick={openLocationModal}
              className="sm:hidden p-2 rounded-lg bg-slate-100 text-slate-700 cursor-pointer"
              title="Change Location"
            >
              <MapPin className="w-4 h-4 text-[#168548]" />
            </button>

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-2 bg-[#168548] hover:bg-[#126e3c] text-white px-3.5 py-2 rounded-xl font-bold text-sm shadow-md shadow-emerald-900/15 transition-all active:scale-95 cursor-pointer"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              <span className="bg-white text-[#168548] font-black text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </button>

            {/* Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="lg:hidden mt-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search Maggi, pasta, snacks, services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs focus:outline-hidden focus:ring-2 focus:ring-[#168548]/30 focus:border-[#168548]"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top duration-150">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-[#168548]" />
              <span className="font-semibold text-slate-800">{selectedLocation}</span>
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openLocationModal();
              }}
              className="text-xs font-bold text-[#168548] hover:underline"
            >
              Change
            </button>
          </div>

          <button
            onClick={() => handleNavClick('home')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold ${
              currentView === 'home' ? 'bg-[#EAF7EE] text-[#168548]' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Home
          </button>
          <button
            onClick={() => handleNavClick('services')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold ${
              currentView === 'services' ? 'bg-[#EAF7EE] text-[#168548]' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-4 h-4" />
            All Super App Services (8)
          </button>
          <button
            onClick={() => handleNavClick('food')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-bold ${
              currentView === 'food' ? 'bg-[#EAF7EE] text-[#168548]' : 'text-slate-900 bg-emerald-50/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <UtensilsCrossed className="w-4 h-4 text-[#168548]" />
              <span>Food & Snacks (Order Now)</span>
            </div>
            <span className="bg-[#168548] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
              Active
            </span>
          </button>
          <button
            onClick={() => handleNavClick('seller')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold ${
              currentView === 'seller' ? 'bg-[#EAF7EE] text-[#168548]' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Store className="w-4 h-4" />
            Become a Seller
          </button>
          <button
            onClick={() => handleNavClick('partner')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold ${
              currentView === 'partner' ? 'bg-[#EAF7EE] text-[#168548]' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Bike className="w-4 h-4" />
            Become a Partner / Delivery
          </button>
          <button
            onClick={() => handleNavClick('tracking')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold ${
              currentView === 'tracking' ? 'bg-[#EAF7EE] text-[#168548]' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Clock className="w-4 h-4" />
            My Orders & Tracking
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold ${
              currentView === 'contact' ? 'bg-[#EAF7EE] text-[#168548]' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <PhoneCall className="w-4 h-4" />
            Contact & Support
          </button>
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => handleNavClick('admin')}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-900 text-white rounded-lg text-xs font-bold"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Admin Portal Dashboard
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
