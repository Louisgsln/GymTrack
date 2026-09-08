import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';
import { randomUUID } from 'expo-crypto';
import { z } from 'zod';
import { expoDatabase } from '../database/expo';
import { migrate } from '../database/migrations';
import { EntityRepository } from '../repositories/entities';
import { TrainingService } from './training';
import { NutritionService } from './nutrition';
import { SettingsService } from './settings';
import { RoutineService } from './routines';
import { RoutineSharingService } from './routineSharing';
import { WorkoutTemplateService } from './workoutTemplates';
import { SupersetService } from './supersets';
import { RoutineFolderService } from './routineFolders';
import { ProgramService } from './programs';

export async function bootstrap() {
  const sqlite = await openDatabaseAsync('gymtrack.db');
  let writer: SQLiteDatabase | null = null;
  try {
    writer = await openDatabaseAsync('gymtrack.db', { useNewConnection: true });
    const db = expoDatabase(sqlite, writer);
    await migrate(db);
    const ownerId = await db.transaction(async (tx) => {
      const stored = await tx.first<{ value: string }>(
        "SELECT value FROM local_settings WHERE key='local_owner_id'",
      );
      if (stored) return z.uuid().parse(stored.value);
      const id = randomUUID();
      await tx.run(
        "INSERT INTO local_settings(key,value) VALUES ('local_owner_id',?)",
        [id],
      );
      return id;
    });
    const repo = new EntityRepository(db, ownerId, {
      id: randomUUID,
      now: () => new Date().toISOString(),
    });
    const settings = new SettingsService(db);
    return {
      training: new TrainingService(repo),
      supersets: new SupersetService(repo),
      routineFolders: new RoutineFolderService(repo),
      programs: new ProgramService(repo),
      nutrition: new NutritionService(repo),
      routines: new RoutineService(repo),
      routineSharing: new RoutineSharingService(repo),
      workoutTemplates: new WorkoutTemplateService(repo),
      settings,
      preferences: await settings.load(),
    };
  } catch (error) {
    await writer?.closeAsync();
    await sqlite.closeAsync();
    throw error;
  }
}
export type Services = Awaited<ReturnType<typeof bootstrap>>;
