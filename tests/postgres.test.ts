import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { PGlite } from '@electric-sql/pglite';
import { beforeAll, afterAll, it, expect } from 'vitest';
import { setup, startWithSet } from './helpers/database';
import type { SyncOperation } from '../src/sync/engine';

let pg: PGlite;
const ownerA = randomUUID();
const ownerB = randomUUID();
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
  await pg.exec(
    readFileSync('supabase/migrations/202609050001_training_sync.sql', 'utf8'),
  );
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
