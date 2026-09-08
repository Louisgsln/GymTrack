import {
  setTargetsSchema,
  type SetTargets,
  type Exercise,
} from '../../types/entities';
import { toKg } from './calculations';
export type TargetNumber = Exclude<keyof SetTargets, 'type'>;
export function parseTargetInput(
  field: TargetNumber,
  text: string,
  unit: 'kg' | 'lb',
): number | null {
  const normalized = text.replace(',', '.');
  const nullable = ['rpe', 'rir', 'durationSeconds', 'distanceMeters'].includes(
    field,
  );
  if (!text && nullable) return null;
  if (!/^\d+(\.\d*)?$/.test(normalized)) throw new Error('INVALID_NUMBER');
  const value =
    field === 'weightKg' ? toKg(Number(normalized), unit) : Number(normalized);
  return setTargetsSchema.shape[field].parse(value);
}
export function trackingFields(type: Exercise['trackingType']): TargetNumber[] {
  const fields: Record<Exercise['trackingType'], TargetNumber[]> = {
    WEIGHT_REPS: ['weightKg', 'reps'],
    BODYWEIGHT_REPS: ['reps'],
    ASSISTED_BODYWEIGHT: ['weightKg', 'reps'],
    WEIGHT_DURATION: ['weightKg', 'durationSeconds'],
    DURATION: ['durationSeconds'],
    DISTANCE: ['distanceMeters'],
    DISTANCE_DURATION: ['distanceMeters', 'durationSeconds'],
  };
  return fields[type];
}
