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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const categories = await getCategories();
    const index = categories.findIndex((c: any) => c.id === id);
    if (index === -1) return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    
    categories[index] = {
      ...categories[index],
      name: body.name || categories[index].name,
      subcategories: body.subcategories ?? categories[index].subcategories,
      subcategoriesList: body.subcategories ? body.subcategories.split(',').map((s: string) => s.trim()).filter(Boolean) : categories[index].subcategoriesList,
    };
    await saveCategories(categories);
    return NextResponse.json({ category: categories[index] });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const categories = await getCategories();
    const filtered = categories.filter((c: any) => c.id !== id);
    if (filtered.length === categories.length) return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    await saveCategories(filtered);
    return NextResponse.json({ message: 'Category deleted' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
