// Setup database for Render deployment
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const dbDir = path.join(__dirname, '..', 'db');
const dbFile = path.join(dbDir, 'custom.db');

console.log('=== Database Setup ===');

// Ensure db directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log('Created db directory');
}

// Check DATABASE_URL
const dbUrl = process.env.DATABASE_URL || 'file:./db/custom.db';
console.log('DATABASE_URL:', dbUrl);

try {
  // Push schema
  console.log('\nPushing Prisma schema...');
  execSync('npx prisma db push --force-reset --skip-generate', { stdio: 'inherit' });
  console.log('Schema pushed successfully');
} catch (err) {
  console.error('Failed to push schema:', err.message);
  process.exit(1);
}

try {
  // Run seed using tsx
  console.log('\nRunning database seed...');
  execSync('npx tsx prisma/seed.ts', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  console.log('Seed completed successfully');
} catch (err) {
  console.error('Failed to run seed:', err.message);
  process.exit(1);
}

console.log('\n=== Database setup complete ===');
