#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════
# ShopSmart – Idempotent Local Setup Script
# Run this script as many times as you want – it always produces the same result.
# Usage: bash scripts/setup.sh
# ═══════════════════════════════════════════════════════════════════════════
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "🛍️  ShopSmart – Local Setup"
echo "════════════════════════════════════════════"

# ── 1. Check prerequisites ──────────────────────────────────────────────────
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed."; exit 1; }
command -v npm  >/dev/null 2>&1 || { echo "❌ npm is required but not installed."; exit 1; }

echo "✅ Node.js $(node --version) detected"
echo "✅ npm $(npm --version) detected"

# ── 2. Create necessary directories (idempotent: mkdir -p) ──────────────────
mkdir -p "$PROJECT_ROOT/server/coverage"
mkdir -p "$PROJECT_ROOT/client/coverage"
mkdir -p "$PROJECT_ROOT/server/logs"
echo "✅ Directories ensured"

# ── 3. Backend setup ────────────────────────────────────────────────────────
echo ""
echo "📦 Installing backend dependencies..."
cd "$PROJECT_ROOT/server"
npm install --silent

# Create .env if it doesn't exist (idempotent: check before create)
if [ ! -f .env ]; then
  cat > .env <<EOF
PORT=5001
NODE_ENV=development
EOF
  echo "✅ Created server/.env"
else
  echo "✅ server/.env already exists (skipped)"
fi

# ── 4. Frontend setup ───────────────────────────────────────────────────────
echo ""
echo "📦 Installing frontend dependencies..."
cd "$PROJECT_ROOT/client"
npm install --silent

# ── 5. Verify setup ─────────────────────────────────────────────────────────
echo ""
echo "🧪 Verifying setup..."
cd "$PROJECT_ROOT/server"
npm run lint --silent && echo "✅ Backend lint passed" || echo "⚠️  Backend lint has warnings"

echo ""
echo "════════════════════════════════════════════"
echo "🎉 Setup complete!"
echo ""
echo "  Start backend:   cd server && npm run dev"
echo "  Start frontend:  cd client && npm run dev"
echo "  Run all tests:   cd server && npm run test:all"
echo "════════════════════════════════════════════"
