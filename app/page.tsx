'use client';

import React, { useState, useMemo, useRef } from 'react';
import { useAuthAndCart } from '@/context/AuthAndCartContext';
import { PRODUCTS, CATEGORIES } from '@/data/products';
import { ProductCategory } from '@/types/ecommerce';
import Header from '@/components/Header';
import HeroBanner from '@/components/HeroBanner';
import ValueProps from '@/components/ValueProps';
import CategoryGrid from '@/components/CategoryGrid';
import FlashDeals from '@/components/FlashDeals';
import ProductCard from '@/components/ProductCard';
import QuickViewModal from '@/components/QuickViewModal';
import CartDrawer from '@/components/CartDrawer';
import CheckoutModal from '@/components/CheckoutModal';
import OrderSuccessModal from '@/components/OrderSuccessModal';
import AccountModal from '@/components/AccountModal';
import AdminOrdersModal from '@/components/AdminOrdersModal';
import FarmerStory from '@/components/FarmerStory';
import Footer from '@/components/Footer';
import ToastContainer from '@/components/ToastContainer';
import {
  SlidersHorizontal,
  ArrowUpDown,
  Sparkles,
  Check,
  Search,
  RotateCcw,
  Leaf,
  Award,
  Truck,
} from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const { t, lang, setIsCartOpen } = useAuthAndCart();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(1200);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'popular'>('featured');

  const productsSectionRef = useRef<HTMLDivElement>(null);
  const dealsSectionRef = useRef<HTMLDivElement>(null);

  const scrollToProducts = () => {
    productsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToDeals = () => {
    dealsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchPrice = p.price <= maxPrice;
      const matchStock = inStockOnly ? p.inStock : true;
      const q = searchFilter.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.nameBn.includes(q) ||
        p.origin.toLowerCase().includes(q) ||
        p.originBn.includes(q);

      return matchCat && matchPrice && matchStock && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'popular') return b.soldCount - a.soldCount;
      return 0; // featured default
    });
  }, [selectedCategory, maxPrice, inStockOnly, searchFilter, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchFilter('');
    setMaxPrice(1200);
    setInStockOnly(false);
    setSortBy('featured');
  };

  return (
    <div className="min-h-screen bg-[#fafbfa] text-gray-900 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-950">
      {/* Header */}
      <Header
        selectedCategory={selectedCategory}
        onCategorySelect={(catId) => {
          setSelectedCategory(catId);
          scrollToProducts();
        }}
      />

      <main className="flex-1">
        {/* Hero Banner */}
        <HeroBanner onShopClick={scrollToProducts} onDealsClick={scrollToDeals} />

        {/* 4 Value Propositions */}
        <ValueProps />

        {/* Visual Category Grid */}
        <CategoryGrid
          selectedCategory={selectedCategory}
          onSelectCategory={(catId) => {
            setSelectedCategory(catId);
            scrollToProducts();
          }}
        />

        {/* Flash Deals & Harvest Offers */}
        <div ref={dealsSectionRef}>
          <FlashDeals />
        </div>

        {/* Farm Seasonal Highlight Strip */}
        <section className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Banner 1: Sundarban Wild Honey */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-900 to-amber-700 text-white p-6 sm:p-8 flex items-center justify-between shadow-md">
              <div className="relative z-10 space-y-2 max-w-xs">
                <span className="text-[11px] font-black uppercase tracking-wider bg-amber-400 text-amber-950 px-2 py-0.5 rounded-md">
                  {t('100% Raw Forest Harvest', 'প্রাকৃতিক চাকের খাঁটি মধু')}
                </span>
                <h3 className="text-xl sm:text-2xl font-black">
                  {t('Sundarban Pure Honey', 'সুন্দরবনের খাঁটি মধু')}
                </h3>
                <p className="text-xs text-amber-100/90 leading-relaxed">
                  {t(
                    'Directly gathered by certified Mouwals. Natural enzymes intact, zero heating or adulteration.',
                    'মৌয়ালদের দ্বারা সংগৃহীত অপ্রক্রিয়াজাত মধু। ক্ষতিকর চিনিমুক্ত।'
                  )}
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('honey-ghee');
                    scrollToProducts();
                  }}
                  className="bg-white text-amber-950 hover:bg-amber-100 text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
                >
                  {t('Explore Honey & Ghee', 'মধু ও ঘি দেখুন')}
                </button>
              </div>
              <div className="hidden sm:block relative w-36 h-36 rounded-2xl overflow-hidden border-2 border-amber-400/30 flex-shrink-0 shadow-lg">
                <Image
                  src="https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=400&q=80"
                  alt="Raw Wild Honey Bangladesh"
                  fill
                  sizes="150px"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Banner 2: Wood-Ghani Cold-Pressed Mustard Oil */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-950 to-emerald-800 text-white p-6 sm:p-8 flex items-center justify-between shadow-md">
              <div className="relative z-10 space-y-2 max-w-xs">
                <span className="text-[11px] font-black uppercase tracking-wider bg-emerald-400 text-emerald-950 px-2 py-0.5 rounded-md">
                  {t('Traditional Wood-Ghani', 'কাঠের ঘানি ভাঙা')}
                </span>
                <h3 className="text-xl sm:text-2xl font-black">
                  {t('Cold-Pressed Mustard Oil', 'তীব্র ঝাঁঝালো সরিষার তেল')}
                </h3>
                <p className="text-xs text-emerald-100/90 leading-relaxed">
                  {t(
                    'Sirajganj & Natore native mustard seeds. Perfect strong flavor for Bengali Bhorta & fish curries.',
                    'সিরাজগঞ্জের দেশি সরিষার কাঠের ঘানিতে ভাঙা খাঁটি তেল। ভর্তায় অতুলনীয় ঝাঁঝ।'
                  )}
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('oil-grains');
                    scrollToProducts();
                  }}
                  className="bg-white text-emerald-950 hover:bg-emerald-100 text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
                >
                  {t('Explore Mustard Oil & Rice', 'তেল ও চাল দেখুন')}
                </button>
              </div>
              <div className="hidden sm:block relative w-36 h-36 rounded-2xl overflow-hidden border-2 border-emerald-400/30 flex-shrink-0 shadow-lg">
                <Image
                  src="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80"
                  alt="Cold Pressed Mustard Oil Sirajganj"
                  fill
                  sizes="150px"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Main Products Collection Section with Filter Sidebar & Grid */}
        <section ref={productsSectionRef} id="products-section" className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {t('Our Fresh Farm Catalog', 'আমাদের খামারের তাজা সমাহার')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
                {t('Daily Harvested Organic Groceries', 'দৈনিক সংগৃহীত অর্গানিক বাজার')}
              </h2>
            </div>

            {/* Sort & Quick Filter Bar */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-2xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-gray-500">{t('Sort:', 'সাজান:')}</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-gray-900 font-bold focus:outline-none cursor-pointer"
                >
                  <option value="featured">{t('Featured / Best Match', 'বাছাইকৃত')}</option>
                  <option value="popular">{t('Most Popular', 'সবচেয়ে জনপ্রিয়')}</option>
                  <option value="rating">{t('Highest Rated', 'সর্বোচ্চ রেটিং')}</option>
                  <option value="price-asc">{t('Price: Low to High', 'দাম: কম থেকে বেশি')}</option>
                  <option value="price-desc">{t('Price: High to Low', 'দাম: বেশি থেকে কম')}</option>
                </select>
              </div>

              {(selectedCategory !== 'all' || inStockOnly || searchFilter || maxPrice < 1200) && (
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-800 bg-rose-50 px-2.5 py-1.5 rounded-xl font-bold transition cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{t('Reset Filters', 'ফিল্টার রিসেট')}</span>
                </button>
              )}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                    : 'bg-white border border-gray-200 hover:border-emerald-300 text-gray-700 hover:bg-emerald-50/50'
                }`}
              >
                {lang === 'bn' ? cat.nameBn : cat.name}
              </button>
            ))}
          </div>

          {/* Filter Sub-bar: Price Slider & In-Stock Switch */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 my-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3 flex-1 min-w-[240px] max-w-md">
              <span className="text-xs font-semibold text-gray-500 flex-shrink-0">
                {t('Max Price:', 'সর্বোচ্চ দাম:')} <strong className="text-emerald-800">৳{maxPrice}</strong>
              </span>
              <input
                type="range"
                min={50}
                max={1200}
                step={25}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span>{t('In Stock Only', 'শুধু মজুদে থাকা পণ্য')}</span>
              </label>

              <span className="text-xs text-gray-400 font-medium">
                {filteredProducts.length} {t('products found', 'টি পণ্য প্রদর্শিত')}
              </span>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center my-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <Leaf className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                {t('No organic items match your filter', 'আপনার ফিল্টারের সাথে কোনো পণ্য মেলেনি')}
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                {t(
                  'Try widening your price range, clearing your search or switching categories.',
                  'দামের পরিসীমা বাড়িয়ে দেখুন অথবা অন্য কোনো ক্যাটেগরি নির্বাচন করুন।'
                )}
              </p>
              <button
                onClick={resetFilters}
                className="bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-emerald-800 transition cursor-pointer"
              >
                {t('Show All Products', 'সকল পণ্য দেখুন')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* Farmer Story & Verified Reviews */}
        <FarmerStory />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Cart Drawer */}
      <CartDrawer />

      {/* Checkout Modal */}
      <CheckoutModal />

      {/* Order Confirmation Success Modal */}
      <OrderSuccessModal />

      {/* Quick View Modal */}
      <QuickViewModal />

      {/* Customer Account / Orders Modal */}
      <AccountModal />

      {/* Store Admin Orders Panel */}
      <AdminOrdersModal />

      {/* Notification Toast Stack */}
      <ToastContainer />
    </div>
  );
}
