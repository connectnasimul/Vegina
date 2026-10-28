'use client';

import React from 'react';
import { useAuthAndCart } from '@/context/AuthAndCartContext';
import { Sparkles, ArrowRight, ShieldCheck, Clock, Award, Leaf } from 'lucide-react';
import Image from 'next/image';

interface HeroBannerProps {
  onShopClick?: () => void;
  onDealsClick?: () => void;
}

export default function HeroBanner({ onShopClick, onDealsClick }: HeroBannerProps) {
  const { t, lang } = useAuthAndCart();

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-900 text-white rounded-3xl mx-4 my-4 max-w-7xl lg:mx-auto shadow-2xl border border-emerald-700/50">
      {/* Decorative leaf watermarks */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-green-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 px-6 py-10 sm:px-12 sm:py-16 md:py-20 flex flex-col lg:flex-row items-center justify-between gap-10">
        {/* Left Column Text Content */}
        <div className="flex-1 space-y-6 text-center lg:text-left">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-700/80 border border-emerald-500/40 text-emerald-100 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-sm shadow-inner">
            <Leaf className="w-4 h-4 text-emerald-300" />
            <span>{t('100% Organic & Chemical-Free', '১০০% প্রাকৃতিক ও বিষমুক্ত অর্গানিক খাবার')}</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
            {t('Pure Farm Freshness', 'খামার থেকে তাজা ফসল')}
            <span className="block text-emerald-300 mt-1">
              {t('Direct to Your Dining Table', 'সরাসরি আপনার খাবার টেবিলে')}
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-sm sm:text-base text-emerald-100/90 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            {t(
              'Hand-harvested vegetables from Bogura, sun-ripened fruits from Rajshahi, raw wild honey from Sundarbans, and pure cold-pressed mustard oil with express delivery in Dhaka.',
              'বগুড়ার সতেজ শাকসবজি, রাজশাহীর পাকা ফল, সুন্দরবনের প্রাকৃতিক চাকের মধু ও খাঁটি ঘানি ভাঙা সরিষার তেল—সর্বোচ্চ সতেজতায় দ্রুত ডেলিভারি।'
            )}
          </p>

          {/* Promo code pill */}
          <div className="inline-flex items-center gap-3 bg-amber-400 text-emerald-950 px-4 py-2 rounded-2xl font-bold text-xs sm:text-sm shadow-lg shadow-amber-400/20">
            <Sparkles className="w-4 h-4 text-emerald-900" />
            <span>{t('Special Offer: Use code', 'বিশেষ অফার: কোড দিন')} <strong className="font-black underline tracking-wide">ORGANIC100</strong> {t('for ৳100 discount!', 'পেয়ে যান ৳১০০ ছাড়!')}</span>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
            <button
              onClick={onShopClick}
              className="flex items-center gap-2 bg-white text-emerald-900 hover:bg-emerald-50 font-bold px-6 py-3.5 rounded-2xl text-sm shadow-lg shadow-black/10 transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>{t('Shop Fresh Produce', 'তাজা পণ্য কিনুন')}</span>
              <ArrowRight className="w-4 h-4 text-emerald-700" />
            </button>
            <button
              onClick={onDealsClick}
              className="flex items-center gap-2 bg-emerald-700/60 hover:bg-emerald-700 text-white border border-emerald-500/50 font-semibold px-6 py-3.5 rounded-2xl text-sm backdrop-blur-sm transition cursor-pointer"
            >
              <span>{t('View Flash Deals', 'ফ্ল্যাশ ডিল দেখুন')}</span>
              <span className="bg-amber-400 text-emerald-950 text-[10px] font-black px-1.5 py-0.5 rounded">
                -25%
              </span>
            </button>
          </div>

          {/* Micro Trust Stats */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-emerald-700/40 max-w-md mx-auto lg:mx-0">
            <div className="text-center lg:text-left">
              <div className="text-xl sm:text-2xl font-black text-amber-300">৫০+</div>
              <div className="text-[11px] text-emerald-200">{t('Verified BD Farms', 'খাঁটি দেশি খামার')}</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-xl sm:text-2xl font-black text-emerald-300">২৪ ঘণ্টা</div>
              <div className="text-[11px] text-emerald-200">{t('Harvest to Door', 'মাঠ থেকে বাসায়')}</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-xl sm:text-2xl font-black text-white">২৫,০০০+</div>
              <div className="text-[11px] text-emerald-200">{t('Happy Families', 'সন্তুষ্ট পরিবার')}</div>
            </div>
          </div>
        </div>

        {/* Right Column Visual Card */}
        <div className="w-full lg:w-5/12 max-w-md relative">
          <div className="relative rounded-3xl overflow-hidden border-4 border-emerald-500/30 shadow-2xl aspect-4/3 bg-emerald-950">
            <Image
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
              alt="Fresh Organic Vegetables Organic Khabar Bangladesh"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent" />

            {/* Floating Organic Quality Seal */}
            <div className="absolute top-4 right-4 bg-white/95 text-emerald-900 rounded-2xl p-3 shadow-xl flex items-center gap-2 backdrop-blur-md">
              <Award className="w-6 h-6 text-amber-500 flex-shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  {t('Organic Guarantee', 'অর্গানিক স্বীকৃতি')}
                </p>
                <p className="text-xs font-black text-emerald-800">
                  {t('Pesticide Free', '১০০% বিষমুক্ত')}
                </p>
              </div>
            </div>

            {/* Floating Delivery Timer Card */}
            <div className="absolute bottom-4 left-4 right-4 bg-emerald-900/90 border border-emerald-600/40 text-white rounded-2xl p-3.5 backdrop-blur-md flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/30 flex items-center justify-center text-emerald-300">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold">{t('Morning Harvest Slot', 'ভোরের ফসল সেশন')}</p>
                  <p className="text-[11px] text-emerald-200">{t('Next delivery: Today 4 PM', 'পরবর্তী ডেলিভারি: আজ বিকাল ৪টা')}</p>
                </div>
              </div>
              <span className="text-[11px] font-bold bg-emerald-500 text-emerald-950 px-2 py-1 rounded-lg">
                {t('Fast Slot', 'সচল')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
