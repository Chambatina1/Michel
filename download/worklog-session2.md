---
Task ID: 1
Agent: Main Agent
Task: Fix PS Medical Devices deployment - connect PostgreSQL database

Work Log:
- Cloned GitHub repo Chambatina1/Michel
- Discovered all deploys since cbe438f have been failing (20+ consecutive failures)
- Last successful deploy: cbe438f "Switch from SQLite to PostgreSQL"
- Fixed prisma/schema.prisma: hardcoded PostgreSQL URL directly (removed env() dependency)
- Removed postinstall script from package.json (avoid double prisma generate)
- Build succeeds locally with all changes (npm install + prisma generate + next build)
- Updated Render build command via API: removed setup-db.js, added --ignore-scripts
- Set NODE_VERSION=20.11.0 env var on Render
- Tried 8+ different deploy attempts with various build commands - all failed
- Build fails in 38-83 seconds consistently
- Cannot access Render build logs through API (not exposed)
- Cannot push code changes to GitHub (no credentials available)
- Site is ONLINE and serving pages with 13 fallback products
- DB is NOT connected (site uses embedded fallback data)

Stage Summary:
- Site is functional at ps-medical-devices.onrender.com using fallback data
- Two code changes prepared locally (schema.prisma + package.json) but cannot push
- User needs to push changes to GitHub for auto-deploy to pick them up
- Build command updated on Render: npm install --ignore-scripts && npx prisma generate && npm run build
- Env vars configured: DATABASE_URL, DIRECT_DATABASE_URL, OPENAI_API_KEY, NODE_ENV, NODE_VERSION
