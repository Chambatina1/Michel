import { NextRequest, NextResponse } from 'next/server';
import { stripe, verifyWebhookSignature } from '@/lib/stripe';
import { db } from '@/lib/db';

// Disable body parsing for webhooks - Stripe needs raw body for signature verification
export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not configured');
    return NextResponse.json(
      { error: 'Webhook not configured' },
      { status: 500 }
    );
  }

  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const event = verifyWebhookSignature(body, signature, webhookSecret);

    // Handle specific events
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        await handleCheckoutComplete(session);
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        console.log(`Payment succeeded: ${paymentIntent.id}`);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        console.log(`Payment failed: ${paymentIntent.id}`);
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object;
        console.log(`Charge refunded: ${charge.id}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    console.error('Webhook error:', error);
    const message = error instanceof Error ? error.message : 'Webhook handler failed';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

/**
 * Handle successful checkout - update product status
 */
async function handleCheckoutComplete(session: any) {
  const productId = session.metadata?.productId;

  if (!productId) {
    console.error('No productId in session metadata');
    return;
  }

  try {
    // Update product status to sold
    await db.product.update({
      where: { id: productId },
      data: { status: 'sold' },
    });

    // Create order record
    await db.order.create({
      data: {
        stripeSessionId: session.id,
        productId: productId,
        productName: session.metadata?.productName || 'Unknown Product',
        customerEmail: session.customer_details?.email || session.customer_email || null,
        customerName: session.customer_details?.name || null,
        amount: session.amount_total / 100,
        currency: session.currency || 'usd',
        status: 'completed',
        metadata: JSON.stringify({
          paymentIntent: session.payment_intent,
          customer: session.customer,
          shippingType: session.metadata?.shippingType,
          shippingAddress: session.shipping_details?.address,
          shippingOption: session.shipping_options?.[0]?.shipping_rate,
        }),
      },
    });

    console.log(`Product ${productId} marked as sold and order created after successful payment`);
  } catch (dbError) {
    console.error('Failed to update product status or create order:', dbError);
  }
}

// Allow GET for Stripe webhook verification during setup
export async function GET() {
  return NextResponse.json({ status: 'Stripe webhook endpoint is active' });
}
