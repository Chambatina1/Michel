import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { normalizeProductInput, isUniqueSlugError } from '@/lib/product-input';

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

    let updateData: Record<string, unknown>;
    try {
      updateData = normalizeProductInput(body);
    } catch (validationError) {
      return NextResponse.json({ error: (validationError as Error).message }, { status: 400 });
    }

    for (const field of ['name', 'slug', 'condition', 'description']) {
      if (field in updateData && !updateData[field]) {
        return NextResponse.json({ error: `"${field}" cannot be empty` }, { status: 400 });
      }
    }

    if (updateData.slug && updateData.slug !== existing.slug) {
      const clash = await db.product.findUnique({ where: { slug: updateData.slug as string } });
      if (clash) {
        return NextResponse.json({ error: `Another product already uses the slug "${updateData.slug}"` }, { status: 409 });
      }
    }

    const product = await db.product.update({ where: { id }, data: updateData });
    return NextResponse.json({ product });
  } catch (error) {
    if (isUniqueSlugError(error)) {
      return NextResponse.json({ error: 'Another product already uses this slug' }, { status: 409 });
    }
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
