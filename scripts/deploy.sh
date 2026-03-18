#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════
# ShopSmart – Idempotent Deployment Script (for EC2 or any Linux server)
# Safe to run multiple times – always converges to the same state.
# Usage: bash scripts/deploy.sh
# ═══════════════════════════════════════════════════════════════════════════
set -euo pipefail

APP_DIR="${APP_DIR:-/home/ubuntu/shopsmart}"
REPO_URL="${REPO_URL:-https://github.com/sainath2212/shopsmart.git}"
BRANCH="${BRANCH:-main}"
PORT="${PORT:-5001}"

echo "🚀 ShopSmart – Deployment"
echo "════════════════════════════════════════════"
echo "  Target:  $APP_DIR"
echo "  Branch:  $BRANCH"
echo "  Port:    $PORT"
echo "════════════════════════════════════════════"

# ── 1. Clone or pull (idempotent) ────────────────────────────────────────────
if [ -d "$APP_DIR/.git" ]; then
  echo "→ Repository exists, pulling latest..."
  cd "$APP_DIR"
  git fetch --all
  git checkout "$BRANCH"
  git reset --hard "origin/$BRANCH"
else
  echo "→ Cloning repository..."
  mkdir -p "$(dirname "$APP_DIR")"
  git clone --branch "$BRANCH" "$REPO_URL" "$APP_DIR"
  cd "$APP_DIR"
fi
echo "✅ Code is up to date"

# ── 2. Install backend dependencies (idempotent: npm ci) ────────────────────
echo "→ Installing backend dependencies..."
cd "$APP_DIR/server"
npm ci --omit=dev --silent
echo "✅ Backend dependencies installed"

# ── 3. Install frontend & build (idempotent: npm ci + build) ────────────────
echo "→ Building frontend..."
cd "$APP_DIR/client"
npm ci --silent
npm run build
echo "✅ Frontend built"

# ── 4. Stop existing process if running (idempotent: || true) ────────────────
echo "→ Managing backend process..."
if command -v pm2 >/dev/null 2>&1; then
  pm2 delete shopsmart-backend 2>/dev/null || true
  cd "$APP_DIR/server"
  PORT="$PORT" pm2 start src/index.js --name shopsmart-backend
  pm2 save
  echo "✅ Backend started via PM2"
else
  echo "⚠️  PM2 not found. Install with: npm install -g pm2"
  echo "    Starting with node directly..."
  cd "$APP_DIR/server"
  # Kill any existing process on the port (idempotent)
  lsof -ti :"$PORT" | xargs kill -9 2>/dev/null || true
  PORT="$PORT" nohup node src/index.js > "$APP_DIR/server/logs/server.log" 2>&1 &
  echo "✅ Backend started (PID: $!)"
fi

# ── 5. Health check (idempotent: read-only) ──────────────────────────────────
echo "→ Running health check..."
sleep 3
if curl -sf "http://localhost:$PORT/api/health" > /dev/null; then
  echo "✅ Health check passed!"
else
  echo "⚠️  Health check failed – check logs at $APP_DIR/server/logs/server.log"
fi

echo ""
echo "════════════════════════════════════════════"
echo "🎉 Deployment complete!"
echo "════════════════════════════════════════════"
