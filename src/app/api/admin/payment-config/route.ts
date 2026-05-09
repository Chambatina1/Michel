import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const configs = await db.paymentConfig.findMany();
    const configObj: Record<string, { isActive: boolean; config: Record<string, string> }> = {};
    for (const c of configs) {
      configObj[c.gateway] = {
        isActive: c.isActive,
        config: JSON.parse(c.config || '{}'),
      };
    }
    return NextResponse.json({ configs: configObj });
  } catch (error) {
    console.error('Error fetching payment config:', error);
    return NextResponse.json({ error: 'Failed to fetch payment config' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { gateway, isActive, config } = body;

    if (!gateway) {
      return NextResponse.json({ error: 'Gateway is required' }, { status: 400 });
    }

    const existing = await db.paymentConfig.findUnique({ where: { gateway } });

    let result;
    if (existing) {
      const updateData: Record<string, unknown> = {};
      if (isActive !== undefined) updateData.isActive = isActive;
      if (config !== undefined) updateData.config = JSON.stringify(config);
      result = await db.paymentConfig.update({
        where: { gateway },
        data: updateData,
      });
    } else {
      result = await db.paymentConfig.create({
        data: {
          gateway,
          isActive: isActive ?? false,
          config: config ? JSON.stringify(config) : '{}',
        },
      });
    }

    return NextResponse.json({
      config: {
        gateway: result.gateway,
        isActive: result.isActive,
        config: JSON.parse(result.config),
      },
    });
  } catch (error) {
    console.error('Error updating payment config:', error);
    return NextResponse.json({ error: 'Failed to update payment config' }, { status: 500 });
  }
}
