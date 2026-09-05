import type { Database } from '../database/connection';
import type { EntityType } from '../types/entities';

export interface SyncOperation {
  operation_id: string;
  owner_id: string;
  entity_type: EntityType;
  entity_id: string;
  payload: string;
  base_revision: number;
  retry_count: number;
}
export interface RemoteRepository {
  push(operation: SyncOperation): Promise<'APPLIED' | 'DUPLICATE' | 'CONFLICT'>;
}
export class SyncEngine {
  private running: Promise<void> | null = null;
  constructor(
    private readonly db: Database,
    private readonly remote: RemoteRepository,
    private readonly ownerId: string,
    private readonly now: () => string,
  ) {}

  /** One engine per account/database. Retries reuse operation_id after ambiguous responses. */
  flush(): Promise<void> {
    if (!this.running)
      this.running = this.perform().finally(() => {
        this.running = null;
      });
    return this.running;
  }
  private async perform() {
    // Recovery after process death while a request was in flight.
    await this.db.transaction((tx) =>
      tx.run(
        "UPDATE sync_queue SET status='PENDING' WHERE owner_id=? AND status='SYNCING'",
        [this.ownerId],
      ),
    );
    while (true) {
      const operation = await this.db.transaction(async (tx) => {
        // Global ordering preserves foreign keys and stops descendants behind conflicts.
        const row = await tx.first<
          SyncOperation & { next_attempt_at: string; status: string }
        >(
          "SELECT * FROM sync_queue WHERE owner_id=? AND status!='SYNCED' ORDER BY rowid LIMIT 1",
          [this.ownerId],
        );
        if (!row || row.status === 'ERROR' || row.next_attempt_at > this.now())
          return null;
        await tx.run(
          "UPDATE sync_queue SET status='SYNCING' WHERE operation_id=?",
          [row.operation_id],
        );
        return row;
      });
      if (!operation) return;
      try {
        const result = await this.remote.push(operation);
        await this.db.transaction((tx) =>
          tx.run(
            'UPDATE sync_queue SET status=?, error_code=? WHERE operation_id=?',
            [
              result === 'CONFLICT' ? 'ERROR' : 'SYNCED',
              result === 'CONFLICT' ? 'CONFLICT' : null,
              operation.operation_id,
            ],
          ),
        );
        if (result === 'CONFLICT') return;
      } catch {
        const retry = operation.retry_count + 1;
        const delay = Math.min(300000, 1000 * 2 ** Math.min(retry, 8));
        await this.db.transaction((tx) =>
          tx.run(
            "UPDATE sync_queue SET status='PENDING', retry_count=?, next_attempt_at=?, error_code='TRANSPORT' WHERE operation_id=?",
            [
              retry,
              new Date(Date.parse(this.now()) + delay).toISOString(),
              operation.operation_id,
            ],
          ),
        );
        return;
      }
    }
  }
}
