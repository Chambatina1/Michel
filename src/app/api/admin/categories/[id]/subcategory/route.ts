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

// Remove a subcategory from a category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { subcategory } = await request.json();
    const categories = await getCategories();
    const index = categories.findIndex((c: any) => c.id === id);
    if (index === -1) return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    
    const cat = categories[index];
    cat.subcategoriesList = (cat.subcategoriesList || []).filter((s: string) => s !== subcategory);
    cat.subcategories = cat.subcategoriesList.join(', ');
    categories[index] = cat;
    await saveCategories(categories);
    return NextResponse.json({ category: cat });
  } catch (error) {
    console.error('Error removing subcategory:', error);
    return NextResponse.json({ error: 'Failed to remove subcategory' }, { status: 500 });
  }
}
