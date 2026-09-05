import { z } from 'zod';
import { EntityRepository } from '../repositories/entities';
import type { SqlConnection } from '../database/connection';
import {
  exerciseSchema,
  workoutSetSchema,
  type Workout,
  type WorkoutSet,
} from '../types/entities';
import { DomainError } from '../utils/errors';
import { summarizeSets } from '../features/training/calculations';

export class TrainingService {
  constructor(private readonly repo: EntityRepository) {}
  async state() {
    const workouts = await this.repo.list('workouts');
    const exercises = await this.repo.list('exercises');
    const workoutExercises = await this.repo.list('workout_exercises');
    const sets = (await this.repo.list('workout_sets')).filter(
      (s) => !s.deletedAt,
    );
    return {
      active: workouts.find((w) => w.status === 'ACTIVE') ?? null,
      history: workouts
        .filter((w) => w.status === 'FINISHED')
        .sort((a, b) => b.startedAt.localeCompare(a.startedAt)),
      exercises,
      workoutExercises,
      sets,
    };
  }
  private async active(id: string, tx: SqlConnection): Promise<Workout> {
    const workout = await this.repo.get('workouts', id, tx);
    if (workout.status !== 'ACTIVE') throw new DomainError('WORKOUT_CLOSED');
    return workout;
  }
  start(title: string) {
    return this.repo.db.transaction(async (tx) => {
      const active = (await this.repo.list('workouts', tx)).find(
        (w) => w.status === 'ACTIVE',
      );
      if (active) return active;
      const base = this.repo.base();
      return this.repo.save(
        'workouts',
        {
          ...base,
          title,
          startedAt: base.createdAt,
          finishedAt: null,
          status: 'ACTIVE',
          privacy: 'PRIVATE',
          notes: '',
          routineId: null,
          restEndsAt: null,
        },
        tx,
      );
    });
  }
  createExercise(input: unknown) {
    return this.repo.db.transaction((tx) =>
      this.repo.save(
        'exercises',
        exerciseSchema.parse({
          ...this.repo.base(),
          ...exerciseSchema
            .omit({
              id: true,
              ownerId: true,
              revision: true,
              createdAt: true,
              updatedAt: true,
            })
            .parse(input),
        }),
        tx,
      ),
    );
  }
  addExercise(workoutId: string, exerciseId: string) {
    return this.repo.db.transaction(async (tx) => {
      await this.active(workoutId, tx);
      await this.repo.get('exercises', exerciseId, tx);
      const existing = (await this.repo.list('workout_exercises', tx)).filter(
        (e) => e.workoutId === workoutId,
      );
      const item = await this.repo.save(
        'workout_exercises',
        {
          ...this.repo.base(),
          workoutId,
          exerciseId,
          position: existing.length,
          notes: '',
          supersetGroupId: null,
        },
        tx,
      );
      await this.newSet(item.id, tx);
      return item;
    });
  }
  private async newSet(workoutExerciseId: string, tx: SqlConnection) {
    const sets = (await this.repo.list('workout_sets', tx)).filter(
      (s) => s.workoutExerciseId === workoutExerciseId && !s.deletedAt,
    );
    const previous = sets.sort((a, b) => a.position - b.position).at(-1);
    return this.repo.save(
      'workout_sets',
      {
        ...this.repo.base(),
        workoutExerciseId,
        position: (previous?.position ?? -1) + 1,
        type: 'NORMAL',
        weightKg: previous?.weightKg ?? 0,
        reps: previous?.reps ?? 0,
        rpe: null,
        rir: null,
        durationSeconds: null,
        distanceMeters: null,
        completedAt: null,
        deletedAt: null,
      },
      tx,
    );
  }
  addSet(workoutExerciseId: string) {
    return this.repo.db.transaction(async (tx) => {
      const item = await this.repo.get(
        'workout_exercises',
        workoutExerciseId,
        tx,
      );
      await this.active(item.workoutId, tx);
      return this.newSet(item.id, tx);
    });
  }
  updateSet(id: string, input: unknown) {
    const patch = workoutSetSchema
      .pick({
        weightKg: true,
        reps: true,
        rpe: true,
        rir: true,
        type: true,
        durationSeconds: true,
        distanceMeters: true,
      })
      .partial()
      .strict()
      .parse(input);
    return this.repo.db.transaction(async (tx) => {
      const set = await this.repo.get('workout_sets', id, tx);
      const item = await this.repo.get(
        'workout_exercises',
        set.workoutExerciseId,
        tx,
      );
      await this.active(item.workoutId, tx);
      if (set.deletedAt) throw new DomainError('NOT_FOUND');
      const next = { ...set, ...patch };
      if (next.completedAt)
        await this.validateCompleted(next, item.exerciseId, tx);
      return this.repo.save('workout_sets', next, tx);
    });
  }
  private async validateCompleted(
    set: WorkoutSet,
    exerciseId: string,
    tx: SqlConnection,
  ) {
    const exercise = await this.repo.get('exercises', exerciseId, tx);
    if (
      (['WEIGHT_REPS', 'BODYWEIGHT_REPS', 'ASSISTED_BODYWEIGHT'].includes(
        exercise.trackingType,
      ) &&
        set.reps <= 0) ||
      (['WEIGHT_DURATION', 'DURATION', 'DISTANCE_DURATION'].includes(
        exercise.trackingType,
      ) &&
        !(set.durationSeconds && set.durationSeconds > 0)) ||
      (['DISTANCE', 'DISTANCE_DURATION'].includes(exercise.trackingType) &&
        !(set.distanceMeters && set.distanceMeters > 0))
    ) {
      throw new DomainError('INVALID_SET');
    }
  }
  completeSet(id: string, complete: boolean) {
    return this.repo.db.transaction(async (tx) => {
      const set = await this.repo.get('workout_sets', id, tx);
      const item = await this.repo.get(
        'workout_exercises',
        set.workoutExerciseId,
        tx,
      );
      const workout = await this.active(item.workoutId, tx);
      if (set.deletedAt) throw new DomainError('NOT_FOUND');
      if (complete) await this.validateCompleted(set, item.exerciseId, tx);
      if (!!set.completedAt === complete) return set;
      const now = this.repo.runtime.now();
      const next = await this.repo.save(
        'workout_sets',
        { ...set, completedAt: complete ? now : null },
        tx,
      );
      if (complete) {
        const exercise = await this.repo.get('exercises', item.exerciseId, tx);
        await this.repo.save(
          'workouts',
          {
            ...workout,
            restEndsAt: new Date(
              Date.parse(now) + exercise.defaultRestSeconds * 1000,
            ).toISOString(),
          },
          tx,
        );
      }
      return next;
    });
  }
  duplicateSet(id: string) {
    return this.repo.db.transaction(async (tx) => {
      const set = await this.repo.get('workout_sets', id, tx);
      const item = await this.repo.get(
        'workout_exercises',
        set.workoutExerciseId,
        tx,
      );
      await this.active(item.workoutId, tx);
      if (set.deletedAt) throw new DomainError('NOT_FOUND');
      const created = await this.newSet(item.id, tx);
      return this.repo.save(
        'workout_sets',
        {
          ...set,
          ...created,
          weightKg: set.weightKg,
          reps: set.reps,
          type: set.type,
          rpe: set.rpe,
          rir: set.rir,
          durationSeconds: set.durationSeconds,
          distanceMeters: set.distanceMeters,
        },
        tx,
      );
    });
  }
  deleteSet(id: string) {
    return this.repo.db.transaction(async (tx) => {
      const set = await this.repo.get('workout_sets', id, tx);
      const item = await this.repo.get(
        'workout_exercises',
        set.workoutExerciseId,
        tx,
      );
      await this.active(item.workoutId, tx);
      if (set.deletedAt) return;
      await this.repo.save(
        'workout_sets',
        { ...set, deletedAt: this.repo.runtime.now() },
        tx,
      );
    });
  }
  editWorkout(id: string, input: unknown) {
    const patch = z
      .object({
        title: z.string().trim().min(1).max(160).optional(),
        notes: z.string().max(10000).optional(),
      })
      .strict()
      .parse(input);
    return this.repo.db.transaction(async (tx) =>
      this.repo.save(
        'workouts',
        { ...(await this.active(id, tx)), ...patch },
        tx,
      ),
    );
  }
  adjustRest(id: string, seconds: number | null) {
    if (seconds !== null) z.number().int().min(-3600).max(3600).parse(seconds);
    return this.repo.db.transaction(async (tx) => {
      const workout = await this.active(id, tx);
      const now = Date.parse(this.repo.runtime.now());
      const deadline =
        seconds === null
          ? null
          : new Date(
              Math.max(
                now,
                Date.parse(workout.restEndsAt ?? this.repo.runtime.now()),
              ) +
                seconds * 1000,
            ).toISOString();
      return this.repo.save(
        'workouts',
        { ...workout, restEndsAt: deadline },
        tx,
      );
    });
  }
  finish(id: string, discard = false) {
    return this.repo.db.transaction(async (tx) => {
      const workout = await this.active(id, tx);
      return this.repo.save(
        'workouts',
        {
          ...workout,
          status: discard ? 'DISCARDED' : 'FINISHED',
          finishedAt: this.repo.runtime.now(),
          restEndsAt: null,
        },
        tx,
      );
    });
  }
  async summary(id: string) {
    const state = await this.state();
    const ids = new Set(
      state.workoutExercises.filter((e) => e.workoutId === id).map((e) => e.id),
    );
    return summarizeSets(
      state.sets.filter((set) => ids.has(set.workoutExerciseId)),
    );
  }
}
