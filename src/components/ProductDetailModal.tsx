import React, { useState } from 'react';
import { FoodProduct } from '../types';
import { X, Plus, Minus, Clock, Star, Store, ShieldCheck, Heart, Sparkles, Check } from 'lucide-react';

interface ProductDetailModalProps {
  product: FoodProduct | null;
  onClose: () => void;
  cartQuantity: number;
  onAddToCart: (product: FoodProduct) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  cartQuantity,
  onAddToCart,
  onUpdateQuantity
}) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
        {/* Top image section */}
        <div className="relative h-64 sm:h-72 w-full bg-slate-100 shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80';
            }}
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badges on image */}
          <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
            <span className="bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg text-xs font-bold text-emerald-800 flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              {product.isVeg ? '100% Pure Veg' : 'Non-Veg'}
            </span>
            <span className="bg-black/70 backdrop-blur-xs px-2.5 py-1 rounded-lg text-xs font-semibold text-white flex items-center gap-1 shadow-sm">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              {product.preparationTimeMinutes} Mins Prep Time
            </span>
          </div>
        </div>

        {/* Modal body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Category & Tags */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#168548] bg-[#EAF7EE] px-2.5 py-1 rounded-md border border-emerald-100">
              {product.category}
            </span>
            <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span className="font-bold text-xs text-amber-800">{product.rating}</span>
              <span className="text-[11px] text-amber-600">({product.reviewCount} village reviews)</span>
            </div>
          </div>

          {/* Title & Price */}
          <div>
            <h2 className="text-2xl font-black text-slate-900">{product.name}</h2>
            <div className="flex items-baseline gap-2.5 mt-2">
              <span className="text-3xl font-black text-[#0B4626]">₹{product.price}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-base text-slate-400 line-through">₹{product.originalPrice}</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-sm">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">About This Dish</h4>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              {product.description}
            </p>
          </div>

          {/* Seller / Kitchen info */}
          <div className="bg-[#EAF7EE]/60 rounded-2xl p-4 border border-emerald-100 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0B4626] uppercase tracking-wider">
              <Store className="w-4 h-4 text-[#168548]" />
              Local Kitchen & Seller Partner
            </div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-bold text-slate-900 text-sm">{product.sellerName}</div>
                <div className="text-xs text-slate-600">{product.sellerLocation}</div>
              </div>
              <span className="bg-white text-emerald-800 text-[10px] font-bold px-2 py-1 rounded-md border border-emerald-200 shrink-0">
                FSSAI & Hygiene Verified
              </span>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Prepared fresh upon receiving your order using fresh ingredients from local mandis.
            </p>
          </div>

          {/* Tags */}
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Highlights</div>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-xs font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg"
                >
                  <Sparkles className="w-3 h-3 text-[#168548]" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal footer / CTA */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Total Price</div>
            <div className="text-xl font-black text-[#0B4626]">
              ₹{product.price * Math.max(1, cartQuantity)}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {cartQuantity > 0 ? (
              <div className="flex items-center gap-3 bg-white border border-emerald-300 rounded-xl p-1 shadow-xs">
                <button
                  onClick={() => onUpdateQuantity(product.id, cartQuantity - 1)}
                  className="w-9 h-9 rounded-lg bg-emerald-50 text-[#168548] hover:bg-emerald-100 flex items-center justify-center font-bold text-base transition-colors cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-6 text-center font-black text-base text-[#0B4626]">
                  {cartQuantity}
                </span>
                <button
                  onClick={() => onUpdateQuantity(product.id, cartQuantity + 1)}
                  className="w-9 h-9 rounded-lg bg-[#168548] text-white hover:bg-[#126e3c] flex items-center justify-center font-bold text-base transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onAddToCart(product)}
                disabled={!product.isAvailable}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#168548] hover:bg-[#126e3c] disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-emerald-900/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
