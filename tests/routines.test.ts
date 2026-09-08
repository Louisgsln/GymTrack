import { randomUUID } from 'node:crypto';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  setup,
  exerciseInput,
  startWithSet,
  nodeDatabase,
} from './helpers/database';
import { migrate, migrations } from '../src/database/migrations';
import { RoutineService } from '../src/services/routines';
import { EntityRepository } from '../src/repositories/entities';
import { parseSharedRoutine } from '../src/features/routines/model';
import {
  parseTargetInput,
  trackingFields,
} from '../src/features/training/setInput';
async function build(s: Awaited<ReturnType<typeof setup>>) {
  const exercise = await s.training.createExercise(exerciseInput);
  const routine = await s.routines.create('Push');
  const item = await s.routines.addExercise(routine.id, exercise.id);
  const set = (await s.routines.detail(routine.id)).exercises[0]!.sets[0]!;
  await s.routines.updateSet(set.id, {
    weightKg: 102.5,
    reps: 8,
    rpe: 8.5,
    type: 'DROP_SET',
  });
  await s.routines.updateExercise(item.id, {
    notes: 'Control the descent',
    restSeconds: 120,
  });
  await s.routines.update(routine.id, { notes: 'Training plan' });
  return { exercise, routine, item, set };
}
describe('routines on real SQLite', () => {
  it('upgrades an existing v1 database without losing its active workout/outbox', async () => {
    const s = nodeDatabase();
    try {
      await s.db.exec(
        'CREATE TABLE schema_migrations(version INTEGER PRIMARY KEY)',
      );
      await s.db.exec(migrations[0].sql);
      await s.db.run('INSERT INTO schema_migrations VALUES (1)');
      const repo = new EntityRepository(s.db, randomUUID(), {
        id: randomUUID,
        now: () => '2026-09-06T10:00:00.000Z',
      });
      const base = repo.base();
      await s.db.transaction((tx) =>
        repo.save(
          'workouts',
          {
            ...base,
            title: 'Before upgrade',
            startedAt: base.createdAt,
            finishedAt: null,
            status: 'ACTIVE',
            privacy: 'PRIVATE',
            notes: 'Preserved',
            routineId: null,
            restEndsAt: null,
          },
          tx,
        ),
      );
      const before = await s.db.all('SELECT * FROM sync_queue');
      await migrate(s.db);
      await migrate(s.db);
      expect((await repo.get('workouts', base.id)).notes).toBe('Preserved');
      expect(await s.db.all('SELECT * FROM sync_queue')).toEqual(before);
      expect(await s.db.all('SELECT * FROM schema_migrations')).toEqual([
        { version: 1 },
        { version: 2 },
        { version: 3 },
        { version: 4 },
        { version: 5 },
      ]);
    } finally {
      s.close();
    }
  });
  it('creates, edits, reopens and starts an independent workout with persisted targets', async () => {
    const directory = mkdtempSync(join(tmpdir(), 'gymtrack-routines-'));
    const path = join(directory, 'routines.db');
    let s = await setup(path);
    try {
      const { routine } = await build(s);
      const owner = s.ownerId;
      s.close();
      s = await setup(path, owner);
      expect((await s.routines.detail(routine.id)).routine.notes).toBe(
        'Training plan',
      );
      const workout = await s.workoutTemplates.startRoutine(routine.id);
      const state = await s.training.state();
      const targets = state.sets[0]!;
      expect(targets).toMatchObject({
        weightKg: 102.5,
        reps: 8,
        rpe: 8.5,
        type: 'DROP_SET',
        completedAt: null,
      });
      expect(state.active).toMatchObject({
        routineId: routine.id,
        privacy: 'PRIVATE',
        notes: 'Training plan',
      });
      expect(state.workoutExercises[0]).toMatchObject({
        notes: 'Control the descent',
        restSeconds: 120,
      });
      await s.training.completeSet(targets.id, true);
      expect((await s.training.state()).active?.restEndsAt).toBe(
        '2026-09-05T12:02:00.000Z',
      );
      await s.routines.remove(routine.id);
      expect((await s.training.state()).active?.id).toBe(workout.id);
      expect((await s.training.state()).sets[0]?.weightKg).toBe(102.5);
      await s.training.finish(workout.id);
      s.close();
      s = await setup(path, owner);
      expect((await s.training.state()).history[0]?.id).toBe(workout.id);
      expect(await s.routines.list()).toHaveLength(0);
    } finally {
      s.close();
      rmSync(directory, { recursive: true });
    }
  });
  it('duplicates the complete graph without sharing template IDs', async () => {
    const s = await setup();
    try {
      const { routine } = await build(s);
      const copy = await s.routines.duplicate(routine.id, 'Copy');
      const source = await s.routines.detail(routine.id);
      const cloned = await s.routines.detail(copy.id);
      expect(cloned.exercises[0]?.item.id).not.toBe(
        source.exercises[0]?.item.id,
      );
      expect(cloned.exercises[0]?.sets[0]?.id).not.toBe(
        source.exercises[0]?.sets[0]?.id,
      );
      await s.routines.updateSet(cloned.exercises[0]!.sets[0]!.id, {
        reps: 12,
      });
      expect(
        (await s.routines.detail(routine.id)).exercises[0]?.sets[0]?.reps,
      ).toBe(8);
      await s.routines.remove(routine.id);
      expect(
        (await s.routines.detail(copy.id)).exercises[0]?.sets[0]?.reps,
      ).toBe(12);
    } finally {
      s.close();
    }
  });
  it('reorders routines, exercises and sets; rejects partial, duplicate and foreign IDs', async () => {
    const s = await setup();
    try {
      const { routine, exercise, item, set } = await build(s);
      const other = await s.routines.create('B');
      await s.routines.reorder([other.id, routine.id]);
      expect((await s.routines.list()).map((r) => r.id)).toEqual([
        other.id,
        routine.id,
      ]);
      const second = await s.routines.addExercise(routine.id, exercise.id);
      await s.routines.reorderExercises(routine.id, [second.id, item.id]);
      expect(
        (await s.routines.detail(routine.id)).exercises.map((e) => e.item.id),
      ).toEqual([second.id, item.id]);
      const extra = await s.routines.addSet(item.id, set.id);
      await s.routines.reorderSets(item.id, [extra.id, set.id]);
      expect(
        (await s.routines.detail(routine.id)).exercises[1]?.sets.map(
          (v) => v.id,
        ),
      ).toEqual([extra.id, set.id]);
      await expect(s.routines.reorder([routine.id])).rejects.toThrow(
        'INVALID_ORDER',
      );
      await expect(
        s.routines.reorderExercises(routine.id, [item.id, item.id]),
      ).rejects.toThrow('INVALID_ORDER');
      await expect(
        s.routines.reorderSets(item.id, [randomUUID(), set.id]),
      ).rejects.toThrow('INVALID_ORDER');
      await s.routines.removeSet(extra.id);
      await s.routines.removeExercise(second.id);
      expect((await s.routines.detail(routine.id)).exercises).toHaveLength(1);
    } finally {
      s.close();
    }
  });
  it('validates mutations and enforces ownership including SQL foreign keys', async () => {
    const s = await setup();
    try {
      const { routine, exercise, set } = await build(s);
      const otherRepo = new EntityRepository(
        s.db,
        randomUUID(),
        s.repo.runtime,
      );
      const other = new RoutineService(otherRepo);
      await expect(other.detail(routine.id)).rejects.toThrow('NOT_FOUND');
      await expect(other.updateSet(set.id, { reps: 9 })).rejects.toThrow(
        'NOT_FOUND',
      );
      expect(() => s.routines.updateSet(set.id, { rpe: 5 })).toThrow();
      expect(() => s.routines.updateSet(set.id, { reps: 1.5 })).toThrow();
      expect(() =>
        s.routines.update(routine.id, { ownerId: randomUUID() }),
      ).toThrow();
      const foreignRoutine = await other.create('Other');
      await expect(
        s.db.transaction((tx) =>
          otherRepo.save(
            'routine_exercises',
            {
              ...otherRepo.base(),
              routineId: foreignRoutine.id,
              exerciseId: exercise.id,
              position: 0,
              notes: '',
              restSeconds: 90,
              supersetGroupId: null,
              deletedAt: null,
            },
            tx,
          ),
        ),
      ).rejects.toThrow('FOREIGN KEY');
      await s.routines.remove(routine.id);
      await expect(s.routines.updateSet(set.id, { reps: 9 })).rejects.toThrow(
        'NOT_FOUND',
      );
    } finally {
      s.close();
    }
  });
  it('rolls back the entire start when any copied set cannot be persisted', async () => {
    const s = await setup();
    try {
      const { routine } = await build(s);
      const before = await s.db.all('SELECT * FROM sync_queue');
      await s.db.exec(
        "CREATE TRIGGER reject_sets BEFORE INSERT ON workout_sets BEGIN SELECT RAISE(ABORT,'DISK_FULL'); END;",
      );
      await expect(s.workoutTemplates.startRoutine(routine.id)).rejects.toThrow(
        'DISK_FULL',
      );
      expect((await s.training.state()).active).toBeNull();
      expect(await s.repo.list('workout_exercises')).toHaveLength(0);
      expect(await s.db.all('SELECT * FROM sync_queue')).toEqual(before);
    } finally {
      s.close();
    }
  });
  it('preserves an active workout and serializes competing starts', async () => {
    const s = await setup();
    try {
      const { routine } = await build(s);
      const results = await Promise.allSettled([
        s.workoutTemplates.startRoutine(routine.id),
        s.workoutTemplates.startRoutine(routine.id),
      ]);
      expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(1);
      expect(results.filter((r) => r.status === 'rejected')).toHaveLength(1);
      const before = await s.training.state();
      await expect(s.workoutTemplates.startRoutine(routine.id)).rejects.toThrow(
        'WORKOUT_ACTIVE',
      );
      expect(await s.training.state()).toEqual(before);
    } finally {
      s.close();
    }
  });
  it('exports a private-data-free portable format and imports independent copies after validation', async () => {
    const s = await setup();
    try {
      const { routine, exercise } = await build(s);
      const text = await s.routineSharing.export(routine.id);
      expect(text).not.toContain(s.ownerId);
      expect(text).not.toContain(routine.id);
      expect(text).not.toContain(exercise.id);
      expect(text).not.toContain('completedAt');
      const preview = s.routineSharing.preview(text);
      expect(preview.exercises[0]?.sets[0]?.weightKg).toBe(102.5);
      expect(await s.routines.list()).toHaveLength(1);
      const imported = await s.routineSharing.import(text);
      const result = await s.routines.detail(imported.id);
      expect(result.exercises[0]?.exercise.id).not.toBe(exercise.id);
      expect(result.exercises[0]?.exercise.name).toBe(exerciseInput.name);
      expect(result.exercises[0]?.sets[0]).toMatchObject({
        weightKg: 102.5,
        reps: 8,
      });
      expect(() =>
        parseSharedRoutine(JSON.stringify({ ...preview, version: 999 })),
      ).toThrow();
      expect(() =>
        parseSharedRoutine(JSON.stringify({ ...preview, ownerId: s.ownerId })),
      ).toThrow();
      expect(() => parseSharedRoutine('x'.repeat(500001))).toThrow(
        'ROUTINE_TOO_LARGE',
      );
      expect(() => s.routineSharing.import('not json')).toThrow();
    } finally {
      s.close();
    }
  });
  it('copies finished workouts into templates and repeats without changing history', async () => {
    const s = await setup();
    try {
      const { workout, set } = await startWithSet(s);
      await s.training.updateSet(set.id, { weightKg: 100, reps: 8, rir: 2 });
      await s.training.completeSet(set.id, true);
      await s.training.finish(workout.id);
      const original = await s.repo.get('workout_sets', set.id);
      const routine = await s.workoutTemplates.saveAsRoutine(
        workout.id,
        'History plan',
      );
      expect(
        (await s.routines.detail(routine.id)).exercises[0]?.sets[0],
      ).toMatchObject({ weightKg: 100, reps: 8, rir: 2 });
      const repeated = await s.workoutTemplates.repeatWorkout(
        workout.id,
        'Copy',
      );
      expect(repeated.id).not.toBe(workout.id);
      expect(repeated.title).toBe('Copy');
      expect(
        (await s.training.state()).sets.find((s) => s.id !== set.id)
          ?.completedAt,
      ).toBeNull();
      expect(await s.repo.get('workout_sets', set.id)).toEqual(original);
    } finally {
      s.close();
    }
  });
  it('rejects empty routine starts without leaving a partial workout', async () => {
    const s = await setup();
    try {
      const r = await s.routines.create('Draft');
      await expect(s.workoutTemplates.startRoutine(r.id)).rejects.toThrow(
        'EMPTY_ROUTINE',
      );
      expect((await s.training.state()).active).toBeNull();
    } finally {
      s.close();
    }
  });
  it('keeps workout notes, rest and targets independent from later routine edits', async () => {
    const s = await setup();
    try {
      const { routine, item, set } = await build(s);
      await s.workoutTemplates.startRoutine(routine.id);
      await s.routines.updateSet(set.id, { weightKg: 150 });
      await s.routines.updateExercise(item.id, {
        notes: 'Future plan',
        restSeconds: 300,
      });
      const state = await s.training.state();
      expect(state.sets[0]?.weightKg).toBe(102.5);
      expect(state.workoutExercises[0]).toMatchObject({
        notes: 'Control the descent',
        restSeconds: 120,
      });
      await s.training.editExercise(
        state.workoutExercises[0]!.id,
        'This session only',
      );
      expect(
        (await s.routines.detail(routine.id)).exercises[0]?.item.notes,
      ).toBe('Future plan');
    } finally {
      s.close();
    }
  });
  it('rolls back failed duplication/import and deleted-set descendants atomically', async () => {
    const s = await setup();
    try {
      const { routine } = await build(s);
      const exported = await s.routineSharing.export(routine.id);
      const before = await s.db.all('SELECT * FROM sync_queue');
      await s.db.exec(
        "CREATE TRIGGER reject_routine_sets BEFORE INSERT ON routine_sets BEGIN SELECT RAISE(ABORT,'DISK_FULL'); END;",
      );
      await expect(
        s.routines.duplicate(routine.id, 'Failed copy'),
      ).rejects.toThrow('DISK_FULL');
      await expect(s.routineSharing.import(exported)).rejects.toThrow(
        'DISK_FULL',
      );
      expect(await s.routines.list()).toHaveLength(1);
      expect(await s.repo.list('exercises')).toHaveLength(1);
      expect(await s.db.all('SELECT * FROM sync_queue')).toEqual(before);
      await s.db.exec('DROP TRIGGER reject_routine_sets');
      await s.db.exec(
        "CREATE TRIGGER reject_outbox BEFORE INSERT ON sync_queue WHEN NEW.entity_type='routines' BEGIN SELECT RAISE(ABORT,'DISK_FULL'); END;",
      );
      await expect(s.routines.remove(routine.id)).rejects.toThrow('DISK_FULL');
      expect(
        (await s.routines.detail(routine.id)).exercises[0]?.sets,
      ).toHaveLength(1);
      expect(await s.db.all('SELECT * FROM sync_queue')).toEqual(before);
    } finally {
      s.close();
    }
  });
  it('starts and completes duration/distance templates using the copied numeric targets', async () => {
    const s = await setup();
    try {
      const exercise = await s.training.createExercise({
        ...exerciseInput,
        trackingType: 'DISTANCE_DURATION',
      });
      const routine = await s.routines.create('Run');
      await s.routines.addExercise(routine.id, exercise.id);
      const set = (await s.routines.detail(routine.id)).exercises[0]!.sets[0]!;
      await s.routines.updateSet(set.id, {
        distanceMeters: 1500.5,
        durationSeconds: 360.5,
      });
      await s.workoutTemplates.startRoutine(routine.id);
      const actual = (await s.training.state()).sets[0]!;
      await s.training.completeSet(actual.id, true);
      expect((await s.training.state()).sets[0]).toMatchObject({
        distanceMeters: 1500.5,
        durationSeconds: 360.5,
        completedAt: s.clock.value,
      });
    } finally {
      s.close();
    }
  });
});
it('shares the same numeric parser across routine targets and live sets', () => {
  expect(parseTargetInput('weightKg', '102,5', 'kg')).toBe(102.5);
  expect(parseTargetInput('weightKg', '100', 'lb')).toBeCloseTo(45.359237);
  expect(parseTargetInput('rpe', '', 'kg')).toBeNull();
  expect(parseTargetInput('durationSeconds', '12.5', 'kg')).toBe(12.5);
  expect(() => parseTargetInput('reps', '3.5', 'kg')).toThrow();
  expect(() => parseTargetInput('rpe', '8.3', 'kg')).toThrow();
  expect(() => parseTargetInput('weightKg', '', 'kg')).toThrow();
  expect(trackingFields('DISTANCE_DURATION')).toEqual([
    'distanceMeters',
    'durationSeconds',
  ]);
});
