import type { SQLiteDatabase } from 'expo-sqlite';
import type { Database, SqlConnection, SqlValue } from './connection';
import { WriteQueue } from './connection';

export type ExpoConnection = Pick<
  SQLiteDatabase,
  'execAsync' | 'runAsync' | 'getAllAsync' | 'getFirstAsync'
>;
const connection = (db: ExpoConnection): SqlConnection => ({
  exec: (sql) => db.execAsync(sql),
  run: async (sql, params: SqlValue[] = []) => {
    await db.runAsync(sql, params);
  },
  all: <T>(sql: string, params: SqlValue[] = []) =>
    db.getAllAsync<T>(sql, params),
  first: <T>(sql: string, params: SqlValue[] = []) =>
    db.getFirstAsync<T>(sql, params),
});

export function expoDatabase(
  reader: ExpoConnection,
  writer: ExpoConnection,
): Database {
  const writes = new WriteQueue();
  return {
    ...connection(reader),
    transaction: <T>(work: (tx: SqlConnection) => Promise<T>) =>
      writes.run(async () => {
        // Expo's exclusive helper opens a fresh connection, losing per-connection
        // PRAGMAs. Keep our own writer, configure it before BEGIN, and serialize it.
        await writer.execAsync(
          'PRAGMA foreign_keys = ON; PRAGMA synchronous = FULL; PRAGMA busy_timeout = 5000;',
        );
        await writer.execAsync('BEGIN IMMEDIATE');
        try {
          const result = await work(connection(writer));
          await writer.execAsync('COMMIT');
          return result;
        } catch (error) {
          await writer.execAsync('ROLLBACK');
          throw error;
        }
      }),
  };
}
