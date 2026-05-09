import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - List all knowledge entries (with optional filters)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const active = searchParams.get('active');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {};

    if (category && category !== 'all') {
      where.category = category;
    }
    if (active !== null && active !== undefined && active !== 'all') {
      where.isActive = active === 'true';
    }
    if (search) {
      where.OR = [
        { question: { contains: search, mode: 'insensitive' } },
        { answer: { contains: search, mode: 'insensitive' } },
        { keywords: { contains: search, mode: 'insensitive' } },
      ];
    }

    const knowledge = await db.aiKnowledge.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ knowledge });
  } catch (error) {
    console.error('Error fetching AI knowledge:', error);
    return NextResponse.json({ error: 'Failed to fetch knowledge entries' }, { status: 500 });
  }
}

// POST - Create new knowledge entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, question, answer, keywords } = body;

    if (!category || !question || !answer) {
      return NextResponse.json(
        { error: 'Category, question, and answer are required' },
        { status: 400 }
      );
    }

    const knowledge = await db.aiKnowledge.create({
      data: {
        category,
        question,
        answer,
        keywords: keywords || '',
        isActive: true,
      },
    });

    return NextResponse.json({ knowledge }, { status: 201 });
  } catch (error) {
    console.error('Error creating AI knowledge:', error);
    return NextResponse.json({ error: 'Failed to create knowledge entry' }, { status: 500 });
  }
}
