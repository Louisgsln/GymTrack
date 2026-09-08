export const supersetsMigration = {
  version: 3,
  sql: `
    CREATE UNIQUE INDEX workouts_id_owner ON workouts(id,owner_id);
    CREATE TABLE superset_groups (
      id TEXT PRIMARY KEY, owner_id TEXT NOT NULL, revision INTEGER NOT NULL CHECK(revision>0),
      payload TEXT NOT NULL CHECK(json_valid(payload)), updated_at TEXT NOT NULL,
      workout_id TEXT GENERATED ALWAYS AS (json_extract(payload,'$.workoutId')) VIRTUAL,
      routine_id TEXT GENERATED ALWAYS AS (json_extract(payload,'$.routineId')) VIRTUAL,
      CHECK ((workout_id IS NULL) != (routine_id IS NULL)),
      FOREIGN KEY(workout_id,owner_id) REFERENCES workouts(id,owner_id),
      FOREIGN KEY(routine_id,owner_id) REFERENCES routines(id,owner_id)
    );
    CREATE INDEX superset_groups_workout ON superset_groups(owner_id,workout_id);
    CREATE INDEX superset_groups_routine ON superset_groups(owner_id,routine_id);
    ALTER TABLE workout_exercises ADD COLUMN superset_group_id TEXT GENERATED ALWAYS AS (json_extract(payload,'$.supersetGroupId')) VIRTUAL REFERENCES superset_groups(id);
    ALTER TABLE routine_exercises ADD COLUMN superset_group_id TEXT GENERATED ALWAYS AS (json_extract(payload,'$.supersetGroupId')) VIRTUAL REFERENCES superset_groups(id);
    CREATE INDEX workout_exercises_group ON workout_exercises(superset_group_id);
    CREATE INDEX routine_exercises_group ON routine_exercises(superset_group_id);
    ${['INSERT', 'UPDATE']
      .map((event) =>
        ['workout', 'routine']
          .map(
            (kind) => `
      CREATE TRIGGER ${kind}_group_${event.toLowerCase()} BEFORE ${event} ON ${kind}_exercises
      WHEN NEW.superset_group_id IS NOT NULL AND NOT EXISTS (
        SELECT 1 FROM superset_groups g WHERE g.id=NEW.superset_group_id AND g.owner_id=NEW.owner_id AND g.${kind}_id=NEW.${kind}_id
      ) BEGIN SELECT RAISE(ABORT,'GROUP_PARENT_MISMATCH'); END;
    `,
          )
          .join(''),
      )
      .join('')}
    CREATE TRIGGER group_parent_immutable BEFORE UPDATE ON superset_groups
    WHEN NEW.owner_id != OLD.owner_id OR NEW.workout_id IS NOT OLD.workout_id OR NEW.routine_id IS NOT OLD.routine_id
    BEGIN SELECT RAISE(ABORT,'GROUP_PARENT_IMMUTABLE'); END;
  `,
} as const;
