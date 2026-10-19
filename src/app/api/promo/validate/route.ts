import { NextRequest, NextResponse } from 'next/server';
import { evaluatePromo } from '@/lib/promo';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const cart = Array.isArray(body.cart) ? body.cart : [];
    const result = await evaluatePromo(body.code, cart);

    if (!result.valid) {
      return NextResponse.json({ valid: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      valid: true,
      code: result.code,
      percent: result.percent,
      discount: result.discount,
      productIds: [...result.discountedIds],
    });
  } catch (error) {
    console.error('Error validating promo code:', error);
    return NextResponse.json({ valid: false, error: 'Failed to validate code' }, { status: 500 });
  }
}
