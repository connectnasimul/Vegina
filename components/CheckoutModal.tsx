'use client';

import React, { useState } from 'react';
import { useAuthAndCart } from '@/context/AuthAndCartContext';
import { BANGLADESH_DIVISIONS } from '@/data/products';
import {
  X,
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  Sparkles,
  Phone,
  MapPin,
  User as UserIcon,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CheckoutModal() {
  const {
    user,
    signInWithGoogle,
    cart,
    subtotal,
    deliveryFee,
    discount,
    total,
    selectedDivision,
    setSelectedDivision,
    placeOrder,
    isCheckoutOpen,
    setIsCheckoutOpen,
    t,
    lang,
    showToast,
  } = useAuthAndCart();

  const [customerName, setCustomerName] = useState(user?.displayName || '');
  const [customerPhone, setCustomerPhone] = useState('');
  const [city, setCity] = useState('Dhaka');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'COD'>('bKash');
  const [senderNumber, setSenderNumber] = useState('');
  const [trxId, setTrxId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isCheckoutOpen) return null;

  const handleAutoFillDemo = () => {
    setSenderNumber('01712345678');
    setTrxId(`BK${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
    showToast(
      lang === 'bn' ? 'টেস্ট বিকাশ পেমেন্ট তথ্য অটো-ফিল করা হয়েছে!' : 'Test bKash details auto-filled!',
      'info'
    );
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!customerName.trim()) {
      setErrorMsg(lang === 'bn' ? 'অনুগ্রহ করে আপনার নাম লিখুন।' : 'Please enter your name.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 11) {
      setErrorMsg(
        lang === 'bn'
          ? 'অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 01712345678)।'
          : 'Please enter a valid 11-digit Bangladeshi mobile number (e.g., 01712345678).'
      );
      return;
    }
    if (!deliveryAddress.trim() || deliveryAddress.length < 10) {
      setErrorMsg(
        lang === 'bn'
          ? 'অনুগ্রহ করে আপনার পূর্ণ ডেলিভারি ঠিকানা লিখুন (বাড়ি, রোড, এলাকা)।'
          : 'Please enter a complete delivery address with house, road, and area.'
      );
      return;
    }

    if (paymentMethod !== 'COD' && (!senderNumber.trim() || !trxId.trim())) {
      setErrorMsg(
        lang === 'bn'
          ? 'অনুগ্রহ করে আপনার বিকাশ/নগদ নম্বর এবং ট্রানজেকশন আইডি (TrxID) দিন অথবা অটো-ফিল চাপুন।'
          : 'Please enter your payment mobile number and Transaction ID (TrxID) or click Auto-fill Test.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await placeOrder({
        customerName,
        customerPhone,
        deliveryAddress,
        city,
        paymentMethod,
        transactionId: trxId.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      // Fire confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#059669', '#10b981', '#34d399', '#f59e0b'],
        });
      } catch {
        // ignore
      }

      showToast(
        lang === 'bn'
          ? 'অভিনন্দন! আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে।'
          : 'Congratulations! Your order has been placed successfully.',
        'success'
      );
    } catch (err: unknown) {
      console.error('Order creation error:', err);
      setErrorMsg(
        err instanceof Error
          ? err.message
          : lang === 'bn'
          ? 'অর্ডার প্রক্রিয়া করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
          : 'Failed to process order. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-gray-100 my-6 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-emerald-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-700/20">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-gray-900 leading-tight">
                {t('Bangladeshi Express Checkout', 'নিরাপদ ডেলিভারি ও পেমেন্ট')}
              </h2>
              <p className="text-xs text-gray-500">
                {t('Fast delivery to Dhaka & 64 Districts', 'ঢাকা ও সারাদেশে দ্রুত হোম ডেলিভারি')}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Guest vs Logged-In notice */}
        {!user && (
          <div className="px-6 py-2.5 bg-amber-50 border-b border-amber-200/60 flex items-center justify-between text-xs text-amber-900">
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
              {t(
                'Sign in with Google to automatically track this order in your account!',
                'অর্ডার ট্র্যাকিং ও পয়েন্ট পেতে গুগল দিয়ে লগইন করতে পারেন!'
              )}
            </span>
            <button
              onClick={signInWithGoogle}
              className="bg-amber-600 hover:bg-amber-700 text-white px-2.5 py-1 rounded-lg font-bold text-xs cursor-pointer transition flex-shrink-0"
            >
              {t('Sign In', 'লগইন')}
            </button>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmitOrder} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
              {errorMsg}
            </div>
          )}

          {/* Section 1: Customer Contact */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
              <UserIcon className="w-4 h-4 text-emerald-600" />
              <span>{t('1. Customer Information', '১. ক্রেতার তথ্য')}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t('Full Name', 'পূর্ণ নাম')} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={t('e.g. Nasimul Islam', 'যেমন: নাসিমুল ইসলাম')}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t('Mobile Number', 'মোবাইল নম্বর')} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600"
                />
                <span className="text-[10px] text-gray-400">
                  {t('Delivery rider will call this number', 'ডেলিভারি রাইডার এই নম্বরে যোগাযোগ করবেন')}
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Address */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>{t('2. Delivery Address in Bangladesh', '২. ডেলিভারি ঠিকানা')}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t('Division', 'বিভাগ')} <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedDivision}
                  onChange={(e) => setSelectedDivision(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-emerald-600 cursor-pointer"
                >
                  {BANGLADESH_DIVISIONS.map((div) => (
                    <option key={div} value={div}>
                      {div}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t('City / Area / Thana', 'শহর / এলাকা / থানা')} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder={t('e.g. Dhanmondi, Gulshan, Mirpur', 'যেমন: ধানমন্ডি, গুলশান, মিরপুর')}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t('Full Street Address', 'বিস্তারিত ঠিকানা (বাড়ি নং, রোড নং, ফ্ল্যাট)')}{' '}
                  <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder={t(
                    'House 14, Road 5, Block B, Dhanmondi, Dhaka',
                    'বাড়ি ১৪, রোড ৫, ব্লক বি, ধানমন্ডি, ঢাকা'
                  )}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {t('Delivery Notes (Optional)', 'বিশেষ কোনো নির্দেশনা (ঐচ্ছিক)')}
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t(
                    'e.g. Please deliver in the afternoon, call before arrival',
                    'যেমন: বিকালে ডেলিভারি করবেন, আসার আগে কল দিবেন'
                  )}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Payment Method Selection */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>{t('3. Payment Method', '৩. মূল্য পরিশোধ পদ্ধতি')}</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* bKash */}
              <button
                type="button"
                onClick={() => setPaymentMethod('bKash')}
                className={`p-3 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  paymentMethod === 'bKash'
                    ? 'border-pink-500 bg-pink-50/60 shadow-sm ring-2 ring-pink-400/40'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <span className="w-7 h-7 rounded-lg bg-pink-600 text-white font-black text-xs flex items-center justify-center">
                  b
                </span>
                <span className="text-xs font-bold text-gray-900">bKash (বিকাশ)</span>
                <span className="text-[10px] text-pink-700 font-semibold">{t('Popular', 'জনপ্রিয়')}</span>
              </button>

              {/* Nagad */}
              <button
                type="button"
                onClick={() => setPaymentMethod('Nagad')}
                className={`p-3 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  paymentMethod === 'Nagad'
                    ? 'border-orange-500 bg-orange-50/60 shadow-sm ring-2 ring-orange-400/40'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <span className="w-7 h-7 rounded-lg bg-orange-600 text-white font-black text-xs flex items-center justify-center">
                  ন
                </span>
                <span className="text-xs font-bold text-gray-900">Nagad (নগদ)</span>
                <span className="text-[10px] text-orange-700 font-semibold">{t('Instant', 'ইনস্ট্যান্ট')}</span>
              </button>

              {/* Rocket */}
              <button
                type="button"
                onClick={() => setPaymentMethod('Rocket')}
                className={`p-3 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  paymentMethod === 'Rocket'
                    ? 'border-purple-500 bg-purple-50/60 shadow-sm ring-2 ring-purple-400/40'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <span className="w-7 h-7 rounded-lg bg-purple-600 text-white font-black text-xs flex items-center justify-center">
                  R
                </span>
                <span className="text-xs font-bold text-gray-900">Rocket (রকেট)</span>
                <span className="text-[10px] text-purple-700 font-semibold">DBBL</span>
              </button>

              {/* Cash on Delivery */}
              <button
                type="button"
                onClick={() => setPaymentMethod('COD')}
                className={`p-3 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  paymentMethod === 'COD'
                    ? 'border-emerald-600 bg-emerald-50/60 shadow-sm ring-2 ring-emerald-500/40'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <span className="w-7 h-7 rounded-lg bg-emerald-700 text-white font-black text-xs flex items-center justify-center">
                  ৳
                </span>
                <span className="text-xs font-bold text-gray-900">Cash on Delivery</span>
                <span className="text-[10px] text-emerald-700 font-semibold">{t('ক্যাশ অন ডেলিভারি', 'COD')}</span>
              </button>
            </div>

            {/* Payment Details Container */}
            {paymentMethod !== 'COD' ? (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200/80 pb-3">
                  <div>
                    <p className="text-xs font-bold text-gray-900">
                      {paymentMethod} {t('Merchant Account:', 'মার্চেন্ট পেমেন্ট নম্বর:')}
                    </p>
                    <p className="font-mono text-sm font-black text-emerald-800">
                      01799-834462 <span className="text-xs font-normal text-gray-500">(Vegina Store BD)</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAutoFillDemo}
                    className="self-start sm:self-auto bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>{t('Auto-Fill Test Payment', 'টেস্ট পেমেন্ট অটো-ফিল')}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      {paymentMethod} {t('Account Number', 'যে নম্বর থেকে টাকা পাঠিয়েছেন')} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={senderNumber}
                      onChange={(e) => setSenderNumber(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600 bg-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      {t('Transaction ID (TrxID)', 'ট্রানজেকশন আইডি (TrxID)')} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      placeholder="e.g. BK9X28AL9"
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-600 bg-white font-mono uppercase"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-900 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">{t('Cash on Delivery Confirmed', 'ক্যাশ অন ডেলিভারি সুবিধা')}</p>
                  <p className="text-emerald-700 mt-0.5">
                    {t(
                      'Pay cash directly to the delivery person once your fresh vegetables & products arrive and you inspect the quality.',
                      'পণ্য হাতে পেয়ে দেখে শুনে রাইডারের কাছে নগদ মূল্য পরিশোধ করুন। কোনো অগ্রিম চার্জ লাগবে না।'
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Order Summary Review */}
          <div className="bg-gray-50 border border-gray-200/80 rounded-2xl p-4 space-y-2">
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
              {t('Order Summary', 'অর্ডার সামারি')} ({cart.length} items)
            </h4>
            <div className="space-y-1 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>{t('Subtotal', 'মোট পণ্য')}</span>
                <span>৳{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('Delivery Charge', 'ডেলিভারি খরচ')}</span>
                <span>{deliveryFee === 0 ? t('FREE', 'ফ্রি') : `৳${deliveryFee}`}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>{t('Discount', 'ছাড়')}</span>
                  <span>-৳{discount}</span>
                </div>
              )}
              <div className="flex justify-between text-sm sm:text-base font-black text-gray-900 border-t border-gray-200 pt-2">
                <span>{t('Payable Amount', 'পরিশোধযোগ্য সর্বমোট')}</span>
                <span className="text-emerald-800">৳{total}</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-400 text-white font-black py-4 px-6 rounded-2xl text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-emerald-700/25 transition cursor-pointer"
          >
            {isSubmitting ? (
              <span>{t('Processing Order...', 'অর্ডার প্রসেস হচ্ছে...')}</span>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>
                  {t('Confirm Order', 'অর্ডার কনফার্ম করুন')} • ৳{total}
                </span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
