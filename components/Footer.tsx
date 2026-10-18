'use client';

import React, { useState } from 'react';
import { useAuthAndCart } from '@/context/AuthAndCartContext';
import { Phone, Mail, MapPin, Send, ShieldCheck, Truck, Sparkles, Heart } from 'lucide-react';

export default function Footer() {
  const { t, showToast, lang } = useAuthAndCart();
  const [emailInput, setEmailInput] = useState('');

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    showToast(
      lang === 'bn'
        ? 'ধন্যবাদ! আপনার ইমেইলটি সংরক্ষিত হয়েছে। VEGINA100 কুপন কোড ব্যবহার করুন।'
        : 'Thank you for subscribing! Use coupon VEGINA100 for ৳100 discount.',
      'success'
    );
    setEmailInput('');
  };

  return (
    <footer className="bg-emerald-950 text-emerald-100 border-t border-emerald-900 mt-16">
      {/* Newsletter Bar */}
      <div className="border-b border-emerald-900/80 bg-emerald-900/40">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">
              {t('Join the Organic Revolution', 'অর্গানিক আন্দোলনের সাথে থাকুন')}
            </span>
            <h4 className="text-xl sm:text-2xl font-black text-white mt-0.5">
              {t(
                'Get ৳100 Discount on Your First Farm Order',
                'প্রথম কেনাকাটায় পান ৳১০০ বিশেষ ছাড়!'
              )}
            </h4>
            <p className="text-xs text-emerald-200/80 mt-1">
              {t(
                'Subscribe to get daily morning harvest updates and seasonal offers.',
                'সকালে ভোরের তাজা ফসল ও মৌসুমি অফার জানতে সাবস্ক্রাইব করুন।'
              )}
            </p>
          </div>

          <form onSubmit={handleNewsletter} className="w-full md:w-auto flex max-w-md gap-2">
            <input
              type="email"
              required
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder={t('Enter your email address', 'আপনার ইমেইল লিখুন')}
              className="px-4 py-2.5 rounded-xl bg-emerald-950 border border-emerald-700 text-xs text-white placeholder-emerald-400 focus:outline-none focus:border-emerald-400 flex-1 min-w-[200px]"
            />
            <button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-xs px-5 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5"
            >
              <span>{t('Subscribe', 'যুক্ত হোন')}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-green-400 flex items-center justify-center text-emerald-950 font-black text-xl shadow-md">
                V
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                VEGINA <span className="text-emerald-400 text-sm font-bold">BANGLADESH</span>
              </span>
            </div>

            <p className="text-xs text-emerald-200/80 leading-relaxed max-w-sm">
              {t(
                'Vegina Bangladesh is your trusted farm-to-door organic grocery partner. We bring natural, chemical-free food directly from verified rural growers in Bogura, Rajshahi, Rangpur and Sundarban to urban dining tables.',
                'ভেজিলা বাংলাদেশ হলো খামার থেকে সরাসরি বাসায় পৌঁছানো নির্ভরযোগ্য অর্গানিক গ্রোসারি শপ। বগুড়া, রাজশাহী ও সুন্দরবনের খাঁটি উৎপাদকদের সরাসরি যুক্ত করে আমরা পৌছে দিচ্ছি পুষ্টিকর খাদ্য।'
              )}
            </p>

            <div className="space-y-2 text-xs text-emerald-300">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold">হটলাইন: 09612-VEGINA (09612-834462)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>support@vegina.com.bd</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>প্লট ৪২, রোড ১১, তেজগাঁও শিল্প এলাকা, ঢাকা-১২০৮</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h5 className="text-xs font-black uppercase text-amber-400 tracking-wider">
              {t('Categories', 'ক্যাটেগরি')}
            </h5>
            <ul className="space-y-2 text-xs text-emerald-200/90">
              <li>
                <a href="#products-section" className="hover:text-white transition">
                  {t('Fresh Vegetables', 'তাজা শাকসবজি')}
                </a>
              </li>
              <li>
                <a href="#products-section" className="hover:text-white transition">
                  {t('Seasonal Fruits', 'মৌসুমি ফলমূল')}
                </a>
              </li>
              <li>
                <a href="#products-section" className="hover:text-white transition">
                  {t('Cold-Pressed Mustard Oil', 'খাঁটি সরিষার তেল')}
                </a>
              </li>
              <li>
                <a href="#products-section" className="hover:text-white transition">
                  {t('Sundarban Wild Honey', 'সুন্দরবনের প্রাকৃতিক মধু')}
                </a>
              </li>
              <li>
                <a href="#products-section" className="hover:text-white transition">
                  {t('Pabna Pure Ghee', 'পাবনার খাঁটি গাওয়া ঘি')}
                </a>
              </li>
            </ul>
          </div>

          {/* Delivery Coverage */}
          <div className="space-y-3">
            <h5 className="text-xs font-black uppercase text-amber-400 tracking-wider">
              {t('Delivery Zones', 'ডেলিভারি এলাকা')}
            </h5>
            <ul className="space-y-2 text-xs text-emerald-200/90">
              <li>{t('Dhaka City (Inside 24 Hours)', 'ঢাকা মেট্রো (২৪ ঘণ্টায় এক্সপ্রেস)')}</li>
              <li>{t('Chattogram City (48 Hours)', 'চট্টগ্রাম শহর (৪৮ ঘণ্টা)')}</li>
              <li>{t('Sylhet & Sreemangal', 'সিলেট ও শ্রীমঙ্গল')}</li>
              <li>{t('Rajshahi & Bogura', 'রাজশাহী ও বগুড়া')}</li>
              <li>{t('All 64 Districts via Curier', 'সারাদেশের ৬৪ জেলাতেই ডেলিভারি')}</li>
            </ul>
          </div>

          {/* Payment Methods & Guarantees */}
          <div className="space-y-3">
            <h5 className="text-xs font-black uppercase text-amber-400 tracking-wider">
              {t('Accepted Payments', 'পেমেন্ট পদ্ধতি')}
            </h5>
            <div className="flex flex-wrap gap-2">
              <span className="bg-pink-700 text-white font-bold text-[11px] px-2.5 py-1 rounded-md">
                bKash বিকাশ
              </span>
              <span className="bg-orange-600 text-white font-bold text-[11px] px-2.5 py-1 rounded-md">
                Nagad নগদ
              </span>
              <span className="bg-purple-700 text-white font-bold text-[11px] px-2.5 py-1 rounded-md">
                Rocket রকেট
              </span>
              <span className="bg-emerald-800 text-white font-bold text-[11px] px-2.5 py-1 rounded-md">
                Cash on Delivery
              </span>
              <span className="bg-sky-800 text-white font-bold text-[11px] px-2.5 py-1 rounded-md">
                Visa / MasterCard
              </span>
            </div>

            <div className="pt-2 text-[11px] text-emerald-300/80 space-y-1">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t('100% Formalin Free Guarantee', '১০০% ফরমালিনমুক্ত গ্যারান্টি')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t('Instant Replacement if unsatisfied', 'সতেজতায় ঘাটতি পেলে ইনস্ট্যান্ট রিপ্লেস')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="mt-12 pt-6 border-t border-emerald-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-300">
          <p>
            © {new Date().getFullYear()} VEGINA BANGLADESH. All Rights Reserved. Inspired by Vegina Store.
          </p>
          <div className="flex items-center gap-1 text-emerald-300">
            <span>{t('Crafted for health & organic living in Bangladesh', 'বাংলাদেশের সুস্থ ও খাঁটি জীবনের জন্য নিবেদিত')}</span>
            <Heart className="w-3 h-3 text-rose-400 fill-rose-400 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
}
