import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: Record<string, unknown> = {};
    if (status && status !== 'all') {
      where.status = status;
    }

    const orders = await db.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    const total = await db.order.count({ where });
    const completedTotal = await db.order.findMany({ where: { status: 'completed' } });
    const revenue = completedTotal.reduce((sum, o) => sum + o.amount, 0);

    return NextResponse.json({ orders, total, revenue });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { stripeSessionId, productId, productName, customerEmail, customerName, amount, currency, status, metadata } = body;

    const order = await db.order.create({
      data: {
        stripeSessionId,
        productId,
        productName,
        customerEmail,
        customerName,
        amount: parseFloat(amount),
        currency: currency || 'usd',
        status: status || 'pending',
        metadata: metadata ? JSON.stringify(metadata) : '{}',
      },
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
