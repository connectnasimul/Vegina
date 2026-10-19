'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App runtime error caught by boundary:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#fafbfa] flex flex-col items-center justify-center p-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center mx-auto mb-4 font-black text-2xl">
        !
      </div>
      <h1 className="text-2xl font-black text-gray-900 mb-2">Something Went Wrong</h1>
      <p className="text-sm text-gray-600 max-w-sm mb-6">
        An unexpected error occurred. Please try reloading the page or returning home.
      </p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={() => reset()}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition cursor-pointer"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-5 py-2.5 rounded-xl text-xs transition"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
