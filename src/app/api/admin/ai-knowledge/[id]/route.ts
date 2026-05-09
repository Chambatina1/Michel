import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// PATCH - Update knowledge entry
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await db.aiKnowledge.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Knowledge entry not found' }, { status: 404 });
    }

    const allowedFields = ['category', 'question', 'answer', 'keywords', 'isActive'];
    const updateData: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    const knowledge = await db.aiKnowledge.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ knowledge });
  } catch (error) {
    console.error('Error updating AI knowledge:', error);
    return NextResponse.json({ error: 'Failed to update knowledge entry' }, { status: 500 });
  }
}

// DELETE - Delete knowledge entry
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await db.aiKnowledge.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Knowledge entry not found' }, { status: 404 });
    }

    await db.aiKnowledge.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting AI knowledge:', error);
    return NextResponse.json({ error: 'Failed to delete knowledge entry' }, { status: 500 });
  }
}
