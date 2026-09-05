import { DatabaseSync } from 'node:sqlite';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { it, expect } from 'vitest';
import { expoDatabase, type ExpoConnection } from '../src/database/expo';
import type { SqlValue } from '../src/database/connection';

/** Structural Expo adapter backed by real SQLite handles, not an in-memory SQL mock. */
function handle(raw: DatabaseSync): ExpoConnection {
  return {
    execAsync: async (sql: string) => {
      raw.exec(sql);
    },
    runAsync: async (sql: string, ...args: unknown[]) => {
      const params = (args[0] ?? []) as SqlValue[];
      const result = raw.prepare(sql).run(...params);
      return {
        lastInsertRowId: Number(result.lastInsertRowid),
        changes: Number(result.changes),
      };
    },
    getAllAsync: async <T>(sql: string, ...args: unknown[]) =>
      raw.prepare(sql).all(...((args[0] as SqlValue[]) ?? [])) as T[],
    getFirstAsync: async <T>(sql: string, ...args: unknown[]) =>
      (raw.prepare(sql).get(...((args[0] as SqlValue[]) ?? [])) as
        T | undefined) ?? null,
  };
}
it('configures writer foreign keys before BEGIN and isolates readers from uncommitted data', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'gymtrack-adapter-'));
  const path = join(directory, 'data.db');
  const reader = new DatabaseSync(path, { enableForeignKeyConstraints: false });
  const writer = new DatabaseSync(path, { enableForeignKeyConstraints: false });
  try {
    const db = expoDatabase(handle(reader), handle(writer));
    await db.exec(
      'PRAGMA journal_mode=WAL; CREATE TABLE parent(id INTEGER PRIMARY KEY); CREATE TABLE child(parent_id INTEGER REFERENCES parent(id));',
    );
    await expect(
      db.transaction((tx) =>
        tx.run('INSERT INTO child(parent_id) VALUES (99)'),
      ),
    ).rejects.toThrow('FOREIGN KEY');
    await db.transaction(async (tx) => {
      await tx.run('INSERT INTO parent(id) VALUES (1)');
      expect(await db.all('SELECT * FROM parent')).toHaveLength(0);
      expect(await tx.all('SELECT * FROM parent')).toHaveLength(1);
    });
    expect(await db.all('SELECT * FROM parent')).toHaveLength(1);
  } finally {
    reader.close();
    writer.close();
    rmSync(directory, { recursive: true });
  }
});
