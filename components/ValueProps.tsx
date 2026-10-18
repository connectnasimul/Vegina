'use client';

import React from 'react';
import { useAuthAndCart } from '@/context/AuthAndCartContext';
import { Truck, ShieldCheck, CreditCard, RefreshCw } from 'lucide-react';

export default function ValueProps() {
  const { t } = useAuthAndCart();

  const props = [
    {
      icon: Truck,
      titleEn: '24-Hour Express Delivery',
      titleBn: '২৪ ঘণ্টার মধ্যে দ্রুত ডেলিভারি',
      descEn: 'Freshly harvested produce delivered directly to your doorstep in Dhaka.',
      descBn: 'মাঠ থেকে তোলার পরই তাজা অবস্থায় আপনার ঠিকানায় সরাসরি পৌঁছানো হয়।',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      icon: ShieldCheck,
      titleEn: '100% Certified Chemical-Free',
      titleBn: '১০০% ভেজাল ও ফরমালিনমুক্ত',
      descEn: 'Zero formalin, no harmful preservatives, naturally grown on partner farms.',
      descBn: 'কোনো প্রকার কীটনাশক বা কেমিক্যাল ছাড়া বিশ্বস্ত চুক্তিবদ্ধ খামারে উৎপাদিত।',
      color: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      icon: CreditCard,
      titleEn: 'bKash, Nagad & Cash on Delivery',
      titleBn: 'বিকাশ, নগদ ও ক্যাশ অন ডেলিভারি',
      descEn: 'Secure digital checkout or pay cash after inspecting fresh items.',
      descBn: 'পণ্য হাতে পেয়ে দেখে ক্যাশ দিন অথবা সহজেই বিকাশ ও নগদে পেমেন্ট করুন।',
      color: 'bg-sky-50 text-sky-700 border-sky-200',
    },
    {
      icon: RefreshCw,
      titleEn: 'Instant Replacement Guarantee',
      titleBn: 'সহজ পণ্য প্রতিস্থাপন গ্যারান্টি',
      descEn: 'Not fully satisfied with freshness? Instant replacement or refund.',
      descBn: 'পণ্যের সতেজতায় কোনো ঘাটতি পেলে সাথে সাথে রিটার্ন বা রিফান্ড গ্যারান্টি।',
      color: 'bg-green-50 text-green-700 border-green-200',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {props.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div
              key={idx}
              className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition group"
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border transition-transform group-hover:scale-105 ${p.color}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                  {t(p.titleEn, p.titleBn)}
                </h4>
                <p className="text-[11px] sm:text-xs text-gray-500 mt-1 leading-relaxed">
                  {t(p.descEn, p.descBn)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
