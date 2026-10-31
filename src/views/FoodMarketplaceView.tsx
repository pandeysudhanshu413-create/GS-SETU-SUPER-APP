import React, { useState } from 'react';
import { FoodProduct } from '../types';
import { ProductCard } from '../components/ProductCard';
import {
  UtensilsCrossed,
  Search,
  Filter,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

interface FoodMarketplaceViewProps {
  products: FoodProduct[];
  loading: boolean;
  error: string | null;
  onRefreshProducts: () => void;
  cartQuantities: Record<string, number>;
  onAddToCart: (product: FoodProduct) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onOpenProductDetails: (product: FoodProduct) => void;
  openCart: () => void;
  cartCount: number;
  cartTotal: number;
  selectedLocation: string;
  openLocationModal: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const FoodMarketplaceView: React.FC<FoodMarketplaceViewProps> = ({
  products,
  loading,
  error,
  onRefreshProducts,
  cartQuantities,
  onAddToCart,
  onUpdateQuantity,
  onOpenProductDetails,
  openCart,
  cartCount,
  cartTotal,
  selectedLocation,
  openLocationModal,
  searchQuery,
  setSearchQuery
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [vegOnly, setVegOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'prep'>('featured');

  // Categories
  const categories = [
    'All',
    'Maggi & Noodles',
    'Pasta & Italian',
    'Desi Macaroni',
    'Tea & Snacks'
  ];

  // Filtering
  const filteredProducts = products.filter((p) => {
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchSeller = p.sellerName.toLowerCase().includes(q);
      const matchTags = p.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchSeller && !matchTags) return false;
    }
    // Category
    if (selectedCategory !== 'All' && p.category !== selectedCategory) {
      return false;
    }
    // Veg only
    if (vegOnly && !p.isVeg) {
      return false;
    }
    return true;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'prep') return a.preparationTimeMinutes - b.preparationTimeMinutes;
    return 0; // default featured order
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 pb-24">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0B4626] to-[#168548] text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 bg-emerald-800/80 text-emerald-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            GS Setu Active Kitchen Pilot
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Fresh Village Kitchens & Desi Snacks
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            Order authentic Masala Maggi, Cheese Maggi, Red & White Sauce Pasta, and home-style spicy macaroni. Made to order by local women chefs and neighborhood cooks!
          </p>
        </div>

        {/* Location badge in banner */}
        <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/20 text-xs space-y-2 shrink-0 w-full sm:w-auto">
          <div className="text-emerald-200 uppercase font-bold text-[10px]">Active Hub</div>
          <div className="font-extrabold text-sm flex items-center gap-2 text-white">
            <MapPin className="w-4 h-4 text-emerald-300" />
            <span>{selectedLocation}</span>
          </div>
          <button
            onClick={openLocationModal}
            className="text-[11px] font-bold text-emerald-300 hover:text-white underline cursor-pointer"
          >
            Change Location
          </button>
        </div>
      </div>

      {/* Filter and Search Bar Controls */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#168548] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Quick Filters: Veg Only & Sort */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 cursor-pointer select-none hover:border-emerald-300">
              <input
                type="checkbox"
                checked={vegOnly}
                onChange={(e) => setVegOnly(e.target.checked)}
                className="rounded-xs text-[#168548] focus:ring-[#168548] w-4 h-4 cursor-pointer"
              />
              <span className="flex items-center gap-1 text-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                Pure Veg Only
              </span>
            </label>

            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
              <span className="text-slate-400 font-semibold">Sort:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-transparent font-bold text-slate-800 focus:outline-hidden cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="prep">Fastest (Prep Time)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Search status indicator if active */}
        {searchQuery.trim() && (
          <div className="flex items-center justify-between bg-slate-100 px-4 py-2 rounded-xl text-xs text-slate-700">
            <span>
              Showing results for: <strong>"{searchQuery}"</strong> ({sortedProducts.length} items found)
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="font-bold text-[#168548] hover:underline cursor-pointer"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-200 border-t-[#168548] rounded-full animate-spin"></div>
          <p className="text-sm text-slate-500 font-medium">Loading fresh menu from local kitchens...</p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-center space-y-3 max-w-md mx-auto">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
          <h3 className="font-bold text-base text-red-900">Failed to Load Menu</h3>
          <p className="text-xs text-red-700">{error}</p>
          <button
            onClick={onRefreshProducts}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && (
        <>
          {sortedProducts.length === 0 ? (
            <div className="text-center py-16 space-y-3 bg-white rounded-3xl border border-slate-200 p-8">
              <UtensilsCrossed className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">No dishes match your filters</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try selecting "All" categories or clearing your search term to see all our delicious items.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setVegOnly(false);
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-[#168548] text-white rounded-xl text-xs font-bold hover:bg-[#126e3c] cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
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
          )}
        </>
      )}

      {/* Floating Bottom Cart Bar (appears when items are in cart) */}
      {cartCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto z-40 animate-in slide-in-from-bottom duration-200">
          <div
            onClick={openCart}
            className="bg-[#0B4626] text-white rounded-2xl p-4 shadow-2xl flex items-center justify-between cursor-pointer hover:bg-[#08381e] transition-colors border border-emerald-500/30"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#168548] flex items-center justify-center font-black text-sm">
                {cartCount}
              </div>
              <div>
                <div className="text-xs uppercase font-bold text-emerald-300">
                  {cartCount} {cartCount === 1 ? 'Dish' : 'Dishes'} in Cart
                </div>
                <div className="text-base font-black">₹{cartTotal} Total</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3.5 py-2 rounded-xl transition-colors">
              <span>View Cart & Order</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
