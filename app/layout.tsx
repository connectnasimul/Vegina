import type { Metadata } from 'next';
import './globals.css';
import { AuthAndCartProvider } from '@/context/AuthAndCartContext';

export const metadata: Metadata = {
  title: 'Organic Khabar Bangladesh - Organic Grocery & E-Commerce',
  description:
    'A vibrant Bangladesh-focused organic fresh grocery and food e-commerce platform, featuring BDT pricing, bKash/Nagad/COD checkout, category browsing, and Cloud Firestore sync.',
  openGraph: {
    title: 'Organic Khabar Bangladesh - Organic Grocery & E-Commerce',
    description:
      'Farm fresh vegetables, seasonal fruits, pure Sundarban raw honey, and wood-ghani mustard oil delivered across Dhaka and Bangladesh.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Organic Khabar Bangladesh - Organic Grocery & E-Commerce',
    description:
      'Farm fresh vegetables, seasonal fruits, pure Sundarban raw honey, and wood-ghani mustard oil delivered across Dhaka and Bangladesh.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body className="antialiased text-gray-900 bg-[#fafbfa]" suppressHydrationWarning>
        <AuthAndCartProvider>{children}</AuthAndCartProvider>
      </body>
    </html>
  );
}
