import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fafbfa] flex flex-col items-center justify-center p-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-4 font-black text-2xl">
        404
      </div>
      <h1 className="text-2xl font-black text-gray-900 mb-2">Page Not Found</h1>
      <p className="text-sm text-gray-600 max-w-sm mb-6">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition"
      >
        Return to Home
      </Link>
    </div>
  );
}
