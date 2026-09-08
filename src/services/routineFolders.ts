import { z } from 'zod';
import { EntityRepository } from '../repositories/entities';
import { RoutineRepository } from '../repositories/routines';
import type { SqlConnection } from '../database/connection';
import type { Routine } from '../types/entities';
import { assertPermutation } from '../features/routines/model';
import { DomainError } from '../utils/errors';
export class RoutineFolderService {
  private readonly routines: RoutineRepository;
  constructor(private readonly repo: EntityRepository) {
    this.routines = new RoutineRepository(repo);
  }
  async live(id: string, tx: SqlConnection) {
    const folder = await this.repo.get('routine_folders', id, tx);
    if (folder.deletedAt) throw new DomainError('NOT_FOUND');
    return folder;
  }
  async list(tx: SqlConnection = this.repo.db) {
    return (await this.repo.list('routine_folders', tx))
      .filter((f) => !f.deletedAt)
      .sort((a, b) => a.position - b.position || a.id.localeCompare(b.id));
  }
  library() {
    return this.repo.db.transaction(async (tx) => ({
      folders: await this.list(tx),
      routines: await this.routines.list(tx),
    }));
  }
  create(name: string) {
    return this.repo.db.transaction(async (tx) => {
      const folders = await this.list(tx);
      return this.repo.save(
        'routine_folders',
        {
          ...this.repo.base(),
          name,
          position: Math.max(-1, ...folders.map((f) => f.position)) + 1,
          deletedAt: null,
        },
        tx,
      );
    });
  }
  rename(id: string, name: string) {
    return this.repo.db.transaction(async (tx) =>
      this.repo.save(
        'routine_folders',
        { ...(await this.live(id, tx)), name },
        tx,
      ),
    );
  }
  reorder(ids: string[]) {
    return this.repo.db.transaction(async (tx) => {
      const folders = await this.list(tx);
      assertPermutation(ids, folders);
      for (const folder of folders)
        if (folder.position !== ids.indexOf(folder.id))
          await this.repo.save(
            'routine_folders',
            { ...folder, position: ids.indexOf(folder.id) },
            tx,
          );
    });
  }
  moveFolder(id: string, beforeId: string | null) {
    return this.repo.db.transaction(async (tx) => {
      await this.live(id, tx);
      const folders = await this.list(tx);
      if (beforeId === id) return;
      const ids = folders.filter((f) => f.id !== id).map((f) => f.id);
      const index = beforeId === null ? ids.length : ids.indexOf(beforeId);
      if (index < 0) throw new DomainError('NOT_FOUND');
      ids.splice(index, 0, id);
      for (const folder of folders)
        if (folder.position !== ids.indexOf(folder.id))
          await this.repo.save(
            'routine_folders',
            { ...folder, position: ids.indexOf(folder.id) },
            tx,
          );
    });
  }
  private async orderRoutines(
    rows: Routine[],
    folderId: string | null,
    tx: SqlConnection,
  ) {
    for (const [position, routine] of rows.entries())
      if (routine.folderId !== folderId || routine.position !== position)
        await this.repo.save(
          'routines',
          { ...routine, folderId, position },
          tx,
        );
  }
  moveRoutine(
    id: string,
    folderId: string | null,
    beforeId: string | null = null,
  ) {
    z.uuid().nullable().parse(folderId);
    return this.repo.db.transaction(async (tx) => {
      const routine = await this.routines.live(id, tx);
      if (folderId) await this.live(folderId, tx);
      if (beforeId === id && routine.folderId === folderId) return;
      const all = await this.routines.list(tx);
      const destination = all.filter(
        (r) => r.folderId === folderId && r.id !== id,
      );
      const index =
        beforeId === null
          ? destination.length
          : destination.findIndex((r) => r.id === beforeId);
      if (index < 0) throw new DomainError('NOT_FOUND');
      destination.splice(index, 0, routine);
      if (routine.folderId !== folderId)
        await this.orderRoutines(
          all.filter((r) => r.folderId === routine.folderId && r.id !== id),
          routine.folderId,
          tx,
        );
      await this.orderRoutines(destination, folderId, tx);
    });
  }
  remove(id: string) {
    return this.repo.db.transaction(async (tx) => {
      const folder = await this.live(id, tx);
      const all = await this.routines.list(tx);
      await this.orderRoutines(
        [
          ...all.filter((r) => r.folderId === null),
          ...all.filter((r) => r.folderId === id),
        ],
        null,
        tx,
      );
      await this.repo.save(
        'routine_folders',
        { ...folder, deletedAt: this.repo.runtime.now() },
        tx,
      );
    });
  }
}
