import type {
  Exercise,
  Workout,
  WorkoutExercise,
  WorkoutSet,
} from '../../types/entities';
import { epley, type OneRepMaxFormula } from './calculations';

export const recordTypes = [
  'MAX_WEIGHT',
  'MAX_REPS',
  'MAX_SET_VOLUME',
  'MAX_ESTIMATED_1RM',
  'MAX_WORKOUT_VOLUME',
] as const;
export type RecordType = (typeof recordTypes)[number];
export interface PersonalRecord {
  exerciseId: string;
  workoutId: string;
  type: RecordType;
  value: number;
  previousValue: number | null;
  setId: string | null;
}
export interface PreviousPerformance {
  workoutId: string;
  startedAt: string;
  set: WorkoutSet;
}
interface Input {
  workouts: Workout[];
  exercises: Exercise[];
  workoutExercises: WorkoutExercise[];
  sets: WorkoutSet[];
}
const ordered = <T extends { position: number; id: string }>(rows: T[]) =>
  rows.sort((a, b) => a.position - b.position || a.id.localeCompare(b.id));
const chronological = (a: Workout, b: Workout) =>
  a.startedAt.localeCompare(b.startedAt) ||
  (a.finishedAt ?? '').localeCompare(b.finishedAt ?? '') ||
  a.id.localeCompare(b.id);
const improves = (value: number, previous: number) =>
  value - previous > 1e-9 * Math.max(1, Math.abs(value), Math.abs(previous));

/** A rebuildable local projection: never writes awards or changes source sets. */
export function buildPerformance(
  input: Input,
  formula: OneRepMaxFormula = epley,
) {
  const previousBySetId: Record<string, PreviousPerformance> = {};
  const recordsByWorkoutId: Record<string, PersonalRecord[]> = {};
  const definitions = new Map(input.exercises.map((e) => [e.id, e]));
  const itemsByWorkout = new Map<string, WorkoutExercise[]>();
  const setsByItem = new Map<string, WorkoutSet[]>();
  for (const item of input.workoutExercises) {
    const items = itemsByWorkout.get(item.workoutId) ?? [];
    items.push(item);
    itemsByWorkout.set(item.workoutId, items);
  }
  for (const set of input.sets) {
    if (set.deletedAt) continue;
    const sets = setsByItem.get(set.workoutExerciseId) ?? [];
    sets.push(set);
    setsByItem.set(set.workoutExerciseId, sets);
  }
  for (const items of itemsByWorkout.values()) ordered(items);
  for (const sets of setsByItem.values()) ordered(sets);
  const finished = input.workouts
    .filter((w) => w.status === 'FINISHED')
    .sort(chronological);
  const active = input.workouts.find((w) => w.status === 'ACTIVE');
  if (active) {
    const occurrences = new Map<string, number>();
    const earlier = [...finished]
      .reverse()
      .filter(
        (workout) =>
          (workout.finishedAt ?? workout.startedAt) <= active.startedAt,
      );
    for (const item of itemsByWorkout.get(active.id) ?? []) {
      const occurrence = occurrences.get(item.exerciseId) ?? 0;
      occurrences.set(item.exerciseId, occurrence + 1);
      const ordinalByType = new Map<WorkoutSet['type'], number>();
      for (const set of setsByItem.get(item.id) ?? []) {
        const ordinal = ordinalByType.get(set.type) ?? 0;
        ordinalByType.set(set.type, ordinal + 1);
        for (const workout of earlier) {
          const priorItem = (itemsByWorkout.get(workout.id) ?? []).filter(
            (e) => e.exerciseId === item.exerciseId,
          )[occurrence];
          if (!priorItem) continue;
          const priorSets = (setsByItem.get(priorItem.id) ?? []).filter(
            (s) => s.type === set.type,
          );
          if (!priorSets.some((s) => s.completedAt)) continue;
          const previous = priorSets[ordinal];
          if (previous?.completedAt)
            previousBySetId[set.id] = {
              workoutId: workout.id,
              startedAt: workout.startedAt,
              set: previous,
            };
          break;
        }
      }
    }
  }

  function candidates(workout: Workout) {
    const result = new Map<string, PersonalRecord>();
    const volumes = new Map<string, number>();
    const offer = (
      exerciseId: string,
      type: RecordType,
      value: number,
      setId: string | null,
    ) => {
      if (!(value > 0) || !Number.isFinite(value)) return;
      const key = `${exerciseId}:${type}`;
      if (!result.has(key) || improves(value, result.get(key)!.value))
        result.set(key, {
          exerciseId,
          workoutId: workout.id,
          type,
          value,
          previousValue: null,
          setId,
        });
    };
    for (const item of itemsByWorkout.get(workout.id) ?? []) {
      const tracking = definitions.get(item.exerciseId)?.trackingType;
      for (const set of setsByItem.get(item.id) ?? []) {
        if (!set.completedAt || set.type === 'WARMUP' || set.reps <= 0)
          continue;
        if (tracking === 'WEIGHT_REPS' || tracking === 'BODYWEIGHT_REPS')
          offer(item.exerciseId, 'MAX_REPS', set.reps, set.id);
        // Assistance is not lifted weight; body mass is not available as a snapshot.
        if (tracking !== 'WEIGHT_REPS') continue;
        offer(item.exerciseId, 'MAX_WEIGHT', set.weightKg, set.id);
        offer(
          item.exerciseId,
          'MAX_SET_VOLUME',
          set.weightKg * set.reps,
          set.id,
        );
        offer(
          item.exerciseId,
          'MAX_ESTIMATED_1RM',
          formula.estimate(set.weightKg, set.reps),
          set.id,
        );
        volumes.set(
          item.exerciseId,
          (volumes.get(item.exerciseId) ?? 0) + set.weightKg * set.reps,
        );
      }
    }
    for (const [exerciseId, value] of volumes)
      offer(exerciseId, 'MAX_WORKOUT_VOLUME', value, null);
    return result;
  }
  const best = new Map<string, number>();
  function evaluate(workout: Workout, baseline: Map<string, number>) {
    const records: PersonalRecord[] = [];
    for (const [key, candidate] of candidates(workout)) {
      const previous = baseline.get(key);
      if (previous === undefined || improves(candidate.value, previous)) {
        records.push({ ...candidate, previousValue: previous ?? null });
        baseline.set(key, candidate.value);
      }
    }
    recordsByWorkoutId[workout.id] = records;
  }
  for (const workout of finished) evaluate(workout, best);
  if (active) {
    const baseline = new Map<string, number>();
    for (const workout of finished) {
      if ((workout.finishedAt ?? workout.startedAt) > active.startedAt)
        continue;
      for (const [key, record] of candidates(workout))
        baseline.set(key, Math.max(baseline.get(key) ?? 0, record.value));
    }
    evaluate(active, baseline);
  }
  return { previousBySetId, recordsByWorkoutId };
}
