import { readFileSync, readdirSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { PGlite } from '@electric-sql/pglite';
import { beforeAll, afterAll, it, expect } from 'vitest';
import { setup, startWithSet, exerciseInput } from './helpers/database';
import type { SyncOperation } from '../src/sync/engine';
import { SyncEngine } from '../src/sync/engine';

let pg: PGlite;
const ownerA = randomUUID();
const ownerB = randomUUID();
it('syncs programs, repeated routine occurrences, starts and tombstones with owner constraints', async () => {
  const owner = randomUUID();
  await pg.exec('reset role');
  await pg.query('insert into auth.users(id) values ($1)', [owner]);
  const s = await setup(':memory:', owner);
  try {
    const routine = await s.routines.create('Push');
    const exercise = await s.training.createExercise(exerciseInput);
    await s.routines.addExercise(routine.id, exercise.id);
    const program = await s.programs.create('PPL');
    const entry = await s.programs.addRoutine(program.id, routine.id);
    await s.programs.addRoutine(program.id, routine.id);
    const copy = await s.programs.duplicate(program.id, 'Copy');
    const workout = await s.programs.startEntry(entry.id);
    await s.programs.remove(program.id);
    const ops = await s.db.all<SyncOperation>(
      'SELECT * FROM sync_queue ORDER BY rowid',
    );
    await pg.exec('set role authenticated');
    for (const op of ops)
      expect((await push(op, owner)).rows[0]?.result).toBe('APPLIED');
    expect((await push(ops.at(-1)!, owner)).rows[0]?.result).toBe('DUPLICATE');
    expect(
      (
        await pg.query(
          "select id from public.program_routines where program_id=$1 and payload->>'deletedAt' is null",
          [copy.id],
        )
      ).rows,
    ).toHaveLength(2);
    expect(
      (
        await pg.query('select id from public.workouts where id=$1', [
          workout.id,
        ])
      ).rows,
    ).toHaveLength(1);
    const parentOp = ops.find((op) => op.entity_type === 'programs')!;
    const foreignId = randomUUID();
    await push(
      {
        ...parentOp,
        operation_id: randomUUID(),
        entity_id: foreignId,
        base_revision: 0,
        payload: JSON.stringify({
          ...JSON.parse(parentOp.payload),
          id: foreignId,
          ownerId: ownerB,
          revision: 1,
        }),
      },
      ownerB,
    );
    const childOp = ops.find((op) => op.entity_type === 'program_routines')!;
    const fakeId = randomUUID();
    await expect(
      push(
        {
          ...childOp,
          operation_id: randomUUID(),
          entity_id: fakeId,
          base_revision: 0,
          payload: JSON.stringify({
            ...JSON.parse(childOp.payload),
            id: fakeId,
            programId: foreignId,
            revision: 1,
          }),
        },
        owner,
      ),
    ).rejects.toThrow('foreign key');
    await s.routines.remove(routine.id);
    for (const op of (
      await s.db.all<SyncOperation>('SELECT * FROM sync_queue ORDER BY rowid')
    ).slice(ops.length))
      expect((await push(op, owner)).rows[0]?.result).toBe('APPLIED');
    expect(
      (
        await pg.query(
          "select id from public.program_routines where program_id=$1 and payload->>'deletedAt' is null",
          [copy.id],
        )
      ).rows,
    ).toHaveLength(0);
    await pg.query("select set_config('request.jwt.claim.sub',$1,false)", [
      ownerB,
    ]);
    expect(
      (await pg.query('select * from public.programs where id=$1', [copy.id]))
        .rows,
    ).toHaveLength(0);
    await expect(
      pg.query('delete from public.program_routines'),
    ).rejects.toThrow('permission denied');
  } finally {
    await pg.exec('reset role');
    s.close();
  }
});
it('syncs folder membership and safe deletion, and enforces owner-only folder references', async () => {
  const owner = randomUUID();
  await pg.exec('reset role');
  await pg.query('insert into auth.users(id) values ($1)', [owner]);
  const s = await setup(':memory:', owner);
  try {
    const folder = await s.routineFolders.create('PPL');
    const other = await s.routineFolders.create('Travel');
    const routine = await s.routines.create('Push', folder.id);
    const exercise = await s.training.createExercise(exerciseInput);
    await s.routines.addExercise(routine.id, exercise.id);
    const workout = await s.workoutTemplates.startRoutine(routine.id);
    await s.routineFolders.rename(folder.id, 'Training');
    await s.routineFolders.moveRoutine(routine.id, other.id);
    await s.routineFolders.remove(other.id);
    const ops = await s.db.all<SyncOperation>(
      'SELECT * FROM sync_queue ORDER BY rowid',
    );
    await pg.exec('set role authenticated');
    for (const op of ops)
      expect((await push(op, owner)).rows[0]?.result).toBe('APPLIED');
    expect((await push(ops.at(-1)!, owner)).rows[0]?.result).toBe('DUPLICATE');
    expect(
      (
        await pg.query<{ folder_id: string | null }>(
          'select folder_id from public.routines where id=$1',
          [routine.id],
        )
      ).rows[0]?.folder_id,
    ).toBeNull();
    expect(
      (
        await pg.query('select id from public.workouts where id=$1', [
          workout.id,
        ])
      ).rows,
    ).toHaveLength(1);
    const folderOp = ops.find((op) => op.entity_type === 'routine_folders')!;
    const foreignId = randomUUID();
    await push(
      {
        ...folderOp,
        operation_id: randomUUID(),
        entity_id: foreignId,
        base_revision: 0,
        payload: JSON.stringify({
          ...JSON.parse(folderOp.payload),
          id: foreignId,
          ownerId: ownerB,
          revision: 1,
        }),
      },
      ownerB,
    );
    const routineOp = ops.find((op) => op.entity_type === 'routines')!;
    const fakeId = randomUUID();
    await expect(
      push(
        {
          ...routineOp,
          operation_id: randomUUID(),
          entity_id: fakeId,
          base_revision: 0,
          payload: JSON.stringify({
            ...JSON.parse(routineOp.payload),
            id: fakeId,
            folderId: foreignId,
            revision: 1,
          }),
        },
        owner,
      ),
    ).rejects.toThrow('foreign key');
    await pg.query("select set_config('request.jwt.claim.sub',$1,false)", [
      ownerB,
    ]);
    expect(
      (
        await pg.query('select * from public.routine_folders where id=$1', [
          folder.id,
        ])
      ).rows,
    ).toHaveLength(0);
    await expect(
      pg.query('delete from public.routine_folders'),
    ).rejects.toThrow('permission denied');
  } finally {
    await pg.exec('reset role');
    s.close();
  }
});
it('syncs group creation, copies and tombstones with owner and parent constraints', async () => {
  const owner = randomUUID();
  await pg.exec('reset role');
  await pg.query('insert into auth.users(id) values ($1)', [owner]);
  const s = await setup(':memory:', owner);
  try {
    const w = await s.training.start('Superset');
    const members = [];
    for (const name of ['Press', 'Fly', 'Row']) {
      const exercise = await s.training.createExercise({
        ...exerciseInput,
        name,
      });
      members.push(await s.training.addExercise(w.id, exercise.id));
    }
    const original = await s.supersets.create(
      { workoutId: w.id },
      members.map((e) => e.id),
      90,
    );
    await s.supersets.updateRest(original.id, 120);
    await s.training.finish(w.id);
    const routine = await s.workoutTemplates.saveAsRoutine(w.id, 'Model');
    const active = await s.workoutTemplates.startRoutine(routine.id);
    const copied = (await s.training.state()).groups.find(
      (g) => g.workoutId === active.id,
    )!;
    await s.routines.remove(routine.id);
    const operations = await s.db.all<SyncOperation>(
      'select * from sync_queue order by rowid',
    );
    await pg.exec('set role authenticated');
    for (const op of operations)
      expect((await push(op, owner)).rows[0]?.result).toBe('APPLIED');
    expect((await push(operations.at(-1)!, owner)).rows[0]?.result).toBe(
      'DUPLICATE',
    );
    expect(
      (
        await pg.query(
          'select id from public.workout_exercises where superset_group_id=$1',
          [copied.id],
        )
      ).rows,
    ).toHaveLength(3);
    const templateGroups = await pg.query<{ payload: { deletedAt: string } }>(
      'select payload from public.superset_groups where routine_id=$1',
      [routine.id],
    );
    expect(templateGroups.rows[0]?.payload.deletedAt).toBeTruthy();
    const fakeId = randomUUID();
    const base = operations.find((op) => op.entity_type === 'superset_groups')!;
    await expect(
      push(
        {
          ...base,
          operation_id: randomUUID(),
          entity_id: fakeId,
          base_revision: 0,
          payload: JSON.stringify({
            ...JSON.parse(base.payload),
            id: fakeId,
            revision: 1,
            restSeconds: -1,
          }),
        },
        owner,
      ),
    ).rejects.toThrow();
    const childOp = operations.find(
      (op) => op.entity_type === 'workout_exercises',
    )!;
    const childId = randomUUID();
    await expect(
      push(
        {
          ...childOp,
          operation_id: randomUUID(),
          entity_id: childId,
          base_revision: 0,
          payload: JSON.stringify({
            ...JSON.parse(childOp.payload),
            id: childId,
            revision: 1,
            supersetGroupId: copied.id,
          }),
        },
        owner,
      ),
    ).rejects.toThrow('foreign key');
    await pg.query("select set_config('request.jwt.claim.sub',$1,false)", [
      ownerB,
    ]);
    expect(
      (
        await pg.query('select * from public.superset_groups where id=$1', [
          copied.id,
        ])
      ).rows,
    ).toHaveLength(0);
    await expect(
      pg.query('delete from public.superset_groups'),
    ).rejects.toThrow('permission denied');
  } finally {
    await pg.exec('reset role');
    s.close();
  }
});
beforeAll(async () => {
  pg = new PGlite();
  await pg.exec(`
    create role anon; create role authenticated;
    create schema auth;
    create table auth.users(id uuid primary key);
    create function auth.uid() returns uuid language sql stable as $$
      select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
    $$;
    grant usage on schema auth, public to authenticated, anon;
    grant execute on function auth.uid() to authenticated, anon;
  `);
  for (const file of readdirSync('supabase/migrations')
    .filter((name) => name.endsWith('.sql'))
    .sort())
    await pg.exec(readFileSync(`supabase/migrations/${file}`, 'utf8'));
  await pg.query('insert into auth.users(id) values ($1),($2)', [
    ownerA,
    ownerB,
  ]);
}, 30000);
afterAll(async () => {
  await pg.close();
});
async function push(op: SyncOperation, userId: string = ownerA) {
  await pg.query("select set_config('request.jwt.claim.sub', $1, false)", [
    userId,
  ]);
  return pg.query<{ result: string }>(
    'select public.apply_local_operation($1,$2,$3,$4,$5::jsonb) as result',
    [
      op.operation_id,
      op.entity_type,
      op.entity_id,
      op.base_revision,
      op.payload,
    ],
  );
}
it('applies actual local outbox payloads to PostgreSQL and handles duplicate/conflicting writes', async () => {
  const s = await setup(':memory:', ownerA);
  try {
    const { set } = await startWithSet(s);
    await s.training.updateSet(set.id, { weightKg: 100, reps: 8, rpe: 8 });
    await s.training.completeSet(set.id, true);
    await s.nutrition.quickAdd({
      name: 'Meal',
      diaryDate: '2026-09-05',
      meal: 'Lunch',
      nutrients: { energy_kcal: { value: 99, unit: 'kcal' } },
    });
    const ops = await s.db.all<SyncOperation>(
      'select * from sync_queue order by rowid',
    );
    await pg.exec('set role authenticated');
    for (const op of ops)
      expect((await push(op)).rows[0]?.result).toBe('APPLIED');
    const last = ops.at(-1)!;
    expect((await push(last)).rows[0]?.result).toBe('DUPLICATE');
    expect(
      (await push({ ...last, operation_id: randomUUID() })).rows[0]?.result,
    ).toBe('CONFLICT');
    await expect(
      push({ ...last, operation_id: randomUUID() }, ownerB),
    ).rejects.toThrow('INVALID_PAYLOAD');
    await pg.query("select set_config('request.jwt.claim.sub', $1, false)", [
      ownerB,
    ]);
    expect((await pg.query('select * from public.workouts')).rows).toHaveLength(
      0,
    );
    await pg.query("select set_config('request.jwt.claim.sub', $1, false)", [
      ownerA,
    ]);
    expect((await pg.query('select * from public.workouts')).rows).toHaveLength(
      1,
    );
    await expect(
      pg.query("update public.workouts set payload='{}'"),
    ).rejects.toThrow('permission denied');
  } finally {
    await pg.exec('reset role');
    s.close();
  }
});
it('refuses unauthenticated access and injected table names', async () => {
  const s = await setup(':memory:', ownerB);
  try {
    await s.training.start('B');
    const op = (await s.db.all<SyncOperation>('select * from sync_queue'))[0]!;
    await pg.exec('set role authenticated');
    await expect(push(op, '')).rejects.toThrow('AUTH_REQUIRED');
    await pg.query("select set_config('request.jwt.claim.sub', $1, false)", [
      ownerB,
    ]);
    await expect(
      pg.query(
        "select public.apply_local_operation($1,'workouts; drop table profiles',$2,0,$3)",
        [randomUUID(), op.entity_id, op.payload],
      ),
    ).rejects.toThrow('INVALID_ENTITY');
    const parent = await pg.query<{ id: string }>(
      'select id from public.workouts',
    );
    expect(parent.rows).toHaveLength(0);
  } finally {
    await pg.exec('reset role');
    s.close();
  }
});
it('enforces composite ownership foreign keys and rejects invalid set values', async () => {
  const s = await setup(':memory:', ownerB);
  try {
    const { set, item } = await startWithSet(s);
    const ops = await s.db.all<SyncOperation>(
      'select * from sync_queue order by rowid',
    );
    const parentA = (
      await pg.query<{ id: string }>(
        'select id from public.workout_exercises where owner_id=$1 limit 1',
        [ownerA],
      )
    ).rows[0]!;
    await pg.exec('set role authenticated');
    for (const op of ops.filter((op) => op.entity_type !== 'workout_sets'))
      await push(op, ownerB);
    const setOp = ops.find((op) => op.entity_id === set.id)!;
    await expect(
      push(
        {
          ...setOp,
          payload: JSON.stringify({ ...set, workoutExerciseId: parentA.id }),
        },
        ownerB,
      ),
    ).rejects.toThrow('foreign key');
    await expect(
      push(
        {
          ...setOp,
          payload: JSON.stringify({
            ...set,
            workoutExerciseId: item.id,
            reps: -1,
          }),
        },
        ownerB,
      ),
    ).rejects.toThrow('set_values');
    await expect(
      push(
        { ...setOp, payload: JSON.stringify({ ...set, reps: null }) },
        ownerB,
      ),
    ).rejects.toThrow();
    await expect(
      push(
        { ...setOp, payload: JSON.stringify({ ...set, reps: '8' }) },
        ownerB,
      ),
    ).rejects.toThrow();
    expect((await push(setOp, ownerB)).rows[0]?.result).toBe('APPLIED');
  } finally {
    await pg.exec('reset role');
    s.close();
  }
});
it('syncs routines, copied workouts and tombstones through the migrated RPC with ownership isolation', async () => {
  const owner = randomUUID();
  await pg.query('insert into auth.users(id) values ($1)', [owner]);
  const s = await setup(':memory:', owner);
  try {
    const { exercise } = await startWithSet(s);
    const active = (await s.training.state()).active!;
    await s.training.finish(active.id);
    const routine = await s.routines.create('Remote routine');
    const item = await s.routines.addExercise(routine.id, exercise.id);
    const template = (await s.routines.detail(routine.id)).exercises[0]!
      .sets[0]!;
    await s.routines.updateSet(template.id, { reps: 8, weightKg: 100 });
    await s.routines.updateExercise(item.id, { restSeconds: 180 });
    const workout = await s.workoutTemplates.startRoutine(routine.id);
    await s.routines.remove(routine.id);
    await pg.exec('set role authenticated');
    const engine = new SyncEngine(
      s.db,
      {
        push: async (op) =>
          (await push(op, owner)).rows[0]!.result as
            'APPLIED' | 'DUPLICATE' | 'CONFLICT',
      },
      owner,
      () => s.clock.value,
    );
    await engine.flush();
    expect(
      await s.db.all("SELECT * FROM sync_queue WHERE status!='SYNCED'"),
    ).toHaveLength(0);
    const remote = await pg.query<{ payload: { deletedAt: string | null } }>(
      'select payload from public.routines where id=$1',
      [routine.id],
    );
    expect(remote.rows[0]?.payload.deletedAt).toBe(s.clock.value);
    expect(
      (
        await pg.query<{ routine_id: string }>(
          'select routine_id from public.workouts where id=$1',
          [workout.id],
        )
      ).rows[0]?.routine_id,
    ).toBe(routine.id);
    await pg.query("select set_config('request.jwt.claim.sub',$1,false)", [
      ownerB,
    ]);
    expect(
      (
        await pg.query('select * from public.routines where id=$1', [
          routine.id,
        ])
      ).rows,
    ).toHaveLength(0);
    await expect(pg.query('delete from public.routine_sets')).rejects.toThrow(
      'permission denied',
    );
  } finally {
    await pg.exec('reset role');
    s.close();
  }
});
