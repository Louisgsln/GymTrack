import { randomUUID } from 'node:crypto';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { beforeEach, afterEach, expect, it } from 'vitest';
import { setup, nodeDatabase, exerciseInput } from './helpers/database';
import { EntityRepository } from '../src/repositories/entities';
import { ProgramService } from '../src/services/programs';
import { migrate, migrations } from '../src/database/migrations';
let s: Awaited<ReturnType<typeof setup>>;
beforeEach(async () => {
  s = await setup();
});
afterEach(() => s.close());
async function routine(name = 'Push') {
  const model = await s.routines.create(name);
  const exercise = await s.training.createExercise({
    ...exerciseInput,
    name: `${name} press`,
  });
  const item = await s.routines.addExercise(model.id, exercise.id);
  const set = (await s.routines.detail(model.id)).exercises[0]!.sets[0]!;
  await s.routines.updateSet(set.id, { weightKg: 50, reps: 8 });
  return { model, item, set };
}
it('composes a six-entry PPL from three shared routines with independent occurrence IDs', async () => {
  const program = await s.programs.create('PPL 6 Days');
  const models = await Promise.all(
    ['Push', 'Pull', 'Legs'].map((name) => s.routines.create(name)),
  );
  const entries = [];
  for (let index = 0; index < 6; index++)
    entries.push(
      await s.programs.addRoutine(program.id, models[index % 3]!.id),
    );
  expect(new Set(entries.map((e) => e.id)).size).toBe(6);
  expect(
    (await s.programs.detail(program.id)).entries.map((e) => e.routine.name),
  ).toEqual(['Push', 'Pull', 'Legs', 'Push', 'Pull', 'Legs']);
  await s.programs.reorderRoutines(
    program.id,
    entries.map((e) => e.id).reverse(),
  );
  await s.programs.update(program.id, { name: 'PPL', notes: 'Six sessions' });
  expect((await s.programs.detail(program.id)).program).toMatchObject({
    name: 'PPL',
    notes: 'Six sessions',
  });
  await s.programs.removeRoutine(entries[0]!.id);
  expect((await s.programs.detail(program.id)).entries).toHaveLength(5);
  expect(await s.routines.list()).toHaveLength(3);
});
it('duplicates program and occurrence IDs while deliberately sharing live routine references', async () => {
  const program = await s.programs.create('Upper Lower');
  const { model } = await routine();
  const entry = await s.programs.addRoutine(program.id, model.id);
  const copy = await s.programs.duplicate(program.id, 'Copy');
  const detail = await s.programs.detail(copy.id);
  expect(copy.id).not.toBe(program.id);
  expect(detail.entries[0]!.item.id).not.toBe(entry.id);
  expect(detail.entries[0]!.item.routineId).toBe(model.id);
  await s.routines.update(model.id, { name: 'Updated Push' });
  expect((await s.programs.detail(copy.id)).entries[0]!.routine.name).toBe(
    'Updated Push',
  );
  await s.programs.reorder([copy.id, program.id]);
  expect((await s.programs.list()).map((p) => p.id)).toEqual([
    copy.id,
    program.id,
  ]);
});
it('starts a routine snapshot with groups and refuses to replace an active workout', async () => {
  const program = await s.programs.create('Strength');
  const { model, item, set } = await routine();
  const exercise = await s.training.createExercise({
    ...exerciseInput,
    name: 'Fly',
  });
  const second = await s.routines.addExercise(model.id, exercise.id);
  await s.supersets.create({ routineId: model.id }, [item.id, second.id], 120);
  const entry = await s.programs.addRoutine(program.id, model.id);
  const workout = await s.programs.startEntry(entry.id);
  let state = await s.training.state();
  expect(state.active?.id).toBe(workout.id);
  expect(
    state.groups.find((g) => g.workoutId === workout.id)?.restSeconds,
  ).toBe(120);
  expect(state.sets[0]).toMatchObject({
    weightKg: 50,
    reps: 8,
    completedAt: null,
  });
  await s.routines.updateSet(set.id, { weightKg: 80 });
  await expect(s.programs.startEntry(entry.id)).rejects.toThrow(
    'WORKOUT_ACTIVE',
  );
  state = await s.training.state();
  expect(state.sets[0]!.weightKg).toBe(50);
  await s.programs.remove(program.id);
  expect((await s.training.state()).active?.id).toBe(workout.id);
  expect((await s.routines.detail(model.id)).exercises).toHaveLength(2);
});
it('removes deleted routine occurrences from every program without losing existing workouts', async () => {
  const a = await s.programs.create('A');
  const b = await s.programs.create('B');
  const { model } = await routine();
  const first = await s.programs.addRoutine(a.id, model.id);
  await s.programs.addRoutine(a.id, model.id);
  await s.programs.addRoutine(b.id, model.id);
  const workout = await s.programs.startEntry(first.id);
  const before = await s.training.state();
  await s.routines.remove(model.id);
  expect((await s.programs.detail(a.id)).entries).toEqual([]);
  expect((await s.programs.detail(b.id)).entries).toEqual([]);
  expect(
    (await s.repo.list('program_routines')).every((e) => !!e.deletedAt),
  ).toBe(true);
  expect(await s.training.state()).toEqual(before);
  expect(workout.routineId).toBe(model.id);
  await expect(s.programs.startEntry(first.id)).rejects.toThrow('NOT_FOUND');
});
it('rejects foreign routines/programs, invalid permutations and deleted entries without partial changes', async () => {
  const program = await s.programs.create('A');
  const other = await s.programs.create('B');
  const { model } = await routine();
  const first = await s.programs.addRoutine(program.id, model.id);
  const second = await s.programs.addRoutine(other.id, model.id);
  const repo = new EntityRepository(s.db, randomUUID(), s.repo.runtime);
  const foreign = new ProgramService(repo);
  const foreignProgram = await foreign.create('Foreign');
  const queue = await s.db.all('SELECT * FROM sync_queue');
  await expect(foreign.addRoutine(foreignProgram.id, model.id)).rejects.toThrow(
    'NOT_FOUND',
  );
  await expect(foreign.detail(program.id)).rejects.toThrow('NOT_FOUND');
  await expect(
    s.programs.reorderRoutines(program.id, [second.id]),
  ).rejects.toThrow('INVALID_ORDER');
  await expect(s.programs.reorder([program.id, program.id])).rejects.toThrow(
    'INVALID_ORDER',
  );
  await expect(s.programs.create(' ')).rejects.toThrow();
  await expect(
    s.db.transaction((tx) =>
      s.repo.save(
        'program_routines',
        {
          ...s.repo.base(),
          programId: foreignProgram.id,
          routineId: model.id,
          position: 0,
          deletedAt: null,
        },
        tx,
      ),
    ),
  ).rejects.toThrow('FOREIGN KEY');
  expect(await s.db.all('SELECT * FROM sync_queue')).toEqual(queue);
  await s.programs.removeRoutine(first.id);
  await expect(s.programs.startEntry(first.id)).rejects.toThrow('NOT_FOUND');
});
it('rolls back program copies, deletion and linked routine removal on outbox failure', async () => {
  const program = await s.programs.create('A');
  const { model } = await routine();
  await s.programs.addRoutine(program.id, model.id);
  await s.programs.addRoutine(program.id, model.id);
  const before = await s.programs.detail(program.id);
  const queue = await s.db.all('SELECT * FROM sync_queue');
  await s.db.exec(
    "CREATE TRIGGER reject_program_queue BEFORE INSERT ON sync_queue WHEN NEW.entity_type='program_routines' BEGIN SELECT RAISE(ABORT,'DISK_FULL'); END;",
  );
  await expect(s.programs.duplicate(program.id, 'Copy')).rejects.toThrow(
    'DISK_FULL',
  );
  await expect(s.programs.remove(program.id)).rejects.toThrow('DISK_FULL');
  await expect(s.routines.remove(model.id)).rejects.toThrow('DISK_FULL');
  expect(await s.programs.list()).toHaveLength(1);
  expect(await s.programs.detail(program.id)).toEqual(before);
  expect((await s.routines.detail(model.id)).routine.deletedAt).toBeNull();
  expect(await s.db.all('SELECT * FROM sync_queue')).toEqual(queue);
});
it('rejects empty routine starts, serializes concurrent starts and rolls back a failed snapshot', async () => {
  const program = await s.programs.create('A');
  const empty = await s.routines.create('Empty');
  const emptyEntry = await s.programs.addRoutine(program.id, empty.id);
  await expect(s.programs.startEntry(emptyEntry.id)).rejects.toThrow(
    'EMPTY_ROUTINE',
  );
  const { model } = await routine();
  const entry = await s.programs.addRoutine(program.id, model.id);
  const queue = await s.db.all('SELECT * FROM sync_queue');
  await s.db.exec(
    "CREATE TRIGGER reject_program_start BEFORE INSERT ON workout_sets BEGIN SELECT RAISE(ABORT,'DISK_FULL'); END;",
  );
  await expect(s.programs.startEntry(entry.id)).rejects.toThrow('DISK_FULL');
  expect((await s.training.state()).active).toBeNull();
  expect(await s.db.all('SELECT * FROM sync_queue')).toEqual(queue);
  await s.db.exec('DROP TRIGGER reject_program_start');
  const results = await Promise.allSettled([
    s.programs.startEntry(entry.id),
    s.programs.startEntry(entry.id),
  ]);
  expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(1);
});
it('reopens program composition from SQLite without emitting new operations', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'gymtrack-programs-'));
  const path = join(dir, 'data.db');
  s.close();
  s = await setup(path);
  try {
    const program = await s.programs.create('PPL');
    const { model } = await routine();
    await s.programs.addRoutine(program.id, model.id);
    const before = await s.programs.detail(program.id);
    const queue = await s.db.all('SELECT * FROM sync_queue');
    const owner = s.ownerId;
    s.close();
    s = await setup(path, owner);
    expect(await s.programs.detail(program.id)).toEqual(before);
    expect(await s.db.all('SELECT * FROM sync_queue')).toEqual(queue);
  } finally {
    s.close();
    s = await setup();
    rmSync(dir, { recursive: true });
  }
});
it('upgrades a real v4 database without rewriting routine data or pending operations', async () => {
  const old = nodeDatabase();
  try {
    await old.db.exec(
      'PRAGMA foreign_keys=ON; CREATE TABLE schema_migrations(version INTEGER PRIMARY KEY);',
    );
    for (const migration of migrations.slice(0, 4)) {
      await old.db.exec(migration.sql);
      await old.db.run('INSERT INTO schema_migrations VALUES (?)', [
        migration.version,
      ]);
    }
    const base = s.repo.base();
    const payload = JSON.stringify({
      ...base,
      name: 'Legacy',
      notes: '',
      folderId: null,
      position: 0,
      deletedAt: null,
    });
    await old.db.run(
      'INSERT INTO routines(id,owner_id,revision,payload,updated_at) VALUES (?,?,?,?,?)',
      [base.id, base.ownerId, 1, payload, base.updatedAt],
    );
    await old.db.run(
      "INSERT INTO sync_queue(operation_id,owner_id,entity_type,entity_id,operation,payload,base_revision,created_at,next_attempt_at) VALUES (?,?,'routines',?,'UPSERT',?,0,?,?)",
      [
        randomUUID(),
        base.ownerId,
        base.id,
        payload,
        base.updatedAt,
        base.updatedAt,
      ],
    );
    const rows = await old.db.all('SELECT * FROM routines');
    const queue = await old.db.all('SELECT * FROM sync_queue');
    await migrate(old.db);
    await migrate(old.db);
    expect(await old.db.all('SELECT * FROM routines')).toEqual(rows);
    expect(await old.db.all('SELECT * FROM sync_queue')).toEqual(queue);
    expect(
      await new ProgramService(
        new EntityRepository(old.db, base.ownerId, s.repo.runtime),
      ).list(),
    ).toEqual([]);
  } finally {
    old.close();
  }
});
