#!/bin/bash
set -e

echo "=== DEPLOY SPEC CAMP ==="

# Paths
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

# 1. Build frontend
echo ""
echo ">>> Building frontend..."
cd frontend
npm run build
cd ..

# 2. Push source code to develop
echo ""
echo ">>> Pushing source to develop..."
git checkout develop
git add -A
git diff --quiet && git diff --staged --quiet || git commit -m "update: $(date '+%Y-%m-%d %H:%M')"
git push origin develop

# 3. Copy dist to main branch
echo ""
echo ">>> Deploying build to main..."
git checkout main
rm -rf dist
cp -r frontend/dist dist
git add -A
git diff --quiet && git diff --staged --quiet || git commit -m "deploy: $(date '+%Y-%m-%d %H:%M')"
git push origin main

# 4. Back to develop
git checkout develop

echo ""
echo "=== DEPLOY SELESAI ==="
