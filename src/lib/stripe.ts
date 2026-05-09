import Stripe from 'stripe';

export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder',
  {
    apiVersion: '2026-04-22.dahlia',
    typescript: true,
  }
);

export const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder';

/**
 * Create a Stripe Checkout Session for a product purchase
 */
export async function createCheckoutSession(params: {
  productName: string;
  productId: string;
  priceInCents: number;
  currency?: string;
  customerEmail?: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const {
    productName,
    productId,
    priceInCents,
    currency = 'usd',
    customerEmail,
    successUrl,
    cancelUrl,
  } = params;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency,
          unit_amount: priceInCents, // amount in cents
          product_data: {
            name: productName,
            metadata: {
              productId,
            },
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      productId,
    },
    customer_email: customerEmail,
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return session;
}

/**
 * Create a Stripe Payment Link for a product (shareable link)
 */
export async function createPaymentLink(params: {
  productName: string;
  productId: string;
  priceInCents: number;
  currency?: string;
  quantity?: number;
}) {
  const {
    productName,
    productId,
    priceInCents,
    currency = 'usd',
    quantity = 1,
  } = params;

  const price = await stripe.prices.create({
    unit_amount: priceInCents,
    currency,
    product_data: {
      name: productName,
      metadata: {
        productId,
      },
    },
  });

  const paymentLink = await stripe.paymentLinks.create({
    line_items: [{ price: price.id, quantity }],
    metadata: {
      productId,
    },
  });

  return paymentLink;
}

/**
 * Verify a Stripe webhook signature
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string,
  webhookSecret: string
) {
  const webhookEvent = stripe.webhooks.constructEvent(
    payload,
    signature,
    webhookSecret
  );
  return webhookEvent;
}

/**
 * Get Stripe dashboard URL for a session
 */
export function getSessionUrl(sessionId: string) {
  return `https://dashboard.stripe.com/payments/${sessionId}`;
}
