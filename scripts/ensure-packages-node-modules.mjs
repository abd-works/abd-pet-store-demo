import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const linkPath = path.join(repoRoot, 'packages', 'node_modules');
const targetPath = path.join(repoRoot, 'conf', 'node_modules');

if (!fs.existsSync(targetPath)) {
  console.error('Run npm run install:conf first (conf/node_modules missing).');
  process.exit(1);
}

if (fs.existsSync(linkPath)) {
  const stat = fs.lstatSync(linkPath);
  if (stat.isSymbolicLink() || stat.isDirectory()) {
    process.exit(0);
  }
}

if (process.platform === 'win32') {
  execSync(`cmd /c mklink /J "${linkPath}" "${targetPath}"`, { stdio: 'inherit' });
} else {
  fs.symlinkSync(targetPath, linkPath, 'junction');
}

console.log('Linked packages/node_modules -> conf/node_modules');
