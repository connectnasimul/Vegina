import { NextResponse } from 'next/server';
import { PRODUCTS, CATEGORIES } from '@/data/products';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const query = searchParams.get('q')?.toLowerCase();

  let filtered = [...PRODUCTS];

  if (category && category !== 'all') {
    filtered = filtered.filter((p) => p.category === category);
  }

  if (query) {
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.nameBn.includes(query) ||
        p.origin.toLowerCase().includes(query) ||
        p.originBn.includes(query)
    );
  }

  return NextResponse.json({
    total: filtered.length,
    categories: CATEGORIES,
    products: filtered,
  });
}
