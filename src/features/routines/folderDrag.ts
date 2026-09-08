import type { Routine, RoutineFolder } from '../../types/entities';
export interface FolderRow {
  key: string;
  kind: 'root' | 'folder' | 'routine' | 'end';
  id: string | null;
  folderId: string | null;
  label: string;
}
export interface DropRect {
  row: FolderRow;
  x: number;
  y: number;
  width: number;
  height: number;
}
export function folderRows(
  folders: RoutineFolder[],
  routines: Routine[],
  rootLabel: string,
  endLabel: string,
): FolderRow[] {
  const rows: FolderRow[] = [];
  for (const folder of [null, ...folders]) {
    rows.push({
      key: folder ? `folder-${folder.id}` : 'root',
      kind: folder ? 'folder' : 'root',
      id: folder?.id ?? null,
      folderId: folder?.id ?? null,
      label: folder?.name ?? rootLabel,
    });
    for (const routine of routines
      .filter((r) => r.folderId === (folder?.id ?? null))
      .sort((a, b) => a.position - b.position || a.id.localeCompare(b.id)))
      rows.push({
        key: `routine-${routine.id}`,
        kind: 'routine',
        id: routine.id,
        folderId: routine.folderId,
        label: routine.name,
      });
  }
  rows.push({
    key: 'end',
    kind: 'end',
    id: null,
    folderId: null,
    label: endLabel,
  });
  return rows;
}
export function dropTarget(
  source: FolderRow,
  rects: DropRect[],
  x: number,
  y: number,
) {
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  return (
    rects.find(
      ({ row, x: left, y: top, width, height }) =>
        row.key !== source.key &&
        (source.kind === 'folder'
          ? row.kind === 'folder' || row.kind === 'end'
          : row.kind !== 'end') &&
        width > 0 &&
        height > 0 &&
        x >= left &&
        x <= left + width &&
        y >= top &&
        y <= top + height,
    )?.row ?? null
  );
}
