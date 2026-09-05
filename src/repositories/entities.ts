import type { Database, SqlConnection } from '../database/connection';
import { schemas, type Entities, type EntityType } from '../types/entities';
import { DomainError } from '../utils/errors';

export interface Runtime {
  id(): string;
  now(): string;
}
export class EntityRepository {
  constructor(
    readonly db: Database,
    readonly ownerId: string,
    readonly runtime: Runtime,
  ) {}

  base() {
    const now = this.runtime.now();
    return {
      id: this.runtime.id(),
      ownerId: this.ownerId,
      revision: 1,
      createdAt: now,
      updatedAt: now,
    };
  }
  async get<K extends EntityType>(
    kind: K,
    id: string,
    tx: SqlConnection = this.db,
  ): Promise<Entities[K]> {
    const row = await tx.first<{ payload: string }>(
      `SELECT payload FROM ${kind} WHERE id = ? AND owner_id = ?`,
      [id, this.ownerId],
    );
    if (!row) throw new DomainError('NOT_FOUND');
    return schemas[kind].parse(JSON.parse(row.payload)) as Entities[K];
  }
  async list<K extends EntityType>(
    kind: K,
    tx: SqlConnection = this.db,
  ): Promise<Entities[K][]> {
    const rows = await tx.all<{ payload: string }>(
      `SELECT payload FROM ${kind} WHERE owner_id = ? ORDER BY rowid`,
      [this.ownerId],
    );
    return rows.map(
      (row) => schemas[kind].parse(JSON.parse(row.payload)) as Entities[K],
    );
  }
  async save<K extends EntityType>(
    kind: K,
    entity: Entities[K],
    tx: SqlConnection,
  ): Promise<Entities[K]> {
    const parsed = schemas[kind].parse(entity) as Entities[K];
    if (parsed.ownerId !== this.ownerId) throw new DomainError('NOT_FOUND');
    const previous = await tx.first<{ revision: number; owner_id: string }>(
      `SELECT revision, owner_id FROM ${kind} WHERE id = ?`,
      [parsed.id],
    );
    if (previous && previous.owner_id !== this.ownerId)
      throw new DomainError('NOT_FOUND');
    const baseRevision = previous?.revision ?? 0;
    if (parsed.revision !== (previous?.revision ?? 1))
      throw new DomainError('CONFLICT');
    const next = {
      ...parsed,
      revision: baseRevision + 1,
      updatedAt: this.runtime.now(),
    };
    const payload = JSON.stringify(next);
    await tx.run(
      `INSERT INTO ${kind}(id, owner_id, revision, payload, updated_at) VALUES (?,?,?,?,?)
      ON CONFLICT(id) DO UPDATE SET revision=excluded.revision, payload=excluded.payload, updated_at=excluded.updated_at`,
      [next.id, next.ownerId, next.revision, payload, next.updatedAt],
    );
    await tx.run(
      `INSERT INTO sync_queue(operation_id, owner_id, entity_type, entity_id, operation, payload, base_revision, created_at, next_attempt_at)
      VALUES (?,?,?,?, 'UPSERT',?,?,?,?)`,
      [
        this.runtime.id(),
        this.ownerId,
        kind,
        next.id,
        payload,
        baseRevision,
        next.updatedAt,
        next.updatedAt,
      ],
    );
    return next;
  }
}
