export const routinesMigration = {
  version: 2,
  sql: `
    CREATE UNIQUE INDEX exercises_id_owner ON exercises(id, owner_id);
    CREATE TABLE routines (
      id TEXT PRIMARY KEY, owner_id TEXT NOT NULL, revision INTEGER NOT NULL CHECK(revision > 0),
      payload TEXT NOT NULL CHECK(json_valid(payload)), updated_at TEXT NOT NULL,
      position INTEGER GENERATED ALWAYS AS (json_extract(payload, '$.position')) VIRTUAL,
      deleted_at TEXT GENERATED ALWAYS AS (json_extract(payload, '$.deletedAt')) VIRTUAL,
      UNIQUE(id, owner_id)
    );
    CREATE INDEX routines_owner_position ON routines(owner_id, position) WHERE deleted_at IS NULL;
    CREATE TABLE routine_exercises (
      id TEXT PRIMARY KEY, owner_id TEXT NOT NULL, revision INTEGER NOT NULL CHECK(revision > 0),
      payload TEXT NOT NULL CHECK(json_valid(payload)), updated_at TEXT NOT NULL,
      routine_id TEXT GENERATED ALWAYS AS (json_extract(payload, '$.routineId')) STORED NOT NULL,
      exercise_id TEXT GENERATED ALWAYS AS (json_extract(payload, '$.exerciseId')) STORED NOT NULL,
      UNIQUE(id, owner_id),
      FOREIGN KEY (routine_id, owner_id) REFERENCES routines(id, owner_id),
      FOREIGN KEY (exercise_id, owner_id) REFERENCES exercises(id, owner_id)
    );
    CREATE INDEX routine_exercises_parent ON routine_exercises(routine_id);
    CREATE TABLE routine_sets (
      id TEXT PRIMARY KEY, owner_id TEXT NOT NULL, revision INTEGER NOT NULL CHECK(revision > 0),
      payload TEXT NOT NULL CHECK(json_valid(payload)), updated_at TEXT NOT NULL,
      routine_exercise_id TEXT GENERATED ALWAYS AS (json_extract(payload, '$.routineExerciseId')) STORED NOT NULL,
      FOREIGN KEY (routine_exercise_id, owner_id) REFERENCES routine_exercises(id, owner_id)
    );
    CREATE INDEX routine_sets_parent ON routine_sets(routine_exercise_id);
    ALTER TABLE workouts ADD COLUMN routine_id TEXT GENERATED ALWAYS AS (json_extract(payload, '$.routineId')) VIRTUAL REFERENCES routines(id);
  `,
} as const;
