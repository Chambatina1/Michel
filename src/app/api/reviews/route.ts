import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const admin = searchParams.get('admin') === 'true';
    const featured = searchParams.get('featured') === 'true';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const rating = searchParams.get('rating');

    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    // Public endpoint only returns approved reviews unless admin
    if (!admin) {
      where.isApproved = true;
    }

    if (featured) {
      where.isFeatured = true;
    }

    if (rating) {
      where.rating = parseInt(rating, 10);
    }

    const [reviews, total] = await Promise.all([
      db.review.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
      }),
      db.review.count({ where }),
    ]);

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { author, email, rating, title, content, company, role } = body;

    if (!author || !rating || !title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: author, rating, title, content' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    if (content.length < 20) {
      return NextResponse.json(
        { error: 'Review content must be at least 20 characters' },
        { status: 400 }
      );
    }

    const review = await db.review.create({
      data: {
        author,
        email: email || null,
        rating,
        title,
        content,
        company: company || null,
        role: role || null,
        isApproved: false,
        isFeatured: false,
      },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 }
    );
  }
}
