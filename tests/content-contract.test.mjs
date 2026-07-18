import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const root = new URL('..', import.meta.url);
const read = (relative) => readFileSync(new URL(relative, root), 'utf8');
const profile = () => read('profile/README.md');

const fixture = JSON.parse(read('tests/fixtures/portfolio-products.json'));
const { products } = fixture;

test('fixture pins the canonical governance portfolio source', () => {
  assert.equal(fixture.source.repository, 'MonarchCastleTech/company-governance');
  assert.equal(fixture.source.commit, 'effa65f847268fb251f1187f846ac9ab80ed7863');
  assert.equal(fixture.ownerOrg, 'MonarchCastleTech');
  assert.equal(fixture.endorsement, 'Part of Monarch Castle Technologies');
  assert.ok(products.length > 0);
});

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

test('profile covers every fixture product with canonical public and methodology links plus the masterbrand endorsement', () => {
  const text = profile();
  for (const product of products) {
    assert.equal(product.ownerOrg, fixture.ownerOrg, `wrong owner for ${product.id}`);
    assert.ok(text.includes(product.name), `missing product: ${product.name}`);
    if (product.publicUrl) assert.ok(text.includes(`](${product.publicUrl})`), `missing canonical public URL for ${product.name}`);
    assert.ok(text.includes(`](${product.methodologyUrl})`), `missing methodology URL for ${product.name}`);
    assert.ok(text.includes(`\`${product.lifecycle}\``), `missing lifecycle for ${product.name}`);
  }
  assert.equal((text.match(new RegExp(fixture.endorsement, 'g')) ?? []).length, products.length);
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
