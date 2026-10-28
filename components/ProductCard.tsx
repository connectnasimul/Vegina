'use client';

import React from 'react';
import { Product } from '@/types/ecommerce';
import { useAuthAndCart } from '@/context/AuthAndCartContext';
import { Plus, Minus, Heart, Eye, Star, ShieldCheck, Sparkles, MapPin } from 'lucide-react';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const {
    cart,
    addToCart,
    updateQuantity,
    isInWishlist,
    toggleWishlist,
    setQuickViewProduct,
    t,
    lang,
  } = useAuthAndCart();

  const cartItem = cart.find((item) => item.product.id === product.id);
  const inWishlist = isInWishlist(product.id);

  const discountPercent =
    product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 hover:border-emerald-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group overflow-hidden">
      <div>
        {/* Image Container with Badges */}
        <div className="relative aspect-square w-full bg-emerald-50/30 overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            referrerPolicy="no-referrer"
          />

          {/* Badges on top left */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
            {product.badge && (
              <span className="bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
                {lang === 'bn' ? product.badgeBn || product.badge : product.badge}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-sm">
                -{discountPercent}%
              </span>
            )}
          </div>

          {/* Floating Actions on top right */}
          <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(product.id);
              }}
              className={`p-2 rounded-xl backdrop-blur-md shadow-md transition cursor-pointer ${
                inWishlist
                  ? 'bg-rose-500 text-white'
                  : 'bg-white/90 text-gray-600 hover:text-rose-500 hover:bg-white'
              }`}
              title="Save to Wishlist"
            >
              <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-white' : ''}`} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setQuickViewProduct(product);
              }}
              className="p-2 rounded-xl bg-white/90 text-gray-600 hover:text-emerald-700 hover:bg-white backdrop-blur-md shadow-md transition cursor-pointer opacity-90 sm:opacity-0 sm:group-hover:opacity-100"
              title="Quick View"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Farm Origin Strip at bottom of image */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
            <span className="bg-emerald-950/80 backdrop-blur-sm text-emerald-100 text-[10px] font-medium px-2 py-0.5 rounded-md truncate max-w-[85%] flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5 text-emerald-400 flex-shrink-0" />
              <span>{product.originBn || product.origin}</span>
            </span>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-4">
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="text-[11px] font-medium text-emerald-700 uppercase tracking-wider">
              {lang === 'bn' ? product.categoryNameBn : product.categoryName}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-gray-400 text-[10px]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3
            onClick={() => setQuickViewProduct(product)}
            className="font-bold text-gray-900 text-sm sm:text-base leading-snug line-clamp-1 hover:text-emerald-700 cursor-pointer transition"
          >
            {lang === 'bn' ? product.nameBn : product.name}
          </h3>

          {/* Unit / Weight */}
          <p className="text-xs text-gray-500 mt-0.5 font-medium">
            {product.unitBn || product.unit}
          </p>

          {/* Pricing */}
          <div className="flex items-baseline gap-2 mt-2.5">
            <span className="text-lg sm:text-xl font-black text-emerald-800">
              ৳{product.price}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through">
                ৳{product.originalPrice}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer: Add to Cart or Quantity Controls */}
      <div className="p-4 pt-0">
        {cartItem ? (
          <div className="flex items-center justify-between bg-emerald-50 border border-emerald-300 rounded-xl p-1 text-emerald-900 shadow-inner">
            <button
              onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
              className="w-8 h-8 rounded-lg bg-white hover:bg-emerald-100 flex items-center justify-center text-emerald-800 shadow-sm transition active:scale-95 cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-black text-sm px-2">{cartItem.quantity} in Cart</span>
            <button
              onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
              className="w-8 h-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-sm transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => addToCart(product, 1)}
            className="w-full bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-700/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t('Add to Cart', 'কার্টে যোগ করুন')}</span>
          </button>
        )}
      </div>
    </div>
  );
}
