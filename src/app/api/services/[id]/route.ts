import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

/* ── GET: Get single service by ID ── */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const service = await db.service.findUnique({ where: { id } });

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    const parsedService = {
      ...service,
      features: JSON.parse(service.features),
      images: JSON.parse(service.images),
    };

    return NextResponse.json({ service: parsedService });
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service' },
      { status: 500 }
    );
  }
}

/* ── PUT: Full update of a service ── */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const {
      title, slug, description, shortDesc, icon, coverImage,
      images, features, ctaText, ctaLink, sortOrder,
      isPublished, isFeatured,
    } = body;

    // Verify service exists
    const existing = await db.service.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    // Check slug uniqueness if changing
    if (slug && slug !== existing.slug) {
      const slugExists = await db.service.findUnique({ where: { slug } });
      if (slugExists) {
        return NextResponse.json({ error: 'A service with this slug already exists' }, { status: 409 });
      }
    }

    const service = await db.service.update({
      where: { id },
      data: {
        title: title ?? existing.title,
        slug: slug ?? existing.slug,
        description: description ?? existing.description,
        shortDesc: shortDesc ?? existing.shortDesc,
        icon: icon ?? existing.icon,
        coverImage: coverImage ?? existing.coverImage,
        images: images !== undefined
          ? (typeof images === 'string' ? images : JSON.stringify(images))
          : existing.images,
        features: features !== undefined
          ? (typeof features === 'string' ? features : JSON.stringify(features))
          : existing.features,
        ctaText: ctaText ?? existing.ctaText,
        ctaLink: ctaLink ?? existing.ctaLink,
        sortOrder: sortOrder ?? existing.sortOrder,
        isPublished: isPublished ?? existing.isPublished,
        isFeatured: isFeatured ?? existing.isFeatured,
      },
    });

    return NextResponse.json({ service });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { error: 'Failed to update service' },
      { status: 500 }
    );
  }
}

/* ── PATCH: Partial update of a service ── */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // PATCH delegates to PUT for this API
  return PUT(request, { params });
}

/* ── DELETE: Delete a service ── */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const existing = await db.service.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    await db.service.delete({ where: { id } });

    return NextResponse.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    );
  }
}
