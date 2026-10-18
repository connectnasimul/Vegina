'use client';

import React, { useState } from 'react';
import { useAuthAndCart } from '@/context/AuthAndCartContext';
import {
  X,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  Tag,
  Truck,
  ShieldCheck,
} from 'lucide-react';
import Image from 'next/image';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    discount,
    total,
    promoCode,
    promoError,
    applyPromo,
    removePromo,
    setIsCheckoutOpen,
    selectedDivision,
    t,
    lang,
  } = useAuthAndCart();

  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 1500;
  const progressToFreeShipping = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );
  const remainingForFree = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const success = applyPromo(couponInput);
    if (success) {
      setCouponInput('');
    }
  };

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-emerald-100 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-emerald-50/40">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">
                  {t('Your Fresh Basket', 'আপনার বাজার সদাই')}
                </h3>
                <p className="text-xs text-gray-500">
                  {cart.length} {t('unique items', 'প্রকার পণ্য')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-rose-600 hover:text-rose-800 font-medium px-2 py-1 rounded hover:bg-rose-50 transition cursor-pointer"
                  title="Clear all items"
                >
                  {t('Clear', 'খালি করুন')}
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-5 py-3 bg-emerald-100/40 border-b border-emerald-100 text-xs">
            {remainingForFree > 0 ? (
              <div>
                <div className="flex items-center justify-between text-emerald-950 font-semibold mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-emerald-700" />
                    {t(
                      `Add ৳${remainingForFree} more for FREE Delivery!`,
                      `আর মাত্র ৳${remainingForFree} টাকার পণ্য নিলেই ফ্রি ডেলিভারি!`
                    )}
                  </span>
                  <span className="text-emerald-700 font-bold">{progressToFreeShipping}%</span>
                </div>
                <div className="w-full bg-emerald-200/70 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${progressToFreeShipping}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-emerald-800 font-bold">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>
                  {t(
                    '🎉 You have unlocked FREE Express Delivery!',
                    '🎉 অভিনন্দন! আপনি ফ্রি হোম ডেলিভারি অফার পেয়েছেন!'
                  )}
                </span>
              </div>
            )}
          </div>

          {/* Items List (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 divide-y divide-gray-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ShoppingCart className="w-8 h-8 stroke-1" />
                </div>
                <h4 className="text-base font-bold text-gray-800">
                  {t('Your cart is empty', 'আপনার কার্ট এখন খালি')}
                </h4>
                <p className="text-xs text-gray-500 max-w-xs">
                  {t(
                    'Browse our farm fresh vegetables, fruits, honey and oils to add organic goodness to your meal.',
                    'আমাদের খাঁটি শাকসবজি, ফলমূল, মধু ও খাঁটি সরিষার তেল থেকে বাছাই করে বাজার করুন।'
                  )}
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-emerald-800 transition cursor-pointer"
                >
                  {t('Start Shopping', 'কেনাকাটা শুরু করুন')}
                </button>
              </div>
            ) : (
              cart.map(({ product, quantity }) => (
                <div key={product.id} className="pt-3 flex items-start gap-3 group">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                      {lang === 'bn' ? product.nameBn : product.name}
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {product.unitBn || product.unit} • ৳{product.price}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Controller */}
                      <div className="flex items-center border border-gray-200 rounded-lg p-0.5 bg-gray-50">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="w-6 h-6 rounded bg-white flex items-center justify-center text-gray-700 shadow-xs hover:bg-gray-100 transition active:scale-95 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center font-bold text-xs text-gray-900">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="w-6 h-6 rounded bg-white flex items-center justify-center text-gray-700 shadow-xs hover:bg-gray-100 transition active:scale-95 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <div className="text-right">
                        <span className="font-bold text-sm text-emerald-800">
                          ৳{product.price * quantity}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="p-1 text-gray-300 hover:text-rose-500 transition cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Area: Promo Code, Pricing Breakdown & Checkout Button */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50/50 space-y-3.5">
              {/* Promo Code Form */}
              <div>
                {promoCode ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-2 rounded-xl text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{promoCode}</span>
                      <span className="text-[10px] font-normal text-emerald-600">
                        (-৳{discount})
                      </span>
                    </div>
                    <button
                      onClick={removePromo}
                      className="text-xs text-rose-500 hover:text-rose-700 font-semibold cursor-pointer"
                    >
                      {t('Remove', 'মুছুন')}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder={t('Promo Code (e.g. VEGINA100)', 'প্রোমো কোড (যেমন VEGINA100)')}
                      className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-emerald-500 uppercase tracking-wider"
                    />
                    <button
                      type="submit"
                      className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      {t('Apply', 'প্রয়োগ')}
                    </button>
                  </form>
                )}
                {promoError && (
                  <p className="text-[11px] text-rose-600 mt-1 font-medium">{promoError}</p>
                )}
              </div>

              {/* Price Calculation */}
              <div className="space-y-1.5 text-xs text-gray-600 border-t border-gray-200/60 pt-2.5">
                <div className="flex justify-between">
                  <span>{t('Subtotal', 'মোট পণ্য মূল্য')}</span>
                  <span className="font-semibold text-gray-900">৳{subtotal}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>
                    {t('Home Delivery', 'ডেলিভারি চার্জ')} ({selectedDivision.split(' ')[0]})
                  </span>
                  <span className="font-semibold text-gray-900">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-600 font-bold">{t('FREE', 'ফ্রি')}</span>
                    ) : (
                      `৳${deliveryFee}`
                    )}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>{t('Promo Discount', 'বিশেষ ছাড়')}</span>
                    <span>-৳{discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm sm:text-base font-black text-gray-900 border-t border-gray-200/80 pt-2">
                  <span>{t('Grand Total', 'সর্বমোট')}</span>
                  <span className="text-emerald-800">৳{total}</span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <button
                onClick={handleProceedCheckout}
                className="w-full bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white py-3.5 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/25 transition cursor-pointer"
              >
                <span>{t('Proceed to Checkout', 'অর্ডার করতে এগিয়ে যান')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
