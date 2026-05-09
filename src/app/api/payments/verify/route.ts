import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

/**
 * GET /api/payments/verify?session_id=xxx
 * Verify a Stripe checkout session status
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      id: session.id,
      status: session.payment_status, // 'paid', 'unpaid', 'no_payment_required'
      amount_total: session.amount_total,
      currency: session.currency,
      customer_email: session.customer_email,
      metadata: session.metadata,
      created: session.created,
    });
  } catch (error: unknown) {
    console.error('Error verifying session:', error);
    const message = error instanceof Error ? error.message : 'Failed to verify session';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
