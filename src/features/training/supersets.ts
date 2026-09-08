import type { WorkoutExercise, WorkoutSet } from '../../types/entities';
export interface GroupedItem {
  id: string;
  position: number;
  supersetGroupId: string | null;
}
export function exerciseBlocks<T extends GroupedItem>(items: T[]): T[][] {
  const blocks: T[][] = [];
  const groups = new Map<string, T[]>();
  for (const item of [...items].sort(
    (a, b) => a.position - b.position || a.id.localeCompare(b.id),
  )) {
    if (!item.supersetGroupId) {
      blocks.push([item]);
      continue;
    }
    let block = groups.get(item.supersetGroupId);
    if (!block) {
      block = [];
      groups.set(item.supersetGroupId, block);
      blocks.push(block);
    }
    block.push(item);
  }
  return blocks;
}
export function groupLabels(items: GroupedItem[]) {
  const labels: Record<string, string> = {};
  let groupIndex = 0;
  for (const block of exerciseBlocks(items)) {
    if (!block[0]?.supersetGroupId) continue;
    let index = ++groupIndex;
    let letter = '';
    while (index > 0) {
      index--;
      letter = String.fromCharCode(65 + (index % 26)) + letter;
      index = Math.floor(index / 26);
    }
    block.forEach((item, i) => {
      labels[item.id] = `${letter}${i + 1}`;
    });
  }
  return labels;
}
export function orderedSets(sets: WorkoutSet[], itemId: string) {
  return sets
    .filter((s) => s.workoutExerciseId === itemId && !s.deletedAt)
    .sort((a, b) => a.position - b.position || a.id.localeCompare(b.id));
}
export function circuitSequence(items: WorkoutExercise[], sets: WorkoutSet[]) {
  const sequence: WorkoutSet[] = [];
  for (const block of exerciseBlocks(items)) {
    const columns = block.map((item) => orderedSets(sets, item.id));
    const rounds = Math.max(0, ...columns.map((column) => column.length));
    for (let round = 0; round < rounds; round++)
      for (const column of columns)
        if (column[round]) sequence.push(column[round]!);
  }
  return sequence;
}
export function completedRound(
  set: WorkoutSet,
  members: WorkoutExercise[],
  sets: WorkoutSet[],
) {
  const round = orderedSets(sets, set.workoutExerciseId).findIndex(
    (s) => s.id === set.id,
  );
  return (
    round >= 0 &&
    members.every((item) => {
      const member = orderedSets(sets, item.id)[round];
      return !member || !!member.completedAt;
    })
  );
}
