'use client';

import React, { useState } from 'react';
import { useAuthAndCart } from '@/context/AuthAndCartContext';
import { X, Star, Plus, Minus, Heart, ShieldCheck, Truck, RefreshCw, Leaf } from 'lucide-react';
import Image from 'next/image';

export default function QuickViewModal() {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    isInWishlist,
    toggleWishlist,
    t,
    lang,
  } = useAuthAndCart();

  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const inWishlist = isInWishlist(product.id);
  const discountPercent =
    product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuickViewProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-100 max-h-[90vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-gray-100 text-gray-700 flex items-center justify-center transition cursor-pointer shadow-md"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Product Image Section */}
        <div className="relative w-full md:w-1/2 aspect-square md:aspect-auto bg-emerald-50/50 min-h-[260px]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 350px"
            className="object-cover"
            referrerPolicy="no-referrer"
          />
          {product.badge && (
            <span className="absolute top-4 left-4 bg-emerald-700 text-white text-xs font-black uppercase px-2.5 py-1 rounded-lg shadow-md">
              {lang === 'bn' ? product.badgeBn || product.badge : product.badge}
            </span>
          )}
        </div>

        {/* Product Details Section */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-3">
            {/* Category & Rating */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="font-semibold text-emerald-700 uppercase tracking-wider">
                {lang === 'bn' ? product.categoryNameBn : product.categoryName}
              </span>
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                <span className="text-gray-400 text-[10px]">({product.reviewCount} reviews)</span>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-xl font-black text-gray-900 leading-snug">
              {lang === 'bn' ? product.nameBn : product.name}
            </h2>

            {/* Price & Unit */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-black text-emerald-800">৳{product.price}</span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-gray-400 line-through">৳{product.originalPrice}</span>
              )}
              <span className="text-xs bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                {product.unitBn || product.unit}
              </span>
            </div>

            {/* Description */}
            <p className="text-xs text-gray-600 leading-relaxed">
              {lang === 'bn' ? product.descriptionBn : product.description}
            </p>

            {/* Origin & Specs */}
            <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">{t('Harvest Origin:', 'উৎপাদন স্থল:')}</span>
                <span className="font-semibold text-gray-800">{product.originBn || product.origin}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{t('Shelf Life:', 'সংরক্ষণকাল:')}</span>
                <span className="font-semibold text-gray-800">
                  {lang === 'bn' ? product.nutrition.shelfLifeBn : product.nutrition.shelfLife}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{t('Quality Seal:', 'মানদণ্ড:')}</span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {t('100% Pesticide Free', '১০০% বিষমুক্ত অর্গানিক')}
                </span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-gray-100 mt-4 space-y-3">
            <div className="flex items-center gap-3">
              {/* Quantity Picker */}
              <div className="flex items-center border border-gray-200 rounded-xl p-1 bg-gray-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-700 shadow-sm hover:bg-gray-100 cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center font-bold text-sm text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-700 shadow-sm hover:bg-gray-100 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-4 rounded-xl text-sm shadow-md shadow-emerald-700/20 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>
                  {t('Add to Cart', 'কার্টে যোগ করুন')} • ৳{product.price * quantity}
                </span>
              </button>

              {/* Wishlist toggle */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3 rounded-xl border transition cursor-pointer ${
                  inWishlist
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
