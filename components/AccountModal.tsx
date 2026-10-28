'use client';

import React, { useState } from 'react';
import { useAuthAndCart } from '@/context/AuthAndCartContext';
import { PRODUCTS } from '@/data/products';
import {
  X,
  User as UserIcon,
  Package,
  Heart,
  Clock,
  CheckCircle2,
  Truck,
  RotateCcw,
  LogOut,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  MapPin,
} from 'lucide-react';
import Image from 'next/image';

export default function AccountModal() {
  const {
    user,
    signInWithGoogle,
    signOut,
    isAdmin,
    orders,
    wishlist,
    toggleWishlist,
    addToCart,
    isAccountOpen,
    setIsAccountOpen,
    setIsAdminModalOpen,
    t,
    lang,
    showToast,
  } = useAuthAndCart();

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist'>('orders');

  if (!isAccountOpen) return null;

  const wishlistProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Processing':
        return {
          bg: 'bg-amber-100 text-amber-900 border-amber-300',
          icon: Clock,
          label: lang === 'bn' ? 'প্রসেসিং হচ্ছে' : 'Processing',
        };
      case 'Farm Dispatched':
        return {
          bg: 'bg-sky-100 text-sky-900 border-sky-300',
          icon: Truck,
          label: lang === 'bn' ? 'খামার থেকে রওনা হয়েছে' : 'Farm Dispatched',
        };
      case 'Out for Delivery':
        return {
          bg: 'bg-indigo-100 text-indigo-900 border-indigo-300',
          icon: Truck,
          label: lang === 'bn' ? 'ডেলিভারির জন্য বের হয়েছে' : 'Out for Delivery',
        };
      case 'Delivered':
        return {
          bg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          icon: CheckCircle2,
          label: lang === 'bn' ? 'ডেলিভারি সম্পন্ন' : 'Delivered',
        };
      default:
        return {
          bg: 'bg-gray-100 text-gray-800 border-gray-300',
          icon: Clock,
          label: status,
        };
    }
  };

  const handleReorder = (order: (typeof orders)[0]) => {
    order.items.forEach((item) => {
      const fullProd = PRODUCTS.find((p) => p.id === item.productId);
      if (fullProd) {
        addToCart(fullProd, item.quantity);
      }
    });
    showToast(
      lang === 'bn' ? 'অর্ডারের পণ্যসমূহ কার্টে যোগ করা হয়েছে!' : 'Order items added back to cart!',
      'success'
    );
    setIsAccountOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-100 my-6 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-emerald-50/50">
          <div className="flex items-center gap-3">
            {user?.photoURL ? (
              <div className="relative w-12 h-12 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-sm">
                <Image
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  fill
                  sizes="48px"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                <UserIcon className="w-6 h-6" />
              </div>
            )}
            <div>
              <h2 className="text-base sm:text-lg font-black text-gray-900 leading-tight">
                {user ? user.displayName || 'Customer' : t('Guest Account', 'গেস্ট একাউন্ট')}
              </h2>
              <p className="text-xs text-gray-500">{user?.email || t('Not signed in', 'লগইন করা নেই')}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={() => {
                  setIsAccountOpen(false);
                  setIsAdminModalOpen(true);
                }}
                className="hidden sm:flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-2.5 py-1.5 rounded-xl transition cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t('Admin Panel', 'অ্যাডমিন')}</span>
              </button>
            )}
            <button
              onClick={() => setIsAccountOpen(false)}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex border-b border-gray-100 px-4 sm:px-6 bg-gray-50/50">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'orders'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>
              {t('My Orders', 'আমার অর্ডার')} ({orders.length})
            </span>
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'wishlist'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>
              {t('Saved Wishlist', 'উইশলিস্ট')} ({wishlist.length})
            </span>
          </button>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {!user && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <p className="font-bold">
                  {t('Sign in with Google to sync orders to cloud', 'অর্ডারগুলো সেভ রাখতে গুগল লগইন করুন')}
                </p>
                <p className="text-amber-700 mt-0.5">
                  {t(
                    'Access your order history and live dispatch status across any device.',
                    'যে কোনো ডিভাইস থেকে আপনার অর্ডারের অগ্রগতি দেখতে পারবেন।'
                  )}
                </p>
              </div>
              <button
                onClick={signInWithGoogle}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl transition cursor-pointer flex-shrink-0"
              >
                {t('Sign In with Google', 'গুগল দিয়ে লগইন')}
              </button>
            </div>
          )}

          {activeTab === 'orders' ? (
            orders.length === 0 ? (
              <div className="text-center py-12 text-gray-500 space-y-2">
                <Package className="w-12 h-12 mx-auto text-gray-300 stroke-1" />
                <p className="font-semibold text-sm">
                  {t('No orders placed yet', 'এখনও কোনো অর্ডার করেননি')}
                </p>
                <p className="text-xs text-gray-400">
                  {t(
                    'Your farm fresh organic orders will appear here with live tracking.',
                    'আপনার অর্ডারের বিস্তারিত তথ্য এবং ট্র্যাকিং এখানে দেখা যাবে।'
                  )}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => {
                  const statusBadge = getStatusBadge(ord.status);
                  const StatusIcon = statusBadge.icon;

                  return (
                    <div
                      key={ord.id}
                      className="border border-gray-200 rounded-2xl p-4 bg-white shadow-xs space-y-3"
                    >
                      {/* Top Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-black text-emerald-900">
                              {ord.id}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusBadge.bg}`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              <span>{statusBadge.label}</span>
                            </span>
                          </div>
                          <span className="text-[11px] text-gray-400">
                            {new Date(ord.createdAt).toLocaleDateString('bn-BD', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-black text-emerald-800">৳{ord.total}</span>
                          <span className="block text-[10px] text-gray-500">
                            {ord.paymentMethod} ({ord.paymentStatus})
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="divide-y divide-gray-50">
                        {ord.items.map((it, idx) => (
                          <div
                            key={idx}
                            className="py-1.5 flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                <Image
                                  src={it.image}
                                  alt={it.name}
                                  fill
                                  sizes="32px"
                                  className="object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <span className="text-gray-800 truncate font-medium">
                                {lang === 'bn' ? it.nameBn : it.name} × {it.quantity}
                              </span>
                            </div>
                            <span className="text-gray-900 font-semibold flex-shrink-0">
                              ৳{it.price * it.quantity}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Delivery Address & Actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
                        <span className="truncate max-w-sm flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span className="truncate">{ord.deliveryAddress}, {ord.division}</span>
                        </span>
                        <button
                          onClick={() => handleReorder(ord)}
                          className="self-start sm:self-auto flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-bold bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-lg transition cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>{t('Re-Order Items', 'পুনরায় অর্ডার')}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : wishlistProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-500 space-y-2">
              <Heart className="w-12 h-12 mx-auto text-gray-300 stroke-1" />
              <p className="font-semibold text-sm">
                {t('Your wishlist is empty', 'আপনার উইশলিস্ট খালি')}
              </p>
              <p className="text-xs text-gray-400">
                {t(
                  'Click the heart icon on any fresh organic product to save it here.',
                  'যেকোনো পণ্যের পাশে হার্ট আইকন চাপলে তা এখানে জমা হবে।'
                )}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {wishlistProducts.map((p) => (
                <div
                  key={p.id}
                  className="p-3 rounded-2xl border border-gray-100 bg-white flex items-center gap-3 shadow-2xs"
                >
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-900 truncate">
                      {lang === 'bn' ? p.nameBn : p.name}
                    </h4>
                    <span className="text-xs font-black text-emerald-800">৳{p.price}</span>
                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={() => addToCart(p, 1)}
                        className="text-[10px] bg-emerald-700 text-white font-bold px-2 py-0.5 rounded-md hover:bg-emerald-800 cursor-pointer"
                      >
                        {t('Add to Cart', 'কার্ট')}
                      </button>
                      <button
                        onClick={() => toggleWishlist(p.id)}
                        className="text-[10px] text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                      >
                        {t('Remove', 'মুছুন')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {user && (
          <div className="p-4 border-t border-gray-100 bg-gray-50/60 flex justify-between items-center text-xs">
            <span className="text-gray-500">
              {t('Signed in as', 'লগইন আছেন')} <strong>{user.email}</strong>
            </span>
            <button
              onClick={() => {
                signOut();
                setIsAccountOpen(false);
              }}
              className="text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t('Sign Out', 'লগআউট')}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
