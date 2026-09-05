import { describe, it, expect } from 'vitest';
import {
  epley,
  toKg,
  fromKg,
  remainingSeconds,
} from '../src/features/training/calculations';
import {
  gramsForServings,
  snapshotForGrams,
  nutrientTotals,
  localDiaryDate,
} from '../src/features/nutrition/calculations';
describe('pure calculations', () => {
  it('converts kg/lb reversibly without storage rounding', () => {
    expect(toKg(1, 'lb')).toBe(0.45359237);
    expect(toKg(fromKg(102.5, 'lb'), 'lb')).toBeCloseTo(102.5, 12);
  });
  it('estimates Epley 1RM and handles zero or single repetition', () => {
    expect(epley.estimate(100, 8)).toBeCloseTo(126.66666667);
    expect(epley.estimate(100, 1)).toBe(100);
    expect(epley.estimate(100, 0)).toBe(0);
  });
  it('reconstructs timer from a deadline after suspended execution', () => {
    expect(
      remainingSeconds('2026-09-05T12:02:00Z', '2026-09-05T12:01:30Z'),
    ).toBe(30);
    expect(
      remainingSeconds('2026-09-05T12:02:00Z', '2026-09-05T13:00:00Z'),
    ).toBe(0);
    expect(remainingSeconds(null, '2026-09-05T13:00:00Z')).toBe(0);
  });
  it('scales fractional servings, kcal, macros and micros without rounding', () => {
    const grams = gramsForServings(2.25, 30);
    expect(grams).toBe(67.5);
    const result = snapshotForGrams(
      {
        energy_kcal: { value: 99, unit: 'kcal' },
        iron: { value: 0.2, unit: 'mg' },
      },
      grams,
    );
    expect(result.energy_kcal?.value).toBe(66.825);
    expect(result.iron?.value).toBeCloseTo(0.135);
    expect(() => gramsForServings(1, 0)).toThrow();
  });
  it('normalizes mass units and rejects incompatible nutrient units', () => {
    expect(
      nutrientTotals([
        { sodium: { value: 1, unit: 'g' } },
        { sodium: { value: 250, unit: 'mg' } },
      ]).sodium?.value,
    ).toBe(1.25);
    expect(() =>
      nutrientTotals([
        { x: { value: 1, unit: 'kcal' } },
        { x: { value: 1, unit: 'g' } },
      ]),
    ).toThrow();
  });
  it('uses the civil local date rather than truncating UTC', () => {
    expect(localDiaryDate(new Date(2026, 8, 5, 0, 15))).toBe('2026-09-05');
  });
});
