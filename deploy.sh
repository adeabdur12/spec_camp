#!/bin/bash
set -e

echo "=== DEPLOY FRONTEND SPEC CAMP ==="
echo ""

FRONTEND_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$FRONTEND_DIR"

REMOTE_URL=$(git remote get-url origin)

# 1. Build frontend
echo ">>> Building frontend..."
npm run build

# 2. Push source code to develop
echo ""
echo ">>> Pushing source to develop..."
git add -A
git diff --quiet && git diff --staged --quiet || git commit -m "update: $(date '+%Y-%m-%d %H:%M')"
git push origin develop

# 3. Deploy build (dist) to main via temp directory
echo ""
echo ">>> Deploying build to main..."
DEPLOY_DIR="/tmp/speccamp-frontend-deploy-$(date +%s)"
mkdir -p "$DEPLOY_DIR"

cp -r dist/* "$DEPLOY_DIR"/

cd "$DEPLOY_DIR"
git init
git remote add origin "$REMOTE_URL"
git checkout -b main

git fetch origin main 2>/dev/null && git reset origin/main 2>/dev/null || true

git add -A
git commit -m "deploy: $(date '+%Y-%m-%d %H:%M')"
git push -f origin main

# Clean up temp & local dist
cd "$FRONTEND_DIR"
rm -rf "$DEPLOY_DIR" dist

echo ""
echo "=== DEPLOY FRONTEND SELESAI ==="
