#!/usr/bin/env bash
# Pull the latest code and restart the site. Run on the VPS from the project folder,
# or let the GitHub Action run it for you on every push to main.
set -euo pipefail
cd "$(dirname "$0")/.."

git pull --ff-only
npm ci
npx prisma migrate deploy
npm run build
pm2 reload ecosystem.config.cjs --update-env || pm2 start ecosystem.config.cjs
pm2 save
echo "Deployed $(git rev-parse --short HEAD)"
