import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const CATEGORIES_KEY = 'equipment_categories';

async function getCategories() {
  const setting = await db.siteSettings.findUnique({ where: { key: CATEGORIES_KEY } });
  if (!setting) return [];
  try { return JSON.parse(setting.value); } catch { return []; }
}

async function saveCategories(categories: any[]) {
  await db.siteSettings.upsert({
    where: { key: CATEGORIES_KEY },
    create: { key: CATEGORIES_KEY, value: JSON.stringify(categories), type: 'json' },
    update: { value: JSON.stringify(categories) },
  });
}

// Add a subcategory to a parent category
export async function POST(request: NextRequest) {
  try {
    const { parentCategory, name } = await request.json();
    if (!parentCategory || !name) return NextResponse.json({ error: 'Both fields required' }, { status: 400 });
    
    const categories = await getCategories();
    const catIndex = categories.findIndex((c: any) => c.name === parentCategory);
    if (catIndex === -1) return NextResponse.json({ error: 'Parent category not found' }, { status: 404 });
    
    if (!categories[catIndex].subcategoriesList) categories[catIndex].subcategoriesList = [];
    if (!categories[catIndex].subcategoriesList.includes(name)) {
      categories[catIndex].subcategoriesList.push(name);
      categories[catIndex].subcategories = categories[catIndex].subcategoriesList.join(', ');
    }
    await saveCategories(categories);
    return NextResponse.json({ category: categories[catIndex] });
  } catch (error) {
    console.error('Error adding subcategory:', error);
    return NextResponse.json({ error: 'Failed to add subcategory' }, { status: 500 });
  }
}
