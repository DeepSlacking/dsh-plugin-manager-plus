/**
 * Offline check of the built Client bundle and its data.
 *
 * The DSH Client module loader is not available in Node, so the bundle is
 * evaluated against a minimal `window.__ModuleLoader__` stub and the factory's
 * exposed `__model` helpers are asserted directly. This verifies the pure
 * translation/summary logic and the embedded content; the DOM decoration is a
 * browser integration and needs the Harness Web UI to exercise.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const root = dirname(dirname(fileURLToPath(import.meta.url)));

const code = readFileSync(join(root, 'client.js'), 'utf8');
let definition;
const sandbox = {
  window: {
    __ModuleLoader__: {
      load(def) {
        definition = def;
      },
    },
    localStorage: {
      getItem: () => null,
      setItem: () => {},
    },
    requestAnimationFrame: (fn) => setTimeout(fn, 0),
  },
  console,
  setTimeout,
  clearTimeout,
};
vm.createContext(sandbox);
vm.runInContext(code, sandbox, { filename: 'client.js' });

assert.ok(definition, 'client.js must register a module definition');
assert.equal(definition.id, 'dsh-plugin-manager-plus', 'module id must equal the package name');
const half = definition.factory(() => ({
  createElement() {
    return null;
  },
}));
assert.ok(half && typeof half.apply === 'function', 'factory must return an apply half');
assert.ok(Array.isArray(half.inject) && half.inject.includes('slots'), 'client half must inject slots');
assert.ok(half.inject.includes('locale'), 'client half must inject locale');
const m = half.__model;
assert.ok(m, 'factory must expose __model for this check');

/* ---------------------------------------------------------------- content */
const content = JSON.parse(readFileSync(join(root, 'content.zh.json'), 'utf8'));
const profileDir = process.env.DSH_PROFILE_DIR || 'C:/Users/Administrator/.dsh/profiles/desktop';
let installed = [];
try {
  const profile = JSON.parse(readFileSync(join(profileDir, 'package.json'), 'utf8'));
  installed = Object.keys(profile.dependencies || {});
} catch (_error) {
  console.warn(`profile package.json not readable at ${profileDir}; skipping installed-package coverage`);
}
const tones = new Set(['blue', 'violet', 'green', 'amber', 'rose', 'cyan', 'slate']);
if (installed.length > 0) {
  for (const name of installed.concat(['dsh-plugin-manager-plus'])) {
    const entry = content.packages[name];
    assert.ok(entry, `content missing for installed package ${name}`);
    assert.ok(entry.name && entry.name.length >= 2, `${name}: name too short`);
    assert.ok(m.hasCjk(entry.name), `${name}: name must contain Chinese`);
    assert.ok(entry.summary && m.hasCjk(entry.summary), `${name}: summary must be Chinese`);
    assert.ok(entry.summary.length >= 10, `${name}: summary too short`);
    assert.ok(entry.tag && m.hasCjk(entry.tag), `${name}: tag must be Chinese`);
    assert.ok(tones.has(entry.tagTone), `${name}: invalid tagTone ${entry.tagTone}`);
  }
}

/* -------------------------------------------------------------- translation */
assert.equal(m.isEnglishTitle('DSH Market'), true);
assert.equal(m.isEnglishTitle('插件市场'), false);
assert.equal(m.isEnglishTitle('Blender 套件'), false);

const curated = m.displayNameFor('dshmarket', 'DSH Market');
assert.equal(curated.text, '插件市场');
assert.equal(curated.translated, true);
assert.equal(curated.raw, 'DSH Market');

const chinese = m.displayNameFor('dsh-market-cn', '插件市场');
assert.equal(chinese.text, '插件市场');
assert.equal(chinese.translated, false, 'a Chinese title must not be replaced');

const unknown = m.displayNameFor('dsh-voice-input', 'Voice input');
assert.ok(m.hasCjk(unknown.text), 'heuristic translation should produce Chinese for common words');
assert.equal(unknown.translated, true);
const untranslatable = m.displayNameFor('zzz-flurbo', 'Flurbo');
assert.equal(untranslatable.text, 'Flurbo', 'untranslatable title stays as-is');
assert.equal(untranslatable.translated, false);

/* ---------------------------------------------------------------- summaries */
const fakeT = (key, params) => {
  if (key === 'fallbackTag') return '第三方插件';
  if (key === 'fallbackSummary') return `第三方插件，提供「${params.name}」相关能力。`;
  return key;
};
const summary = m.summaryFor('dshmarket', 'DSH Market', 'Visual plugin market', fakeT);
assert.ok(m.hasCjk(summary.text));
assert.equal(summary.tag, content.packages.dshmarket.tag);
assert.equal(summary.tone, content.packages.dshmarket.tagTone);

const fallbackChinese = m.summaryFor('unknown-zh', '未知插件', '这是一个中文描述', fakeT);
assert.equal(fallbackChinese.text, '这是一个中文描述');
assert.equal(fallbackChinese.tone, 'slate');

const fallbackEnglish = m.summaryFor('unknown-en', 'Mystery', 'An English description', fakeT);
assert.ok(m.hasCjk(fallbackEnglish.text));
assert.ok(fallbackEnglish.text.includes('Mystery'));

/* ----------------------------------------------------------------- manifest */
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
assert.equal(pkg.name, 'dsh-plugin-manager-plus');
assert.ok(pkg.exports['./client'], 'client export is required');
assert.ok(pkg.dsh.bundle.patch, 'bundle patch is required');
assert.equal(pkg.dsh.client.platform, 'web');
for (const file of ['index.js', 'client.js', 'cordis.patch.yml', 'icon.svg']) {
  assert.ok(pkg.files.includes(file), `${file} must be listed in files`);
}
for (const locale of ['zh', 'en']) {
  const dict = JSON.parse(readFileSync(join(root, `locale/${locale}.json`), 'utf8'));
  assert.ok(dict.meta && dict.meta.title, `locale/${locale}.json needs meta.title`);
  assert.ok(dict.meta.description, `locale/${locale}.json needs meta.description`);
  for (const key of ['groupBuiltin', 'groupExperimental', 'groupInstalled', 'controlLabel', 'note', 'openLabel']) {
    assert.ok(dict[key], `locale/${locale}.json needs ${key}`);
  }
}
const icon = readFileSync(join(root, 'icon.svg'), 'utf8');
assert.ok(icon.trimStart().startsWith('<svg'), 'icon.svg must be an SVG document');
assert.ok(icon.includes('</svg>'));

console.log(`model check passed: ${installed.length} installed packages curated, ${Object.keys(content.packages).length} total entries`);
