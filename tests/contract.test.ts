import { readFileSync, readdirSync } from 'node:fs';
import { it, expect } from 'vitest';
import { BRAND_CONFIG } from '../src/constants/brand';
import { en, fr } from '../src/i18n/messages';
it('retains every contractual section in the permanent feature matrix', () => {
  const source = readdirSync('.').find((name) =>
    name.startsWith('Prompt maître'),
  )!;
  const headings = [
    ...readFileSync(source, 'utf8').matchAll(/^# (\d+)\. (.+)$/gm),
  ];
  const matrix = readFileSync('FEATURE_MATRIX.md', 'utf8');
  expect(headings).toHaveLength(277);
  for (const [, id, heading] of headings)
    expect(matrix).toContain(`### ${id}. ${heading?.trim()}`);
  expect([
    ...matrix.matchAll(
      /^Statut : (NOT_STARTED|IN_PROGRESS|BLOCKED|DONE|TESTED)$/gm,
    ),
  ]).toHaveLength(277);
});
it('has the same complete translation keys for FR/EN and centralized branding', () => {
  expect(Object.keys(en).sort()).toEqual(Object.keys(fr).sort());
  expect(BRAND_CONFIG).toEqual(JSON.parse(readFileSync('brand.json', 'utf8')));
});
