// Setup database for Render deployment
const { execSync } = require('child_process');
const { PrismaClient } = require('@prisma/client');

async function main() {
  console.log('=== Database Setup (PostgreSQL) ===');
  console.log('Working directory:', process.cwd());

  // Check DATABASE_URL
  if (!process.env.DATABASE_URL) {
    console.log('ERROR: DATABASE_URL not set, skipping database setup');
    process.exit(0);
  }

  console.log('DATABASE_URL is configured');

  // Push schema to create/update tables
  console.log('Pushing Prisma schema to database...');
  try {
    execSync('npx prisma db push --skip-generate --accept-data-loss 2>&1', {
      stdio: 'pipe',
      timeout: 60000,
    });
    console.log('Schema pushed successfully');
  } catch (err) {
    console.log('Schema push output:', err.stdout?.toString());
    console.log('Schema push errors:', err.stderr?.toString());
  }

  // Check if products already exist before seeding
  try {
    const prisma = new PrismaClient();
    const productCount = await prisma.product.count();
    console.log(`Current product count: ${productCount}`);

    if (productCount === 0) {
      console.log('No products found, running seed...');
      try {
        execSync('npx tsx prisma/seed.ts 2>&1', {
          stdio: 'pipe',
          timeout: 120000,
          cwd: process.cwd(),
        });
        console.log('Seed completed successfully');
      } catch (err) {
        console.log('Seed output:', err.stdout?.toString());
        console.log('Seed errors:', err.stderr?.toString());
      }
    } else {
      console.log(`Database already has ${productCount} products, skipping seed`);
    }

    await prisma.$disconnect();
  } catch (err) {
    console.log('Database check failed:', err.message);
  }

  console.log('=== Database Setup Complete ===');
}

main().catch((err) => {
  console.error('Setup failed:', err);
  process.exit(0);
});
