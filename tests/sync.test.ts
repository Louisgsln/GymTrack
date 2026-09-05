import { it, expect } from 'vitest';
import { setup } from './helpers/database';
import { SyncEngine, type RemoteRepository } from '../src/sync/engine';
it('retries an ambiguous response using the same id, without duplicate remote writes', async () => {
  const s = await setup();
  try {
    await s.training.start('Offline');
    const received = new Set<string>();
    const remote: RemoteRepository = {
      push: async (op) => {
        if (received.has(op.operation_id)) return 'DUPLICATE';
        received.add(op.operation_id);
        throw new Error('CONNECTION_LOST_AFTER_COMMIT');
      },
    };
    const engine = new SyncEngine(s.db, remote, s.ownerId, () => s.clock.value);
    await engine.flush();
    expect(
      await s.db.first('SELECT status,retry_count FROM sync_queue'),
    ).toMatchObject({ status: 'PENDING', retry_count: 1 });
    s.clock.value = '2026-09-05T12:10:00.000Z';
    await Promise.all([engine.flush(), engine.flush()]);
    expect(received.size).toBe(1);
    expect(await s.db.first('SELECT status FROM sync_queue')).toMatchObject({
      status: 'SYNCED',
    });
  } finally {
    s.close();
  }
});
it('recovers SYNCING operations after restart and preserves FIFO', async () => {
  const s = await setup();
  try {
    const w = await s.training.start('A');
    await s.training.editWorkout(w.id, { title: 'B' });
    await s.db.run(
      "UPDATE sync_queue SET status='SYNCING' WHERE base_revision=0",
    );
    const revisions: number[] = [];
    await new SyncEngine(
      s.db,
      {
        push: async (op) => {
          revisions.push(op.base_revision);
          return 'APPLIED';
        },
      },
      s.ownerId,
      () => s.clock.value,
    ).flush();
    expect(revisions).toEqual([0, 1]);
  } finally {
    s.close();
  }
});
it('keeps conflicts and blocks descendants without deleting or overwriting local work', async () => {
  const s = await setup();
  try {
    const w = await s.training.start('Local');
    await s.training.editWorkout(w.id, { notes: 'Keep me' });
    let calls = 0;
    const engine = new SyncEngine(
      s.db,
      {
        push: async () => {
          calls++;
          return 'CONFLICT';
        },
      },
      s.ownerId,
      () => s.clock.value,
    );
    await engine.flush();
    await engine.flush();
    expect(calls).toBe(1);
    expect((await s.training.state()).active?.notes).toBe('Keep me');
    expect(
      await s.db.all('SELECT status FROM sync_queue ORDER BY rowid'),
    ).toEqual([{ status: 'ERROR' }, { status: 'PENDING' }]);
  } finally {
    s.close();
  }
});
