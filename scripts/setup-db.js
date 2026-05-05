// Setup database for Render deployment
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const dbDir = path.resolve(process.cwd(), 'db');

console.log('=== Database Setup ===');
console.log('Working directory:', process.cwd());
console.log('DB directory:', dbDir);

// Ensure db directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log('Created db directory');
}

// Push schema
console.log('Pushing Prisma schema...');
try {
  execSync('npx prisma db push --force-reset --skip-generate 2>&1', { stdio: 'pipe' });
  console.log('Schema pushed');
} catch (err) {
  console.log('Schema push output:', err.stdout?.toString());
  console.log('Schema push errors:', err.stderr?.toString());
}

// Run seed
console.log('Running seed...');
try {
  execSync('npx tsx prisma/seed.ts 2>&1', { stdio: 'pipe', cwd: process.cwd() });
  console.log('Seed completed');
} catch (err) {
  console.log('Seed output:', err.stdout?.toString());
  console.log('Seed errors:', err.stderr?.toString());
}

console.log('=== Done ===');
