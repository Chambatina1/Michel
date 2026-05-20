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

// Comprehensive default categories including ALL known subcategories from products
const DEFAULT_CATEGORIES = [
  { id: 'imaging', name: 'Imaging Equipment', subcategories: 'CT, MRI, X-Ray, Ultrasound, Mammography, C-Arm, DXA', subcategoriesList: ['CT', 'MRI', 'X-Ray', 'Ultrasound', 'Mammography', 'C-Arm', 'DXA'] },
  { id: 'ophthalmology', name: 'Ophthalmology Equipment', subcategories: 'OCT, Retinal Camera, Visual Field, Refractometers, Examination', subcategoriesList: ['OCT', 'Retinal Camera', 'Visual Field', 'Refractometers', 'Examination'] },
  { id: 'parts', name: 'Parts & Accessories', subcategories: '', subcategoriesList: [] },
  { id: 'laboratory', name: 'Laboratory Equipment', subcategories: '', subcategoriesList: [] },
  { id: 'surgical', name: 'Surgical Equipment', subcategories: '', subcategoriesList: [] },
  { id: 'patient-monitoring', name: 'Patient Monitoring', subcategories: '', subcategoriesList: [] },
  { id: 'other', name: 'Other Equipment', subcategories: '', subcategoriesList: [] },
];

// Auto-sync: Pull unique parentCategory + subCategory from existing products
// and merge any missing categories/subcategories into the category list
async function syncCategoriesFromProducts(categories: any[]): Promise<any[]> {
  try {
    // Get distinct parentCategories and subCategories from products
    const productCategories = await db.product.findMany({
      select: {
        parentCategory: true,
        subCategory: true,
        category: true,
      },
      distinct: ['parentCategory', 'subCategory'],
    });

    if (!productCategories || productCategories.length === 0) return categories;

    for (const prod of productCategories) {
      const parentName = prod.parentCategory?.trim();
      const subName = prod.subCategory?.trim() || prod.category?.trim();

      if (!parentName) continue;

      // Find or create parent category
      let catIndex = categories.findIndex((c: any) =>
        c.name.toLowerCase() === parentName.toLowerCase()
      );

      if (catIndex === -1) {
        // Create new parent category
        const newCat = {
          id: parentName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          name: parentName,
          subcategories: '',
          subcategoriesList: [] as string[],
        };
        categories.push(newCat);
        catIndex = categories.length - 1;
      }

      // Add subcategory if missing
      if (subName && categories[catIndex].subcategoriesList) {
        if (!categories[catIndex].subcategoriesList.some((s: string) => s.toLowerCase() === subName.toLowerCase())) {
          categories[catIndex].subcategoriesList.push(subName);
          categories[catIndex].subcategories = categories[catIndex].subcategoriesList.join(', ');
        }
      }
    }

    return categories;
  } catch (error) {
    console.error('Error syncing categories from products:', error);
    return categories;
  }
}

export async function GET() {
  try {
    let categories = await getCategories();

    // If no categories exist, seed with defaults
    if (categories.length === 0) {
      categories = [...DEFAULT_CATEGORIES];
      await saveCategories(categories);
    }

    // Always auto-sync from products to catch any new categories
    const synced = await syncCategoriesFromProducts([...categories]);
    let changed = false;

    // Check if sync added new categories or subcategories
    if (JSON.stringify(synced) !== JSON.stringify(categories)) {
      await saveCategories(synced);
      categories = synced;
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
