import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await db.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    const allowedFields = ['name', 'slug', 'category', 'condition', 'price', 'description', 'specs', 'features', 'imageUrl', 'images', 'videos', 'status', 'isFeatured', 'isNegotiable', 'parentCategory', 'subCategory'];
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (field === 'specs') updateData.specs = typeof body[field] === 'string' ? body[field] : JSON.stringify(body[field]);
        else if (field === 'features') updateData.features = typeof body[field] === 'string' ? body[field] : JSON.stringify(body[field]);
        else if (field === 'images') updateData.images = typeof body[field] === 'string' ? body[field] : JSON.stringify(body[field]);
        else if (field === 'videos') updateData.videos = typeof body[field] === 'string' ? body[field] : JSON.stringify(body[field]);
        else updateData[field] = body[field];
      }
    }

    const product = await db.product.update({ where: { id }, data: updateData });
    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await db.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    await db.product.delete({ where: { id } });
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
