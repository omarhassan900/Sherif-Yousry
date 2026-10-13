// GoDaddy production launcher.
//
// GoDaddy injects a non-standard NODE_ENV which makes Next.js use the React
// *development* server bundle. That bundle crashes while prerendering the
// built-in /404 and /500 error pages ("<Html> should not be imported").
//
// Forcing NODE_ENV=production in-process BEFORE requiring Next guarantees the
// production React bundle is used for both build and start.
process.env.NODE_ENV = 'production';

const { spawnSync } = require('node:child_process');

function run(cmd, args) {
  const res = spawnSync(cmd, args, {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, NODE_ENV: 'production' },
  });
  if (res.status !== 0) {
    process.exit(res.status || 1);
  }
}

const port = process.env.PORT || '3000';

// 1. Generate Prisma client (safe to run every boot)
run('npx', ['prisma', 'generate']);

// 2. Build if there is no existing build output
const fs = require('node:fs');
if (!fs.existsSync('.next/BUILD_ID')) {
  run('npx', ['next', 'build']);
}

// 3. Start the production server
run('npx', ['next', 'start', '-p', port]);
