import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action } = body;

    const existing = await db.review.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    if (action === 'approve') {
      const updated = await db.review.update({
        where: { id },
        data: {
          isApproved: true,
          ...(body.isFeatured !== undefined ? { isFeatured: body.isFeatured } : {}),
        },
      });
      return NextResponse.json({ review: updated });
    }

    if (action === 'unapprove') {
      const updated = await db.review.update({
        where: { id },
        data: { isApproved: false },
      });
      return NextResponse.json({ review: updated });
    }

    if (action === 'delete') {
      await db.review.delete({ where: { id } });
      return NextResponse.json({ message: 'Review deleted successfully' });
    }

    if (action === 'update') {
      const { title, content, rating, isApproved, isFeatured } = body;
      const updated = await db.review.update({
        where: { id },
        data: {
          ...(title !== undefined ? { title } : {}),
          ...(content !== undefined ? { content } : {}),
          ...(rating !== undefined ? { rating } : {}),
          ...(isApproved !== undefined ? { isApproved } : {}),
          ...(isFeatured !== undefined ? { isFeatured } : {}),
        },
      });
      return NextResponse.json({ review: updated });
    }

    return NextResponse.json(
      { error: 'Invalid action. Use: approve, unapprove, delete, or update' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await db.review.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    await db.review.delete({ where: { id } });
    return NextResponse.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    );
  }
}
