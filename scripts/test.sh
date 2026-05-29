#!/usr/bin/env bash
# Runs server and client unit/component tests ONLY (vitest run).
# Does NOT run E2E tests. Use scripts/test-e2e.sh for end-to-end tests.
set -euo pipefail
cd "$(dirname "$0")/.."
npm run install:conf --silent 2>/dev/null || true
cd conf && npx vitest run --config ../vitest.config.ts
