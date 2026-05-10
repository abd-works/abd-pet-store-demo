# Runs Playwright end-to-end tests.
#
# REQUIRES: packages/app-client must exist and serve the React frontend.
# Without it, page routes like /products/:sku and /store-locator do not exist
# and every test will fail with "Cannot GET /<route>".
#
# The playwright.config.ts webServer block auto-starts the Express API server.
# The React frontend (app-client) must be started separately if not using
# Playwright's webServer to manage it.
Set-Location (Split-Path -Parent $PSScriptRoot)
npx playwright test
