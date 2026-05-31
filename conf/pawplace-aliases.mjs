import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const confRoot = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(confRoot, '..');
const packagesRoot = path.join(repoRoot, 'packages');

const SKIP = new Set(['app-client', 'app-server', 'shared', 'node_modules', 'scanner-report']);

function packageDirs() {
  return fs
    .readdirSync(packagesRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !SKIP.has(entry.name))
    .map((entry) => entry.name);
}

/** Vite / Vitest resolve.alias entries */
export function pawplaceViteAliases() {
  const root = repoRoot.replace(/\\/g, '/');
  return [
    { find: '@pawplace/app-server', replacement: `${root}/packages/app-server/index.ts` },
    {
      find: /^@pawplace\/([\w-]+)-(shared|server|client)$/,
      replacement: `${root}/packages/$1/$2/index.ts`,
    },
    {
      find: /^@pawplace\/([\w-]+)-(client|server)\/(.+)$/,
      replacement: `${root}/packages/$1/$2/$3`,
    },
  ];
}

/** tsconfig paths object */
export function pawplaceTsconfigPaths() {
  const paths = {
    '@pawplace/app-server': ['packages/app-server/index.ts'],
  };

  for (const name of packageDirs()) {
    for (const layer of ['shared', 'server', 'client']) {
      const layerDir = path.join(packagesRoot, name, layer);
      if (!fs.existsSync(layerDir)) continue;
      const alias = `@pawplace/${name}-${layer}`;
      paths[alias] = [`packages/${name}/${layer}/index.ts`];
      paths[`${alias}/*`] = [`packages/${name}/${layer}/*`];
    }
  }

  return paths;
}
