import { z } from 'zod';

export const exerciseTypes = [
  'WEIGHT_REPS',
  'BODYWEIGHT_REPS',
  'ASSISTED_BODYWEIGHT',
  'WEIGHT_DURATION',
  'DURATION',
  'DISTANCE',
  'DISTANCE_DURATION',
] as const;
export const setTypes = [
  'NORMAL',
  'WARMUP',
  'DROP_SET',
  'FAILURE',
  'AMRAP',
  'BACKOFF',
  'MYO_REP',
  'CUSTOM',
] as const;
const base = {
  id: z.uuid(),
  ownerId: z.uuid(),
  revision: z.number().int().positive(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
};
export const exerciseSchema = z.object({
  ...base,
  name: z.string().trim().min(1).max(120),
  primaryMuscle: z.string().trim().min(1).max(80),
  secondaryMuscles: z.array(z.string().max(80)),
  equipment: z.string().trim().min(1).max(80),
  trackingType: z.enum(exerciseTypes),
  instructions: z.string().max(5000),
  defaultRestSeconds: z.number().int().min(0).max(3600),
});
export const workoutSchema = z.object({
  ...base,
  title: z.string().trim().min(1).max(160),
  startedAt: z.iso.datetime(),
  finishedAt: z.iso.datetime().nullable(),
  status: z.enum(['ACTIVE', 'FINISHED', 'DISCARDED']),
  privacy: z.enum(['PRIVATE', 'FRIENDS', 'PUBLIC']),
  notes: z.string().max(10000),
  routineId: z.uuid().nullable(),
  restEndsAt: z.iso.datetime().nullable(),
});
export const workoutExerciseSchema = z.object({
  ...base,
  workoutId: z.uuid(),
  exerciseId: z.uuid(),
  position: z.number().int().nonnegative(),
  notes: z.string().max(5000),
  supersetGroupId: z.uuid().nullable(),
});
export const workoutSetSchema = z.object({
  ...base,
  workoutExerciseId: z.uuid(),
  position: z.number().int().nonnegative(),
  type: z.enum(setTypes),
  weightKg: z.number().finite().min(0).max(2000),
  reps: z.number().int().min(0).max(10000),
  rpe: z.number().min(6).max(10).multipleOf(0.5).nullable(),
  rir: z.number().int().min(0).max(10).nullable(),
  durationSeconds: z.number().finite().nonnegative().nullable(),
  distanceMeters: z.number().finite().nonnegative().nullable(),
  completedAt: z.iso.datetime().nullable(),
  deletedAt: z.iso.datetime().nullable(),
});
export const nutrientsSchema = z.record(
  z.string().min(1),
  z.object({
    value: z.number().finite().nonnegative(),
    unit: z.enum(['kcal', 'kJ', 'g', 'mg', 'µg']),
  }),
);
export const diaryEntrySchema = z.object({
  ...base,
  diaryDate: z.iso.date(),
  meal: z.string().trim().min(1).max(100),
  name: z.string().trim().min(1).max(160),
  grams: z.number().positive().nullable(),
  source: z.enum(['QUICK_ADD', 'CUSTOM', 'PROVIDER']),
  foodId: z.string().nullable(),
  nutrients: nutrientsSchema,
  loggedAt: z.iso.datetime(),
  deletedAt: z.iso.datetime().nullable(),
});
export const schemas = {
  exercises: exerciseSchema,
  workouts: workoutSchema,
  workout_exercises: workoutExerciseSchema,
  workout_sets: workoutSetSchema,
  food_diary_entries: diaryEntrySchema,
};
export type EntityType = keyof typeof schemas;
export type Entities = { [K in EntityType]: z.infer<(typeof schemas)[K]> };
export type Exercise = Entities['exercises'];
export type Workout = Entities['workouts'];
export type WorkoutExercise = Entities['workout_exercises'];
export type WorkoutSet = Entities['workout_sets'];
export type DiaryEntry = Entities['food_diary_entries'];
export type Nutrients = z.infer<typeof nutrientsSchema>;
