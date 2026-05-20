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
    // Get unique parentCategories from products
    const parentGroups = await db.product.groupBy({
      by: ['parentCategory'],
      where: { parentCategory: { not: null } },
    });

    if (!parentGroups || parentGroups.length === 0) return categories;

    for (const pg of parentGroups) {
      const parentName = pg.parentCategory?.trim();
      if (!parentName) continue;

      // Get unique subCategories for this parentCategory
      const subGroups = await db.product.groupBy({
        by: ['subCategory'],
        where: { parentCategory: parentName, subCategory: { not: null, not: '' } },
      });

      // Find or create parent category in list
      let catIndex = categories.findIndex((c: any) =>
        c.name.toLowerCase() === parentName.toLowerCase()
      );

      if (catIndex === -1) {
        const newCat = {
          id: parentName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          name: parentName,
          subcategories: '',
          subcategoriesList: [] as string[],
        };
        categories.push(newCat);
        catIndex = categories.length - 1;
      }

      // Ensure subcategoriesList exists
      if (!categories[catIndex].subcategoriesList) {
        categories[catIndex].subcategoriesList = [];
      }

      // Add each subcategory if missing
      for (const sg of subGroups) {
        const subName = sg.subCategory?.trim();
        if (!subName) continue;
        if (!categories[catIndex].subcategoriesList.some((s: string) => s.toLowerCase() === subName.toLowerCase())) {
          categories[catIndex].subcategoriesList.push(subName);
        }
      }

      // Update subcategories string
      categories[catIndex].subcategories = categories[catIndex].subcategoriesList.join(', ');
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
