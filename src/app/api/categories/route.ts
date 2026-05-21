import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const CATEGORIES_KEY = 'equipment_categories';

// GET /api/categories — Public endpoint for front-end pages
// Reads from SiteSettings (same data the admin writes to)
// Also counts real products per subcategory for display
export async function GET() {
  try {
    const setting = await db.siteSettings.findUnique({ where: { key: CATEGORIES_KEY } });
    let categories: any[] = [];
    if (setting) {
      try {
        categories = JSON.parse(setting.value);
      } catch {
        categories = [];
      }
    }

    // If nothing in DB, return empty (admin should seed categories first)
    // Build product counts per subcategory for richer display
    const productCounts: Record<string, number> = {};
    try {
      const rows = await db.product.groupBy({
        by: ['subCategory'],
        where: { status: 'published', subCategory: { not: null, not: '' } },
        _count: true,
      });
      for (const row of rows) {
        if (row.subCategory) {
          productCounts[row.subCategory] = row._count;
        }
      }
    } catch {
      // products table might not have status field or be empty
    }

    // Enrich each category with product counts
    const enriched = categories.map((cat: any) => {
      const subsWithCount = (cat.subcategoriesList || []).map((sub: string) => ({
        name: sub,
        count: productCounts[sub] || 0,
      }));
      return {
        id: cat.id,
        name: cat.name,
        subcategories: cat.subcategories || '',
        subcategoriesList: subsWithCount,
      };
    });

    return NextResponse.json({ categories: enriched });
  } catch (error) {
    console.error('Error fetching public categories:', error);
    return NextResponse.json({ categories: [] });
  }
}
