import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const root = new URL('..', import.meta.url);
const read = (relative) => readFileSync(new URL(relative, root), 'utf8');
const profile = () => read('profile/README.md');

const products = [
  ['Cloudy&Shiny Index', 'https://github.com/MonarchCastleTech/Cloudy-Shiny', 'https://github.com/MonarchCastleTech/Cloudy-Shiny/blob/main/README.md'],
  ['EconMap', 'https://github.com/MonarchCastleTech/econmap', 'https://github.com/MonarchCastleTech/econmap/blob/main/README.md'],
  ['ESGMap', 'https://github.com/MonarchCastleTech/esgmap', 'https://github.com/MonarchCastleTech/esgmap/blob/master/README.md'],
  ['MacroIntel', 'https://github.com/MonarchCastleTech/macrointel', 'https://github.com/MonarchCastleTech/macrointel/blob/main/README.md'],
  ['MILCODEC Receiver', 'https://github.com/MonarchCastleTech/milcodec-receiver', 'https://github.com/MonarchCastleTech/milcodec-receiver/blob/main/README.md'],
  ['Nuclear Energy Intelligence', 'https://github.com/MonarchCastleTech/NuclearEnergyIntelligence', 'https://github.com/MonarchCastleTech/NuclearEnergyIntelligence/blob/main/README.md'],
  ['PrepTurk', 'https://github.com/MonarchCastleTech/prepturk', 'https://github.com/MonarchCastleTech/prepturk/blob/master/README.md'],
  ['Supply Chain Intelligence', 'https://github.com/MonarchCastleTech/supplychain', 'https://github.com/MonarchCastleTech/supplychain/blob/master/README.md'],
];

test('profile states the masterbrand positioning, verified company-site fallback, and theme-aware local logo paths', () => {
  const text = profile();
  for (const expected of [
    'Monarch Castle Technologies',
    'Decision intelligence grounded in transparent data and calibrated forecasting.',
    'Strategy', 'Data', 'Intelligence', 'Forecasting',
    '[Company site](https://github.com/MonarchCastleTech)',
    'profile/logo.png', 'profile/logo-dark.png',
  ]) assert.ok(text.includes(expected), `missing ${expected}`);
  assert.match(text, /prefers-color-scheme: dark/);
});

test('profile covers every registry product with public and methodology links plus the masterbrand endorsement', () => {
  const text = profile();
  for (const [name, publicUrl, methodologyUrl] of products) {
    assert.ok(text.includes(name), `missing product: ${name}`);
    assert.ok(text.includes(`](${publicUrl})`), `missing product link for ${name}`);
    assert.ok(text.includes(`](${methodologyUrl})`), `missing methodology URL for ${name}`);
  }
  assert.equal((text.match(/Part of Monarch Castle Technologies/g) ?? []).length, products.length);
  assert.ok(text.includes('review-required'));
  assert.ok(text.includes('Trust and security'));
  assert.ok(text.includes('Developer repositories'));
});

test('profile excludes unsupported or superseded organizational claims', () => {
  const text = profile().toLowerCase();
  for (const prohibited of ['monarch castle holdings', 'operating company', 'sister company', 'most accurate', 'leading', 'best', 'customers', 'products-8', 'divisions-5']) {
    assert.ok(!text.includes(prohibited), `unsupported or superseded phrase: ${prohibited}`);
  }
});

test('organization-level community documents give actionable private security and contribution guidance', () => {
  for (const file of ['SECURITY.md', 'CONTRIBUTING.md']) assert.ok(existsSync(new URL(file, root)), `missing ${file}`);
  const security = read('SECURITY.md').toLowerCase();
  for (const expected of ['private vulnerability reporting', 'report a vulnerability', 'do not disclose', 'public issue']) assert.ok(security.includes(expected), `SECURITY.md missing ${expected}`);
  const contributing = read('CONTRIBUTING.md').toLowerCase();
  for (const expected of ['data provenance', 'deterministic validation', 'forecast record', 'english', 'accessibility', 'test']) assert.ok(contributing.includes(expected), `CONTRIBUTING.md missing ${expected}`);
});
