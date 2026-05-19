import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { FALLBACK_PRODUCTS } from '@/lib/fallback-products';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Try database first
  try {
    const product = await db.product.findUnique({ where: { slug } });

    if (!product) {
      // Fallback if DB product not found
      const fallback = FALLBACK_PRODUCTS.find((p) => p.slug === slug);
      if (!fallback) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      const parsed = {
        ...fallback,
        specs: JSON.parse(fallback.specs),
        features: JSON.parse(fallback.features),
        images: JSON.parse(fallback.images || '[]'),
        videos: JSON.parse(fallback.videos || '[]'),
      };
      return NextResponse.json({ product: parsed });
    }

    const parsedProduct = {
      ...product,
      specs: JSON.parse(product.specs || '{}'),
      features: JSON.parse(product.features || '[]'),
      images: JSON.parse(product.images || '[]'),
      videos: JSON.parse(product.videos || '[]'),
    };

    return NextResponse.json({ product: parsedProduct });
  } catch (dbError) {
    // DB unavailable - use fallback
    console.warn('DB unavailable, using fallback for slug:', slug);
    const fallback = FALLBACK_PRODUCTS.find((p) => p.slug === slug);
    if (!fallback) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    const parsed = {
      ...fallback,
      specs: JSON.parse(fallback.specs),
      features: JSON.parse(fallback.features),
      images: JSON.parse(fallback.images || '[]'),
      videos: JSON.parse(fallback.videos || '[]'),
    };
    return NextResponse.json({ product: parsed });
  }
}
