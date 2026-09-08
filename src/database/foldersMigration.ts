export const foldersMigration = {
  version: 4,
  sql: `
    CREATE TABLE routine_folders (
      id TEXT PRIMARY KEY,owner_id TEXT NOT NULL,revision INTEGER NOT NULL CHECK(revision>0),
      payload TEXT NOT NULL CHECK(json_valid(payload)),updated_at TEXT NOT NULL,
      position INTEGER GENERATED ALWAYS AS (json_extract(payload,'$.position')) VIRTUAL,
      deleted_at TEXT GENERATED ALWAYS AS (json_extract(payload,'$.deletedAt')) VIRTUAL,
      UNIQUE(id,owner_id)
    );
    CREATE INDEX folders_owner_position ON routine_folders(owner_id,position) WHERE deleted_at IS NULL;
    ALTER TABLE routines ADD COLUMN folder_id TEXT GENERATED ALWAYS AS (json_extract(payload,'$.folderId')) VIRTUAL REFERENCES routine_folders(id);
    CREATE INDEX routines_folder_position ON routines(owner_id,folder_id,position);
    ${['INSERT', 'UPDATE']
      .map(
        (event) => `
      CREATE TRIGGER routine_folder_${event.toLowerCase()} BEFORE ${event} ON routines
      WHEN NEW.folder_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM routine_folders f WHERE f.id=NEW.folder_id AND f.owner_id=NEW.owner_id)
      BEGIN SELECT RAISE(ABORT,'FOLDER_OWNER_MISMATCH'); END;
    `,
      )
      .join('')}
    CREATE TRIGGER folder_owner_immutable BEFORE UPDATE ON routine_folders
    WHEN NEW.owner_id!=OLD.owner_id BEGIN SELECT RAISE(ABORT,'FOLDER_OWNER_IMMUTABLE'); END;
  `,
} as const;
