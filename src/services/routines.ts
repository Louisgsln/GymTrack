import { z } from 'zod';
import { EntityRepository } from '../repositories/entities';
import { RoutineRepository } from '../repositories/routines';
import {
  routineSchema,
  routineExerciseSchema,
  setTargetsSchema,
} from '../types/entities';
import { assertPermutation, emptyTargets } from '../features/routines/model';
import { DomainError } from '../utils/errors';
import type { SqlConnection } from '../database/connection';
import { SupersetService, copyGroups, copiedGroupId } from './supersets';
import { RoutineFolderService } from './routineFolders';

/** All commands update the durable entity and outbox in the same transaction. */
export class RoutineService {
  readonly repository: RoutineRepository;
  constructor(private readonly repo: EntityRepository) {
    this.repository = new RoutineRepository(repo);
  }
  list() {
    return this.repository.list();
  }
  detail(id: string) {
    return this.repo.db.transaction((tx) => this.repository.detail(id, tx));
  }
  create(name: string, folderId: string | null = null) {
    return this.repo.db.transaction(async (tx) => {
      if (folderId)
        await new RoutineFolderService(this.repo).live(folderId, tx);
      const siblings = (await this.repository.list(tx)).filter(
        (r) => r.folderId === folderId,
      );
      return this.repo.save(
        'routines',
        {
          ...this.repo.base(),
          name,
          notes: '',
          folderId,
          position: siblings.length
            ? Math.max(...siblings.map((r) => r.position)) + 1
            : 0,
          deletedAt: null,
        },
        tx,
      );
    });
  }
  update(id: string, input: unknown) {
    const patch = routineSchema
      .pick({ name: true, notes: true })
      .partial()
      .strict()
      .parse(input);
    return this.repo.db.transaction(async (tx) =>
      this.repo.save(
        'routines',
        { ...(await this.repository.live(id, tx)), ...patch },
        tx,
      ),
    );
  }
  private async exercise(id: string, tx: SqlConnection) {
    const item = await this.repo.get('routine_exercises', id, tx);
    await this.repository.live(item.routineId, tx);
    if (item.deletedAt) throw new DomainError('NOT_FOUND');
    return item;
  }
  private async set(id: string, tx: SqlConnection) {
    const set = await this.repo.get('routine_sets', id, tx);
    await this.exercise(set.routineExerciseId, tx);
    if (set.deletedAt) throw new DomainError('NOT_FOUND');
    return set;
  }
  addExercise(routineId: string, exerciseId: string) {
    return this.repo.db.transaction(async (tx) => {
      await this.repository.live(routineId, tx);
      const exercise = await this.repo.get('exercises', exerciseId, tx);
      const siblings = await this.repository.exercises(routineId, tx);
      const item = await this.repo.save(
        'routine_exercises',
        {
          ...this.repo.base(),
          routineId,
          exerciseId,
          position: siblings.length
            ? Math.max(...siblings.map((e) => e.position)) + 1
            : 0,
          notes: '',
          restSeconds: exercise.defaultRestSeconds,
          supersetGroupId: null,
          deletedAt: null,
        },
        tx,
      );
      await this.repo.save(
        'routine_sets',
        {
          ...this.repo.base(),
          ...emptyTargets,
          routineExerciseId: item.id,
          position: 0,
          deletedAt: null,
        },
        tx,
      );
      return item;
    });
  }
  updateExercise(id: string, input: unknown) {
    const patch = routineExerciseSchema
      .pick({ notes: true, restSeconds: true })
      .partial()
      .strict()
      .parse(input);
    return this.repo.db.transaction(async (tx) =>
      this.repo.save(
        'routine_exercises',
        { ...(await this.exercise(id, tx)), ...patch },
        tx,
      ),
    );
  }
  addSet(routineExerciseId: string, copyId?: string) {
    return this.repo.db.transaction(async (tx) => {
      await this.exercise(routineExerciseId, tx);
      const siblings = await this.repository.sets(routineExerciseId, tx);
      const source = copyId ? await this.set(copyId, tx) : siblings.at(-1);
      if (source && source.routineExerciseId !== routineExerciseId)
        throw new DomainError('NOT_FOUND');
      return this.repo.save(
        'routine_sets',
        {
          ...this.repo.base(),
          ...setTargetsSchema.parse(source ?? emptyTargets),
          routineExerciseId,
          position: siblings.length
            ? Math.max(...siblings.map((s) => s.position)) + 1
            : 0,
          deletedAt: null,
        },
        tx,
      );
    });
  }
  updateSet(id: string, input: unknown) {
    const patch = setTargetsSchema.partial().strict().parse(input);
    return this.repo.db.transaction(async (tx) =>
      this.repo.save(
        'routine_sets',
        { ...(await this.set(id, tx)), ...patch },
        tx,
      ),
    );
  }
  removeSet(id: string) {
    return this.repo.db.transaction(async (tx) => {
      const set = await this.set(id, tx);
      await this.repo.save(
        'routine_sets',
        { ...set, deletedAt: this.repo.runtime.now() },
        tx,
      );
    });
  }
  private async tombstoneExercise(id: string, tx: SqlConnection) {
    const item = await this.exercise(id, tx);
    if (item.supersetGroupId) {
      await new SupersetService(this.repo).dissolveInTransaction(
        item.supersetGroupId,
        tx,
      );
      item.supersetGroupId = null;
      item.revision = (
        await this.repo.get('routine_exercises', id, tx)
      ).revision;
    }
    const deletedAt = this.repo.runtime.now();
    for (const set of await this.repository.sets(id, tx))
      await this.repo.save('routine_sets', { ...set, deletedAt }, tx);
    await this.repo.save('routine_exercises', { ...item, deletedAt }, tx);
  }
  removeExercise(id: string) {
    return this.repo.db.transaction((tx) => this.tombstoneExercise(id, tx));
  }
  remove(id: string) {
    return this.repo.db.transaction(async (tx) => {
      const routine = await this.repository.live(id, tx);
      for (const entry of (await this.repo.list('program_routines', tx)).filter(
        (e) => e.routineId === id && !e.deletedAt,
      ))
        await this.repo.save(
          'program_routines',
          { ...entry, deletedAt: this.repo.runtime.now() },
          tx,
        );
      for (const item of await this.repository.exercises(id, tx))
        await this.tombstoneExercise(item.id, tx);
      await this.repo.save(
        'routines',
        { ...routine, deletedAt: this.repo.runtime.now() },
        tx,
      );
    });
  }
  reorder(ids: string[], folderId: string | null = null) {
    return this.repo.db.transaction(async (tx) => {
      if (folderId)
        await new RoutineFolderService(this.repo).live(folderId, tx);
      const current = (await this.repository.list(tx)).filter(
        (r) => r.folderId === folderId,
      );
      assertPermutation(ids, current);
      for (const routine of current)
        if (routine.position !== ids.indexOf(routine.id))
          await this.repo.save(
            'routines',
            { ...routine, position: ids.indexOf(routine.id) },
            tx,
          );
    });
  }
  reorderExercises(routineId: string, ids: string[]) {
    return new SupersetService(this.repo).reorder({ routineId }, ids);
  }
  reorderSets(exerciseId: string, ids: string[]) {
    return this.repo.db.transaction(async (tx) => {
      await this.exercise(exerciseId, tx);
      const current = await this.repository.sets(exerciseId, tx);
      assertPermutation(ids, current);
      for (const set of current)
        if (set.position !== ids.indexOf(set.id))
          await this.repo.save(
            'routine_sets',
            { ...set, position: ids.indexOf(set.id) },
            tx,
          );
    });
  }
  duplicate(id: string, name: string) {
    z.string().trim().min(1).max(160).parse(name);
    return this.repo.db.transaction(async (tx) => {
      const source = await this.repository.detail(id, tx);
      const siblings = (await this.repository.list(tx)).filter(
        (r) => r.folderId === source.routine.folderId,
      );
      const routine = await this.repo.save(
        'routines',
        {
          ...source.routine,
          ...this.repo.base(),
          name,
          position: Math.max(-1, ...siblings.map((r) => r.position)) + 1,
        },
        tx,
      );
      const groups = await copyGroups(
        this.repo,
        source.groups,
        { routineId: routine.id },
        tx,
      );
      for (const { item, sets } of source.exercises) {
        const copied = await this.repo.save(
          'routine_exercises',
          {
            ...item,
            ...this.repo.base(),
            routineId: routine.id,
            supersetGroupId: copiedGroupId(item.supersetGroupId, groups),
          },
          tx,
        );
        for (const set of sets)
          await this.repo.save(
            'routine_sets',
            { ...set, ...this.repo.base(), routineExerciseId: copied.id },
            tx,
          );
      }
      return routine;
    });
  }
}
