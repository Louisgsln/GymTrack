import type { Database } from '../database/connection';
import { preferencesSchema, type Preferences } from '../store/preferences';
export class SettingsService {
  constructor(private readonly db: Database) {}
  async load(): Promise<Preferences | null> {
    const row = await this.db.first<{ value: string }>(
      "SELECT value FROM local_settings WHERE key='preferences'",
    );
    return row ? preferencesSchema.parse(JSON.parse(row.value)) : null;
  }
  save(value: Preferences) {
    const payload = JSON.stringify(preferencesSchema.parse(value));
    return this.db.transaction((tx) =>
      tx.run(
        "INSERT INTO local_settings(key,value) VALUES ('preferences',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",
        [payload],
      ),
    );
  }
}
