import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import crypto from "crypto";

// ─── DATABASE SETUP ───────────────────────────────────────────────────────────

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    "postgresql://micel_admin:yJmfj4wjjHF2YHehcvM907wWWb1A8SWM@dpg-d7t6gvl7vvec73ft84qg-a.oregon-postgres.render.com:5432/michel_db?sslmode=require";
}
if (!process.env.DIRECT_DATABASE_URL) {
  process.env.DIRECT_DATABASE_URL =
    "postgresql://micel_admin:yJmfj4wjjHF2YHehcvM907wWWb1A8SWM@dpg-d7t6gvl7vvec73ft84qg-a.oregon-postgres.render.com:5432/michel_db?sslmode=require";
}

const prisma = new PrismaClient({
  log: ["error"],
});

// ─── SIMPLE CUID GENERATOR ────────────────────────────────────────────────────
// Prisma's createMany doesn't trigger @default(cuid()), so we generate IDs manually.

function generateCuid(): string {
  const timestamp = Date.now().toString(36);
  const random = crypto.randomBytes(8).toString("hex");
  const counter = process.hrtime.bigint().toString(36);
  return `c${timestamp}${random}${counter}`;
}

// ─── CATEGORY MAPPING ─────────────────────────────────────────────────────────

const IMAGING_SUBCATEGORIES = new Set([
  "CT", "MRI", "X-Ray", "Ultrasound", "C-Arm", "CT Scanner",
  "16-Slice CT", "1.5T MRI", "3T MRI", "Open MRI", "Mobile MRI",
  "Mobile C-Arm", "X-Ray Generator", "X-Ray System",
  "Digital Radiography (DR)", "Mammography", "3D Mammography (DBT)",
  "DEXA", "Interventional Radiology", "O-Arm", "Urology",
  "Ultrasound System", "MRI System",
]);

const OPHTHALMOLOGY_SUBCATEGORIES = new Set([
  "OCT", "Retinal Camera", "Visual Field", "Refractometers",
  "Autorefractor/Keratometer", "Examination", "Slit Lamp",
  "Chairs & Stands", "Chart Projector", "Lensmeter", "Refractor",
  "Indirect Ophthalmoscope", "Tonometer", "Biometer",
  "Specular Microscope", "Corneal Topographer", "Laser",
]);

const PARTS_SUBCATEGORIES = new Set(["C-Arm Table"]);

function getParentCategory(subcategory: string): string | null {
  if (IMAGING_SUBCATEGORIES.has(subcategory)) return "Imaging Equipment";
  if (OPHTHALMOLOGY_SUBCATEGORIES.has(subcategory)) return "Ophthalmology Equipment";
  if (PARTS_SUBCATEGORIES.has(subcategory)) return "Parts & Accessories";
  const lowerSub = subcategory.toLowerCase();
  for (const cat of OPHTHALMOLOGY_SUBCATEGORIES) {
    if (lowerSub.includes(cat.toLowerCase())) return "Ophthalmology Equipment";
  }
  for (const cat of IMAGING_SUBCATEGORIES) {
    if (lowerSub.includes(cat.toLowerCase())) return "Imaging Equipment";
  }
  return null;
}

// ─── CONDITION NORMALIZATION ──────────────────────────────────────────────────

function normalizeCondition(raw: string): string {
  const lower = raw.toLowerCase().trim();
  if (lower === "new" || lower === "new/pre-owned") return "New";
  return "Refurbished";
}

// ─── PRICE EXTRACTION ─────────────────────────────────────────────────────────

function extractPrice(priceStr: string | null | undefined): number | null {
  if (!priceStr) return null;
  const trimmed = priceStr.trim();
  if (
    trimmed.toLowerCase() === "contact for price" ||
    trimmed.toLowerCase() === "request quote" ||
    trimmed === "" || trimmed === "-"
  ) return null;
  const match = trimmed.match(/\$([0-9,]+(?:\.\d{1,2})?)/);
  if (match) return parseFloat(match[1].replace(/,/g, ""));
  return null;
}

// ─── SLUG GENERATION ──────────────────────────────────────────────────────────

function generateBaseSlug(name: string): string {
  return name
    .toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 120);
}

function randomSuffix(len = 6): string {
  return crypto.randomBytes(len).toString("hex").substring(0, len);
}

// ─── DESCRIPTION CLEANUP ──────────────────────────────────────────────────────

function cleanDescription(raw: string): string {
  const cleaned = raw.trim();
  if (cleaned.startsWith('ole="') || cleaned.startsWith("<") || cleaned.length < 10) {
    return "Professional medical equipment. Contact us for detailed specifications and condition assessment.";
  }
  return cleaned.length > 500 ? cleaned.substring(0, 500) + "..." : cleaned;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

interface ScrapedProduct {
  product_name: string;
  manufacturer?: string;
  category?: string;
  subcategory?: string;
  price?: string;
  condition: string;
  description: string;
  product_url: string;
  image_url?: string | null;
}

async function main() {
  console.log("=".repeat(60));
  console.log("P&S Medical Device - Product Import Script");
  console.log("=".repeat(60));

  // 1. Read scraped data
  const jsonPath = path.resolve("/home/z/my-project/download/scraped-products.json");
  console.log(`\n📂 Reading: ${jsonPath}`);
  if (!fs.existsSync(jsonPath)) {
    console.error("❌ File not found!");
    process.exit(1);
  }

  const rawData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

  // 2. Collect all products
  const allProducts: (ScrapedProduct & { source: string })[] = [];
  for (const [siteName, siteData] of Object.entries(rawData.sites)) {
    const site = siteData as { status: string; products: ScrapedProduct[] };
    if (site.status === "success" && site.products.length > 0) {
      for (const product of site.products) {
        allProducts.push({ ...product, source: siteName });
      }
    }
  }
  console.log(`📊 Found ${allProducts.length} products`);

  // 3. Category distribution
  const catCounts: Record<string, number> = {};
  for (const p of allProducts) {
    const c = p.subcategory || "Unknown";
    catCounts[c] = (catCounts[c] || 0) + 1;
  }
  console.log("\n📋 Subcategory breakdown:");
  Object.entries(catCounts)
    .sort(([, a], [, b]) => b - a)
    .forEach(([cat, n]) => {
      const parent = getParentCategory(cat) || "⚠️ Unmapped";
      console.log(`   ${cat}: ${n} → ${parent}`);
    });

  // 4. Connect
  console.log("\n🔌 Connecting to PostgreSQL...");
  await prisma.$connect();
  console.log("✅ Connected");

  // 5. Get existing slugs
  const existing = await prisma.product.findMany({ select: { slug: true, name: true } });
  const existingSlugs = new Set(existing.map((p) => p.slug));
  const existingNames = new Set(existing.map((p) => p.name.toLowerCase().trim()));
  console.log(`📊 Existing products: ${existing.length}`);

  // 6. Pre-process all products
  console.log("\n🔄 Pre-processing products...");

  const stats = {
    total: allProducts.length,
    imported: 0,
    skipped: 0,
    errors: 0,
    byParent: { "Imaging Equipment": 0, "Ophthalmology Equipment": 0, "Parts & Accessories": 0, Unmapped: 0 } as Record<string, number>,
    byCondition: { New: 0, Refurbished: 0 } as Record<string, number>,
    withPrice: 0,
    withoutPrice: 0,
    skippedNames: [] as string[],
    errorMessages: [] as string[],
  };

  // Build all the records first
  const records: Array<{
    id: string;
    name: string;
    slug: string;
    category: string;
    condition: string;
    price: number | null;
    description: string;
    specs: string;
    features: string;
    imageUrl: string;
    images: string;
    videos: string;
    status: string;
    isFeatured: boolean;
    isNegotiable: boolean;
    parentCategory: string | null;
    weight: number | null;
    requiresFreight: boolean;
  }> = [];

  for (const product of allProducts) {
    const subcategory = product.subcategory || product.category || "Other";
    const parentCategory = getParentCategory(subcategory);
    const condition = normalizeCondition(product.condition || "Used");
    const price = extractPrice(product.price);
    const name = product.product_name.trim();

    // Skip if exact name already exists
    if (existingNames.has(name.toLowerCase())) {
      stats.skipped++;
      stats.skippedNames.push(name);
      continue;
    }

    const description = cleanDescription(product.description || "");

    // Build specs JSON
    const specsObj: Record<string, string> = {};
    if (product.manufacturer) specsObj["Manufacturer"] = product.manufacturer;
    specsObj["Source"] = product.source;
    if (product.product_url) specsObj["Source URL"] = product.product_url;
    if (product.subcategory) specsObj["Subcategory"] = product.subcategory;
    if (product.condition) specsObj["Original Condition"] = product.condition;

    // Generate unique slug
    let slug = generateBaseSlug(name);
    if (!slug || slug.length < 2) slug = `product-${randomSuffix(8)}`;
    if (existingSlugs.has(slug)) slug = `${slug}-${randomSuffix(6)}`;
    while (existingSlugs.has(slug)) slug = `${slug}${randomSuffix(4)}`;
    existingSlugs.add(slug);

    // Build images
    const images: string[] = [];
    if (product.image_url) images.push(product.image_url);
    const imageUrl = product.image_url || "/images/placeholder-equipment.svg";

    records.push({
      id: generateCuid(),
      name,
      slug,
      category: subcategory,
      condition,
      price,
      description,
      specs: JSON.stringify(specsObj),
      features: "[]",
      imageUrl,
      images: JSON.stringify(images),
      videos: "[]",
      status: "active",
      isFeatured: false,
      isNegotiable: price === null,
      parentCategory: parentCategory || null,
      weight: null,
      requiresFreight: false,
    });

    // Track stats
    stats.imported++;
    stats.byCondition[condition] = (stats.byCondition[condition] || 0) + 1;
    if (parentCategory) {
      stats.byParent[parentCategory] = (stats.byParent[parentCategory] || 0) + 1;
    } else {
      stats.byParent.Unmapped++;
    }
    if (price !== null) stats.withPrice++;
    else stats.withoutPrice++;
  }

  console.log(`   Ready to import: ${records.length} products`);
  console.log(`   Skipped (duplicate names): ${stats.skipped}`);

  // 7. Bulk insert using createMany (batches of 20)
  console.log("\n🚀 Importing to database (bulk insert)...\n");

  const BATCH_SIZE = 20;
  let insertedCount = 0;

  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE);
    try {
      const result = await prisma.product.createMany({
        data: batch,
        skipDuplicates: true,
      });
      insertedCount += result.count;
      console.log(`   Batch ${Math.floor(i / BATCH_SIZE) + 1}: +${result.count} products inserted`);
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : String(error);
      console.error(`   Batch ${Math.floor(i / BATCH_SIZE) + 1} ERROR: ${errMsg}`);
      stats.errors += batch.length;

      // Fallback: try individual inserts for this batch
      console.log(`   Falling back to individual inserts...`);
      for (const record of batch) {
        try {
          await prisma.product.create({ data: record });
          insertedCount++;
          stats.errors--; // Adjust since we counted it as error
        } catch (individualError: unknown) {
          const iErr = individualError instanceof Error ? individualError.message : String(individualError);
          stats.errorMessages.push(`${record.name}: ${iErr.substring(0, 100)}`);
          console.log(`     ❌ ${record.name}: ${iErr.substring(0, 80)}`);
        }
      }
    }
  }

  // 8. Final summary
  console.log("\n" + "=".repeat(60));
  console.log("📊 IMPORT SUMMARY");
  console.log("=".repeat(60));
  console.log(`Total products found:           ${stats.total}`);
  console.log(`Successfully imported:           ${insertedCount}`);
  console.log(`Skipped (duplicate names):       ${stats.skipped}`);
  console.log(`Errors:                          ${stats.errors}`);
  console.log("");
  console.log("─── By Parent Category ───");
  Object.entries(stats.byParent).forEach(([cat, count]) => {
    if (count > 0) console.log(`   ${cat}: ${count}`);
  });
  console.log("");
  console.log("─── By Condition ───");
  console.log(`   New:         ${stats.byCondition.New}`);
  console.log(`   Refurbished: ${stats.byCondition.Refurbished}`);
  console.log("");
  console.log("─── By Price ───");
  console.log(`   With listed price:    ${stats.withPrice}`);
  console.log(`   Negotiable (no price): ${stats.withoutPrice}`);

  if (stats.skippedNames.length > 0) {
    console.log(`\n─── Skipped Products (already exist) ───`);
    stats.skippedNames.forEach(n => console.log(`   - ${n}`));
  }

  if (stats.errorMessages.length > 0) {
    console.log(`\n─── Error Details ───`);
    stats.errorMessages.forEach(e => console.log(`   ${e}`));
  }

  // Verify
  const finalCount = await prisma.product.count();
  console.log(`\n📊 Final product count in DB: ${finalCount}`);
  console.log(`   (was ${existing.length} before, added ${finalCount - existing.length})`);

  await prisma.$disconnect();
  console.log("\n✅ Import complete!");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  prisma.$disconnect();
  process.exit(1);
});
