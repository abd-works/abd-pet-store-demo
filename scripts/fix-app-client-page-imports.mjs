import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pagesRoot = path.join(repoRoot, 'packages', 'app-client', 'src', 'pages');
const packageRoots = new Set(
  fs
    .readdirSync(path.join(repoRoot, 'packages'), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name),
);

function expectedPrefix(filePath) {
  const relDir = path.relative(pagesRoot, path.dirname(filePath));
  const depth = relDir === '' || relDir === '.' ? 0 : relDir.split(path.sep).filter(Boolean).length;
  return '../'.repeat(3 + depth);
}

function fixImports(filePath) {
  const prefix = expectedPrefix(filePath);
  const importPattern = /(from\s+['"])((?:\.\.\/)+)([a-z][\w-]*\/(?:shared|client|server)\/[^'"]+)(['"])/g;
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  content = content.replace(importPattern, (match, lead, dots, pkgPath, tail) => {
    const root = pkgPath.split('/')[0];
    if (!packageRoots.has(root) && root !== 'shared') return match;
    if (dots === prefix) return match;
    changed = true;
    return `${lead}${prefix}${pkgPath}${tail}`;
  });

  if (changed) fs.writeFileSync(filePath, content);
  return changed;
}

function walk(dir) {
  let count = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) count += walk(full);
    else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
      if (fixImports(full)) {
        console.log(path.relative(repoRoot, full));
        count += 1;
      }
    }
  }
  return count;
}

const fixed = walk(pagesRoot);
console.log(`Fixed ${fixed} file(s)`);
