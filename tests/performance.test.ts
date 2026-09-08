import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { afterEach, beforeEach, expect, it } from 'vitest';
import { setup, exerciseInput } from './helpers/database';
import { TrainingService } from '../src/services/training';
import { EntityRepository } from '../src/repositories/entities';
import { buildPerformance } from '../src/features/training/performance';
import type { SetTargets } from '../src/types/entities';
let s: Awaited<ReturnType<typeof setup>>;
beforeEach(async () => {
  s = await setup();
});
afterEach(() => s.close());
async function session(
  exerciseId: string,
  day: number,
  targets: Partial<SetTargets>[],
  finish = true,
) {
  s.clock.value = `2026-09-${String(day).padStart(2, '0')}T12:00:00.000Z`;
  const workout = await s.training.start('Performance');
  const item = await s.training.addExercise(workout.id, exerciseId);
  const first = (await s.training.state()).sets.find(
    (set) => set.workoutExerciseId === item.id,
  )!;
  const sets = [first];
  for (const [index, patch] of targets.entries()) {
    const set = index === 0 ? first : await s.training.addSet(item.id);
    if (index) sets.push(set);
    await s.training.updateSet(set.id, { weightKg: 100, reps: 8, ...patch });
    await s.training.completeSet(set.id, true);
  }
  if (finish) await s.training.finish(workout.id);
  return { workout, item, sets };
}
it('compares all five exercise records with prior sessions, aggregates repeated occurrences, and ignores ties', async () => {
  const exercise = await s.training.createExercise(exerciseInput);
  const first = await session(exercise.id, 1, [{}]);
  const second = await session(
    exercise.id,
    2,
    [{ weightKg: 110, reps: 10 }],
    false,
  );
  const another = await s.training.addExercise(second.workout.id, exercise.id);
  const extra = (await s.training.state()).sets.find(
    (set) => set.workoutExerciseId === another.id,
  )!;
  await s.training.updateSet(extra.id, { weightKg: 50, reps: 5 });
  await s.training.completeSet(extra.id, true);
  await s.training.finish(second.workout.id);
  const state = await s.training.state();
  expect(state.performance.recordsByWorkoutId[first.workout.id]).toHaveLength(
    5,
  );
  const records = state.performance.recordsByWorkoutId[second.workout.id]!;
  expect(Object.fromEntries(records.map((r) => [r.type, r.value]))).toEqual({
    MAX_WEIGHT: 110,
    MAX_REPS: 10,
    MAX_SET_VOLUME: 1100,
    MAX_ESTIMATED_1RM: 110 * (1 + 10 / 30),
    MAX_WORKOUT_VOLUME: 1350,
  });
  expect(
    records.find((r) => r.type === 'MAX_WORKOUT_VOLUME')?.previousValue,
  ).toBe(800);
  const tie = await session(exercise.id, 3, [
    { weightKg: 110, reps: 10 },
    { weightKg: 50, reps: 5 },
  ]);
  expect(
    (await s.training.state()).performance.recordsByWorkoutId[tie.workout.id],
  ).toEqual([]);
});
it('rebuilds provisional records after edits, uncompletion, deletion and discard without altering historical awards', async () => {
  const exercise = await s.training.createExercise(exerciseInput);
  const prior = await session(exercise.id, 1, [{}]);
  const current = await session(
    exercise.id,
    2,
    [{ weightKg: 120, reps: 9 }],
    false,
  );
  const records = async () =>
    (await s.training.state()).performance.recordsByWorkoutId[
      current.workout.id
    ];
  expect(await records()).toHaveLength(5);
  await s.training.updateSet(current.sets[0]!.id, { weightKg: 50, reps: 4 });
  expect(await records()).toEqual([]);
  await s.training.updateSet(current.sets[0]!.id, { weightKg: 120, reps: 9 });
  await s.training.completeSet(current.sets[0]!.id, false);
  expect(await records()).toEqual([]);
  await s.training.completeSet(current.sets[0]!.id, true);
  await s.training.deleteSet(current.sets[0]!.id);
  expect(await records()).toEqual([]);
  await s.training.finish(current.workout.id, true);
  expect(await records()).toBeUndefined();
  expect(
    (await s.training.state()).performance.recordsByWorkoutId[prior.workout.id],
  ).toHaveLength(5);
});
it('matches previous sets by exercise identity, occurrence and type ordinal, preserving uncompleted holes', async () => {
  const exercise = await s.training.createExercise(exerciseInput);
  const prior = await session(
    exercise.id,
    1,
    [
      { type: 'WARMUP', weightKg: 20, rpe: 6 },
      { weightKg: 80, rpe: 8 },
      { weightKg: 90 },
    ],
    false,
  );
  await s.training.completeSet(prior.sets[1]!.id, false);
  const duplicate = await s.training.addExercise(prior.workout.id, exercise.id);
  const duplicateSet = (await s.training.state()).sets.find(
    (set) => set.workoutExerciseId === duplicate.id,
  )!;
  await s.training.updateSet(duplicateSet.id, {
    weightKg: 60,
    reps: 12,
    rpe: 7,
  });
  await s.training.completeSet(duplicateSet.id, true);
  await s.training.finish(prior.workout.id);
  const current = await session(
    exercise.id,
    2,
    [{}, {}, { type: 'WARMUP' }],
    false,
  );
  const duplicateNow = await s.training.addExercise(
    current.workout.id,
    exercise.id,
  );
  const duplicateNowSet = (await s.training.state()).sets.find(
    (set) => set.workoutExerciseId === duplicateNow.id,
  )!;
  const previous = (await s.training.state()).performance.previousBySetId;
  expect(previous[current.sets[0]!.id]).toBeUndefined();
  expect(previous[current.sets[1]!.id]?.set.weightKg).toBe(90);
  expect(previous[current.sets[2]!.id]?.set).toMatchObject({
    weightKg: 20,
    rpe: 6,
  });
  expect(previous[duplicateNowSet.id]?.set).toMatchObject({
    weightKg: 60,
    rpe: 7,
  });
});
it('skips discarded and empty occurrences and never uses a different exercise with the same name', async () => {
  const exercise = await s.training.createExercise(exerciseInput);
  const first = await session(exercise.id, 1, [{ rpe: 8.5 }]);
  const discarded = await session(exercise.id, 2, [{ weightKg: 200 }], false);
  await s.training.finish(discarded.workout.id, true);
  await session(exercise.id, 3, []);
  const sameName = await s.training.createExercise(exerciseInput);
  await session(sameName.id, 4, [{ weightKg: 300 }]);
  const current = await session(exercise.id, 5, [{}], false);
  expect(
    (await s.training.state()).performance.previousBySetId[current.sets[0]!.id],
  ).toMatchObject({
    workoutId: first.workout.id,
    set: { weightKg: 100, rpe: 8.5 },
  });
});
it('excludes warmups and invalid metric families; bodyweight reps never invent lifted body mass', async () => {
  const weighted = await s.training.createExercise(exerciseInput);
  const warmup = await session(weighted.id, 1, [
    { type: 'WARMUP', weightKg: 500 },
  ]);
  expect(
    (await s.training.state()).performance.recordsByWorkoutId[
      warmup.workout.id
    ],
  ).toEqual([]);
  for (const trackingType of [
    'BODYWEIGHT_REPS',
    'ASSISTED_BODYWEIGHT',
    'DISTANCE_DURATION',
  ] as const) {
    const exercise = await s.training.createExercise({
      ...exerciseInput,
      trackingType,
    });
    const current = await session(exercise.id, 2, [
      { durationSeconds: 60, distanceMeters: 300 },
    ]);
    const records = (await s.training.state()).performance.recordsByWorkoutId[
      current.workout.id
    ]!;
    expect(records.map((r) => r.type)).toEqual(
      trackingType === 'BODYWEIGHT_REPS' ? ['MAX_REPS'] : [],
    );
  }
});
it('rebuilds after reopening SQLite without adding outbox writes and isolates owners', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'gymtrack-performance-'));
  s.close();
  s = await setup(join(directory, 'data.db'));
  try {
    const exercise = await s.training.createExercise(exerciseInput);
    await session(exercise.id, 1, [{}]);
    await session(exercise.id, 2, [{ weightKg: 110 }], false);
    const before = (await s.training.state()).performance;
    const queue = await s.db.all('SELECT * FROM sync_queue');
    const owner = s.ownerId;
    s.close();
    s = await setup(join(directory, 'data.db'), owner);
    expect((await s.training.state()).performance).toEqual(before);
    expect(await s.db.all('SELECT * FROM sync_queue')).toEqual(queue);
    const stranger = new TrainingService(
      new EntityRepository(s.db, randomUUID(), s.repo.runtime),
    );
    expect((await stranger.state()).performance).toEqual({
      previousBySetId: {},
      recordsByWorkoutId: {},
    });
  } finally {
    s.close();
    s = await setup();
    rmSync(directory, { recursive: true });
  }
});
it('supports another 1RM formula and tolerates insignificant floating-point differences', async () => {
  const exercise = await s.training.createExercise(exerciseInput);
  const first = await session(exercise.id, 1, [{}]);
  const next = await session(exercise.id, 2, [{ weightKg: 100 + 1e-12 }]);
  const state = await s.training.state();
  const projection = buildPerformance(
    { ...state, workouts: state.history },
    { estimate: (weight, reps) => weight * reps },
  );
  expect(
    projection.recordsByWorkoutId[first.workout.id]?.find(
      (r) => r.type === 'MAX_ESTIMATED_1RM',
    )?.value,
  ).toBe(800);
  expect(projection.recordsByWorkoutId[next.workout.id]).toEqual([]);
});

it('uses the latest relevant set type and excludes later sessions from active comparisons', async () => {
  const exercise = await s.training.createExercise(exerciseInput);
  const original = await session(exercise.id, 1, [{ weightKg: 80 }]);
  const warmup = await session(exercise.id, 2, [
    { type: 'WARMUP', weightKg: 20 },
  ]);
  await session(exercise.id, 5, [{ weightKg: 200 }]);
  const active = await session(
    exercise.id,
    3,
    [{ weightKg: 100 }, { type: 'WARMUP', weightKg: 30 }],
    false,
  );
  const projection = (await s.training.state()).performance;
  expect(projection.previousBySetId[active.sets[0]!.id]?.workoutId).toBe(
    original.workout.id,
  );
  expect(projection.previousBySetId[active.sets[1]!.id]?.workoutId).toBe(
    warmup.workout.id,
  );
  expect(
    projection.recordsByWorkoutId[active.workout.id]?.find(
      (r) => r.type === 'MAX_WEIGHT',
    ),
  ).toMatchObject({ value: 100, previousValue: 80 });
});

it('reconstructs record chronology independently of repository order and corrects downstream records', async () => {
  const exercise = await s.training.createExercise(exerciseInput);
  const first = await session(exercise.id, 1, [{ weightKg: 100 }]);
  const next = await session(exercise.id, 2, [{ weightKg: 110 }]);
  const state = await s.training.state();
  const input = {
    ...state,
    workouts: [...state.history].reverse(),
    sets: [...state.sets].reverse(),
    workoutExercises: [...state.workoutExercises].reverse(),
  };
  expect(buildPerformance(input)).toEqual(state.performance);
  const corrected = buildPerformance({
    ...input,
    sets: input.sets.map((set) =>
      set.id === first.sets[0]!.id ? { ...set, weightKg: 120 } : set,
    ),
  });
  expect(corrected.recordsByWorkoutId[next.workout.id]).toEqual([]);
  expect(state.sets.find((set) => set.id === first.sets[0]!.id)?.weightKg).toBe(
    100,
  );
});
