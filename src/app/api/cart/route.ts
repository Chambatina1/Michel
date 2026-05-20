import { NextResponse } from 'next/server';

/**
 * Cart API endpoint for server-side validation.
 * Currently returns a simple success response.
 * Future: validate product availability, apply discounts, etc.
 */
export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'Cart API is operational' });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productIds } = body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { error: 'Product IDs array is required' },
        { status: 400 }
      );
    }

    // Future: validate product availability, pricing, etc.
    return NextResponse.json({
      status: 'ok',
      validatedCount: productIds.length,
    });
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
