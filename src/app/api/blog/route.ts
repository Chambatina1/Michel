import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/blog - List published blog posts
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const slug = searchParams.get('slug');

    // If slug is provided, return single post
    if (slug) {
      const post = await prisma.blogPost.findUnique({
        where: { slug, isPublished: true },
      });
      if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }
      return NextResponse.json({ post });
    }

    const where: Record<string, unknown> = { isPublished: true };
    if (category && category !== 'All') {
      where.category = category;
    }
    if (featured === 'true') {
      where.isFeatured = true;
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.blogPost.count({ where }),
    ]);

    // Get all unique categories
    const categories = await prisma.blogPost.findMany({
      where: { isPublished: true },
      select: { category: true },
      distinct: ['category'],
    });

    return NextResponse.json({
      posts,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      categories: categories.map((c) => c.category),
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}
