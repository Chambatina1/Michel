import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { normalizeProductInput, isUniqueSlugError, slugify } from '@/lib/product-input';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const condition = searchParams.get('condition');
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '50', 10) || 50, 1), 2000);
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (condition) where.condition = condition;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy: Record<string, string> = {};
    if (sort === 'price') orderBy.price = order === 'asc' ? 'asc' : 'desc';
    else if (sort === 'name') orderBy.name = order === 'asc' ? 'asc' : 'desc';
    else orderBy.createdAt = order === 'asc' ? 'asc' : 'desc';

    const [products, total] = await Promise.all([
      db.product.findMany({ where, orderBy, skip, take: limit }),
      db.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Error fetching admin products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let data: Record<string, unknown>;
    try {
      data = normalizeProductInput({ ...body, slug: body.slug || slugify(String(body.name || '')) });
    } catch (validationError) {
      return NextResponse.json({ error: (validationError as Error).message }, { status: 400 });
    }

    const missing = ['name', 'slug', 'category', 'condition', 'description'].filter((f) => !data[f]);
    if (missing.length > 0) {
      return NextResponse.json({ error: `Missing required fields: ${missing.join(', ')}` }, { status: 400 });
    }

    const existing = await db.product.findUnique({ where: { slug: data.slug as string } });
    if (existing) {
      return NextResponse.json({ error: `Another product already uses the slug "${data.slug}"` }, { status: 409 });
    }

    const product = await db.product.create({
      data: {
        name: data.name as string,
        slug: data.slug as string,
        category: data.category as string,
        condition: data.condition as string,
        description: data.description as string,
        price: (data.price as number | null | undefined) ?? null,
        specs: (data.specs as string) ?? '{}',
        features: (data.features as string) ?? '[]',
        imageUrl: (data.imageUrl as string) || '/images/placeholder-equipment.svg',
        images: (data.images as string) ?? '[]',
        videos: (data.videos as string) ?? '[]',
        status: (data.status as string) || 'active',
        isFeatured: (data.isFeatured as boolean) || false,
        isNegotiable: (data.isNegotiable as boolean) || false,
        parentCategory: (data.parentCategory as string | null) ?? null,
        subCategory: (data.subCategory as string | null) ?? null,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    if (isUniqueSlugError(error)) {
      return NextResponse.json({ error: 'Another product already uses this slug' }, { status: 409 });
    }
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

function parseIds(body: unknown): string[] | null {
  const ids = (body as { ids?: unknown })?.ids;
  if (!Array.isArray(ids) || ids.length === 0 || !ids.every((id) => typeof id === 'string')) return null;
  return ids as string[];
}

// Bulk status change: { ids: string[], status: string }
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const ids = parseIds(body);
    if (!ids) return NextResponse.json({ error: 'No products selected' }, { status: 400 });

    let data: Record<string, unknown>;
    try {
      data = normalizeProductInput({ status: body.status });
    } catch (validationError) {
      return NextResponse.json({ error: (validationError as Error).message }, { status: 400 });
    }

    const result = await db.product.updateMany({ where: { id: { in: ids } }, data });
    return NextResponse.json({ count: result.count });
  } catch (error) {
    console.error('Error bulk updating products:', error);
    return NextResponse.json({ error: 'Failed to update products' }, { status: 500 });
  }
}

// Bulk delete: { ids: string[] }
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const ids = parseIds(body);
    if (!ids) return NextResponse.json({ error: 'No products selected' }, { status: 400 });

    const result = await db.product.deleteMany({ where: { id: { in: ids } } });
    return NextResponse.json({ count: result.count });
  } catch (error) {
    console.error('Error bulk deleting products:', error);
    return NextResponse.json({ error: 'Failed to delete products' }, { status: 500 });
  }
}
