import { it, expect } from 'vitest';
import { setup } from './helpers/database';
import type { Nutrients } from '../src/types/entities';
it('food changes never modify historical snapshots; fractional portions stay precise', async () => {
  const s = await setup();
  try {
    const source: Nutrients = {
      energy_kcal: { value: 100, unit: 'kcal' },
      protein: { value: 20, unit: 'g' },
    };
    await s.nutrition.logFood({
      name: 'Food A',
      foodId: 'food-a',
      grams: 100,
      diaryDate: '2026-09-05',
      meal: 'Lunch',
      nutrients: source,
    });
    source.energy_kcal = { value: 120, unit: 'kcal' };
    expect(
      (await s.nutrition.diary('2026-09-05')).totals.energy_kcal?.value,
    ).toBe(100);
    await s.nutrition.logFood({
      name: 'Food A',
      foodId: 'food-a',
      grams: 12.5,
      diaryDate: '2026-09-05',
      meal: 'Dinner',
      nutrients: source,
    });
    expect(
      (await s.nutrition.diary('2026-09-05')).totals.energy_kcal?.value,
    ).toBe(115);
    expect((await s.nutrition.diary('2026-09-06')).entries).toHaveLength(0);
  } finally {
    s.close();
  }
});
it('quick add and deletion recompute totals and enqueue both operations', async () => {
  const s = await setup();
  try {
    const entry = await s.nutrition.quickAdd({
      name: 'Lunch',
      diaryDate: '2026-09-05',
      meal: 'Lunch',
      nutrients: { energy_kcal: { value: 99, unit: 'kcal' } },
    });
    expect(
      (await s.nutrition.diary('2026-09-05')).totals.energy_kcal?.value,
    ).toBe(99);
    await s.nutrition.remove(entry.id);
    expect((await s.nutrition.diary('2026-09-05')).entries).toHaveLength(0);
    expect(await s.db.all('SELECT * FROM sync_queue')).toHaveLength(2);
  } finally {
    s.close();
  }
});
