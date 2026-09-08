import type { SqlConnection } from '../database/connection';
import { EntityRepository } from '../repositories/entities';
import { RoutineRepository } from '../repositories/routines';
import { schemas } from '../types/entities';
import { assertPermutation } from '../features/routines/model';
import { DomainError } from '../utils/errors';
import { WorkoutTemplateService } from './workoutTemplates';
export class ProgramService {
  private readonly routines: RoutineRepository;
  constructor(private readonly repo: EntityRepository) {
    this.routines = new RoutineRepository(repo);
  }
  private async live(id: string, tx: SqlConnection) {
    const program = await this.repo.get('programs', id, tx);
    if (program.deletedAt) throw new DomainError('NOT_FOUND');
    return program;
  }
  async list(tx: SqlConnection = this.repo.db) {
    return (await this.repo.list('programs', tx))
      .filter((p) => !p.deletedAt)
      .sort((a, b) => a.position - b.position || a.id.localeCompare(b.id));
  }
  private async entries(id: string, tx: SqlConnection) {
    return (await this.repo.list('program_routines', tx))
      .filter((r) => r.programId === id && !r.deletedAt)
      .sort((a, b) => a.position - b.position || a.id.localeCompare(b.id));
  }
  private async entry(id: string, tx: SqlConnection) {
    const entry = await this.repo.get('program_routines', id, tx);
    if (entry.deletedAt) throw new DomainError('NOT_FOUND');
    await this.live(entry.programId, tx);
    return entry;
  }
  detail(id: string) {
    return this.repo.db.transaction(async (tx) => {
      const program = await this.live(id, tx);
      const entries = [];
      for (const item of await this.entries(id, tx))
        entries.push({
          item,
          routine: await this.routines.live(item.routineId, tx),
        });
      return { program, entries };
    });
  }
  create(name: string) {
    return this.repo.db.transaction(async (tx) => {
      const siblings = await this.list(tx);
      return this.repo.save(
        'programs',
        {
          ...this.repo.base(),
          name,
          notes: '',
          position: Math.max(-1, ...siblings.map((p) => p.position)) + 1,
          deletedAt: null,
        },
        tx,
      );
    });
  }
  update(id: string, input: unknown) {
    const patch = schemas.programs
      .pick({ name: true, notes: true })
      .partial()
      .strict()
      .parse(input);
    return this.repo.db.transaction(async (tx) =>
      this.repo.save(
        'programs',
        { ...(await this.live(id, tx)), ...patch },
        tx,
      ),
    );
  }
  addRoutine(id: string, routineId: string) {
    return this.repo.db.transaction(async (tx) => {
      await this.live(id, tx);
      await this.routines.live(routineId, tx);
      const entries = await this.entries(id, tx);
      return this.repo.save(
        'program_routines',
        {
          ...this.repo.base(),
          programId: id,
          routineId,
          position: Math.max(-1, ...entries.map((r) => r.position)) + 1,
          deletedAt: null,
        },
        tx,
      );
    });
  }
  removeRoutine(id: string) {
    return this.repo.db.transaction(async (tx) =>
      this.repo.save(
        'program_routines',
        { ...(await this.entry(id, tx)), deletedAt: this.repo.runtime.now() },
        tx,
      ),
    );
  }
  reorderRoutines(id: string, ids: string[]) {
    return this.repo.db.transaction(async (tx) => {
      await this.live(id, tx);
      const entries = await this.entries(id, tx);
      assertPermutation(ids, entries);
      for (const item of entries)
        if (item.position !== ids.indexOf(item.id))
          await this.repo.save(
            'program_routines',
            { ...item, position: ids.indexOf(item.id) },
            tx,
          );
    });
  }
  reorder(ids: string[]) {
    return this.repo.db.transaction(async (tx) => {
      const rows = await this.list(tx);
      assertPermutation(ids, rows);
      for (const item of rows)
        if (item.position !== ids.indexOf(item.id))
          await this.repo.save(
            'programs',
            { ...item, position: ids.indexOf(item.id) },
            tx,
          );
    });
  }
  duplicate(id: string, name: string) {
    return this.repo.db.transaction(async (tx) => {
      const source = await this.live(id, tx);
      const siblings = await this.list(tx);
      const program = await this.repo.save(
        'programs',
        {
          ...source,
          ...this.repo.base(),
          name,
          position: Math.max(-1, ...siblings.map((p) => p.position)) + 1,
        },
        tx,
      );
      for (const item of await this.entries(id, tx)) {
        await this.routines.live(item.routineId, tx);
        await this.repo.save(
          'program_routines',
          { ...item, ...this.repo.base(), programId: program.id },
          tx,
        );
      }
      return program;
    });
  }
  remove(id: string) {
    return this.repo.db.transaction(async (tx) => {
      const program = await this.live(id, tx);
      const deletedAt = this.repo.runtime.now();
      for (const item of await this.entries(id, tx))
        await this.repo.save('program_routines', { ...item, deletedAt }, tx);
      await this.repo.save('programs', { ...program, deletedAt }, tx);
    });
  }
  startEntry(id: string) {
    return this.repo.db.transaction(async (tx) => {
      const entry = await this.entry(id, tx);
      return new WorkoutTemplateService(this.repo).startRoutineInTransaction(
        entry.routineId,
        tx,
      );
    });
  }
}
