# AGENTS.md

## Cursor Cloud specific instructions

### Services overview

**PawPlace** is a pet store e-commerce monorepo (TypeScript, Express 5, React 18, Vite 5, MongoDB 7).

| Service | Port | Start command |
|---------|------|---------------|
| Express API | 3001 | `npm run dev` |
| Vite client | 3000 | `npm run dev:client` |
| MongoDB | 27017 | `mongod --dbpath /data/db --logpath /var/log/mongod.log --logappend --fork` |

### Starting the dev environment

1. Start MongoDB first: `mongod --dbpath /data/db --logpath /var/log/mongod.log --logappend --fork`
2. Start API server: `npm run dev` (seeds dev data into Mongo on startup)
3. Start client: `npm run dev:client` (proxies `/api` to port 3001)

### Running tests

- **Unit/integration tests (no MongoDB needed):** `npm test` (uses in-memory repositories)
- **Server-only tests:** `npm run test:server`
- **Client-only tests:** `npm run test:client`
- **E2E (requires MongoDB + both servers running):** `npm run test:e2e`

Note: Some server tests (`*_server.test.ts`) have pre-existing failures due to `{ app }` import from `@pawplace/app-server` — the module exports `createApp` not `app`. Client tests and some server tests pass.

### Non-obvious caveats

- The `npm run dev` command starts the API server with `tsconfig-paths/register` which resolves `@pawplace/*` path aliases. The client dev server (`npm run dev:client`) uses Vite resolve aliases instead.
- MongoDB must be started before `npm run dev` since the dev startup script connects immediately and seeds data.
- Playwright config has `headless: false` by default; for CI/headless environments you may need to override this.
- The project uses `package-lock.json` (npm), not yarn or pnpm.
