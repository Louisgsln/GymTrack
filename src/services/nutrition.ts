import { z } from 'zod';
import { EntityRepository } from '../repositories/entities';
import { nutrientsSchema } from '../types/entities';
import {
  nutrientTotals,
  snapshotForGrams,
} from '../features/nutrition/calculations';

const logSchema = z.object({
  name: z.string().trim().min(1).max(160),
  diaryDate: z.iso.date(),
  meal: z.string().trim().min(1).max(100),
  nutrients: nutrientsSchema,
});
export class NutritionService {
  constructor(private readonly repo: EntityRepository) {}
  async diary(date: string) {
    z.iso.date().parse(date);
    const entries = (await this.repo.list('food_diary_entries')).filter(
      (e) => e.diaryDate === date && !e.deletedAt,
    );
    return { entries, totals: nutrientTotals(entries.map((e) => e.nutrients)) };
  }
  quickAdd(input: unknown) {
    const data = logSchema.parse(input);
    if (!data.nutrients.energy_kcal) throw new Error('CALORIES_REQUIRED');
    return this.repo.db.transaction((tx) =>
      this.repo.save(
        'food_diary_entries',
        {
          ...this.repo.base(),
          ...data,
          source: 'QUICK_ADD',
          foodId: null,
          grams: null,
          loggedAt: this.repo.runtime.now(),
          deletedAt: null,
        },
        tx,
      ),
    );
  }
  logFood(input: unknown) {
    const data = logSchema
      .extend({ foodId: z.string().min(1), grams: z.number().positive() })
      .parse(input);
    return this.repo.db.transaction((tx) =>
      this.repo.save(
        'food_diary_entries',
        {
          ...this.repo.base(),
          ...data,
          nutrients: snapshotForGrams(data.nutrients, data.grams),
          source: 'CUSTOM',
          loggedAt: this.repo.runtime.now(),
          deletedAt: null,
        },
        tx,
      ),
    );
  }
  remove(id: string) {
    return this.repo.db.transaction(async (tx) => {
      const entry = await this.repo.get('food_diary_entries', id, tx);
      if (entry.deletedAt) return;
      await this.repo.save(
        'food_diary_entries',
        { ...entry, deletedAt: this.repo.runtime.now() },
        tx,
      );
    });
  }
}
