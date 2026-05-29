# Runs server and client unit/component tests ONLY (vitest run).
# Does NOT run E2E tests. Use scripts/test-e2e.ps1 for end-to-end tests.
Set-Location (Split-Path -Parent $PSScriptRoot)
npm run install:conf --silent 2>$null
Set-Location conf
npx vitest run --config ../vitest.config.ts
