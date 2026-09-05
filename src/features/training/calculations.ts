import type { WorkoutSet } from '../../types/entities';
const KG_PER_LB = 0.45359237;
export const toKg = (weight: number, unit: 'kg' | 'lb') =>
  unit === 'kg' ? weight : weight * KG_PER_LB;
export const fromKg = (weight: number, unit: 'kg' | 'lb') =>
  unit === 'kg' ? weight : weight / KG_PER_LB;
export interface OneRepMaxFormula {
  estimate(weightKg: number, reps: number): number;
}
export const epley: OneRepMaxFormula = {
  estimate(weightKg, reps) {
    if (
      !Number.isFinite(weightKg) ||
      weightKg < 0 ||
      !Number.isInteger(reps) ||
      reps < 1
    )
      return 0;
    return reps === 1 ? weightKg : weightKg * (1 + reps / 30);
  },
};
export function summarizeSets(sets: WorkoutSet[]) {
  const completed = sets.filter((set) => set.completedAt && !set.deletedAt);
  const working = completed.filter((set) => set.type !== 'WARMUP');
  return {
    completedSets: completed.length,
    volumeKg: working.reduce((sum, set) => sum + set.weightKg * set.reps, 0),
    maxWeightKg: Math.max(0, ...working.map((set) => set.weightKg)),
    estimated1RM: Math.max(
      0,
      ...working.map((set) => epley.estimate(set.weightKg, set.reps)),
    ),
  };
}
export function remainingSeconds(deadline: string | null, now: string) {
  return deadline
    ? Math.max(0, Math.ceil((Date.parse(deadline) - Date.parse(now)) / 1000))
    : 0;
}
