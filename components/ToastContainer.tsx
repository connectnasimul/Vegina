'use client';

import React from 'react';
import { useAuthAndCart } from '@/context/AuthAndCartContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function ToastContainer() {
  const { toasts } = useAuthAndCart();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold border backdrop-blur-md animate-in slide-in-from-bottom-2 duration-200 ${
              isSuccess
                ? 'bg-emerald-900/95 text-white border-emerald-600'
                : isError
                ? 'bg-rose-900/95 text-white border-rose-600'
                : 'bg-gray-900/95 text-white border-gray-700'
            }`}
          >
            {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
            {isError && <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />}
            {!isSuccess && !isError && <Info className="w-4 h-4 text-sky-400 flex-shrink-0" />}
            <span className="flex-1 leading-snug">{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
}
