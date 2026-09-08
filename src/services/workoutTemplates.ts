import { z } from 'zod';
import { EntityRepository } from '../repositories/entities';
import { RoutineRepository } from '../repositories/routines';
import type { SqlConnection } from '../database/connection';
import {
  setTargetsSchema,
  type SetTargets,
  type SupersetGroup,
} from '../types/entities';
import { copyGroups, copiedGroupId } from './supersets';
import { DomainError } from '../utils/errors';

interface WorkoutTemplate {
  name: string;
  notes: string;
  routineId: string | null;
  groups: SupersetGroup[];
  exercises: {
    exerciseId: string;
    notes: string;
    restSeconds: number;
    supersetGroupId: string | null;
    sets: SetTargets[];
  }[];
}
export class WorkoutTemplateService {
  private readonly routines: RoutineRepository;
  constructor(private readonly repo: EntityRepository) {
    this.routines = new RoutineRepository(repo);
  }
  private async start(template: WorkoutTemplate, tx: SqlConnection) {
    if (
      (await this.repo.list('workouts', tx)).some((w) => w.status === 'ACTIVE')
    )
      throw new DomainError('WORKOUT_ACTIVE');
    if (
      !template.exercises.length ||
      template.exercises.some((e) => !e.sets.length)
    )
      throw new DomainError('EMPTY_ROUTINE');
    const base = this.repo.base();
    const workout = await this.repo.save(
      'workouts',
      {
        ...base,
        title: template.name,
        notes: template.notes,
        routineId: template.routineId,
        status: 'ACTIVE',
        privacy: 'PRIVATE',
        startedAt: base.createdAt,
        finishedAt: null,
        restEndsAt: null,
      },
      tx,
    );
    const groups = await copyGroups(
      this.repo,
      template.groups,
      { workoutId: workout.id },
      tx,
    );
    for (const [position, source] of template.exercises.entries()) {
      const item = await this.repo.save(
        'workout_exercises',
        {
          ...this.repo.base(),
          workoutId: workout.id,
          exerciseId: source.exerciseId,
          notes: source.notes,
          restSeconds: source.restSeconds,
          position,
          supersetGroupId: copiedGroupId(source.supersetGroupId, groups),
        },
        tx,
      );
      for (const [index, targets] of source.sets.entries())
        await this.repo.save(
          'workout_sets',
          {
            ...this.repo.base(),
            ...targets,
            workoutExerciseId: item.id,
            position: index,
            completedAt: null,
            deletedAt: null,
          },
          tx,
        );
    }
    return workout;
  }
  startRoutine(id: string) {
    return this.repo.db.transaction((tx) =>
      this.startRoutineInTransaction(id, tx),
    );
  }
  async startRoutineInTransaction(id: string, tx: SqlConnection) {
    const source = await this.routines.detail(id, tx);
    return this.start(
      {
        name: source.routine.name,
        notes: source.routine.notes,
        routineId: source.routine.id,
        groups: source.groups,
        exercises: source.exercises.map(({ item, sets }) => ({
          exerciseId: item.exerciseId,
          notes: item.notes,
          restSeconds: item.restSeconds,
          supersetGroupId: item.supersetGroupId,
          sets: sets.map((set) => setTargetsSchema.parse(set)),
        })),
      },
      tx,
    );
  }
  private async fromWorkout(
    id: string,
    tx: SqlConnection,
  ): Promise<WorkoutTemplate> {
    const workout = await this.repo.get('workouts', id, tx);
    if (workout.status !== 'FINISHED') throw new DomainError('WORKOUT_CLOSED');
    const items = (await this.repo.list('workout_exercises', tx))
      .filter((e) => e.workoutId === id)
      .sort((a, b) => a.position - b.position);
    const sets = (await this.repo.list('workout_sets', tx)).filter(
      (s) => !s.deletedAt,
    );
    const exercises: WorkoutTemplate['exercises'] = [];
    for (const item of items) {
      const exercise = await this.repo.get('exercises', item.exerciseId, tx);
      exercises.push({
        exerciseId: item.exerciseId,
        notes: item.notes,
        restSeconds: item.restSeconds ?? exercise.defaultRestSeconds,
        supersetGroupId: item.supersetGroupId,
        sets: sets
          .filter((s) => s.workoutExerciseId === item.id)
          .sort((a, b) => a.position - b.position)
          .map((s) => setTargetsSchema.parse(s)),
      });
    }
    return {
      name: workout.title,
      notes: workout.notes,
      routineId: null,
      groups: (await this.repo.list('superset_groups', tx)).filter(
        (g) => g.workoutId === id && !g.deletedAt,
      ),
      exercises,
    };
  }
  repeatWorkout(id: string, title?: string) {
    if (title !== undefined) z.string().trim().min(1).max(160).parse(title);
    return this.repo.db.transaction(async (tx) => {
      const source = await this.fromWorkout(id, tx);
      return this.start({ ...source, name: title ?? source.name }, tx);
    });
  }
  saveAsRoutine(id: string, name: string) {
    z.string().trim().min(1).max(160).parse(name);
    return this.repo.db.transaction(async (tx) => {
      const source = await this.fromWorkout(id, tx);
      const siblings = (await this.routines.list(tx)).filter(
        (r) => r.folderId === null,
      );
      const routine = await this.repo.save(
        'routines',
        {
          ...this.repo.base(),
          name,
          folderId: null,
          notes: source.notes,
          position: Math.max(-1, ...siblings.map((r) => r.position)) + 1,
          deletedAt: null,
        },
        tx,
      );
      const groups = await copyGroups(
        this.repo,
        source.groups,
        { routineId: routine.id },
        tx,
      );
      for (const [position, entry] of source.exercises.entries()) {
        const item = await this.repo.save(
          'routine_exercises',
          {
            ...this.repo.base(),
            routineId: routine.id,
            exerciseId: entry.exerciseId,
            notes: entry.notes,
            restSeconds: entry.restSeconds,
            supersetGroupId: copiedGroupId(entry.supersetGroupId, groups),
            position,
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
