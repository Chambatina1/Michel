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
  shippingType?: 'standard' | 'freight';
}) {
  const {
    productName,
    productId,
    priceInCents,
    currency = 'usd',
    customerEmail,
    successUrl,
    cancelUrl,
    shippingType = 'standard',
  } = params;

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency,
          unit_amount: priceInCents,
          product_data: {
            name: productName,
            metadata: { productId },
          },
        },
        quantity: 1,
      },
    ],
    metadata: { productId, shippingType },
    customer_email: customerEmail,
    success_url: successUrl,
    cancel_url: cancelUrl,
    shipping_address_collection: {
      allowed_countries: ['US', 'CA', 'MX'],
    },
  };

  if (shippingType === 'standard') {
    sessionParams.shipping_options = [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: 0, currency },
          display_name: 'Free Pickup',
          delivery_estimate: {
            minimum: { unit: 'day', value: 1 },
            maximum: { unit: 'day', value: 3 },
          },
        },
      },
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: 4999, currency },
          display_name: 'UPS Ground',
          delivery_estimate: {
            minimum: { unit: 'business_day', value: 5 },
            maximum: { unit: 'business_day', value: 7 },
          },
        },
      },
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: 7999, currency },
          display_name: 'USPS Priority',
          delivery_estimate: {
            minimum: { unit: 'business_day', value: 2 },
            maximum: { unit: 'business_day', value: 4 },
          },
        },
      },
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: 9999, currency },
          display_name: 'FedEx Express',
          delivery_estimate: {
            minimum: { unit: 'business_day', value: 1 },
            maximum: { unit: 'business_day', value: 3 },
          },
        },
      },
    ];
  } else {
    // Freight shipping for large equipment
    sessionParams.shipping_options = [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: 0, currency },
          display_name: 'Freight Shipping - Quote Required',
          delivery_estimate: {
            minimum: { unit: 'day', value: 7 },
            maximum: { unit: 'day', value: 21 },
          },
        },
      },
    ];
  }

  const session = await stripe.checkout.sessions.create(sessionParams);
  return session;
}

/**
 * Cart line item interface for createCartCheckoutSession
 */
export interface CartLineItem {
  productId: string;
  name: string;
  priceInCents: number;
  quantity: number;
  imageUrl?: string;
  category?: string;
  condition?: string;
}

export interface ShippingAddress {
  name: string;
  email: string;
  phone: string;
  company?: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

/**
 * Create a Stripe Checkout Session for a cart purchase (multi-line-item)
 */
export async function createCartCheckoutSession(params: {
  lineItems: CartLineItem[];
  shippingOption: {
    id: string;
    name: string;
    priceInCents: number;
    estimatedDays: string;
  };
  shippingAddress: ShippingAddress;
  currency?: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const {
    lineItems,
    shippingOption,
    shippingAddress,
    currency = 'usd',
    successUrl,
    cancelUrl,
  } = params;

  // Build line items for Stripe
  const stripeLineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = lineItems.map(
    (item) => ({
      price_data: {
        currency,
        unit_amount: item.priceInCents,
        product_data: {
          name: item.name,
          metadata: {
            productId: item.productId,
            category: item.category || '',
            condition: item.condition || '',
          },
          images: item.imageUrl ? [item.imageUrl] : undefined,
        },
      },
      quantity: item.quantity,
    })
  );

  // Build shipping option for Stripe
  const stripeShippingOption: Stripe.Checkout.SessionCreateParams.ShippingOption = {
    shipping_rate_data: {
      type: 'fixed_amount',
      fixed_amount: {
        amount: shippingOption.priceInCents,
        currency,
      },
      display_name: shippingOption.name,
      delivery_estimate: {
        minimum: { unit: 'business_day', value: 1 },
        maximum: { unit: 'day', value: parseInt(shippingOption.estimatedDays.replace(/\D/g, '') || '7') },
      },
    },
  };

  // Build metadata with cart and shipping info
  const metadata: Record<string, string> = {
    type: 'cart',
    shippingMethod: shippingOption.id,
    shippingAddress: JSON.stringify(shippingAddress),
    itemCount: String(lineItems.reduce((sum, i) => sum + i.quantity, 0)),
    productIds: lineItems.map((i) => i.productId).join(','),
  };

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: stripeLineItems,
    shipping_options: [stripeShippingOption],
    metadata,
    customer_email: shippingAddress.email,
    success_url: successUrl,
    cancel_url: cancelUrl,
    shipping_address_collection: {
      allowed_countries: ['US', 'CA', 'MX'],
    },
    // Prefill shipping info
    customer_details: {
      address: {
        country: shippingAddress.country === 'US' ? 'US' : shippingAddress.country === 'CA' ? 'CA' : 'MX',
        state: shippingAddress.state,
        city: shippingAddress.city,
        line1: shippingAddress.address,
        postal_code: shippingAddress.zip,
      },
      name: shippingAddress.name,
      phone: shippingAddress.phone,
    },
  };

  const session = await stripe.checkout.sessions.create(sessionParams);
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
