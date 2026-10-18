'use client';

import React from 'react';
import { useAuthAndCart } from '@/context/AuthAndCartContext';
import { CATEGORIES, PRODUCTS } from '@/data/products';
import { Carrot, Apple, Egg, Sparkles, Flame, Wheat } from 'lucide-react';

interface CategoryGridProps {
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
}

export default function CategoryGrid({ selectedCategory, onSelectCategory }: CategoryGridProps) {
  const { t, lang } = useAuthAndCart();

  const getCategoryCount = (catId: string) => {
    if (catId === 'all') return PRODUCTS.length;
    return PRODUCTS.filter((p) => p.category === catId).length;
  };

  const categoryVisuals: Record<string, { icon: React.ComponentType<{ className?: string }>; bg: string; text: string }> = {
    all: { icon: Sparkles, bg: 'bg-emerald-500/10 border-emerald-500/30', text: 'text-emerald-700' },
    vegetables: { icon: Carrot, bg: 'bg-green-500/10 border-green-500/30', text: 'text-green-700' },
    fruits: { icon: Apple, bg: 'bg-rose-500/10 border-rose-500/30', text: 'text-rose-700' },
    'dairy-eggs': { icon: Egg, bg: 'bg-amber-500/10 border-amber-500/30', text: 'text-amber-700' },
    'honey-ghee': { icon: Sparkles, bg: 'bg-orange-500/10 border-orange-500/30', text: 'text-orange-700' },
    'oil-grains': { icon: Wheat, bg: 'bg-yellow-500/10 border-yellow-500/30', text: 'text-yellow-700' },
    spices: { icon: Flame, bg: 'bg-red-500/10 border-red-500/30', text: 'text-red-700' },
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
            {t('Browse Fresh Categories', 'ক্যাটেগরি অনুযায়ী খুঁজুন')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
            {t('Explore Farm Fresh Collections', 'খামারের তাজা ক্যাটেগরি')}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 max-w-sm">
          {t(
            'Select a category to filter seasonal vegetables, organic fruits, cold-pressed oils and pure honey.',
            'আপনার প্রয়োজনীয় তাজা শাকসবজি, ফলমূল, খাঁটি সরিষার তেল ও চাকের মধু বেছে নিন।'
          )}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const visual = categoryVisuals[cat.id] || categoryVisuals.all;
          const Icon = visual.icon;
          const count = getCategoryCount(cat.id);

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex flex-col items-center text-center p-4 rounded-2xl border transition-all cursor-pointer group ${
                isSelected
                  ? 'bg-emerald-700 text-white border-emerald-800 shadow-lg shadow-emerald-700/20 scale-[1.02]'
                  : 'bg-white hover:bg-emerald-50/50 border-gray-100 hover:border-emerald-200 text-gray-800 shadow-sm hover:shadow'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110 ${
                  isSelected ? 'bg-white/20 text-white' : `${visual.bg} ${visual.text}`
                }`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-xs sm:text-sm font-bold leading-tight">
                {lang === 'bn' ? cat.nameBn : cat.name}
              </span>
              <span
                className={`text-[11px] mt-1 font-medium ${
                  isSelected ? 'text-emerald-100' : 'text-gray-400'
                }`}
              >
                {count} {t('Items', 'টি আইটেম')}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
