import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const CATEGORIES_KEY = 'equipment_categories';

async function saveCategories(categories: any[]) {
  await db.siteSettings.upsert({
    where: { key: CATEGORIES_KEY },
    create: { key: CATEGORIES_KEY, value: JSON.stringify(categories), type: 'json' },
    update: { value: JSON.stringify(categories) },
  });
}

// Force sync categories from ALL products in the database
export async function POST() {
  try {
    // Get all unique parentCategory + subCategory combos from products
    const products = await db.product.findMany({
      select: { parentCategory: true, subCategory: true, category: true },
    });

    const catMap: Record<string, Set<string>> = {};

    for (const p of products) {
      const parent = p.parentCategory?.trim();
      const sub = p.subCategory?.trim() || p.category?.trim();
      if (!parent) continue;

      if (!catMap[parent]) catMap[parent] = new Set();
      if (sub) catMap[parent].add(sub);
    }

    // Build categories array
    const categories: any[] = [];
    for (const [parentName, subs] of Object.entries(catMap).sort((a, b) => a[0].localeCompare(b[0]))) {
      const subsList = Array.from(subs).sort();
      categories.push({
        id: parentName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: parentName,
        subcategories: subsList.join(', '),
        subcategoriesList: subsList,
      });
    }

    await saveCategories(categories);

    return NextResponse.json({
      message: `Synced ${categories.length} parent categories from ${products.length} products`,
      categories,
    });
  } catch (error) {
    console.error('Error syncing categories:', error);
    return NextResponse.json({ error: 'Failed to sync categories', details: String(error) }, { status: 500 });
  }
}
