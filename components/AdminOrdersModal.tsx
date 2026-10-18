'use client';

import React, { useState } from 'react';
import { useAuthAndCart } from '@/context/AuthAndCartContext';
import { OrderStatus } from '@/types/ecommerce';
import {
  X,
  ShieldCheck,
  Package,
  TrendingUp,
  Clock,
  Truck,
  CheckCircle2,
  Phone,
  MapPin,
  RefreshCw,
} from 'lucide-react';

export default function AdminOrdersModal() {
  const {
    allAdminOrders,
    updateOrderStatus,
    isAdminModalOpen,
    setIsAdminModalOpen,
    t,
    lang,
    showToast,
  } = useAuthAndCart();

  const [updatingId, setUpdatingId] = useState<string | null>(null);

  if (!isAdminModalOpen) return null;

  const totalRevenue = allAdminOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingCount = allAdminOrders.filter((o) => o.status === 'Processing').length;
  const dispatchedCount = allAdminOrders.filter(
    (o) => o.status === 'Farm Dispatched' || o.status === 'Out for Delivery'
  ).length;
  const deliveredCount = allAdminOrders.filter((o) => o.status === 'Delivered').length;

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-gray-100 my-6 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-amber-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-gray-900 leading-tight">
                  {t('Vegina BD Store Manager', 'ভেজিলা স্টোর ম্যানেজার ড্যাশবোর্ড')}
                </h2>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Admin Active
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {t(
                  'Real-time Firestore customer orders & dispatch controls',
                  'লাইভ ফায়ারস্টোর অর্ডার ব্যবস্থাপনা ও ডেলিভারি স্ট্যাটাস কন্ট্রোল'
                )}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAdminModalOpen(false)}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Analytics Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 sm:p-6 bg-gray-50/70 border-b border-gray-100">
          <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-2xs">
            <span className="text-[11px] text-gray-500 font-medium block">
              {t('Total Sales', 'মোট বিক্রয়')}
            </span>
            <span className="text-lg sm:text-xl font-black text-emerald-800">৳{totalRevenue}</span>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-2xs">
            <span className="text-[11px] text-amber-700 font-medium block">
              {t('Processing', 'প্রসেসিং')}
            </span>
            <span className="text-lg sm:text-xl font-black text-amber-600">{pendingCount}</span>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-2xs">
            <span className="text-[11px] text-sky-700 font-medium block">
              {t('On the Way', 'ডেলিভারিতে')}
            </span>
            <span className="text-lg sm:text-xl font-black text-sky-600">{dispatchedCount}</span>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-2xs">
            <span className="text-[11px] text-emerald-700 font-medium block">
              {t('Delivered', 'সম্পন্ন')}
            </span>
            <span className="text-lg sm:text-xl font-black text-emerald-600">{deliveredCount}</span>
          </div>
        </div>

        {/* Orders Listing */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {allAdminOrders.length === 0 ? (
            <div className="text-center py-12 text-gray-500 space-y-2">
              <Package className="w-12 h-12 mx-auto text-gray-300 stroke-1" />
              <p className="font-semibold text-sm">
                {t('No customer orders in Firestore yet', 'ফায়ারস্টোরে কোনো অর্ডার এখনও জমা হয়নি')}
              </p>
              <p className="text-xs text-gray-400">
                {t(
                  'Place an order using the checkout modal to test the end-to-end sync!',
                  'চেকআউট থেকে একটি অর্ডার দিয়ে ফায়ারস্টোর সিঙ্ক পরীক্ষা করুন!'
                )}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {allAdminOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-gray-200 rounded-2xl p-4 shadow-2xs space-y-3 hover:border-amber-300 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-emerald-900">
                          {order.id}
                        </span>
                        <span className="text-xs font-bold text-gray-900">
                          {order.customerName}
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-400">
                        {new Date(order.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-sm font-black text-emerald-800">৳{order.total}</span>
                        <span className="block text-[10px] text-gray-500 font-medium">
                          {order.paymentMethod} • Trx: {order.transactionId || 'None'}
                        </span>
                      </div>

                      {/* Status Selector */}
                      <select
                        disabled={updatingId === order.id}
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value as OrderStatus)
                        }
                        className="bg-gray-50 border border-gray-300 text-xs font-bold rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-amber-500 cursor-pointer text-gray-800"
                      >
                        <option value="Processing">Processing (প্রসেসিং)</option>
                        <option value="Farm Dispatched">Farm Dispatched (খামার থেকে রওনা)</option>
                        <option value="Out for Delivery">Out for Delivery (ডেলিভারিতে)</option>
                        <option value="Delivered">Delivered (সম্পন্ন)</option>
                        <option value="Cancelled">Cancelled (বাতিল)</option>
                      </select>
                    </div>
                  </div>

                  {/* Customer details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600 bg-gray-50 p-2.5 rounded-xl">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      <span className="font-semibold">{order.customerPhone}</span>
                      <span className="text-gray-400">({order.customerEmail})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span className="truncate">
                        {order.deliveryAddress}, {order.division}
                      </span>
                    </div>
                  </div>

                  {/* Items summary */}
                  <div className="text-xs text-gray-500">
                    <span className="font-bold text-gray-700">Items: </span>
                    {order.items.map((it) => `${it.name} (${it.quantity}x)`).join(', ')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
