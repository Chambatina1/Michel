import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const settings = await db.siteSettings.findMany();

    // Convert array of key-value pairs to a settings object
    const settingsObj: Record<string, string> = {};
    for (const setting of settings) {
      settingsObj[setting.key] = setting.value;
    }

    return NextResponse.json({ settings: settingsObj });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { settings } = body;

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json(
        { error: 'Settings object is required' },
        { status: 400 }
      );
    }

    const updatedSettings = [];

    for (const [key, value] of Object.entries(settings)) {
      if (typeof value !== 'string') continue;

      const existing = await db.siteSettings.findUnique({ where: { key } });

      if (existing) {
        const updated = await db.siteSettings.update({
          where: { key },
          data: { value },
        });
        updatedSettings.push(updated);
      } else {
        const created = await db.siteSettings.create({
          data: { key, value },
        });
        updatedSettings.push(created);
      }
    }

    // Convert back to object
    const settingsObj: Record<string, string> = {};
    for (const s of updatedSettings) {
      settingsObj[s.key] = s.value;
    }

    return NextResponse.json({ settings: settingsObj });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
