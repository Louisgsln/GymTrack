import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { setup, startWithSet } from './helpers/database';
import { migrate } from '../src/database/migrations';
import { EntityRepository } from '../src/repositories/entities';
import { TrainingService } from '../src/services/training';
import { randomUUID } from 'node:crypto';

describe('durable training on real SQLite', () => {
  it('recovers active workout, set, notes, timer and outbox after closing/reopening the file', async () => {
    const directory = mkdtempSync(join(tmpdir(), 'gymtrack-test-'));
    const path = join(directory, 'training.db');
    let system = await setup(path);
    try {
      const { workout, set } = await startWithSet(system);
      await system.training.updateSet(set.id, {
        weightKg: 100,
        reps: 8,
        rpe: 8,
      });
      await system.training.completeSet(set.id, true);
      await system.training.editWorkout(workout.id, {
        notes: 'Persistent note',
      });
      const ownerId = system.ownerId;
      system.close();
      system = await setup(path, ownerId);
      const state = await system.training.state();
      expect(state.active?.id).toBe(workout.id);
      expect(state.active?.notes).toBe('Persistent note');
      expect(state.active?.restEndsAt).toBe('2026-09-05T12:01:30.000Z');
      expect(state.sets[0]).toMatchObject({
        weightKg: 100,
        reps: 8,
        rpe: 8,
        completedAt: system.clock.value,
      });
      expect(await system.training.summary(workout.id)).toMatchObject({
        volumeKg: 800,
        completedSets: 1,
      });
      const operations = await system.db.all('SELECT * FROM sync_queue');
      expect(operations.length).toBeGreaterThan(5);
      await system.training.finish(workout.id);
      system.close();
      system = await setup(path, ownerId);
      expect((await system.training.state()).active).toBeNull();
      expect((await system.training.state()).history).toHaveLength(1);
    } finally {
      system.close();
      rmSync(directory, { recursive: true });
    }
  });
  it('migrations are repeatable and simultaneous starts preserve one active workout', async () => {
    const s = await setup();
    try {
      await migrate(s.db);
      const workouts = await Promise.all(
        Array.from({ length: 10 }, () => s.training.start('Session')),
      );
      expect(new Set(workouts.map((w) => w.id)).size).toBe(1);
      expect(await s.db.all('SELECT * FROM schema_migrations')).toHaveLength(1);
    } finally {
      s.close();
    }
  });
  it('rolls back entity changes if enqueue fails', async () => {
    const s = await setup();
    try {
      await s.db.exec(
        "CREATE TRIGGER reject_queue BEFORE INSERT ON sync_queue BEGIN SELECT RAISE(ABORT, 'DISK_FULL'); END;",
      );
      await expect(s.training.start('Lost?')).rejects.toThrow('DISK_FULL');
      expect((await s.training.state()).active).toBeNull();
    } finally {
      s.close();
    }
  });
  it('serializes concurrent patches without losing fields', async () => {
    const s = await setup();
    try {
      const { set } = await startWithSet(s);
      await Promise.all([
        s.training.updateSet(set.id, { weightKg: 102.5 }),
        s.training.updateSet(set.id, { reps: 8 }),
        s.training.updateSet(set.id, { rpe: 8.5 }),
      ]);
      expect((await s.training.state()).sets[0]).toMatchObject({
        weightKg: 102.5,
        reps: 8,
        rpe: 8.5,
      });
    } finally {
      s.close();
    }
  });
  it('validates values, completion, ownership and closed-workout edits', async () => {
    const s = await setup();
    try {
      const { set, workout } = await startWithSet(s);
      await expect(s.training.completeSet(set.id, true)).rejects.toThrow(
        'INVALID_SET',
      );
      expect(() => s.training.updateSet(set.id, { rpe: 11 })).toThrow();
      expect(() => s.training.updateSet(set.id, { reps: 8.5 })).toThrow();
      expect(() => s.training.updateSet(set.id, { weightKg: NaN })).toThrow();
      const other = new TrainingService(
        new EntityRepository(s.db, randomUUID(), s.repo.runtime),
      );
      await expect(other.updateSet(set.id, { reps: 10 })).rejects.toThrow(
        'NOT_FOUND',
      );
      await s.training.finish(workout.id);
      await expect(s.training.updateSet(set.id, { reps: 10 })).rejects.toThrow(
        'WORKOUT_CLOSED',
      );
    } finally {
      s.close();
    }
  });
  it('duplicate/delete/uncomplete preserve independent entities and correct totals', async () => {
    const s = await setup();
    try {
      const { set, workout } = await startWithSet(s);
      await s.training.updateSet(set.id, { weightKg: 100, reps: 8 });
      await s.training.completeSet(set.id, true);
      const duplicate = await s.training.duplicateSet(set.id);
      expect(duplicate).toMatchObject({
        weightKg: 100,
        reps: 8,
        completedAt: null,
      });
      await s.training.completeSet(duplicate.id, true);
      expect((await s.training.summary(workout.id)).volumeKg).toBe(1600);
      await s.training.completeSet(set.id, false);
      await s.training.deleteSet(duplicate.id);
      expect((await s.training.summary(workout.id)).volumeKg).toBe(0);
      expect((await s.training.state()).sets).toHaveLength(1);
    } finally {
      s.close();
    }
  });
  it('rejects stale repository writes instead of overwriting newer content', async () => {
    const s = await setup();
    try {
      const { workout } = await startWithSet(s);
      await s.training.editWorkout(workout.id, { notes: 'New' });
      await expect(
        s.db.transaction((tx) =>
          s.repo.save('workouts', { ...workout, notes: 'Stale' }, tx),
        ),
      ).rejects.toThrow('CONFLICT');
    } finally {
      s.close();
    }
  });
});
