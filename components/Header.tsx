'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useAuthAndCart } from '@/context/AuthAndCartContext';
import { PRODUCTS, CATEGORIES, BANGLADESH_DIVISIONS } from '@/data/products';
import {
  Search,
  ShoppingCart,
  Heart,
  User as UserIcon,
  Phone,
  Truck,
  Sparkles,
  ChevronDown,
  LogOut,
  Package,
  ShieldCheck,
  Globe,
  X,
} from 'lucide-react';
import Image from 'next/image';

interface HeaderProps {
  onCategorySelect?: (categoryId: string) => void;
  selectedCategory?: string;
}

export default function Header({ onCategorySelect, selectedCategory = 'all' }: HeaderProps) {
  const {
    user,
    signInWithGoogle,
    signOut,
    isAdmin,
    cartCount,
    subtotal,
    wishlist,
    setIsCartOpen,
    setIsAccountOpen,
    setIsAdminModalOpen,
    setQuickViewProduct,
    selectedDivision,
    setSelectedDivision,
    lang,
    toggleLang,
    t,
  } = useAuthAndCart();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchCategory, setSearchCategory] = useState<string>('all');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return PRODUCTS.filter((p) => {
      const matchesCategory = searchCategory === 'all' || p.category === searchCategory;
      const matchesText =
        p.name.toLowerCase().includes(q) ||
        p.nameBn.includes(q) ||
        p.origin.toLowerCase().includes(q) ||
        p.originBn.includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.categoryNameBn.includes(q);
      return matchesCategory && matchesText;
    }).slice(0, 6);
  }, [searchQuery, searchCategory]);

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-emerald-100">
      {/* Top Announcement Bar */}
      <div className="bg-emerald-800 text-white text-xs py-2 px-4 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 bg-emerald-700/80 text-emerald-100 px-2 py-0.5 rounded-full font-medium">
              <Sparkles className="w-3 h-3 text-emerald-300" />
              {t('Farm Fresh 100% Organic', '১০০% খাঁটি ও বিষমুক্ত')}
            </span>
            <p className="hidden md:inline truncate">
              {t(
                'Free home delivery on orders over ৳1500 across Dhaka & all Bangladesh!',
                '৳১৫০০ টাকার অর্ডারে ঢাকা ও সারাদেশে ফ্রি হোম ডেলিভারি!'
              )}
            </p>
          </div>

          <div className="flex items-center gap-4 text-emerald-100">
            {/* Delivery Division Dropdown */}
            <div className="flex items-center gap-1 text-xs">
              <Truck className="w-3.5 h-3.5 text-emerald-300" />
              <span className="hidden sm:inline">{t('Deliver to:', 'ডেলিভারি:')}</span>
              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="bg-emerald-700/80 text-white rounded px-1.5 py-0.5 text-xs border border-emerald-600 focus:outline-none cursor-pointer"
              >
                {BANGLADESH_DIVISIONS.map((div) => (
                  <option key={div} value={div} className="bg-emerald-900 text-white">
                    {div}
                  </option>
                ))}
              </select>
            </div>

            {/* Helpline */}
            <a
              href="tel:09612834462"
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-emerald-300" />
              <span className="font-medium">09612-VEGINA</span>
            </a>

            {/* Language Switcher */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 bg-emerald-700 hover:bg-emerald-600 px-2 py-0.5 rounded text-white font-medium transition cursor-pointer"
              title="Toggle English / বাংলা"
            >
              <Globe className="w-3 h-3 text-emerald-200" />
              <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Area */}
      <div className="max-w-7xl mx-auto px-4 py-3.5 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <a href="#" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                <span className="text-xl font-black tracking-tight">V</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-emerald-900 flex items-center gap-1 leading-tight">
                  VEGINA
                  <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                    BD
                  </span>
                </span>
                <span className="text-[10px] font-semibold text-emerald-600 tracking-wider uppercase">
                  {t('Organic & Fresh Groceries', 'তাজা ও খাঁটি অর্গানিক খামার')}
                </span>
              </div>
            </a>
          </div>

          {/* Search Bar with Live Suggestions */}
          <div ref={searchRef} className="flex-1 max-w-2xl relative hidden md:block">
            <div className="flex rounded-xl border-2 border-emerald-500/40 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-200/50 bg-white transition shadow-sm overflow-hidden">
              <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="bg-emerald-50/70 border-r border-emerald-100 text-xs font-medium text-emerald-800 px-3 py-2.5 focus:outline-none cursor-pointer hover:bg-emerald-100/70 transition"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {lang === 'bn' ? cat.nameBn : cat.name}
                  </option>
                ))}
              </select>

              <div className="relative flex-1 flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchFocused(true);
                  }}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder={t(
                    'Search fresh vegetables, fruits, mustard oil, honey, rice...',
                    'তাজা শাকসবজি, ফলমূল, খাঁটি সরিষার তেল, সুন্দরবনের মধু খুঁজুন...'
                  )}
                  className="w-full px-3.5 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-1 mr-2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 flex items-center justify-center transition cursor-pointer">
                <Search className="w-4 h-4" />
              </button>
            </div>

            {/* Live Search Suggestions Dropdown */}
            {isSearchFocused && searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-xl border border-emerald-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {searchResults.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    <div className="text-[11px] font-semibold text-emerald-700 px-3 py-1 uppercase tracking-wider">
                      {t('Matching Fresh Items', 'খুঁজে পাওয়া পণ্যসমূহ')} ({searchResults.length})
                    </div>
                    {searchResults.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setQuickViewProduct(item);
                          setIsSearchFocused(false);
                          setSearchQuery('');
                        }}
                        className="flex items-center gap-3 p-2 hover:bg-emerald-50 rounded-lg cursor-pointer transition"
                      >
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">
                            {lang === 'bn' ? item.nameBn : item.name}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {item.originBn || item.origin} • {item.unitBn || item.unit}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-emerald-700">৳{item.price}</div>
                          {item.originalPrice > item.price && (
                            <div className="text-xs text-gray-400 line-through">
                              ৳{item.originalPrice}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-gray-500">
                    {t(
                      'No matching fresh items found. Try searching for "টমেটো", "মধু", "তেল", "চাল"',
                      'কোনো পণ্য খুঁজে পাওয়া যায়নি। অন্য নামে খুঁজে দেখুন।'
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Icons: Wishlist, Account, Cart */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Wishlist */}
            <button
              onClick={() => {
                if (wishlist.length === 0) {
                  alert(t('Your wishlist is empty. Tap the heart on products to save them!', 'আপনার উইশলিস্ট খালি। পণ্যের পাশের হার্ট আইকন চাপুন!'));
                } else {
                  setIsAccountOpen(true);
                }
              }}
              className="relative p-2 text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition cursor-pointer"
              title={t('Wishlist', 'উইশলিস্ট')}
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* User Account / Sign In with Google */}
            <div ref={userMenuRef} className="relative">
              {user ? (
                <div>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition text-left cursor-pointer"
                  >
                    {user.photoURL ? (
                      <div className="relative w-7 h-7 rounded-full overflow-hidden border border-emerald-400">
                        <Image
                          src={user.photoURL}
                          alt={user.displayName || 'User'}
                          fill
                          sizes="28px"
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                        {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-xs font-semibold text-emerald-900 hidden sm:inline max-w-[100px] truncate">
                      {user.displayName || user.email?.split('@')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-emerald-700" />
                  </button>

                  {/* User Dropdown */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50">
                      <div className="px-3.5 py-2 border-b border-gray-100">
                        <p className="text-xs font-bold text-gray-900 truncate">
                          {user.displayName || 'Customer'}
                        </p>
                        <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                        {isAdmin && (
                          <span className="inline-block mt-1 text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                            Store Admin
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          setIsAccountOpen(true);
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs text-gray-700 hover:bg-emerald-50 flex items-center gap-2 cursor-pointer"
                      >
                        <Package className="w-4 h-4 text-emerald-600" />
                        {t('My Orders & Account', 'আমার অর্ডার ও অ্যাকাউন্ট')}
                      </button>

                      {isAdmin && (
                        <button
                          onClick={() => {
                            setIsAdminModalOpen(true);
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-3.5 py-2 text-xs text-amber-800 hover:bg-amber-50 flex items-center gap-2 font-semibold cursor-pointer"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-600" />
                          {t('Store Manager Panel', 'অর্ডার কন্ট্রোল প্যানেল')}
                        </button>
                      )}

                      <button
                        onClick={() => {
                          signOut();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 border-t border-gray-100 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        {t('Sign Out', 'লগআউট')}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={signInWithGoogle}
                  className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-2 rounded-xl text-xs font-semibold shadow-sm transition cursor-pointer"
                  title="Sign in with Google"
                >
                  <UserIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('Sign In', 'লগইন')}</span>
                </button>
              )}
            </div>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl shadow-md shadow-emerald-600/20 transition cursor-pointer group"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-emerald-950 text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left leading-tight">
                <span className="text-[10px] text-emerald-100 font-medium">{t('My Cart', 'কার্ট')}</span>
                <span className="text-xs font-bold">৳{subtotal}</span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 md:hidden">
          <div className="flex rounded-xl border border-emerald-300 bg-white overflow-hidden shadow-sm">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('Search organic groceries...', 'অর্গানিক খাবার খুঁজুন...')}
              className="w-full px-3 py-2 text-xs text-gray-800 placeholder-gray-400 focus:outline-none"
            />
            <button className="bg-emerald-600 text-white px-3.5 flex items-center justify-center">
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Categories Navigation Bar */}
      <div className="bg-emerald-50/70 border-t border-emerald-100 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 py-2">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onCategorySelect && onCategorySelect(cat.id)}
                className={`flex-shrink-0 text-xs px-3.5 py-1.5 rounded-full font-medium transition cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-emerald-900 hover:bg-emerald-100/80'
                }`}
              >
                {lang === 'bn' ? cat.nameBn : cat.name}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
