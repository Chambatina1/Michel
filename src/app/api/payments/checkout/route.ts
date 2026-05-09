import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession, STRIPE_PUBLISHABLE_KEY } from '@/lib/stripe';
import { db } from '@/lib/db';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, customerEmail } = body;

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
        { error: 'This product does not have a set price. Please request a quote.' },
        { status: 400 }
      );
    }

    if (product.status !== 'active') {
      return NextResponse.json(
        { error: 'This product is no longer available' },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    // Stripe uses cents, so multiply by 100
    const priceInCents = Math.round(product.price * 100);

    const session = await createCheckoutSession({
      productName: product.name,
      productId: product.id,
      priceInCents,
      customerEmail: customerEmail || undefined,
      successUrl: `${BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${BASE_URL}/checkout/cancel?product=${product.slug}`,
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      publishableKey: STRIPE_PUBLISHABLE_KEY,
    });
  } catch (error: unknown) {
    console.error('Error creating checkout session:', error);
    const message = error instanceof Error ? error.message : 'Failed to create checkout session';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
