import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const dateRange = searchParams.get('dateRange') || 'all';
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: Record<string, unknown> = {};

    // Status filter
    if (status && status !== 'all') {
      where.status = status;
    }

    // Date range filter
    if (dateRange !== 'all') {
      const now = new Date();
      let startDate: Date;
      switch (dateRange) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week': {
          const dayOfWeek = now.getDay();
          const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
          startDate = new Date(now.getFullYear(), now.getMonth(), diff);
          startDate.setHours(0, 0, 0, 0);
          break;
        }
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = new Date(0);
      }
      where.createdAt = { gte: startDate };
    }

    const orders = await db.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    const total = await db.order.count();

    // Revenue from completed/delivered orders
    const completedOrders = await db.order.findMany({ where: { status: { in: ['completed', 'delivered', 'shipped'] } } });
    const revenue = completedOrders.reduce((sum, o) => sum + o.amount, 0);

    // Pending orders count
    const pendingCount = await db.order.count({ where: { status: 'pending' } });

    // This month orders count
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthCount = await db.order.count({ where: { createdAt: { gte: monthStart } } });

    // Average order value (from all non-refunded/cancelled)
    const nonFailedOrders = await db.order.findMany({
      where: { status: { notIn: ['refunded', 'cancelled', 'failed'] } },
    });
    const avgOrderValue = nonFailedOrders.length > 0
      ? nonFailedOrders.reduce((sum, o) => sum + o.amount, 0) / nonFailedOrders.length
      : 0;

    return NextResponse.json({
      orders,
      stats: {
        total,
        revenue,
        pendingCount,
        thisMonthCount,
        avgOrderValue,
      },
    });
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
