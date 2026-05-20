import { NextRequest, NextResponse } from 'next/server';
import {
  createCheckoutSession,
  createCartCheckoutSession,
  STRIPE_PUBLISHABLE_KEY,
} from '@/lib/stripe';
import { db } from '@/lib/db';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, customerEmail, shippingType, cart, shippingAddress, shippingMethod } = body;

    // ── Cart Checkout Flow ──
    if (cart && Array.isArray(cart) && cart.length > 0) {
      // Validate cart items
      const productIds = cart.map((item: { productId: string; quantity: number }) => item.productId);

      // Fetch all products from database
      const products = await db.product.findMany({
        where: { id: { in: productIds } },
      });

      if (products.length === 0) {
        return NextResponse.json(
          { error: 'No valid products found in cart' },
          { status: 400 }
        );
      }

      // Validate each product
      const cartQuantityMap = new Map(cart.map((item: { productId: string; quantity: number }) => [item.productId, item.quantity]));

      for (const product of products) {
        if (product.status !== 'active') {
          return NextResponse.json(
            { error: `${product.name} is no longer available` },
            { status: 400 }
          );
        }
        if (!product.price || product.price <= 0) {
          return NextResponse.json(
            { error: `${product.name} does not have a set price. Please request a quote.` },
            { status: 400 }
          );
        }
      }

      // Build line items
      const lineItems = products.map((product) => {
        const quantity = cartQuantityMap.get(product.id) || 1;
        return {
          productId: product.id,
          name: product.name,
          priceInCents: Math.round(product.price * 100),
          quantity,
          imageUrl: product.imageUrl,
          category: product.category,
          condition: product.condition,
        };
      });

      // Calculate shipping option details
      const subtotal = products.reduce((sum, p) => {
        const qty = cartQuantityMap.get(p.id) || 1;
        return sum + (p.price || 0) * qty;
      }, 0);

      // Determine shipping option name and price
      let shippingOptionName = 'Standard Shipping';
      let shippingOptionPrice = 0;
      let shippingOptionDays = '5-7';

      if (shippingMethod) {
        // Map shipping method IDs to display names and prices
        const shippingMethodMap: Record<string, { name: string; days: string }> = {
          'usps-priority': { name: 'USPS Priority Mail', days: '2-4' },
          'ups-ground': { name: 'UPS Ground', days: '5-7' },
          'fedex-ground': { name: 'FedEx Ground', days: '5-7' },
          'fedex-express-saver': { name: 'FedEx Express Saver', days: '2-3' },
          'fedex-2day': { name: 'FedEx 2Day', days: '2' },
          'fedex-overnight': { name: 'FedEx Priority Overnight', days: '1' },
          'ltl-freight': { name: 'LTL Freight Shipping', days: '7-14' },
          'white-glove': { name: 'White Glove Delivery', days: '14-21' },
        };

        const methodInfo = shippingMethodMap[shippingMethod];
        if (methodInfo) {
          shippingOptionName = methodInfo.name;
          shippingOptionDays = methodInfo.days;
        }

        // Free shipping for orders over $50,000
        if (subtotal >= 50000) {
          shippingOptionPrice = 0;
        }
      }

      const addr = shippingAddress || {
        name: customerEmail || 'Customer',
        email: customerEmail || '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        country: 'US',
      };

      // Create the cart checkout session
      const session = await createCartCheckoutSession({
        lineItems,
        shippingOption: {
          id: shippingMethod || 'standard',
          name: shippingOptionName,
          priceInCents: shippingOptionPrice,
          estimatedDays: shippingOptionDays,
        },
        shippingAddress: addr,
        customerEmail: addr.email || undefined,
        successUrl: `${BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${BASE_URL}/checkout?cancelled=true`,
      });

      return NextResponse.json({
        sessionId: session.id,
        url: session.url,
        publishableKey: STRIPE_PUBLISHABLE_KEY,
      });
    }

    // ── Single Product Checkout (Backward Compatible) ──
    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID or cart is required' },
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
    const priceInCents = Math.round(product.price * 100);

    const session = await createCheckoutSession({
      productName: product.name,
      productId: product.id,
      priceInCents,
      customerEmail: customerEmail || undefined,
      shippingType: shippingType || 'standard',
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
