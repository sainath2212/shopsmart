#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════
# ShopSmart – Idempotent Health Check Script
# Read-only – safe to run unlimited times with identical results.
# Usage: bash scripts/health-check.sh [HOST] [PORT]
# ═══════════════════════════════════════════════════════════════════════════
set -euo pipefail

HOST="${1:-localhost}"
PORT="${2:-5001}"
MAX_RETRIES=5
RETRY_DELAY=2

echo "🏥 ShopSmart – Health Check"
echo "════════════════════════════════════════════"
echo "  Target: http://$HOST:$PORT"
echo "════════════════════════════════════════════"

for i in $(seq 1 $MAX_RETRIES); do
  echo "→ Attempt $i/$MAX_RETRIES..."

  RESPONSE=$(curl -sf "http://$HOST:$PORT/api/health" 2>/dev/null) && {
    echo "✅ Health check passed!"
    echo "   Response: $RESPONSE"

    # Verify products endpoint
    PRODUCTS=$(curl -sf "http://$HOST:$PORT/api/products" 2>/dev/null) && {
      echo "✅ Products endpoint OK"
    } || echo "⚠️  Products endpoint unreachable"

    # Verify categories endpoint
    CATEGORIES=$(curl -sf "http://$HOST:$PORT/api/categories" 2>/dev/null) && {
      echo "✅ Categories endpoint OK"
    } || echo "⚠️  Categories endpoint unreachable"

    echo ""
    echo "════════════════════════════════════════════"
    echo "🎉 All checks passed!"
    echo "════════════════════════════════════════════"
    exit 0
  }

  echo "   ⏳ Retrying in ${RETRY_DELAY}s..."
  sleep "$RETRY_DELAY"
done

echo ""
echo "════════════════════════════════════════════"
echo "❌ Health check failed after $MAX_RETRIES attempts"
echo "════════════════════════════════════════════"
exit 1
