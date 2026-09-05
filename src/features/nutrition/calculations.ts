import { z } from 'zod';
import { nutrientsSchema, type Nutrients } from '../../types/entities';

/** Values stay unrounded. Missing nutrients stay missing, never implicitly zero. */
export function snapshotForGrams(per100g: Nutrients, grams: number): Nutrients {
  z.number().finite().positive().parse(grams);
  const validated = nutrientsSchema.parse(per100g);
  return Object.fromEntries(
    Object.entries(validated).map(([key, nutrient]) => [
      key,
      {
        ...nutrient,
        value: (nutrient.value * grams) / 100,
      },
    ]),
  );
}
export function gramsForServings(
  servings: number,
  gramsPerServing: number,
): number {
  z.number().finite().positive().parse(servings);
  z.number().finite().positive().parse(gramsPerServing);
  return servings * gramsPerServing;
}
const gramFactors = { g: 1, mg: 0.001, µg: 0.000001 } as const;
export function nutrientTotals(snapshots: Nutrients[]): Nutrients {
  const result: Nutrients = {};
  for (const snapshot of snapshots) {
    for (const [key, nutrient] of Object.entries(
      nutrientsSchema.parse(snapshot),
    )) {
      const existing = result[key];
      if (!existing) {
        result[key] = { ...nutrient };
        continue;
      }
      if (existing.unit === nutrient.unit) existing.value += nutrient.value;
      else if (existing.unit in gramFactors && nutrient.unit in gramFactors) {
        existing.value +=
          (nutrient.value *
            gramFactors[nutrient.unit as keyof typeof gramFactors]) /
          gramFactors[existing.unit as keyof typeof gramFactors];
      } else throw new Error('INCOMPATIBLE_NUTRIENT_UNITS');
    }
  }
  return result;
}
export function localDiaryDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
