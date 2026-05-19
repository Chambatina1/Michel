import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Category management stored in SiteSettings for flexibility
const CATEGORIES_KEY = 'equipment_categories';

async function getCategories() {
  const setting = await db.siteSettings.findUnique({ where: { key: CATEGORIES_KEY } });
  if (!setting) return [];
  try {
    return JSON.parse(setting.value);
  } catch {
    return [];
  }
}

async function saveCategories(categories: any[]) {
  await db.siteSettings.upsert({
    where: { key: CATEGORIES_KEY },
    create: { key: CATEGORIES_KEY, value: JSON.stringify(categories), type: 'json' },
    update: { value: JSON.stringify(categories) },
  });
}

const DEFAULT_CATEGORIES = [
  { id: 'imaging', name: 'Imaging Equipment', subcategories: 'CT, MRI, X-Ray, Ultrasound', subcategoriesList: ['CT', 'MRI', 'X-Ray', 'Ultrasound'] },
  { id: 'ophthalmology', name: 'Ophthalmology Equipment', subcategories: 'OCT, Retinal Camera, Visual Field, Refractometers, Examination', subcategoriesList: ['OCT', 'Retinal Camera', 'Visual Field', 'Refractometers', 'Examination'] },
  { id: 'parts', name: 'Parts & Accessories', subcategories: '', subcategoriesList: [] },
];

export async function GET() {
  try {
    let categories = await getCategories();
    if (categories.length === 0) {
      await saveCategories(DEFAULT_CATEGORIES);
      categories = DEFAULT_CATEGORIES;
    }
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, subcategories } = body;
    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    
    const categories = await getCategories();
    const newCategory = {
      id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name,
      subcategories: subcategories || '',
      subcategoriesList: subcategories ? subcategories.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
    };
    categories.push(newCategory);
    await saveCategories(categories);
    return NextResponse.json({ category: newCategory }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
