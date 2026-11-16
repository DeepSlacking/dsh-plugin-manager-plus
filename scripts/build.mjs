/**
 * Build the browser bundle from `src/client.template.js`.
 *
 * The DSH Client module loader takes a single built script per package, so the
 * content dictionary and locale dictionaries are embedded here rather than read
 * at runtime. Run `node scripts/build.mjs` after changing the template or data.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));

function readJson(relativePath, fallback) {
  const fullPath = join(root, relativePath);
  if (!existsSync(fullPath)) return fallback;
  return JSON.parse(readFileSync(fullPath, 'utf8'));
}

/** Locale files carry display metadata for the Plugin Manager; keep only UI strings. */
function uiDictionary(relativePath) {
  const parsed = readJson(relativePath, {});
  const out = {};
  for (const [key, value] of Object.entries(parsed)) {
    if (key === 'meta') continue;
    if (typeof value === 'string') out[key] = value;
  }
  return out;
}

const template = readFileSync(join(root, 'src/client.template.js'), 'utf8');
const content = readJson('content.zh.json', { packages: {} });
const zh = uiDictionary('locale/zh.json');
const en = uiDictionary('locale/en.json');

const replacements = [
  ['__CONTENT__', JSON.stringify(content)],
  ['__LOCALE_ZH__', JSON.stringify(zh)],
  ['__LOCALE_EN__', JSON.stringify(en)],
];

let bundle = template;
for (const [marker, value] of replacements) {
  if (!bundle.includes(marker)) throw new Error(`missing marker ${marker} in template`);
  bundle = bundle.split(marker).join(value);
}

for (const marker of ['__CONTENT__', '__LOCALE_ZH__', '__LOCALE_EN__']) {
  if (bundle.includes(marker)) throw new Error(`marker ${marker} still present after build`);
}

writeFileSync(join(root, 'client.js'), bundle, 'utf8');

const packages = content && content.packages ? Object.keys(content.packages).length : 0;
console.log(`built client.js (${Buffer.byteLength(bundle, 'utf8')} bytes, ${packages} curated packages, ${Object.keys(zh).length} zh keys, ${Object.keys(en).length} en keys)`);
