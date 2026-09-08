import { randomUUID } from 'node:crypto';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, expect, it } from 'vitest';
import { setup, nodeDatabase, exerciseInput } from './helpers/database';
import { migrate, migrations } from '../src/database/migrations';
import { RoutineFolderService } from '../src/services/routineFolders';
import { EntityRepository } from '../src/repositories/entities';
import { dropTarget, folderRows } from '../src/features/routines/folderDrag';
let s: Awaited<ReturnType<typeof setup>>;
beforeEach(async () => {
  s = await setup();
});
afterEach(() => s.close());
it('creates, renames and reorders folders; moves and inserts routines within isolated sibling lists', async () => {
  const a = await s.routineFolders.create('PPL');
  const b = await s.routineFolders.create('Travel');
  const push = await s.routines.create('Push', a.id);
  const pull = await s.routines.create('Pull', a.id);
  const legs = await s.routines.create('Legs');
  await s.routineFolders.rename(a.id, 'Push Pull Legs');
  await s.routineFolders.moveFolder(b.id, a.id);
  expect((await s.routineFolders.list()).map((f) => f.name)).toEqual([
    'Travel',
    'Push Pull Legs',
  ]);
  await s.routineFolders.moveRoutine(legs.id, a.id, pull.id);
  let library = await s.routineFolders.library();
  expect(
    library.routines.filter((r) => r.folderId === a.id).map((r) => r.name),
  ).toEqual(['Push', 'Legs', 'Pull']);
  await s.routines.reorder([pull.id, push.id, legs.id], a.id);
  await s.routineFolders.moveRoutine(push.id, b.id);
  library = await s.routineFolders.library();
  expect(
    library.routines
      .filter((r) => r.folderId === a.id)
      .map((r) => [r.name, r.position]),
  ).toEqual([
    ['Pull', 0],
    ['Legs', 1],
  ]);
  expect(library.routines.find((r) => r.id === push.id)).toMatchObject({
    folderId: b.id,
    position: 0,
  });
  const queue = await s.db.all('SELECT * FROM sync_queue');
  await s.routineFolders.moveRoutine(push.id, b.id, push.id);
  await s.routineFolders.moveFolder(a.id, a.id);
  expect(await s.db.all('SELECT * FROM sync_queue')).toEqual(queue);
});
it('deletes only the folder, appending its routines to unfiled without changing their graph or existing workout', async () => {
  const folder = await s.routineFolders.create('PPL');
  const root = await s.routines.create('Unfiled');
  const routine = await s.routines.create('Push', folder.id);
  const exercise = await s.training.createExercise(exerciseInput);
  await s.routines.addExercise(routine.id, exercise.id);
  const graph = (await s.routines.detail(routine.id)).exercises;
  await s.workoutTemplates.startRoutine(routine.id);
  const training = await s.training.state();
  await s.routineFolders.remove(folder.id);
  expect(
    (await s.routineFolders.library()).routines.map((r) => [
      r.id,
      r.folderId,
      r.position,
    ]),
  ).toEqual([
    [root.id, null, 0],
    [routine.id, null, 1],
  ]);
  expect((await s.routines.detail(routine.id)).exercises).toEqual(graph);
  expect(await s.training.state()).toEqual(training);
  expect(
    (await s.repo.get('routine_folders', folder.id)).deletedAt,
  ).toBeTruthy();
  await expect(s.routines.create('Invalid', folder.id)).rejects.toThrow(
    'NOT_FOUND',
  );
});
it('duplicates in the source folder while portable imports and history conversions start unfiled', async () => {
  const folder = await s.routineFolders.create('Private organisation');
  const routine = await s.routines.create('Push', folder.id);
  const exercise = await s.training.createExercise(exerciseInput);
  await s.routines.addExercise(routine.id, exercise.id);
  const duplicate = await s.routines.duplicate(routine.id, 'Copy');
  expect(duplicate).toMatchObject({ folderId: folder.id, position: 1 });
  const text = await s.routineSharing.export(routine.id);
  expect(text).not.toContain(folder.id);
  expect(text).not.toContain(folder.name);
  const imported = await s.routineSharing.import(text);
  expect(imported.folderId).toBeNull();
  const workout = await s.workoutTemplates.startRoutine(routine.id);
  await s.training.finish(workout.id);
  expect(
    (await s.workoutTemplates.saveAsRoutine(workout.id, 'History')).folderId,
  ).toBeNull();
});
it('rejects foreign owners, deleted folders and stale destination anchors without partial writes', async () => {
  const folder = await s.routineFolders.create('A');
  const other = await s.routineFolders.create('B');
  const routine = await s.routines.create('One', folder.id);
  const anchor = await s.routines.create('Two', other.id);
  const stranger = new EntityRepository(s.db, randomUUID(), s.repo.runtime);
  const foreignFolder = await new RoutineFolderService(stranger).create(
    'Foreign',
  );
  const queue = await s.db.all('SELECT * FROM sync_queue');
  await expect(
    s.routineFolders.moveRoutine(routine.id, foreignFolder.id),
  ).rejects.toThrow('NOT_FOUND');
  await expect(
    new RoutineFolderService(stranger).remove(folder.id),
  ).rejects.toThrow('NOT_FOUND');
  await expect(
    s.routineFolders.moveRoutine(routine.id, folder.id, anchor.id),
  ).rejects.toThrow('NOT_FOUND');
  await expect(
    s.routines.reorder([routine.id, anchor.id], folder.id),
  ).rejects.toThrow('INVALID_ORDER');
  await expect(
    s.routineFolders.reorder([folder.id, folder.id]),
  ).rejects.toThrow('INVALID_ORDER');
  await expect(s.routineFolders.rename(folder.id, '  ')).rejects.toThrow();
  await expect(
    s.db.transaction((tx) =>
      s.repo.save('routines', { ...routine, folderId: foreignFolder.id }, tx),
    ),
  ).rejects.toThrow('FOLDER_OWNER_MISMATCH');
  expect(await s.db.all('SELECT * FROM sync_queue')).toEqual(queue);
});
it('rolls back folder deletion and cross-folder movement on an outbox failure after earlier changes', async () => {
  const folder = await s.routineFolders.create('A');
  const a = await s.routines.create('One', folder.id);
  const b = await s.routines.create('Two', folder.id);
  const before = await s.routineFolders.library();
  const queue = await s.db.all('SELECT * FROM sync_queue');
  await s.db.exec(
    `CREATE TRIGGER reject_folder_queue BEFORE INSERT ON sync_queue WHEN NEW.entity_id='${b.id}' BEGIN SELECT RAISE(ABORT,'DISK_FULL'); END;`,
  );
  await expect(s.routineFolders.remove(folder.id)).rejects.toThrow('DISK_FULL');
  await expect(s.routineFolders.moveRoutine(a.id, null)).rejects.toThrow(
    'DISK_FULL',
  );
  expect(await s.routineFolders.library()).toEqual(before);
  expect(await s.db.all('SELECT * FROM sync_queue')).toEqual(queue);
});
it('serializes competing moves without duplicates or gaps and preserves final membership', async () => {
  const folder = await s.routineFolders.create('A');
  const a = await s.routines.create('One');
  const b = await s.routines.create('Two');
  await Promise.all([
    s.routineFolders.moveRoutine(a.id, folder.id),
    s.routineFolders.moveRoutine(b.id, folder.id),
  ]);
  expect(
    (await s.routineFolders.library()).routines.map((r) => r.position),
  ).toEqual([0, 1]);
  await Promise.all([
    s.routineFolders.moveRoutine(a.id, null),
    s.routineFolders.moveRoutine(a.id, folder.id),
  ]);
  const rows = (await s.routineFolders.library()).routines;
  expect(rows.map((r) => r.folderId)).toEqual([folder.id, folder.id]);
  expect(rows.map((r) => r.position)).toEqual([0, 1]);
});
it('reopens a real database with identical folder membership/order and no read-side outbox writes', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'gymtrack-folders-'));
  const path = join(dir, 'data.db');
  s.close();
  s = await setup(path);
  try {
    const folder = await s.routineFolders.create('PPL');
    await s.routines.create('Push', folder.id);
    const expected = await s.routineFolders.library();
    const queue = await s.db.all('SELECT * FROM sync_queue');
    const owner = s.ownerId;
    s.close();
    s = await setup(path, owner);
    expect(await s.routineFolders.library()).toEqual(expected);
    expect(await s.db.all('SELECT * FROM sync_queue')).toEqual(queue);
    expect(
      await new RoutineFolderService(
        new EntityRepository(s.db, randomUUID(), s.repo.runtime),
      ).library(),
    ).toEqual({ folders: [], routines: [] });
  } finally {
    s.close();
    s = await setup();
    rmSync(dir, { recursive: true });
  }
});
it('upgrades v3 routines without rewriting old payloads or pending operations', async () => {
  const old = nodeDatabase();
  try {
    await old.db.exec(
      'PRAGMA foreign_keys=ON; CREATE TABLE schema_migrations(version INTEGER PRIMARY KEY);',
    );
    for (const migration of migrations.slice(0, 3)) {
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
    const queue = await old.db.all('SELECT * FROM sync_queue');
    await migrate(old.db);
    await migrate(old.db);
    expect(
      (await old.db.first<{ payload: string }>('SELECT payload FROM routines'))
        ?.payload,
    ).toBe(payload);
    expect(await old.db.all('SELECT * FROM sync_queue')).toEqual(queue);
    const library = await new RoutineFolderService(
      new EntityRepository(old.db, base.ownerId, s.repo.runtime),
    ).library();
    expect(library.routines[0]?.folderId).toBeNull();
  } finally {
    old.close();
  }
});
it('resolves only eligible measured drop targets and cancels outside, self and invalid drops', async () => {
  const f = await s.routineFolders.create('A');
  const r = await s.routines.create('One');
  const rows = folderRows([f], [r], 'Root', 'End');
  const rects = rows.map((row, index) => ({
    row,
    x: 10,
    y: index * 60,
    width: 200,
    height: 50,
  }));
  const source = rows.find((row) => row.id === r.id)!;
  expect(dropTarget(source, rects, 20, 125)?.id).toBe(f.id);
  expect(dropTarget(source, rects, 500, 125)).toBeNull();
  expect(dropTarget(source, rects, 20, 65)).toBeNull();
  expect(dropTarget(source, rects, NaN, 125)).toBeNull();
  const folder = rows.find((row) => row.id === f.id)!;
  expect(dropTarget(folder, rects, 20, 65)).toBeNull();
  expect(dropTarget(folder, rects, 20, 185)?.kind).toBe('end');
});
