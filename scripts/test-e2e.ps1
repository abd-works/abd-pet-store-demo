# Runs Playwright end-to-end tests (playwright test).
#
# REQUIRES: packages/app-client must exist and serve the React frontend.
# Without it, page routes like /products/:sku and /store-locator do not exist
# and every test will fail with "Cannot GET /<route>".
Set-Location (Split-Path -Parent $PSScriptRoot)
npm run install:conf --silent 2>$null
Set-Location conf
npx playwright test --config ../playwright.config.ts
