// Setup database for Render deployment
// This script is safe to run during build - it will gracefully skip if DB is unavailable
const { execSync } = require('child_process');

console.log('=== Database Setup ===');
console.log('This script runs during build but may skip if DB is not yet available.');

if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('file:')) {
  console.log('DATABASE_URL not configured for PostgreSQL, skipping DB setup.');
  process.exit(0);
}

console.log('DATABASE_URL found, attempting schema push...');
try {
  execSync('npx prisma db push --skip-generate --accept-data-loss 2>&1', {
    stdio: 'pipe',
    timeout: 30000,
  });
  console.log('Schema pushed successfully');
} catch (err) {
  console.log('Schema push skipped (DB may not be available during build):');
  console.log(err.stdout?.toString() || '');
}

console.log('=== Setup Complete ===');
