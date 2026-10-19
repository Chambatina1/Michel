import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { NEWSLETTER_LEAD_TYPE, generatePromoCode, getPromoSettings } from '@/lib/promo';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = typeof body.name === 'string' ? body.name.trim().slice(0, 100) : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase().slice(0, 200) : '';

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const { enabled, percent } = await getPromoSettings();
    if (!enabled) {
      return NextResponse.json({ error: 'This promotion is not active' }, { status: 400 });
    }

    // One code per email: return the existing one instead of issuing another
    const existing = await db.lead.findFirst({ where: { type: NEWSLETTER_LEAD_TYPE, email } });
    if (existing?.productName) {
      return NextResponse.json({
        code: existing.productName,
        percent,
        alreadyUsed: existing.status === 'converted',
      });
    }

    const code = generatePromoCode(percent);
    await db.lead.create({
      data: {
        name,
        email,
        type: NEWSLETTER_LEAD_TYPE,
        productName: code,
        message: `Newsletter subscriber. Discount code ${code} (${percent}% off parts & accessories, one-time use).`,
        status: 'new',
      },
    });

    return NextResponse.json({ code, percent, alreadyUsed: false }, { status: 201 });
  } catch (error) {
    console.error('Error subscribing:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
