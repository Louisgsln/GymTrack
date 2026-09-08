import { EntityRepository } from '../repositories/entities';
import { RoutineRepository } from '../repositories/routines';
import {
  parseSharedRoutine,
  serializeRoutine,
} from '../features/routines/model';

export class RoutineSharingService {
  private readonly routines: RoutineRepository;
  constructor(private readonly repo: EntityRepository) {
    this.routines = new RoutineRepository(repo);
  }
  export(id: string) {
    return this.repo.db.transaction(async (tx) =>
      serializeRoutine(await this.routines.detail(id, tx)),
    );
  }
  preview(text: string) {
    return parseSharedRoutine(text);
  }
  /** Called only after review and explicit confirmation in the UI. */
  import(text: string) {
    const source = parseSharedRoutine(text);
    return this.repo.db.transaction(async (tx) => {
      const siblings = (await this.routines.list(tx)).filter(
        (r) => r.folderId === null,
      );
      const routine = await this.repo.save(
        'routines',
        {
          ...this.repo.base(),
          name: source.name,
          folderId: null,
          notes: source.notes,
          position: Math.max(-1, ...siblings.map((r) => r.position)) + 1,
          deletedAt: null,
        },
        tx,
      );
      // Never trust sender IDs or merge definitions by name: local custom exercises remain independent.
      const memberGroups = new Map<number, string>();
      for (const entry of 'groups' in source ? source.groups : []) {
        const group = await this.repo.save(
          'superset_groups',
          {
            ...this.repo.base(),
            workoutId: null,
            routineId: routine.id,
            restSeconds: entry.restSeconds,
            deletedAt: null,
          },
          tx,
        );
        for (const member of entry.members) memberGroups.set(member, group.id);
      }
      const definitions = new Map<string, string>();
      for (const [position, entry] of source.exercises.entries()) {
        const fingerprint = JSON.stringify(entry.definition);
        let exerciseId = definitions.get(fingerprint);
        if (!exerciseId) {
          const exercise = await this.repo.save(
            'exercises',
            { ...this.repo.base(), ...entry.definition },
            tx,
          );
          exerciseId = exercise.id;
          definitions.set(fingerprint, exerciseId);
        }
        const item = await this.repo.save(
          'routine_exercises',
          {
            ...this.repo.base(),
            routineId: routine.id,
            exerciseId,
            position,
            notes: entry.notes,
            restSeconds: entry.restSeconds,
            supersetGroupId: memberGroups.get(position) ?? null,
            deletedAt: null,
          },
          tx,
        );
        for (const [index, targets] of entry.sets.entries())
          await this.repo.save(
            'routine_sets',
            {
              ...this.repo.base(),
              ...targets,
              routineExerciseId: item.id,
              position: index,
              deletedAt: null,
            },
            tx,
          );
      }
      return routine;
    });
  }
}
