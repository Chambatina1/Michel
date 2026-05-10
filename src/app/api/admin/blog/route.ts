import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/admin/blog - List all blog posts (admin)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const category = searchParams.get('category');
    const status = searchParams.get('status');

    const where: Record<string, unknown> = {};
    if (category && category !== 'All') {
      where.category = category;
    }
    if (status === 'published') {
      where.isPublished = true;
    } else if (status === 'draft') {
      where.isPublished = false;
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

    const categories = await prisma.blogPost.findMany({
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
    console.error('Error fetching admin blog posts:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

// POST /api/admin/blog - Create a new blog post
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, slug, excerpt, content, coverImage, category, author, tags, isPublished, isFeatured, readTime } = body;

    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'Title, slug, and content are required' }, { status: 400 });
    }

    // Check if slug already exists
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 409 });
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt: excerpt || '',
        content,
        coverImage: coverImage || '',
        category: category || 'Technology',
        author: author || 'P&S Medical Device Inc.',
        tags: tags || '',
        isPublished: isPublished || false,
        isFeatured: isFeatured || false,
        readTime: readTime || 5,
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}
