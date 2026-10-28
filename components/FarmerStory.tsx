'use client';

import React from 'react';
import { useAuthAndCart } from '@/context/AuthAndCartContext';
import { HeartHandshake, CheckCircle2, ShieldCheck, Star } from 'lucide-react';
import Image from 'next/image';

export default function FarmerStory() {
  const { t } = useAuthAndCart();

  const reviews = [
    {
      name: 'Dr. Farhana Yasmin',
      location: 'Gulshan 2, Dhaka',
      commentBn: 'বগুড়ার ফুলকপি আর সুন্দরবনের মধু একদম প্রাকৃতিক। ঢাকা শহরে এমন টাটকা অর্গানিক শাকসবজি পেয়ে আমরা খুব সন্তুষ্ট।',
      commentEn: 'The Bogura cauliflower and Sundarban raw honey were extraordinary! Getting such fresh pesticide-free vegetables in Dhaka is a blessing.',
      rating: 5,
      date: 'গতকাল',
    },
    {
      name: 'Tanvir Hossain',
      location: 'Uttara Sector 7, Dhaka',
      commentBn: 'ঘানি ভাঙা খাঁটি সরিষার তেলের ঝাঁঝ এবং পাবনার গাওয়া ঘির সুবাস অসাধারণ। বিকাশে পেমেন্ট করে দ্রুত ডেলিভারি পেয়েছি।',
      commentEn: 'The cold-pressed mustard oil aroma and pure cow ghee quality are unbeatable. Super fast delivery and seamless bKash checkout.',
      rating: 5,
      date: '২ দিন আগে',
    },
    {
      name: 'Mahfuza Begum',
      location: 'Dhanmondi, Dhaka',
      commentBn: 'দেশি মুরগির ডিম ও চিনিগুঁড়া চাল চমৎকার। বাচ্চাদের খাবারের জন্য অর্গানিক খাবার আমাদের প্রথম পছন্দ।',
      commentEn: 'Free-range eggs and aromatic Chinigura rice are staple for our kids. 100% reliable organic source.',
      rating: 5,
      date: '৩ দিন আগে',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      {/* Farmer Story Section */}
      <div className="bg-gradient-to-br from-emerald-950 to-green-900 rounded-3xl text-white p-8 sm:p-12 overflow-hidden relative shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex-1 space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-emerald-800/80 text-emerald-200 px-3 py-1 rounded-full text-xs font-bold">
              <HeartHandshake className="w-4 h-4 text-emerald-400" />
              <span>{t('Fair Price for Farmers', 'কৃষকের ন্যায্য মূল্য, ভোক্তার খাঁটি পুষ্টি')}</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-black leading-tight">
              {t(
                'Direct Farm Partnership Across Rural Bangladesh',
                'গ্রাম-বাংলার কৃষকদের ঘামে ভেজা খাঁটি ফসল'
              )}
            </h3>

            <p className="text-sm text-emerald-100/90 leading-relaxed max-w-xl">
              {t(
                'We eliminate predatory middlemen by partnering directly with small-scale agro-growers in Bogura, Rajshahi, Rangpur, and Sundarban forest collectors. Every purchase directly improves rural livelihoods while guaranteeing 100% formalin-free food for your loved ones.',
                'আমরা মধ্যস্বত্বভোগী সিন্ডিকেট বাদ দিয়ে বগুড়া, রাজশাহী, নাটোর ও সুন্দরবনের প্রান্তিক কৃষক ও মৌয়ালদের সাথে সরাসরি কাজ করি। প্রতিটি কেনাকাটায় কৃষকের মুখে হাসি ফোটে আর আপনার পরিবার পায় ১০০% ফরমালিনমুক্ত পুষ্টিকর খাবার।'
              )}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
              <div className="bg-emerald-900/60 border border-emerald-700/50 p-3 rounded-2xl">
                <span className="text-xl sm:text-2xl font-black text-amber-300">৳০</span>
                <span className="block text-[11px] text-emerald-200">{t('Preservatives Used', 'প্রিজারভেটিভ ব্যবহার')}</span>
              </div>
              <div className="bg-emerald-900/60 border border-emerald-700/50 p-3 rounded-2xl">
                <span className="text-xl sm:text-2xl font-black text-emerald-300">১০০%</span>
                <span className="block text-[11px] text-emerald-200">{t('Direct From Farms', 'সরাসরি খামার থেকে')}</span>
              </div>
              <div className="bg-emerald-900/60 border border-emerald-700/50 p-3 rounded-2xl col-span-2 sm:col-span-1">
                <span className="text-xl sm:text-2xl font-black text-white">২৪h</span>
                <span className="block text-[11px] text-emerald-200">{t('Dhaka Door Delivery', 'ঢাকা এক্সপ্রেস হোম ডেলিভারি')}</span>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-5/12 max-w-sm">
            <div className="relative rounded-2xl overflow-hidden border-4 border-emerald-600/40 shadow-2xl aspect-4/3">
              <Image
                src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=700&q=80"
                alt="Bangladeshi Rural Farmer Organic Produce"
                fill
                sizes="380px"
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Verified Bangladeshi Customer Reviews */}
      <div>
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
            {t('Customer Experiences', 'গ্রাহকদের মতামত')}
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
            {t('Trusted by 25,000+ Bangladeshi Families', '২৫,০০০+ পরিবারের আস্থা ও ভালোবাসা')}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic">
                  &ldquo;{t(rev.commentEn, rev.commentBn)}&rdquo;
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <div>
                  <h5 className="font-bold text-gray-900">{rev.name}</h5>
                  <p className="text-[11px] text-gray-400">{rev.location}</p>
                </div>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                  {t('Verified Buyer', 'যাচাইকৃত ক্রেতা')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
