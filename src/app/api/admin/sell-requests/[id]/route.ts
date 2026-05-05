import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await db.sellRequest.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Sell request not found' }, { status: 404 });
    }

    const { status } = body;
    const validStatuses = ['pending', 'reviewing', 'offer_made', 'completed', 'declined'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const sellRequest = await db.sellRequest.update({
      where: { id },
      data: { ...(status ? { status } : {}) },
    });

    return NextResponse.json({ sellRequest });
  } catch (error) {
    console.error('Error updating sell request:', error);
    return NextResponse.json({ error: 'Failed to update sell request' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await db.sellRequest.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Sell request not found' }, { status: 404 });
    }

    await db.sellRequest.delete({ where: { id } });
    return NextResponse.json({ message: 'Sell request deleted successfully' });
  } catch (error) {
    console.error('Error deleting sell request:', error);
    return NextResponse.json({ error: 'Failed to delete sell request' }, { status: 500 });
  }
}
