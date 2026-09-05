import type { Database } from './connection';

export const migrations = [
  {
    version: 1,
    sql: `
      CREATE TABLE local_settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
      CREATE TABLE exercises (
        id TEXT PRIMARY KEY, owner_id TEXT NOT NULL, revision INTEGER NOT NULL CHECK(revision > 0),
        payload TEXT NOT NULL CHECK(json_valid(payload)), updated_at TEXT NOT NULL,
        name TEXT GENERATED ALWAYS AS (json_extract(payload, '$.name')) VIRTUAL
      );
      CREATE INDEX exercises_owner_name ON exercises(owner_id, name);
      CREATE TABLE workouts (
        id TEXT PRIMARY KEY, owner_id TEXT NOT NULL, revision INTEGER NOT NULL CHECK(revision > 0),
        payload TEXT NOT NULL CHECK(json_valid(payload)), updated_at TEXT NOT NULL,
        status TEXT GENERATED ALWAYS AS (json_extract(payload, '$.status')) VIRTUAL,
        started_at TEXT GENERATED ALWAYS AS (json_extract(payload, '$.startedAt')) VIRTUAL,
        CHECK(status IN ('ACTIVE','FINISHED','DISCARDED'))
      );
      CREATE UNIQUE INDEX one_active_workout ON workouts(owner_id) WHERE status = 'ACTIVE';
      CREATE INDEX workouts_owner_date ON workouts(owner_id, started_at);
      CREATE TABLE workout_exercises (
        id TEXT PRIMARY KEY, owner_id TEXT NOT NULL, revision INTEGER NOT NULL CHECK(revision > 0),
        payload TEXT NOT NULL CHECK(json_valid(payload)), updated_at TEXT NOT NULL,
        workout_id TEXT GENERATED ALWAYS AS (json_extract(payload, '$.workoutId')) STORED REFERENCES workouts(id),
        exercise_id TEXT GENERATED ALWAYS AS (json_extract(payload, '$.exerciseId')) STORED REFERENCES exercises(id)
      );
      CREATE INDEX workout_exercises_workout ON workout_exercises(workout_id);
      CREATE TABLE workout_sets (
        id TEXT PRIMARY KEY, owner_id TEXT NOT NULL, revision INTEGER NOT NULL CHECK(revision > 0),
        payload TEXT NOT NULL CHECK(json_valid(payload)), updated_at TEXT NOT NULL,
        workout_exercise_id TEXT GENERATED ALWAYS AS (json_extract(payload, '$.workoutExerciseId')) STORED REFERENCES workout_exercises(id)
      );
      CREATE INDEX sets_workout_exercise ON workout_sets(workout_exercise_id);
      CREATE TABLE food_diary_entries (
        id TEXT PRIMARY KEY, owner_id TEXT NOT NULL, revision INTEGER NOT NULL CHECK(revision > 0),
        payload TEXT NOT NULL CHECK(json_valid(payload)), updated_at TEXT NOT NULL,
        diary_date TEXT GENERATED ALWAYS AS (json_extract(payload, '$.diaryDate')) VIRTUAL
      );
      CREATE INDEX diary_owner_date ON food_diary_entries(owner_id, diary_date);
      CREATE TABLE sync_queue (
        operation_id TEXT PRIMARY KEY, owner_id TEXT NOT NULL,
        entity_type TEXT NOT NULL, entity_id TEXT NOT NULL,
        operation TEXT NOT NULL CHECK(operation = 'UPSERT'),
        payload TEXT NOT NULL CHECK(json_valid(payload)),
        base_revision INTEGER NOT NULL CHECK(base_revision >= 0),
        created_at TEXT NOT NULL, retry_count INTEGER NOT NULL DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'PENDING' CHECK(status IN ('PENDING','SYNCING','SYNCED','ERROR')),
        next_attempt_at TEXT NOT NULL, error_code TEXT,
        UNIQUE(entity_type, entity_id, base_revision)
      );
      CREATE INDEX sync_pending ON sync_queue(owner_id, status, next_attempt_at);
    `,
  },
] as const;

export async function migrate(db: Database): Promise<void> {
  await db.exec(
    'PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL; PRAGMA synchronous = FULL;',
  );
  await db.transaction(async (tx) => {
    await tx.exec(
      'CREATE TABLE IF NOT EXISTS schema_migrations (version INTEGER PRIMARY KEY);',
    );
    const applied = await tx.all<{ version: number }>(
      'SELECT version FROM schema_migrations',
    );
    if (applied.some(({ version }) => version > migrations.length)) {
      throw new Error('DATABASE_NEWER_THAN_APP');
    }
    for (const migration of migrations) {
      if (applied.some(({ version }) => version === migration.version))
        continue;
      await tx.exec(migration.sql);
      await tx.run('INSERT INTO schema_migrations(version) VALUES (?)', [
        migration.version,
      ]);
    }
  });
}
