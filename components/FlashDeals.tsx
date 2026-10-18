'use client';

import React, { useState, useEffect } from 'react';
import { useAuthAndCart } from '@/context/AuthAndCartContext';
import { PRODUCTS } from '@/data/products';
import { Flame, Clock, Plus, Eye, Heart } from 'lucide-react';
import Image from 'next/image';

export default function FlashDeals() {
  const { addToCart, isInWishlist, toggleWishlist, setQuickViewProduct, t, lang } = useAuthAndCart();

  // Simulated countdown timer: 8 hours remaining
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 42, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 8, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Pick deals items with discount
  const dealProducts = PRODUCTS.filter((p) => p.originalPrice > p.price).slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-amber-50 via-emerald-50/50 to-orange-50 border border-amber-200/60 rounded-3xl p-6 sm:p-8">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-amber-200/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider bg-amber-200/60 px-2.5 py-0.5 rounded-full">
                  {t('Today Only', 'শুধু আজকের জন্য')}
                </span>
                <span className="text-xs font-semibold text-emerald-700">
                  {t('Up to 30% OFF', 'সর্বোচ্চ ৩০% পর্যন্ত ছাড়')}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 mt-0.5">
                {t('Flash Deals & Harvest Offers', 'আজকের তাজা ফ্ল্যাশ ডিল')}
              </h3>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2 bg-white/90 border border-amber-200 px-4 py-2 rounded-2xl shadow-sm self-start md:self-auto">
            <Clock className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-bold text-gray-700">{t('Ends In:', 'অফার শেষ হতে বাকি:')}</span>
            <div className="flex items-center gap-1 font-mono font-black text-sm text-gray-900">
              <span className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span>:</span>
              <span className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        {/* Deals Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {dealProducts.map((product) => {
            const discountPercent = Math.round(
              ((product.originalPrice - product.price) / product.originalPrice) * 100
            );
            const inWishlist = isInWishlist(product.id);
            const soldPercent = Math.min(
              100,
              Math.round((product.soldCount / (product.soldCount + product.stockQuantity)) * 100)
            );

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-amber-100 p-4 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Image + Badges */}
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 mb-3">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />

                    {/* Discount Badge */}
                    <div className="absolute top-2.5 left-2.5 bg-rose-500 text-white font-black text-xs px-2 py-0.5 rounded-lg shadow-sm">
                      -{discountPercent}%
                    </div>

                    {/* Wishlist and Quickview Floating buttons */}
                    <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className={`p-2 rounded-xl backdrop-blur-md transition cursor-pointer shadow-md ${
                          inWishlist
                            ? 'bg-rose-500 text-white'
                            : 'bg-white/90 text-gray-700 hover:text-rose-500 hover:bg-white'
                        }`}
                        title="Wishlist"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>
                      <button
                        onClick={() => setQuickViewProduct(product)}
                        className="p-2 rounded-xl bg-white/90 text-gray-700 hover:text-emerald-700 hover:bg-white backdrop-blur-md shadow-md transition cursor-pointer"
                        title="Quick View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Origin pill */}
                    <div className="absolute bottom-2 left-2 bg-emerald-950/70 text-emerald-100 backdrop-blur-sm text-[10px] font-semibold px-2 py-0.5 rounded-md">
                      {product.originBn || product.origin}
                    </div>
                  </div>

                  {/* Title & Unit */}
                  <h4 className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-emerald-700 transition">
                    {lang === 'bn' ? product.nameBn : product.name}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">{product.unitBn || product.unit}</p>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-lg font-black text-emerald-800">৳{product.price}</span>
                    <span className="text-xs text-gray-400 line-through">
                      ৳{product.originalPrice}
                    </span>
                  </div>

                  {/* Stock Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-[11px] text-gray-500 mb-1 font-medium">
                      <span>{t('Available:', 'মজুদ:')} {product.stockQuantity}</span>
                      <span>{t('Sold:', 'বিক্রি:')} {product.soldCount}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${soldPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => addToCart(product, 1)}
                  className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-600/20 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('Add to Cart', 'কার্টে যোগ করুন')}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
