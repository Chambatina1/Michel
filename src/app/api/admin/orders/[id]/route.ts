import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const order = await db.order.findUnique({ where: { id } });
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    // If metadata is provided, merge it with existing metadata
    if (body.metadata !== undefined) {
      const existing = await db.order.findUnique({ where: { id } });
      if (!existing) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

      let existingMeta = {};
      try { existingMeta = JSON.parse(existing.metadata || '{}'); } catch { /* ignore */ }

      const mergedMeta = { ...existingMeta, ...body.metadata };
      body.metadata = JSON.stringify(mergedMeta);
    }

    const order = await db.order.update({
      where: { id },
      data: body,
    });
    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
