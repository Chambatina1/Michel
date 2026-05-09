import { NextRequest, NextResponse } from 'next/server';
import { createPaymentLink } from '@/lib/stripe';
import { db } from '@/lib/db';

/**
 * POST /api/payments/create-link
 * Create a Stripe Payment Link for a product (shareable URL)
 * This is useful for admin to generate links to share with customers
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Fetch product from database
    const product = await db.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    if (!product.price || product.price <= 0) {
      return NextResponse.json(
        { error: 'Cannot create payment link for product without price' },
        { status: 400 }
      );
    }

    // Create Stripe Payment Link
    const priceInCents = Math.round(product.price * 100);

    const paymentLink = await createPaymentLink({
      productName: product.name,
      productId: product.id,
      priceInCents,
    });

    return NextResponse.json({
      url: paymentLink.url,
      productId: product.id,
      productName: product.name,
    });
  } catch (error: unknown) {
    console.error('Error creating payment link:', error);
    const message = error instanceof Error ? error.message : 'Failed to create payment link';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
