import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (status) {
      where.status = status;
    }

    const [requests, total] = await Promise.all([
      db.sellRequest.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.sellRequest.count({ where }),
    ]);

    // Parse photos JSON
    const parsedRequests = requests.map((req) => ({
      ...req,
      photos: JSON.parse(req.photos),
    }));

    return NextResponse.json({
      requests: parsedRequests,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching sell requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sell requests' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      company,
      equipmentType,
      manufacturer,
      model,
      condition,
      description,
      photos,
      askingPrice,
    } = body;

    if (!name || !email || !equipmentType || !condition) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, equipmentType, condition' },
        { status: 400 }
      );
    }

    const validConditions = ['Working', 'Needs Repair', 'Non-Working', 'Parts Only'];
    if (!validConditions.includes(condition)) {
      return NextResponse.json(
        { error: 'Invalid condition. Must be one of: Working, Needs Repair, Non-Working, Parts Only' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const sellRequest = await db.sellRequest.create({
      data: {
        name,
        email,
        phone: phone || null,
        company: company || null,
        equipmentType,
        manufacturer: manufacturer || null,
        model: model || null,
        condition,
        description: description || null,
        photos: Array.isArray(photos) ? JSON.stringify(photos) : '[]',
        askingPrice: askingPrice ?? null,
        status: 'pending',
      },
    });

    return NextResponse.json({ sellRequest }, { status: 201 });
  } catch (error) {
    console.error('Error creating sell request:', error);
    return NextResponse.json(
      { error: 'Failed to submit sell request' },
      { status: 500 }
    );
  }
}
