import { DatabaseSync } from 'node:sqlite';
import { randomUUID } from 'node:crypto';
import type {
  Database,
  SqlConnection,
  SqlValue,
} from '../../src/database/connection';
import { WriteQueue } from '../../src/database/connection';
import { migrate } from '../../src/database/migrations';
import { EntityRepository } from '../../src/repositories/entities';
import { TrainingService } from '../../src/services/training';
import { NutritionService } from '../../src/services/nutrition';
import { RoutineService } from '../../src/services/routines';
import { RoutineSharingService } from '../../src/services/routineSharing';
import { WorkoutTemplateService } from '../../src/services/workoutTemplates';
import { SupersetService } from '../../src/services/supersets';
import { RoutineFolderService } from '../../src/services/routineFolders';
import { ProgramService } from '../../src/services/programs';

export function nodeDatabase(path = ':memory:') {
  const sqlite = new DatabaseSync(path);
  const writes = new WriteQueue();
  const connection: SqlConnection = {
    exec: async (sql) => {
      sqlite.exec(sql);
    },
    run: async (sql, params: SqlValue[] = []) => {
      sqlite.prepare(sql).run(...params);
    },
    all: async <T>(sql: string, params: SqlValue[] = []) =>
      sqlite.prepare(sql).all(...params) as T[],
    first: async <T>(sql: string, params: SqlValue[] = []) =>
      (sqlite.prepare(sql).get(...params) as T | undefined) ?? null,
  };
  const db: Database = {
    ...connection,
    transaction: <T>(work: (tx: SqlConnection) => Promise<T>) =>
      writes.run(async () => {
        sqlite.exec('BEGIN IMMEDIATE');
        try {
          const value = await work(connection);
          sqlite.exec('COMMIT');
          return value;
        } catch (error) {
          sqlite.exec('ROLLBACK');
          throw error;
        }
      }),
  };
  return { db, close: () => sqlite.close() };
}
export async function setup(path = ':memory:', ownerId = randomUUID()) {
  const connection = nodeDatabase(path);
  await migrate(connection.db);
  const clock = { value: '2026-09-05T12:00:00.000Z' };
  const repo = new EntityRepository(connection.db, ownerId, {
    id: randomUUID,
    now: () => clock.value,
  });
  return {
    ...connection,
    ownerId,
    repo,
    clock,
    training: new TrainingService(repo),
    supersets: new SupersetService(repo),
    routineFolders: new RoutineFolderService(repo),
    programs: new ProgramService(repo),
    nutrition: new NutritionService(repo),
    routines: new RoutineService(repo),
    routineSharing: new RoutineSharingService(repo),
    workoutTemplates: new WorkoutTemplateService(repo),
  };
}
export const exerciseInput = {
  name: 'Test press',
  primaryMuscle: 'chest',
  secondaryMuscles: ['triceps'],
  equipment: 'barbell',
  trackingType: 'WEIGHT_REPS',
  instructions: '',
  defaultRestSeconds: 90,
};
export async function startWithSet(system: Awaited<ReturnType<typeof setup>>) {
  const exercise = await system.training.createExercise(exerciseInput);
  const workout = await system.training.start('Test workout');
  const item = await system.training.addExercise(workout.id, exercise.id);
  const set = (await system.training.state()).sets[0];
  if (!set) throw new Error('SET_MISSING');
  return { exercise, workout, item, set };
}
