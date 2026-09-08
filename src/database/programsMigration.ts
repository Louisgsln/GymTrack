export const programsMigration = {
  version: 5,
  sql: `
    CREATE TABLE programs (
      id TEXT PRIMARY KEY,owner_id TEXT NOT NULL,revision INTEGER NOT NULL CHECK(revision>0),
      payload TEXT NOT NULL CHECK(json_valid(payload)),updated_at TEXT NOT NULL,
      position INTEGER GENERATED ALWAYS AS (json_extract(payload,'$.position')) VIRTUAL,
      deleted_at TEXT GENERATED ALWAYS AS (json_extract(payload,'$.deletedAt')) VIRTUAL,
      UNIQUE(id,owner_id)
    );
    CREATE INDEX programs_owner_position ON programs(owner_id,position) WHERE deleted_at IS NULL;
    CREATE TABLE program_routines (
      id TEXT PRIMARY KEY,owner_id TEXT NOT NULL,revision INTEGER NOT NULL CHECK(revision>0),
      payload TEXT NOT NULL CHECK(json_valid(payload)),updated_at TEXT NOT NULL,
      program_id TEXT GENERATED ALWAYS AS (json_extract(payload,'$.programId')) STORED NOT NULL,
      routine_id TEXT GENERATED ALWAYS AS (json_extract(payload,'$.routineId')) STORED NOT NULL,
      position INTEGER GENERATED ALWAYS AS (json_extract(payload,'$.position')) VIRTUAL,
      FOREIGN KEY(program_id,owner_id) REFERENCES programs(id,owner_id),
      FOREIGN KEY(routine_id,owner_id) REFERENCES routines(id,owner_id)
    );
    CREATE INDEX program_routines_parent_position ON program_routines(program_id,position);
    CREATE INDEX program_routines_routine ON program_routines(routine_id);
  `,
} as const;
