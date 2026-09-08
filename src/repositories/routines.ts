import type { SqlConnection } from '../database/connection';
import { EntityRepository } from './entities';
import { DomainError } from '../utils/errors';
import type { RoutineDetail } from '../features/routines/model';
import { type Entities, type EntityType, schemas } from '../types/entities';

export class RoutineRepository {
  constructor(readonly entities: EntityRepository) {}
  async live(id: string, tx: SqlConnection) {
    const routine = await this.entities.get('routines', id, tx);
    if (routine.deletedAt) throw new DomainError('NOT_FOUND');
    return routine;
  }
  async list(tx: SqlConnection = this.entities.db) {
    return (await this.entities.list('routines', tx))
      .filter((r) => !r.deletedAt)
      .sort((a, b) => a.position - b.position || a.id.localeCompare(b.id));
  }
  private async children<K extends EntityType>(
    kind: K,
    foreignKey: 'routine_id' | 'routine_exercise_id',
    id: string,
    tx: SqlConnection,
  ): Promise<Entities[K][]> {
    const rows = await tx.all<{ payload: string }>(
      `SELECT payload FROM ${kind} WHERE owner_id=? AND ${foreignKey}=? AND json_extract(payload,'$.deletedAt') IS NULL ORDER BY json_extract(payload,'$.position'),id`,
      [this.entities.ownerId, id],
    );
    return rows.map(
      (row) => schemas[kind].parse(JSON.parse(row.payload)) as Entities[K],
    );
  }
  exercises(id: string, tx: SqlConnection) {
    return this.children('routine_exercises', 'routine_id', id, tx);
  }
  sets(id: string, tx: SqlConnection) {
    return this.children('routine_sets', 'routine_exercise_id', id, tx);
  }
  async detail(id: string, tx: SqlConnection): Promise<RoutineDetail> {
    const routine = await this.live(id, tx);
    const exercises: RoutineDetail['exercises'] = [];
    for (const item of await this.exercises(id, tx)) {
      exercises.push({
        item,
        exercise: await this.entities.get('exercises', item.exerciseId, tx),
        sets: await this.sets(item.id, tx),
      });
    }
    const groups = (await this.entities.list('superset_groups', tx)).filter(
      (g) => g.routineId === id && !g.deletedAt,
    );
    return { routine, exercises, groups };
  }
}
