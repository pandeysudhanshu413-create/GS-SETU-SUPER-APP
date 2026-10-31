import React from 'react';
import { SUPER_APP_SERVICES } from '../data/servicesData';
import { FoodProduct, ServiceCategory } from '../types';
import { ProductCard } from '../components/ProductCard';
import {
  UtensilsCrossed,
  ArrowRight,
  Sparkles,
  MapPin,
  ShieldCheck,
  Users,
  TrendingUp,
  Heart,
  Store,
  Bike,
  CheckCircle2,
  Clock,
  PhoneCall,
  Search,
  BookOpen,
  Apple,
  ShoppingBag,
  Car,
  Wrench,
  Layers
} from 'lucide-react';

interface HomeViewProps {
  products: FoodProduct[];
  cartQuantities: Record<string, number>;
  onAddToCart: (product: FoodProduct) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onOpenProductDetails: (product: FoodProduct) => void;
  onSelectService: (service: ServiceCategory) => void;
  setCurrentView: (view: string) => void;
  selectedLocation: string;
  openLocationModal: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  products,
  cartQuantities,
  onAddToCart,
  onUpdateQuantity,
  onOpenProductDetails,
  onSelectService,
  setCurrentView,
  selectedLocation,
  openLocationModal
}) => {
  // Get icon component dynamically
  const renderIcon = (name: string, className = 'w-6 h-6') => {
    switch (name) {
      case 'UtensilsCrossed':
        return <UtensilsCrossed className={className} />;
      case 'BookOpen':
        return <BookOpen className={className} />;
      case 'Apple':
        return <Apple className={className} />;
      case 'ShoppingBag':
        return <ShoppingBag className={className} />;
      case 'Car':
        return <Car className={className} />;
      case 'Bike':
        return <Bike className={className} />;
      case 'Wrench':
        return <Wrench className={className} />;
      default:
        return <Layers className={className} />;
    }
  };

  // Top 6 featured food items (Masala Maggi, Cheese Maggi, Red Sauce Pasta, White Sauce Pasta, Masala Macaroni, Chatpata Macaroni)
  const featuredFood = products.slice(0, 6);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#EAF7EE] via-white to-white pt-10 sm:pt-16 pb-12 sm:pb-20 border-b border-slate-100">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-200/40 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-emerald-100/60 blur-2xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Headlines & Call to Actions */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Founder badge & local mission */}
              <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2 bg-white px-3.5 py-1.5 rounded-full border border-emerald-200 shadow-2xs text-xs font-semibold text-[#0B4626]">
                <span className="bg-[#168548] text-white px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                  GS SETU
                </span>
                <span>Founded by Sudhanshu Pandey</span>
                <span className="text-slate-300 hidden sm:inline">•</span>
                <span className="text-slate-600 hidden sm:inline">Local Seva | Local Growth</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0B4626] tracking-tight leading-[1.15]">
                Your Local World, <br />
                <span className="text-[#168548]">All in One Place.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Discover local products, food, transport, and everyday services through GS Setu.
                Connecting villages, small towns, cities, and micro-entrepreneurs across India.
              </p>

              {/* Location Strip */}
              <div className="inline-flex items-center gap-2.5 bg-white/90 backdrop-blur-xs p-2 rounded-2xl border border-slate-200 shadow-xs max-w-md w-full justify-between">
                <div className="flex items-center gap-2 pl-2 overflow-hidden text-left">
                  <MapPin className="w-4 h-4 text-[#168548] shrink-0" />
                  <div className="truncate">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                      Delivering to:
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-800 truncate block">
                      {selectedLocation}
                    </span>
                  </div>
                </div>
                <button
                  onClick={openLocationModal}
                  className="px-3 py-1.5 bg-[#EAF7EE] text-[#168548] hover:bg-emerald-100 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
                >
                  Change
                </button>
              </div>

              {/* Hero Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  onClick={() => setCurrentView('food')}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#168548] hover:bg-[#126e3c] text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
                >
                  <UtensilsCrossed className="w-5 h-5" />
                  <span>Order Food (Live Pilot)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentView('services')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm sm:text-base border border-slate-300 shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Layers className="w-4 h-4 text-[#168548]" />
                  <span>Explore All Services (8)</span>
                </button>
              </div>

              {/* Value Props Pills */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-200/80 text-center">
                <div className="p-2">
                  <div className="font-extrabold text-[#0B4626] text-sm sm:text-lg">15-25 min</div>
                  <div className="text-[11px] text-slate-500 font-medium">Quick Local Delivery</div>
                </div>
                <div className="p-2 border-x border-slate-200">
                  <div className="font-extrabold text-[#0B4626] text-sm sm:text-lg">₹40 Onwards</div>
                  <div className="text-[11px] text-slate-500 font-medium">Budget Friendly Menu</div>
                </div>
                <div className="p-2">
                  <div className="font-extrabold text-[#0B4626] text-sm sm:text-lg">100% Verified</div>
                  <div className="text-[11px] text-slate-500 font-medium">Village Kitchens & Stores</div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Card Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-emerald-100 space-y-5">
                {/* Visual Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="font-bold text-sm text-[#0B4626]">GS Setu Live Hub</span>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#EAF7EE] text-[#168548] px-2.5 py-1 rounded-full border border-emerald-200">
                    Active in {selectedLocation.split(',')[0]}
                  </span>
                </div>

                {/* Live Food Highlight Card */}
                <div
                  onClick={() => setCurrentView('food')}
                  className="p-4 rounded-2xl bg-gradient-to-br from-[#EAF7EE] to-white border border-emerald-200 cursor-pointer hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold text-[#168548] uppercase tracking-wider bg-white px-2 py-0.5 rounded-sm border border-emerald-100">
                        Live Food Service
                      </span>
                      <h4 className="font-black text-slate-900 text-base group-hover:text-[#168548] transition-colors">
                        Masala Maggi & Desi Pasta
                      </h4>
                      <p className="text-xs text-slate-500">
                        Prepared fresh by Asha Devi & local cooks. 6 delicious dishes starting at ₹40!
                      </p>
                    </div>
                    <img
                      src="https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=150&q=80"
                      alt="Masala Maggi"
                      className="w-16 h-16 rounded-xl object-cover shadow-xs group-hover:scale-105 transition-transform shrink-0"
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-emerald-100/60 font-bold text-[#168548]">
                    <span>Order Now with Instant Confirmation</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Coming soon teaser categories inside card */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Coming Soon to GS Setu
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-sky-600 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-800">Stationery</div>
                        <div className="text-[10px] text-slate-400">Exam guides & books</div>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                      <Car className="w-4 h-4 text-purple-600 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-800">Transport</div>
                        <div className="text-[10px] text-slate-400">Auto & e-rickshaws</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social proof footer */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#168548]" />
                    <span>Persistent database verified</span>
                  </div>
                  <span className="font-semibold text-[#0B4626]">UPI & Cash on Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SUPER APP SERVICE CATEGORIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#168548] mb-1">
              <Sparkles className="w-4 h-4" />
              GS Setu Ecosystem Directory
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0B4626] tracking-tight">
              All Super App Services
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              One unified platform for your village and town. Food ordering is fully active; other categories are actively being integrated on our roadmap.
            </p>
          </div>
          <button
            onClick={() => setCurrentView('services')}
            className="self-start md:self-auto flex items-center gap-1.5 text-sm font-bold text-[#168548] hover:text-[#0B4626] transition-colors cursor-pointer"
          >
            <span>View All 8 Categories</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 8 Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {SUPER_APP_SERVICES.map((service) => {
            const isEnabled = service.badge === 'Enabled';
            return (
              <div
                key={service.id}
                className={`rounded-2xl p-5 border transition-all flex flex-col justify-between group ${
                  isEnabled
                    ? 'bg-gradient-to-b from-[#EAF7EE] to-white border-[#168548] shadow-md ring-1 ring-[#168548]/30'
                    : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                <div>
                  {/* Top Bar: Icon & Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                        isEnabled
                          ? 'bg-[#168548] text-white shadow-md shadow-emerald-900/20'
                          : 'bg-slate-100 text-slate-600 group-hover:bg-emerald-50 group-hover:text-[#168548]'
                      }`}
                    >
                      {renderIcon(service.iconName, 'w-6 h-6')}
                    </div>

                    <span
                      className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        isEnabled
                          ? 'bg-[#168548] text-white shadow-xs'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {service.badge}
                    </span>
                  </div>

                  {/* Title & Hindi Title */}
                  <h3 className="font-extrabold text-base text-slate-900 group-hover:text-[#168548] transition-colors">
                    {service.name}
                  </h3>
                  <div className="text-xs text-slate-400 font-medium mb-2">
                    {service.hindiName}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                    {service.description}
                  </p>
                </div>

                {/* Bottom Action */}
                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={() => {
                      if (isEnabled) {
                        setCurrentView('food');
                      } else {
                        onSelectService(service);
                      }
                    }}
                    className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isEnabled
                        ? 'bg-[#168548] hover:bg-[#126e3c] text-white shadow-xs'
                        : 'bg-slate-50 hover:bg-[#EAF7EE] text-slate-700 hover:text-[#168548] border border-slate-200'
                    }`}
                  >
                    <span>{isEnabled ? 'Order Food Now' : 'View Service Preview'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. PROMINENT FOOD SERVICE SECTION WITH LIVE ORDERING CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-[#0B4626] to-[#168548] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden mb-8">
          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-xs text-emerald-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Active Service: Food Marketplace
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Hot Masala Maggi, Creamy Pasta & Desi Macaroni
            </h2>
            <p className="text-emerald-100 text-xs sm:text-base leading-relaxed">
              Craving something fresh, tasty, and prepared with care? Our local kitchens and village cooks are ready to take your order right now with live tracking and instant notifications.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => setCurrentView('food')}
                className="bg-white hover:bg-emerald-50 text-[#0B4626] font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <span>Browse Full Menu & Order</span>
                <ArrowRight className="w-4 h-4 text-[#168548]" />
              </button>
              <button
                onClick={() => setCurrentView('tracking')}
                className="bg-emerald-900/60 hover:bg-emerald-900/80 text-white font-semibold text-xs sm:text-sm px-4 py-3 rounded-xl border border-emerald-400/30 transition-colors cursor-pointer"
              >
                Track Existing Order
              </button>
            </div>
          </div>
        </div>

        {/* 6 Demo Products Showcase */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-[#0B4626]">
                Popular Dishes Ready to Order
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Piping hot and made to order in {selectedLocation.split(',')[0]}
              </p>
            </div>
            <button
              onClick={() => setCurrentView('food')}
              className="text-xs sm:text-sm font-bold text-[#168548] hover:text-[#0B4626] flex items-center gap-1 cursor-pointer"
            >
              <span>See All Menu</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredFood.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                cartQuantity={cartQuantities[product.id] || 0}
                onAddToCart={onAddToCart}
                onUpdateQuantity={onUpdateQuantity}
                onOpenDetails={onOpenProductDetails}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. SUPPORT LOCAL BUSINESSES SECTION */}
      <section className="bg-[#EAF7EE]/50 py-16 border-y border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#168548] bg-white px-3 py-1 rounded-full border border-emerald-200 shadow-2xs inline-block">
              Empowering Grassroots India
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#0B4626]">
              Support Local Businesses & Village Women
            </h2>
            <p className="text-sm text-slate-600">
              GS Setu creates a direct bridge for micro-entrepreneurs who lack digital storefronts. Every order directly supports a home kitchen, small shop, or rural family.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Spotlight 1 */}
            <div className="bg-white rounded-2xl p-6 border border-emerald-200/80 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#EAF7EE] text-[#168548] flex items-center justify-center font-bold">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">
                Village Women Self-Help Groups
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Home makers in villages like Rohania and Bithoor are earning independent income by preparing authentic masala macaroni, pickles, and hot snacks with zero commission fees.
              </p>
              <div className="pt-2 text-xs font-semibold text-[#168548] flex items-center gap-1">
                <span>Featured: Asha Devi Rasoi</span>
              </div>
            </div>

            {/* Spotlight 2 */}
            <div className="bg-white rounded-2xl p-6 border border-emerald-200/80 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#EAF7EE] text-[#168548] flex items-center justify-center font-bold">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">
                Small Town Cafes & Dhabas
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Local fast food stalls at tehsil chaurahas and railway crossings get a digital order counter. High-tech order notifications without costly POS hardware.
              </p>
              <div className="pt-2 text-xs font-semibold text-[#168548] flex items-center gap-1">
                <span>Featured: Kashi Fast Food & Cafe</span>
              </div>
            </div>

            {/* Spotlight 3 */}
            <div className="bg-white rounded-2xl p-6 border border-emerald-200/80 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#EAF7EE] text-[#168548] flex items-center justify-center font-bold">
                <Bike className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">
                Local Youth Delivery Captains
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Providing local college students and youth with bicycles or bikes a flexible way to earn ₹300-₹800 daily delivering orders within a 5 km radius.
              </p>
              <div className="pt-2 text-xs font-semibold text-[#168548] flex items-center gap-1">
                <span>Doorstep delivery in 15-25 mins</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW GS SETU WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#168548]">
            Simple & Transparent
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0B4626]">
            How GS Setu Works for You
          </h2>
          <p className="text-sm text-slate-600">
            Designed to be effortless for users in both rural panchayats and busy city neighborhoods.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-[#EAF7EE] text-[#168548] font-black flex items-center justify-center text-lg">
              1
            </div>
            <h4 className="font-bold text-base text-slate-900">Choose Your Locality</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Select your village or town from our network or type your custom neighborhood to see localized vendors.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-[#EAF7EE] text-[#168548] font-black flex items-center justify-center text-lg">
              2
            </div>
            <h4 className="font-bold text-base text-slate-900">Order Fresh Food</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pick your favorite Maggi, pasta, or macaroni dishes. Customize quantities and enter your delivery address.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-[#EAF7EE] text-[#168548] font-black flex items-center justify-center text-lg">
              3
            </div>
            <h4 className="font-bold text-base text-slate-900">Real-Time Kitchen Updates</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Track your order from New → Accepted → Preparing → Out for Delivery with transparent timestamps.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-[#EAF7EE] text-[#168548] font-black flex items-center justify-center text-lg">
              4
            </div>
            <h4 className="font-bold text-base text-slate-900">Fast Local Delivery</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Hot meals brought straight to your doorstep by friendly local captains. Pay via UPI or Cash on delivery.
            </p>
          </div>
        </div>
      </section>

      {/* 6. EARN WITH GS SETU SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white border border-slate-800 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800">
                Partner Opportunities
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white">
                Earn & Grow with GS Setu
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Whether you run a small grocery store, cook delicious food at home, ride a two-wheeler, or work as an electrician, GS Setu is creating new avenues of revenue across Bharat.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Zero upfront listing fees for rural women & home cooks</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Direct customer connection without middleman commissions</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Flexible delivery shifts for students and local youth</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Digital visibility for electricians, plumbers & helpers</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                <button
                  onClick={() => setCurrentView('seller')}
                  className="px-5 py-3 rounded-xl bg-[#168548] hover:bg-[#126e3c] text-white font-bold text-xs sm:text-sm shadow-md transition-colors cursor-pointer"
                >
                  Apply as Food / Shop Seller
                </button>
                <button
                  onClick={() => setCurrentView('partner')}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-700 transition-colors cursor-pointer"
                >
                  Join as Delivery Captain / Helper
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-800/80 rounded-2xl p-6 border border-slate-700 space-y-4">
              <h4 className="font-bold text-base text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                The GS Setu Vision by Sudhanshu Pandey
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
                “Metros have multiple quick-commerce apps, but India's real strength lives in its 6 lakh villages and small towns. GS Setu was founded to build that bridge—ensuring local needs find local solutions, and every local talent has a market right at their doorstep.”
              </p>
              <div className="pt-2 border-t border-slate-700 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">Sudhanshu Pandey</div>
                  <div className="text-slate-400">Founder, GS Setu</div>
                </div>
                <span className="text-emerald-400 font-semibold">Local Seva | Local Growth</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
