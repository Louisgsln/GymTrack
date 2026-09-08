import { z } from 'zod';
import { EntityRepository } from '../repositories/entities';
import type { SqlConnection } from '../database/connection';
import type { SupersetGroup } from '../types/entities';
import { exerciseBlocks } from '../features/training/supersets';
import { assertPermutation } from '../features/routines/model';
import { DomainError } from '../utils/errors';
export type GroupParent =
  | { workoutId: string; routineId?: never }
  | { routineId: string; workoutId?: never };
/** Commands keep group membership, ordering and outbox atomic. */
export class SupersetService {
  constructor(private readonly repo: EntityRepository) {}
  private async context(parent: GroupParent, tx: SqlConnection) {
    if (parent.workoutId) {
      const workout = await this.repo.get('workouts', parent.workoutId, tx);
      if (workout.status !== 'ACTIVE') throw new DomainError('WORKOUT_CLOSED');
      return {
        kind: 'workout_exercises' as const,
        items: (await this.repo.list('workout_exercises', tx)).filter(
          (e) => e.workoutId === parent.workoutId,
        ),
      };
    }
    const routine = await this.repo.get('routines', parent.routineId!, tx);
    if (routine.deletedAt) throw new DomainError('NOT_FOUND');
    return {
      kind: 'routine_exercises' as const,
      items: (await this.repo.list('routine_exercises', tx)).filter(
        (e) => e.routineId === parent.routineId && !e.deletedAt,
      ),
    };
  }
  private async clearRest(parent: GroupParent, tx: SqlConnection) {
    if (parent.workoutId) {
      const workout = await this.repo.get('workouts', parent.workoutId, tx);
      if (workout.restEndsAt)
        await this.repo.save('workouts', { ...workout, restEndsAt: null }, tx);
    }
  }
  create(parent: GroupParent, ids: string[], restSeconds: number) {
    z.array(z.uuid())
      .min(2)
      .max(200)
      .refine((v) => new Set(v).size === v.length)
      .parse(ids);
    z.number().int().min(0).max(3600).parse(restSeconds);
    return this.repo.db.transaction(async (tx) => {
      const { kind, items } = await this.context(parent, tx);
      const selected = ids.map((id) => items.find((item) => item.id === id));
      if (selected.some((item) => !item || item.supersetGroupId))
        throw new Error('INVALID_GROUP_MEMBERS');
      const group = await this.repo.save(
        'superset_groups',
        {
          ...this.repo.base(),
          workoutId: parent.workoutId ?? null,
          routineId: parent.routineId ?? null,
          restSeconds,
          deletedAt: null,
        },
        tx,
      );
      for (const item of selected)
        await this.repo.save(kind, { ...item!, supersetGroupId: group.id }, tx);
      // Keep the selected members contiguous, at the first selected position.
      const order = exerciseBlocks(
        items.map((item) =>
          ids.includes(item.id) ? { ...item, supersetGroupId: group.id } : item,
        ),
      ).flat();
      for (const [position, item] of order.entries()) {
        const current = await this.repo.get(kind, item.id, tx);
        if (current.position !== position)
          await this.repo.save(kind, { ...current, position }, tx);
      }
      await this.clearRest(parent, tx);
      return group;
    });
  }
  async dissolveInTransaction(id: string, tx: SqlConnection) {
    const group = await this.repo.get('superset_groups', id, tx);
    const parent: GroupParent = group.workoutId
      ? { workoutId: group.workoutId }
      : { routineId: group.routineId! };
    const { kind, items } = await this.context(parent, tx);
    if (group.deletedAt) throw new DomainError('NOT_FOUND');
    for (const item of items.filter((e) => e.supersetGroupId === id))
      await this.repo.save(kind, { ...item, supersetGroupId: null }, tx);
    await this.repo.save(
      'superset_groups',
      { ...group, deletedAt: this.repo.runtime.now() },
      tx,
    );
    await this.clearRest(parent, tx);
  }
  dissolve(id: string) {
    return this.repo.db.transaction((tx) => this.dissolveInTransaction(id, tx));
  }
  updateRest(id: string, restSeconds: number) {
    z.number().int().min(0).max(3600).parse(restSeconds);
    return this.repo.db.transaction(async (tx) => {
      const group = await this.repo.get('superset_groups', id, tx);
      if (group.deletedAt) throw new DomainError('NOT_FOUND');
      const parent: GroupParent = group.workoutId
        ? { workoutId: group.workoutId }
        : { routineId: group.routineId! };
      await this.context(parent, tx);
      await this.repo.save('superset_groups', { ...group, restSeconds }, tx);
      await this.clearRest(parent, tx);
    });
  }
  reorder(parent: GroupParent, ids: string[]) {
    return this.repo.db.transaction(async (tx) => {
      const { kind, items } = await this.context(parent, tx);
      assertPermutation(ids, items);
      const ordered = ids.map((id, position) => ({
        ...items.find((item) => item.id === id)!,
        position,
      }));
      if (
        exerciseBlocks(ordered)
          .flat()
          .some((item, index) => item.id !== ids[index])
      )
        throw new Error('GROUP_MUST_STAY_CONTIGUOUS');
      for (const item of ordered)
        if (items.find((e) => e.id === item.id)!.position !== item.position)
          await this.repo.save(kind, item, tx);
      await this.clearRest(parent, tx);
    });
  }
}
/** A missing source reference must never silently become an ungrouped copy. */
export function copiedGroupId(
  sourceId: string | null,
  groups: Map<string, string>,
) {
  if (!sourceId) return null;
  const id = groups.get(sourceId);
  if (!id) throw new DomainError('NOT_FOUND');
  return id;
}
export async function copyGroups(
  repo: EntityRepository,
  groups: SupersetGroup[],
  parent: GroupParent,
  tx: SqlConnection,
) {
  const ids = new Map<string, string>();
  for (const source of groups.filter((g) => !g.deletedAt)) {
    const group = await repo.save(
      'superset_groups',
      {
        ...source,
        ...repo.base(),
        workoutId: parent.workoutId ?? null,
        routineId: parent.routineId ?? null,
      },
      tx,
    );
    ids.set(source.id, group.id);
  }
  return ids;
}
