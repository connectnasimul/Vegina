'use client';

import React from 'react';
import { useAuthAndCart } from '@/context/AuthAndCartContext';
import { CheckCircle, Package, ArrowRight, X, Clock, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';

export default function OrderSuccessModal() {
  const { recentOrder, setRecentOrder, setIsAccountOpen, t, lang } = useAuthAndCart();

  if (!recentOrder) return null;

  const order = recentOrder;

  const handleViewOrders = () => {
    setRecentOrder(null);
    setIsAccountOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-gray-100 my-6 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Green Banner */}
        <div className="bg-gradient-to-r from-emerald-800 to-green-700 text-white p-6 sm:p-8 text-center relative">
          <button
            onClick={() => setRecentOrder(null)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-16 h-16 rounded-full bg-white text-emerald-700 flex items-center justify-center mx-auto mb-3 shadow-xl">
            <CheckCircle className="w-9 h-9 fill-emerald-100 text-emerald-600" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black">
            {t('Order Successfully Placed!', 'আপনার অর্ডার সফল হয়েছে!')}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-sm mx-auto">
            {t(
              'Thank you for choosing Vegina Bangladesh. Our agro-team has started packing your fresh produce.',
              'ভেজিলা বাংলাদেশের সাথে থাকার জন্য ধন্যবাদ। আমাদের খামার থেকে তাজা পণ্য প্রস্তুত হচ্ছে।'
            )}
          </p>

          <div className="mt-4 inline-block bg-emerald-950/40 backdrop-blur-sm border border-emerald-500/40 px-4 py-1.5 rounded-full text-xs font-mono font-bold">
            {t('Order ID:', 'অর্ডার নম্বর:')} {order.id}
          </div>
        </div>

        {/* Order Details Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Status Tracker */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-emerald-900 font-bold">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>{t('Status: Farm Processing', 'বর্তমান অবস্থা: প্রক্রিয়াকরণ চলছে')}</span>
            </div>
            <span className="bg-emerald-200/80 text-emerald-950 text-[11px] font-bold px-2 py-0.5 rounded-md">
              {t('Est: 4-6 Hours in Dhaka', 'সম্ভাব্য: ৪-৬ ঘণ্টা (ঢাকা)')}
            </span>
          </div>

          {/* Customer & Address Details */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-xs space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold text-gray-900">{order.customerName}</p>
                <p className="text-gray-600">{order.deliveryAddress}, {order.division}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-600 pt-1 border-t border-gray-200/60">
              <Phone className="w-3.5 h-3.5 text-gray-500" />
              <span>{order.customerPhone}</span>
              <span className="text-gray-300">•</span>
              <span className="font-semibold text-emerald-700">
                {order.paymentMethod} ({order.paymentStatus})
              </span>
            </div>
          </div>

          {/* Items Summary */}
          <div>
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              {t('Ordered Items', 'অর্ডারের পণ্যসমূহ')} ({order.items.length})
            </h4>
            <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between gap-3 bg-white">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">
                        {lang === 'bn' ? item.nameBn : item.name}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {item.unit} × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-800">
                    ৳{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="bg-gray-50 rounded-2xl p-3.5 text-xs text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span>{t('Subtotal', 'মোট পণ্য')}</span>
              <span>৳{order.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('Delivery Fee', 'ডেলিভারি চার্জ')}</span>
              <span>{order.deliveryFee === 0 ? t('FREE', 'ফ্রি') : `৳${order.deliveryFee}`}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>{t('Discount', 'ছাড়')}</span>
                <span>-৳{order.discount}</span>
              </div>
            )}
            <div className="flex justify-between font-black text-sm text-gray-900 border-t border-gray-200 pt-1.5 mt-1.5">
              <span>{t('Total Paid/Payable', 'সর্বমোট')}</span>
              <span className="text-emerald-800">৳{order.total}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-gray-100 bg-gray-50/60 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleViewOrders}
            className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-md shadow-emerald-700/20"
          >
            <Package className="w-4 h-4" />
            <span>{t('Track in My Orders', 'আমার অর্ডারে ট্র্যাকিং দেখুন')}</span>
          </button>
          <button
            onClick={() => setRecentOrder(null)}
            className="px-5 py-3 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-100 transition cursor-pointer"
          >
            {t('Continue Shopping', 'আরো কেনাকাটা করুন')}
          </button>
        </div>
      </div>
    </div>
  );
}
