import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { afterEach, beforeEach, expect, it } from 'vitest';
import { setup, exerciseInput, nodeDatabase } from './helpers/database';
import { migrations, migrate } from '../src/database/migrations';
import { EntityRepository } from '../src/repositories/entities';
import { TrainingService } from '../src/services/training';
import { SupersetService } from '../src/services/supersets';
import {
  circuitSequence,
  groupLabels,
} from '../src/features/training/supersets';
let s: Awaited<ReturnType<typeof setup>>;
beforeEach(async () => {
  s = await setup();
});
afterEach(() => s.close());
async function workout(memberCount = 3, counts: number[] = []) {
  const workout = await s.training.start('Circuit');
  const items = [];
  for (let index = 0; index < memberCount; index++) {
    const exercise = await s.training.createExercise({
      ...exerciseInput,
      name: `Exercise ${index + 1}`,
    });
    const item = await s.training.addExercise(workout.id, exercise.id);
    for (let set = 1; set < (counts[index] ?? 2); set++)
      await s.training.addSet(item.id);
    items.push(item);
  }
  for (const set of (await s.training.state()).sets)
    await s.training.updateSet(set.id, { weightKg: 20, reps: 8 });
  return { workout, items };
}
it('navigates a tri-set by rounds, handles unequal set counts and starts rest only after each round', async () => {
  const { workout: w, items } = await workout(3, [2, 1, 3]);
  await s.supersets.create(
    { workoutId: w.id },
    items.map((e) => e.id),
    120,
  );
  let state = await s.training.state();
  const sequence = circuitSequence(state.workoutExercises, state.sets);
  expect(sequence.map((set) => set.workoutExerciseId)).toEqual([
    items[0]!.id,
    items[1]!.id,
    items[2]!.id,
    items[0]!.id,
    items[2]!.id,
    items[2]!.id,
  ]);
  expect(Object.values(groupLabels(state.workoutExercises))).toEqual([
    'A1',
    'A2',
    'A3',
  ]);
  for (const [index, set] of sequence.entries()) {
    await s.training.completeSet(set.id, true);
    state = await s.training.state();
    expect(state.active?.restEndsAt).toBe(
      [2, 4, 5].includes(index) ? '2026-09-05T12:02:00.000Z' : null,
    );
  }
  await s.training.completeSet(sequence[5]!.id, false);
  expect((await s.training.state()).active?.restEndsAt).toBeNull();
});
it('supports supersets and giant sets, reorders whole blocks/members/sets and rejects split groups', async () => {
  const { workout: w, items } = await workout(5);
  const group = await s.supersets.create(
    { workoutId: w.id },
    [items[0]!.id, items[2]!.id],
    90,
  );
  let state = await s.training.state();
  let order = state.workoutExercises
    .sort((a, b) => a.position - b.position)
    .map((e) => e.id);
  expect(order).toEqual([
    items[0]!.id,
    items[2]!.id,
    items[1]!.id,
    items[3]!.id,
    items[4]!.id,
  ]);
  await expect(
    s.supersets.reorder(
      { workoutId: w.id },
      items.map((e) => e.id),
    ),
  ).rejects.toThrow('CONTIGUOUS');
  order = [
    items[1]!.id,
    items[2]!.id,
    items[0]!.id,
    items[4]!.id,
    items[3]!.id,
  ];
  await s.supersets.reorder({ workoutId: w.id }, order);
  const sets = state.sets.filter(
    (set) => set.workoutExerciseId === items[0]!.id,
  );
  await s.training.reorderSets(
    items[0]!.id,
    sets.map((set) => set.id).reverse(),
  );
  expect(
    (await s.training.state()).sets.find((set) => set.id === sets[1]!.id)
      ?.position,
  ).toBe(0);
  await expect(
    s.training.reorderSets(items[0]!.id, [sets[0]!.id]),
  ).rejects.toThrow('INVALID_ORDER');
  await s.supersets.dissolve(group.id);
  await s.supersets.create(
    { workoutId: w.id },
    items.slice(0, 4).map((e) => e.id),
    0,
  );
  state = await s.training.state();
  expect(Object.values(groupLabels(state.workoutExercises))).toEqual([
    'A1',
    'A2',
    'A3',
    'A4',
  ]);
  expect(state.groups).toHaveLength(1);
});
it('rejects cross-owner/cross-parent, duplicate, single and already grouped members atomically', async () => {
  const { workout: w, items } = await workout(2);
  const before = await s.db.all('SELECT * FROM sync_queue');
  for (const ids of [
    [items[0]!.id],
    [items[0]!.id, items[0]!.id],
    [items[0]!.id, randomUUID()],
  ])
    await expect(async () =>
      s.supersets.create({ workoutId: w.id }, ids, 90),
    ).rejects.toThrow();
  await expect(async () =>
    s.supersets.create(
      { workoutId: w.id },
      items.map((e) => e.id),
      -1,
    ),
  ).rejects.toThrow();
  const stranger = new SupersetService(
    new EntityRepository(s.db, randomUUID(), s.repo.runtime),
  );
  await expect(
    stranger.create(
      { workoutId: w.id },
      items.map((e) => e.id),
      90,
    ),
  ).rejects.toThrow('NOT_FOUND');
  expect(await s.db.all('SELECT * FROM sync_queue')).toEqual(before);
  const group = await s.supersets.create(
    { workoutId: w.id },
    items.map((e) => e.id),
    90,
  );
  await expect(
    s.supersets.create(
      { workoutId: w.id },
      items.map((e) => e.id),
      90,
    ),
  ).rejects.toThrow('INVALID_GROUP_MEMBERS');
  await s.training.finish(w.id);
  await expect(s.supersets.updateRest(group.id, 30)).rejects.toThrow(
    'WORKOUT_CLOSED',
  );
  const next = await s.training.start('Other');
  const item = await s.training.addExercise(next.id, items[0]!.exerciseId);
  await expect(
    s.db.transaction((tx) =>
      s.repo.save(
        'workout_exercises',
        { ...item, supersetGroupId: group.id },
        tx,
      ),
    ),
  ).rejects.toThrow('GROUP_PARENT_MISMATCH');
});
it('preserves fresh independent groups across routine, duplicate, export/import, workout and history copies', async () => {
  const { workout: w, items } = await workout(3);
  const original = await s.supersets.create(
    { workoutId: w.id },
    items.map((e) => e.id),
    150,
  );
  await s.training.finish(w.id);
  const routine = await s.workoutTemplates.saveAsRoutine(w.id, 'Template');
  const model = await s.routines.detail(routine.id);
  expect(model.groups[0]?.id).not.toBe(original.id);
  expect(model.groups[0]?.restSeconds).toBe(150);
  const duplicate = await s.routines.duplicate(routine.id, 'Clone');
  const clone = await s.routines.detail(duplicate.id);
  expect(clone.groups[0]?.id).not.toBe(model.groups[0]?.id);
  const text = await s.routineSharing.export(duplicate.id);
  expect(text).not.toContain(original.id);
  expect(text).not.toContain(s.ownerId);
  expect(JSON.parse(text).groups).toEqual([
    { members: [0, 1, 2], restSeconds: 150 },
  ]);
  const imported = await s.routineSharing.import(text);
  const importedDetail = await s.routines.detail(imported.id);
  expect(importedDetail.groups[0]?.id).not.toBe(clone.groups[0]?.id);
  await s.workoutTemplates.startRoutine(imported.id);
  let state = await s.training.state();
  const activeGroup = state.groups.find(
    (g) => g.workoutId === state.active?.id,
  )!;
  expect(activeGroup.id).not.toBe(importedDetail.groups[0]?.id);
  await s.supersets.updateRest(activeGroup.id, 45);
  expect((await s.routines.detail(imported.id)).groups[0]?.restSeconds).toBe(
    150,
  );
  await s.training.finish(state.active!.id, true);
  const repeat = await s.workoutTemplates.repeatWorkout(w.id);
  state = await s.training.state();
  expect(state.groups.find((g) => g.workoutId === repeat.id)?.restSeconds).toBe(
    150,
  );
  expect(
    state.sets
      .filter((set) =>
        state.workoutExercises.some(
          (e) => e.workoutId === repeat.id && e.id === set.workoutExerciseId,
        ),
      )
      .every((set) => !set.completedAt),
  ).toBe(true);
});
it('imports legacy v1 and rejects overlapping, singleton, non-contiguous and out-of-bounds shared groups', async () => {
  const { workout: w, items } = await workout(3);
  await s.supersets.create(
    { workoutId: w.id },
    items.map((e) => e.id),
    90,
  );
  await s.training.finish(w.id);
  const routine = await s.workoutTemplates.saveAsRoutine(w.id, 'Portable');
  const payload = JSON.parse(await s.routineSharing.export(routine.id));
  const queue = await s.db.all('SELECT * FROM sync_queue');
  for (const groups of [
    [{ members: [0], restSeconds: 90 }],
    [{ members: [0, 2], restSeconds: 90 }],
    [{ members: [1, 2, 3], restSeconds: 90 }],
    [
      { members: [0, 1], restSeconds: 90 },
      { members: [1, 2], restSeconds: 90 },
    ],
  ])
    await expect(async () =>
      s.routineSharing.import(JSON.stringify({ ...payload, groups })),
    ).rejects.toThrow();
  expect(await s.db.all('SELECT * FROM sync_queue')).toEqual(queue);
  delete payload.groups;
  payload.version = 1;
  const legacy = await s.routineSharing.import(JSON.stringify(payload));
  expect((await s.routines.detail(legacy.id)).groups).toEqual([]);
});
it('rolls back creation, reordering and dissolution when outbox writes fail', async () => {
  const { workout: w, items } = await workout(3);
  const reject = () =>
    s.db.exec(
      "CREATE TRIGGER reject_groups BEFORE INSERT ON sync_queue WHEN NEW.entity_type='workout_exercises' BEGIN SELECT RAISE(ABORT,'DISK_FULL'); END;",
    );
  await reject();
  await expect(
    s.supersets.create(
      { workoutId: w.id },
      items.map((e) => e.id),
      90,
    ),
  ).rejects.toThrow('DISK_FULL');
  expect((await s.training.state()).groups).toEqual([]);
  await s.db.exec('DROP TRIGGER reject_groups');
  const group = await s.supersets.create(
    { workoutId: w.id },
    items.map((e) => e.id),
    90,
  );
  const before = await s.training.state();
  const queue = await s.db.all('SELECT * FROM sync_queue');
  await reject();
  await expect(s.supersets.dissolve(group.id)).rejects.toThrow('DISK_FULL');
  await expect(
    s.supersets.reorder({ workoutId: w.id }, items.map((e) => e.id).reverse()),
  ).rejects.toThrow('DISK_FULL');
  expect(await s.training.state()).toEqual(before);
  expect(await s.db.all('SELECT * FROM sync_queue')).toEqual(queue);
});
it('dissolves a routine group when removing a member and leaves workouts independent', async () => {
  const { workout: w, items } = await workout(3);
  await s.supersets.create(
    { workoutId: w.id },
    items.map((e) => e.id),
    90,
  );
  await s.training.finish(w.id);
  const routine = await s.workoutTemplates.saveAsRoutine(w.id, 'Remove');
  const detail = await s.routines.detail(routine.id);
  await s.routines.removeExercise(detail.exercises[0]!.item.id);
  const after = await s.routines.detail(routine.id);
  expect(after.groups).toEqual([]);
  expect(after.exercises.every((e) => e.item.supersetGroupId === null)).toBe(
    true,
  );
  expect((await s.training.state()).groups).toHaveLength(1);
  await s.routines.remove(routine.id);
  expect((await s.training.state()).history).toHaveLength(1);
});
it('reopens a grouped active workout and retains timer, circuit order and outbox', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'gymtrack-groups-'));
  const path = join(directory, 'data.db');
  s.close();
  s = await setup(path);
  try {
    const { workout: w, items } = await workout(2);
    await s.supersets.create(
      { workoutId: w.id },
      items.map((e) => e.id),
      75,
    );
    let state = await s.training.state();
    const sequence = circuitSequence(state.workoutExercises, state.sets);
    await s.training.completeSet(sequence[0]!.id, true);
    await s.training.completeSet(sequence[1]!.id, true);
    state = await s.training.state();
    const queue = await s.db.all('SELECT * FROM sync_queue');
    const owner = s.ownerId;
    s.close();
    s = await setup(path, owner);
    expect(await s.training.state()).toEqual(state);
    expect(await s.db.all('SELECT * FROM sync_queue')).toEqual(queue);
    await s.training.addSet(items[0]!.id);
    expect((await s.training.state()).active?.restEndsAt).toBeNull();
  } finally {
    s.close();
    s = await setup();
    rmSync(directory, { recursive: true });
  }
});
it('upgrades a real v2 database without rewriting payloads or its pending queue', async () => {
  const old = nodeDatabase();
  try {
    await old.db.exec(
      'PRAGMA foreign_keys=ON; CREATE TABLE schema_migrations(version INTEGER PRIMARY KEY);',
    );
    for (const migration of migrations.slice(0, 2)) {
      await old.db.exec(migration.sql);
      await old.db.run('INSERT INTO schema_migrations VALUES (?)', [
        migration.version,
      ]);
    }
    const repo = new EntityRepository(old.db, randomUUID(), s.repo.runtime);
    const training = new TrainingService(repo);
    await training.start('Legacy active');
    const data = await old.db.all('SELECT * FROM workouts');
    const queue = await old.db.all('SELECT * FROM sync_queue');
    await migrate(old.db);
    await migrate(old.db);
    expect(await old.db.all('SELECT * FROM workouts')).toEqual(data);
    expect(await old.db.all('SELECT * FROM sync_queue')).toEqual(queue);
    expect((await training.state()).groups).toEqual([]);
  } finally {
    old.close();
  }
});

it('rolls back a grouped workout copy if a later set write fails', async () => {
  const { workout: w, items } = await workout(2);
  await s.supersets.create(
    { workoutId: w.id },
    items.map((e) => e.id),
    60,
  );
  await s.training.finish(w.id);
  const routine = await s.workoutTemplates.saveAsRoutine(w.id, 'Source');
  const before = await s.training.state();
  const queue = await s.db.all('SELECT * FROM sync_queue');
  const groups = await s.repo.list('superset_groups');
  await s.db.exec(
    "CREATE TRIGGER reject_grouped_copy BEFORE INSERT ON workout_sets BEGIN SELECT RAISE(ABORT,'DISK_FULL'); END;",
  );
  await expect(s.workoutTemplates.startRoutine(routine.id)).rejects.toThrow(
    'DISK_FULL',
  );
  expect(await s.training.state()).toEqual(before);
  expect(await s.db.all('SELECT * FROM sync_queue')).toEqual(queue);
  expect(await s.repo.list('superset_groups')).toEqual(groups);
});

it('refuses an inconsistent source group instead of silently dropping it during copy/export', async () => {
  const { workout: w, items } = await workout(2);
  await s.supersets.create(
    { workoutId: w.id },
    items.map((e) => e.id),
    60,
  );
  await s.training.finish(w.id);
  const routine = await s.workoutTemplates.saveAsRoutine(w.id, 'Source');
  const group = (await s.routines.detail(routine.id)).groups[0]!;
  // Simulate inconsistent incoming data, bypassing the domain dissolution command.
  await s.db.transaction((tx) =>
    s.repo.save('superset_groups', { ...group, deletedAt: s.clock.value }, tx),
  );
  const queue = await s.db.all('SELECT * FROM sync_queue');
  await expect(s.routines.duplicate(routine.id, 'Copy')).rejects.toThrow(
    'NOT_FOUND',
  );
  await expect(s.workoutTemplates.startRoutine(routine.id)).rejects.toThrow(
    'NOT_FOUND',
  );
  await expect(s.routineSharing.export(routine.id)).rejects.toThrow(
    'MISSING_GROUP',
  );
  expect(await s.db.all('SELECT * FROM sync_queue')).toEqual(queue);
});
