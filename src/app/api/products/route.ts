import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { FALLBACK_PRODUCTS, filterFallbackProducts } from '@/lib/fallback-products';

/* ═══════════════════════════════════════════════════════ */

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');
  const condition = searchParams.get('condition');
  const search = searchParams.get('search');
  const featured = searchParams.get('featured');
  const status = searchParams.get('status') || 'active';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '100', 10);
  const sort = searchParams.get('sort') || 'createdAt';
  const order = searchParams.get('order') || 'desc';

  // Try database first
  try {
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { status };

    if (category) where.category = category;
    if (condition) where.condition = condition;
    if (featured === 'true') where.isFeatured = true;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { category: { contains: search } },
      ];
    }

    const orderBy: Record<string, string> = {};
    if (sort === 'price' && order === 'asc') orderBy.price = 'asc';
    else if (sort === 'price') orderBy.price = 'desc';
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
  } catch (dbError) {
    console.warn('DB unavailable, using fallback products:', (dbError as Error).message);

    // Fallback: use shared fallback data
    let filtered = filterFallbackProducts(FALLBACK_PRODUCTS, {
      category: category || undefined,
      condition: condition || undefined,
      search: search || undefined,
      featured: featured || undefined,
      status,
    });

    // Sort
    filtered.sort((a, b) => {
      if (sort === 'price') {
        return order === 'asc'
          ? (a.price || 0) - (b.price || 0)
          : (b.price || 0) - (a.price || 0);
      }
      if (sort === 'name') {
        return order === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      }
      return order === 'asc'
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Paginate
    const total = filtered.length;
    const skip = (page - 1) * limit;
    const paginated = filtered.slice(skip, skip + limit);

    return NextResponse.json({
      products: paginated,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name, slug, category, condition, price, description,
      specs, features, imageUrl, images, videos, status, isFeatured,
      isNegotiable, parentCategory, subCategory,
    } = body;

    if (!name || !slug || !category || !condition || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: name, slug, category, condition, description' },
        { status: 400 }
      );
    }

    const existing = await db.product.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: 'A product with this slug already exists' },
        { status: 409 }
      );
    }

    const product = await db.product.create({
      data: {
        name, slug, category, condition,
        price: price ?? null,
        description,
        specs: typeof specs === 'string' ? specs : JSON.stringify(specs || {}),
        features: typeof features === 'string' ? features : JSON.stringify(features || []),
        imageUrl: imageUrl || '/images/placeholder-equipment.svg',
        images: typeof images === 'string' ? images : JSON.stringify(images || []),
        videos: typeof videos === 'string' ? videos : JSON.stringify(videos || []),
        status: status || 'active',
        isFeatured: isFeatured || false,
        isNegotiable: isNegotiable || false,
        parentCategory: parentCategory || null,
        subCategory: subCategory || null,
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
