import { z } from 'zod';
import {
  exerciseSchema,
  setTargetsSchema,
  type Routine,
  type RoutineExercise,
  type RoutineSetTemplate,
  type Exercise,
  type SetTargets,
  type SupersetGroup,
} from '../../types/entities';

export interface RoutineDetail {
  routine: Routine;
  groups: SupersetGroup[];
  exercises: {
    item: RoutineExercise;
    exercise: Exercise;
    sets: RoutineSetTemplate[];
  }[];
}
export const emptyTargets: SetTargets = {
  type: 'NORMAL',
  weightKg: 0,
  reps: 0,
  rpe: null,
  rir: null,
  durationSeconds: null,
  distanceMeters: null,
};
export const exerciseDefinitionSchema = exerciseSchema
  .omit({
    id: true,
    ownerId: true,
    revision: true,
    createdAt: true,
    updatedAt: true,
  })
  .strict();
/** Portable versioned format: no account/workout ids, history, or completion markers. */
const legacyRoutineSchema = z
  .object({
    format: z.literal('gymtrack.routine'),
    version: z.literal(1),
    name: z.string().trim().min(1).max(160),
    notes: z.string().max(10000),
    exercises: z
      .array(
        z
          .object({
            definition: exerciseDefinitionSchema,
            notes: z.string().max(5000),
            restSeconds: z.number().int().min(0).max(3600),
            sets: z.array(setTargetsSchema.strict()).max(200),
          })
          .strict(),
      )
      .max(200),
  })
  .strict();
export const sharedRoutineSchema = z
  .union([
    legacyRoutineSchema,
    legacyRoutineSchema
      .extend({
        version: z.literal(2),
        groups: z
          .array(
            z
              .object({
                members: z
                  .array(z.number().int().nonnegative())
                  .min(2)
                  .max(200),
                restSeconds: z.number().int().min(0).max(3600),
              })
              .strict(),
          )
          .max(100),
      })
      .strict(),
  ])
  .superRefine((source, ctx) => {
    if (!('groups' in source)) return;
    const seen = new Set<number>();
    for (const group of source.groups) {
      for (const [index, member] of group.members.entries()) {
        if (
          member >= source.exercises.length ||
          seen.has(member) ||
          (index > 0 && member !== group.members[index - 1]! + 1)
        )
          ctx.addIssue({ code: 'custom', message: 'INVALID_GROUP_MEMBERS' });
        seen.add(member);
      }
    }
  });
export type SharedRoutine = z.infer<typeof sharedRoutineSchema>;
export const MAX_SHARED_ROUTINE_LENGTH = 500_000;
export function parseSharedRoutine(text: string): SharedRoutine {
  if (text.length > MAX_SHARED_ROUTINE_LENGTH)
    throw new Error('ROUTINE_TOO_LARGE');
  return sharedRoutineSchema.parse(JSON.parse(text));
}
export function serializeRoutine(detail: RoutineDetail): string {
  if (
    detail.exercises.some(
      ({ item }) =>
        item.supersetGroupId &&
        !detail.groups.some((g) => g.id === item.supersetGroupId),
    )
  )
    throw new Error('MISSING_GROUP');
  const result = JSON.stringify(
    sharedRoutineSchema.parse({
      format: 'gymtrack.routine',
      version: 2,
      groups: detail.groups.map((group) => ({
        restSeconds: group.restSeconds,
        members: detail.exercises.flatMap(({ item }, index) =>
          item.supersetGroupId === group.id ? [index] : [],
        ),
      })),
      name: detail.routine.name,
      notes: detail.routine.notes,
      exercises: detail.exercises.map(({ item, exercise, sets }) => ({
        definition: exerciseDefinitionSchema.parse(
          exerciseDefinitionSchema.strip().parse(exercise),
        ),
        notes: item.notes,
        restSeconds: item.restSeconds,
        sets: sets.map((set) => setTargetsSchema.parse(set)),
      })),
    }),
    null,
    2,
  );
  if (result.length > MAX_SHARED_ROUTINE_LENGTH)
    throw new Error('ROUTINE_TOO_LARGE');
  return result;
}
/** Reordering must be a permutation of the complete current sibling collection. */
export function assertPermutation(ids: string[], current: { id: string }[]) {
  z.array(z.uuid()).parse(ids);
  if (
    ids.length !== current.length ||
    new Set(ids).size !== ids.length ||
    current.some((item) => !ids.includes(item.id))
  ) {
    throw new Error('INVALID_ORDER');
  }
}
