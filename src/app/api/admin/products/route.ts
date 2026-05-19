import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const condition = searchParams.get('condition');
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (condition) where.condition = condition;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { category: { contains: search } },
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
    const { name, slug, category, condition, price, description, specs, features, imageUrl, images, videos, status, isFeatured, isNegotiable, parentCategory, subCategory } = body;

    if (!name || !slug || !category || !condition || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existing = await db.product.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'Product slug already exists' }, { status: 409 });
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
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
