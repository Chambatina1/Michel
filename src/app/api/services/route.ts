import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

/* ── GET: List all published services (public) ── */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const published = searchParams.get('published');
  const featured = searchParams.get('featured');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  try {
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (published === 'true') {
      where.isPublished = true;
    }
    if (featured === 'true') {
      where.isFeatured = true;
    }

    const [services, total] = await Promise.all([
      db.service.findMany({
        where,
        orderBy: { sortOrder: 'asc' },
        skip,
        take: limit,
      }),
      db.service.count({ where }),
    ]);

    // Parse JSON fields for each service
    const parsedServices = services.map((service) => ({
      ...service,
      features: JSON.parse(service.features),
      images: JSON.parse(service.images),
    }));

    return NextResponse.json({
      services: parsedServices,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

/* ── POST: Create a new service (admin) ── */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title, slug, description, shortDesc, icon, coverImage,
      images, features, ctaText, ctaLink, sortOrder,
      isPublished, isFeatured,
    } = body;

    if (!title || !slug || !shortDesc) {
      return NextResponse.json(
        { error: 'Missing required fields: title, slug, shortDesc' },
        { status: 400 }
      );
    }

    const existing = await db.service.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: 'A service with this slug already exists' },
        { status: 409 }
      );
    }

    const service = await db.service.create({
      data: {
        title,
        slug,
        description: description || '',
        shortDesc,
        icon: icon || 'Wrench',
        coverImage: coverImage || '',
        images: typeof images === 'string' ? images : JSON.stringify(images || []),
        features: typeof features === 'string' ? features : JSON.stringify(features || []),
        ctaText: ctaText || 'Learn More',
        ctaLink: ctaLink || '/contact',
        sortOrder: sortOrder ?? 0,
        isPublished: isPublished ?? true,
        isFeatured: isFeatured ?? false,
      },
    });

    return NextResponse.json({ service }, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    );
  }
}
