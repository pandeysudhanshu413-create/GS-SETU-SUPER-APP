import React from 'react';
import { FoodProduct } from '../types';
import { Plus, Minus, Clock, Star, Store, Check, AlertCircle } from 'lucide-react';

interface ProductCardProps {
  product: FoodProduct;
  cartQuantity: number;
  onAddToCart: (product: FoodProduct) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onOpenDetails: (product: FoodProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  cartQuantity,
  onAddToCart,
  onUpdateQuantity,
  onOpenDetails
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden group">
      {/* Image container */}
      <div
        className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-100 cursor-pointer"
        onClick={() => onOpenDetails(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Veg badge */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2 py-1 rounded-md shadow-xs flex items-center gap-1.5 border border-slate-200">
          <div className="w-3 h-3 rounded-xs border-2 border-emerald-600 flex items-center justify-center p-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-600"></div>
          </div>
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
            {product.isVeg ? 'Veg' : 'Non-Veg'}
          </span>
        </div>

        {/* Prep time badge */}
        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-1 rounded-md flex items-center gap-1">
          <Clock className="w-3 h-3 text-emerald-400" />
          <span>{product.preparationTimeMinutes} min</span>
        </div>

        {/* Availability overlay if out of stock */}
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 text-center">
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              Temporarily Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            {product.tags.slice(0, 2).map((tag, i) => (
              <span
                key={i}
                className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-[#EAF7EE] text-[#168548] border border-emerald-100"
              >
                {tag}
              </span>
            ))}
            <div className="ml-auto flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-sm">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>{product.rating}</span>
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={() => onOpenDetails(product)}
            className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#168548] transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          {/* Description snippet */}
          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>

          {/* Seller tag */}
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-600">
            <Store className="w-3.5 h-3.5 text-[#168548] shrink-0" />
            <span className="truncate">
              <strong>{product.sellerName}</strong> • {product.sellerLocation}
            </span>
          </div>
        </div>

        {/* Price & Quantity / Add Button */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Price</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-[#0B4626]">
                ₹{product.price}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
          </div>

          <div>
            {!product.isAvailable ? (
              <button
                disabled
                className="px-3 py-1.5 bg-slate-100 text-slate-400 rounded-xl text-xs font-bold cursor-not-allowed"
              >
                Unavailable
              </button>
            ) : cartQuantity > 0 ? (
              <div className="flex items-center gap-2 bg-[#EAF7EE] border border-emerald-300 rounded-xl p-1 shadow-xs">
                <button
                  onClick={() => onUpdateQuantity(product.id, cartQuantity - 1)}
                  className="w-7 h-7 rounded-lg bg-white text-[#168548] hover:bg-emerald-100 flex items-center justify-center font-bold text-sm shadow-2xs transition-colors cursor-pointer"
                  title="Decrease"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-5 text-center font-extrabold text-sm text-[#0B4626]">
                  {cartQuantity}
                </span>
                <button
                  onClick={() => onUpdateQuantity(product.id, cartQuantity + 1)}
                  className="w-7 h-7 rounded-lg bg-[#168548] text-white hover:bg-[#126e3c] flex items-center justify-center font-bold text-sm shadow-2xs transition-colors cursor-pointer"
                  title="Increase"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onAddToCart(product)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#168548] hover:bg-[#126e3c] text-white text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
