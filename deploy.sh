#!/bin/bash
set -e

echo "=== DEPLOY SPEC CAMP ==="
echo ""

FRONTEND_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$FRONTEND_DIR"

# Check remote
if ! git remote get-url origin &>/dev/null; then
  echo "⚠️  Remote 'origin' belum diatur."
  exit 1
fi

BRANCH=$(git branch --show-current)
echo "Branch saat ini: $BRANCH (tidak akan berubah)"

# 1. Build frontend
echo ""
echo ">>> Building frontend..."
npm run build

# 2. Push source code to develop
echo ""
echo ">>> Pushing source to develop..."
git add -A
git diff --quiet && git diff --staged --quiet || git commit -m "update: $(date '+%Y-%m-%d %H:%M')"
git push origin develop

# 3. Deploy build to main via worktree (tanpa pindah branch)
echo ""
echo ">>> Deploying build to main..."
WORKTREE="/tmp/speccamp-deploy-$(date +%s)"
git worktree add "$WORKTREE" main 2>/dev/null || git worktree add "$WORKTREE" origin/main --no-checkout 2>/dev/null || {
  rm -rf "$WORKTREE"
  git worktree prune
  git branch -D main-deploy 2>/dev/null || true
  git worktree add "$WORKTREE" main 2>/dev/null || {
    rm -rf "$WORKTREE"
    mkdir -p "$WORKTREE"
    cd "$WORKTREE"
    git init
    git remote add origin "$(cd "$FRONTEND_DIR" && git remote get-url origin)"
    git fetch origin main
    git checkout -b main origin/main
    cd "$FRONTEND_DIR"
  }
}

rm -rf "$WORKTREE"/*
cp -r dist/* "$WORKTREE"/
cd "$WORKTREE"
git add -A
git diff --quiet && git diff --staged --quiet || git commit -m "deploy: $(date '+%Y-%m-%d %H:%M')"
git push origin main
cd "$FRONTEND_DIR"
git worktree remove "$WORKTREE" 2>/dev/null
rm -rf "$WORKTREE"

echo ""
echo "=== DEPLOY SELESAI ==="
echo "Masih di branch: $(git branch --show-current)"
