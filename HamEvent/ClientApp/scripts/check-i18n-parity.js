const fs = require('fs');
const path = require('path');

const i18nDir = path.resolve(__dirname, '..', 'src', 'assets', 'i18n');
const referenceFile = path.join(i18nDir, 'en.json');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function sortedKeys(obj) {
  return Object.keys(obj).sort();
}

function diff(a, b) {
  const bSet = new Set(b);
  return a.filter((x) => !bSet.has(x));
}

const reference = readJson(referenceFile);
const refKeys = sortedKeys(reference);
const localeFiles = fs
  .readdirSync(i18nDir)
  .filter((f) => f.endsWith('.json') && f !== 'en.json')
  .sort();

let hasError = false;

for (const file of localeFiles) {
  const localePath = path.join(i18nDir, file);
  const localeJson = readJson(localePath);
  const localeKeys = sortedKeys(localeJson);

  const missing = diff(refKeys, localeKeys);
  const extra = diff(localeKeys, refKeys);

  if (missing.length || extra.length) {
    hasError = true;
    console.error(`\n[i18n] ${file}`);
    if (missing.length) {
      console.error(`  Missing (${missing.length}): ${missing.join(', ')}`);
    }
    if (extra.length) {
      console.error(`  Extra (${extra.length}): ${extra.join(', ')}`);
    }
  }
}

if (hasError) {
  process.exit(1);
}

console.log(`[i18n] Parity check passed for ${localeFiles.length + 1} locale files.`);
