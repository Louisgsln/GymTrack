import React from 'react';
import { act, create, type ReactTestRenderer } from 'react-test-renderer';
import {
  QueryClient,
  QueryClientProvider,
  onlineManager,
} from '@tanstack/react-query';
import { createLocalQueryClient } from '../src/providers/localQueryClient';
import { beforeEach, afterEach, it, expect, vi } from 'vitest';
import { setup, exerciseInput } from './helpers/database';
import Plan from '../app/plan';
import Train from '../app/train';
import History from '../app/history';
import { usePreferences } from '../src/store/preferences';
import { fr } from '../src/i18n/messages';
import { circuitSequence } from '../src/features/training/supersets';
let services: Awaited<ReturnType<typeof setup>>;
let root: ReactTestRenderer;
let client: QueryClient;
it('composes and reorders a program offline, starts its routine, then duplicates and safely deletes the program', async () => {
  const push = await services.routines.create('Push');
  const pull = await services.routines.create('Pull');
  const exercise = await services.training.createExercise(exerciseInput);
  await services.routines.addExercise(push.id, exercise.id);
  const set = (await services.routines.detail(push.id)).exercises[0]!.sets[0]!;
  await services.routines.updateSet(set.id, { weightKg: 50, reps: 8 });
  onlineManager.setOnline(false);
  await mount();
  await tap(fr.programs);
  await type(fr.programName, 'Strength');
  await tap(fr.createProgram);
  await type(fr.programNotes, 'Three sessions');
  await tap(`${fr.addProgramRoutine} · Push`);
  await tap(`${fr.addProgramRoutine} · Pull`);
  await tap(`${fr.addProgramRoutine} · Push`);
  const program = (await services.programs.list())[0]!;
  expect(
    (await services.programs.detail(program.id)).entries.map(
      (e) => e.routine.id,
    ),
  ).toEqual([push.id, pull.id, push.id]);
  await tap(fr.moveDown, 0);
  await tap(`${fr.removeProgramRoutine} · 3`);
  expect(
    (await services.programs.detail(program.id)).entries.map(
      (e) => e.routine.id,
    ),
  ).toEqual([pull.id, push.id]);
  await tap(`${fr.startRoutine} · 2`);
  expect(native.navigate).toHaveBeenCalledWith('/train');
  expect((await services.training.state()).sets[0]).toMatchObject({
    weightKg: 50,
    reps: 8,
    completedAt: null,
  });
  expect(button(`${fr.startRoutine} · 1`).props.disabled).toBe(true);
  await tap(fr.close);
  await tap(fr.duplicate);
  expect(await services.programs.list()).toHaveLength(2);
  await tap(`${fr.deleteProgram} · Strength`);
  expect(await services.programs.list()).toHaveLength(2);
  const confirmation = native.alert.mock.calls.at(-1)![2] as {
    style?: string;
    onPress?: () => void;
  }[];
  await act(async () =>
    confirmation.find((b) => b.style === 'destructive')?.onPress?.(),
  );
  await settle();
  expect(await services.programs.list()).toHaveLength(1);
  expect(await services.routines.list()).toHaveLength(2);
  expect((await services.training.state()).active?.title).toBe('Push');
});

it('blocks invalid program names and reports an empty routine without creating a workout', async () => {
  const routine = await services.routines.create('Empty');
  const program = await services.programs.create('Draft');
  await services.programs.addRoutine(program.id, routine.id);
  await mount();
  await tap(fr.programs);
  await tap(`${fr.openProgram} · Draft`);
  await type(fr.programName, '');
  expect(button(fr.close).props.disabled).toBe(true);
  await type(fr.programName, 'Fixed');
  expect((await services.programs.detail(program.id)).program.name).toBe(
    'Fixed',
  );
  await tap(`${fr.startRoutine} · 1`);
  expect(native.alert).toHaveBeenCalledWith(fr.routineEmpty);
  expect((await services.training.state()).active).toBeNull();
  await tap(fr.close);
  expect(button(`${fr.openProgram} · Fixed`)).toBeDefined();
});
it('drags routines between folders and before another routine, and reorders folders through native responders offline', async () => {
  const a = await services.routineFolders.create('PPL');
  const b = await services.routineFolders.create('Travel');
  const push = await services.routines.create('Push');
  const pull = await services.routines.create('Pull');
  onlineManager.setOnline(false);
  await mount();
  await tap(fr.organizeFolders);
  native.bounds.set(`drop-folder-${a.id}`, {
    x: 0,
    y: 100,
    width: 300,
    height: 50,
  });
  native.bounds.set(`drop-routine-${push.id}`, {
    x: 0,
    y: 200,
    width: 300,
    height: 50,
  });
  const handle = (key: string) =>
    root.root.find(
      (node) =>
        String(node.type) === 'View' && node.props.nativeID === `drag-${key}`,
    );
  const event = (y: number) => ({ nativeEvent: { pageX: 20, pageY: y } });
  await act(async () =>
    handle(`routine-${push.id}`).props.onResponderGrant(event(20)),
  );
  await act(async () =>
    handle(`routine-${push.id}`).props.onResponderMove(event(125)),
  );
  expect((await services.routines.detail(push.id)).routine.folderId).toBeNull();
  await act(async () =>
    handle(`routine-${push.id}`).props.onResponderRelease(event(125)),
  );
  await settle();
  expect((await services.routines.detail(push.id)).routine.folderId).toBe(a.id);
  await act(async () =>
    handle(`routine-${pull.id}`).props.onResponderGrant(event(20)),
  );
  await act(async () =>
    handle(`routine-${pull.id}`).props.onResponderRelease(event(225)),
  );
  await settle();
  expect(
    (await services.routineFolders.library()).routines
      .filter((r) => r.folderId === a.id)
      .map((r) => r.id),
  ).toEqual([pull.id, push.id]);
  await act(async () =>
    handle(`folder-${b.id}`).props.onResponderGrant(event(20)),
  );
  await act(async () =>
    handle(`folder-${b.id}`).props.onResponderRelease(event(125)),
  );
  await settle();
  expect((await services.routineFolders.list()).map((f) => f.id)).toEqual([
    b.id,
    a.id,
  ]);
});

it('cancels terminated and out-of-bounds drags without touching the outbox', async () => {
  const folder = await services.routineFolders.create('PPL');
  const routine = await services.routines.create('Push');
  await mount();
  await tap(fr.organizeFolders);
  native.bounds.set(`drop-folder-${folder.id}`, {
    x: 0,
    y: 100,
    width: 300,
    height: 50,
  });
  const handle = () =>
    root.root.find(
      (node) =>
        String(node.type) === 'View' &&
        node.props.nativeID === `drag-routine-${routine.id}`,
    );
  const event = (y: number) => ({ nativeEvent: { pageX: 20, pageY: y } });
  const queue = await services.db.all('SELECT * FROM sync_queue');
  await act(async () => handle().props.onResponderGrant(event(20)));
  await act(async () => handle().props.onResponderTerminate());
  await act(async () => handle().props.onResponderRelease(event(125)));
  await settle();
  await act(async () => handle().props.onResponderGrant(event(20)));
  await act(async () => handle().props.onResponderRelease(event(999)));
  await settle();
  expect(await services.db.all('SELECT * FROM sync_queue')).toEqual(queue);
});

it('creates and renames a folder, retains it after routine editing, and requires confirmation to delete it', async () => {
  await mount();
  await tap(fr.organizeFolders);
  await type(fr.folderName, 'PPL');
  await tap(fr.createFolder);
  await tap(`${fr.renameFolder} · PPL`);
  await type(fr.folderName, 'Training');
  await tap(fr.renameFolder);
  await tap('Training');
  await type(fr.routineName, 'Push');
  await tap(fr.createRoutine);
  const routine = (await services.routines.list())[0]!;
  expect(routine.folderId).toBe((await services.routineFolders.list())[0]?.id);
  await tap(fr.close);
  expect(button(fr.editRoutine)).toBeDefined();
  await tap(fr.organizeFolders);
  await tap(`${fr.deleteFolder} · Training`);
  expect(await services.routineFolders.list()).toHaveLength(1);
  const confirmation = native.alert.mock.calls.at(-1)![2] as {
    style?: string;
    onPress?: () => void;
  }[];
  await act(async () =>
    confirmation.find((button) => button.style === 'destructive')?.onPress?.(),
  );
  await settle();
  expect(await services.routineFolders.list()).toEqual([]);
  expect(
    (await services.routines.detail(routine.id)).routine.folderId,
  ).toBeNull();
  expect(button(fr.editRoutine)).toBeDefined();
});

it('offers button-based routine movement as an alternative to dragging', async () => {
  const folder = await services.routineFolders.create('PPL');
  const routine = await services.routines.create('Push');
  await mount();
  await tap(fr.organizeFolders);
  await tap(`${fr.moveRoutine} · Push`);
  await tap(`${fr.moveToFolder} · PPL`);
  expect((await services.routines.detail(routine.id)).routine.folderId).toBe(
    folder.id,
  );
  await tap(`${fr.moveRoutine} · Push`);
  await tap(`${fr.moveToFolder} · ${fr.unfiledRoutines}`);
  expect(
    (await services.routines.detail(routine.id)).routine.folderId,
  ).toBeNull();
});
it('creates a tri-set offline in the UI, guides round navigation, then confirms dissolution', async () => {
  const workout = await services.training.start('Guided');
  for (const name of ['Press', 'Fly', 'Row']) {
    const exercise = await services.training.createExercise({
      ...exerciseInput,
      name,
    });
    const item = await services.training.addExercise(workout.id, exercise.id);
    await services.training.addSet(item.id);
  }
  for (const set of (await services.training.state()).sets)
    await services.training.updateSet(set.id, { weightKg: 20, reps: 8 });
  onlineManager.setOnline(false);
  await mount(<Train />);
  await tap(fr.organizeExercises);
  for (const name of ['Press', 'Fly', 'Row'])
    await tap(`${fr.selectGroup} · ${name}`);
  await type(fr.groupRest, '120');
  await tap(`${fr.createGroup} (3)`);
  const text = () =>
    root.root
      .findAll((node) => String(node.type) === 'Text')
      .map((node) => node.children.join(''))
      .join('\n');
  expect(text()).toContain('A3 · Row');
  expect(text()).toContain(fr.triSet);
  await tap(fr.organizeExercises);
  await tap(fr.followCircuit);
  expect(
    root.root.findAll(
      (node) =>
        String(node.type) === 'TextInput' &&
        node.props.accessibilityLabel === `${fr.weight} (kg)`,
    ),
  ).toHaveLength(1);
  await tap(fr.complete);
  expect(text()).toContain(`${fr.nextExercise} · A2 Fly`);
  expect((await services.training.state()).active?.restEndsAt).toBeNull();
  await tap(fr.complete);
  expect(text()).toContain(`${fr.nextExercise} · A3 Row`);
  await tap(fr.complete);
  expect(text()).toContain(`${fr.nextExercise} · A1 Press`);
  expect((await services.training.state()).active?.restEndsAt).toBe(
    '2026-09-05T12:02:00.000Z',
  );
  await tap(fr.showAllSets);
  await tap(fr.organizeExercises);
  await tap(fr.dissolveGroup);
  expect((await services.training.state()).groups).toHaveLength(1);
  const buttons = native.alert.mock.calls.at(-1)![2] as {
    text: string;
    onPress?: () => void;
  }[];
  await act(async () =>
    buttons.find((b) => b.text === fr.confirm)?.onPress?.(),
  );
  await settle();
  expect((await services.training.state()).groups).toEqual([]);
  expect((await services.training.state()).sets).toHaveLength(6);
});

it('groups a routine through its editor and starts an independent circuit', async () => {
  const routine = await services.routines.create('Grouped routine');
  for (const name of ['Bench', 'Fly']) {
    const exercise = await services.training.createExercise({
      ...exerciseInput,
      name,
    });
    await services.routines.addExercise(routine.id, exercise.id);
  }
  await mount();
  await tap(fr.editRoutine);
  await tap(fr.organizeExercises);
  for (const name of ['Bench', 'Fly']) await tap(`${fr.selectGroup} · ${name}`);
  await tap(`${fr.createGroup} (2)`);
  const group = (await services.routines.detail(routine.id)).groups[0]!;
  await tap(fr.close);
  await tap(fr.startRoutine);
  const state = await services.training.state();
  expect(state.groups[0]?.id).not.toBe(group.id);
  expect(circuitSequence(state.workoutExercises, state.sets)).toHaveLength(2);
});
const native = vi.hoisted(() => ({
  bounds: new Map<
    string,
    { x: number; y: number; width: number; height: number }
  >(),
  share: vi.fn(),
  navigate: vi.fn(),
  alert: vi.fn(),
}));
vi.mock('../src/providers/AppProvider', () => ({
  useServices: () => services,
}));
vi.mock('expo-router', () => ({ router: { navigate: native.navigate } }));
// Only the OS host boundary is replaced. UI, hooks, services, repositories and SQLite are real.
vi.mock('react-native', () => ({
  Text: 'Text',
  View: 'View',
  ScrollView: 'ScrollView',
  TextInput: 'TextInput',
  Pressable: 'Pressable',
  StyleSheet: { create: (value: unknown) => value },
  useColorScheme: () => 'dark',
  Share: { share: native.share },
  Alert: { alert: native.alert },
}));
vi.mock('react-native-safe-area-context', () => ({
  SafeAreaView: 'SafeAreaView',
}));
beforeEach(async () => {
  (
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true;
  services = await setup();
  usePreferences.setState({ locale: 'fr', weightUnit: 'kg', effort: 'RPE' });
  client = createLocalQueryClient();
  native.share.mockReset();
  native.share.mockResolvedValue({ action: 'dismissedAction' });
  native.navigate.mockReset();
  native.alert.mockReset();
  native.bounds.clear();
});
afterEach(async () => {
  if (root) await act(async () => root.unmount());
  client.clear();
  onlineManager.setOnline(true);
  services.close();
});
async function mount(screen: React.ReactNode = <Plan />) {
  await act(async () => {
    root = create(
      <QueryClientProvider client={client}>{screen}</QueryClientProvider>,
      {
        createNodeMock: (element) => {
          const id = (element.props as { nativeID?: string }).nativeID;
          return id?.startsWith('drop-')
            ? {
                measureInWindow: (
                  callback: (
                    x: number,
                    y: number,
                    width: number,
                    height: number,
                  ) => void,
                ) => {
                  const bounds = native.bounds.get(id) ?? {
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0,
                  };
                  callback(bounds.x, bounds.y, bounds.width, bounds.height);
                },
              }
            : null;
        },
      },
    );
  });
  await settle();
}
async function settle() {
  await act(async () => {
    await services.repo.db.transaction(async () => undefined);
    await new Promise((resolve) => setTimeout(resolve, 20));
  });
}
function button(title: string, index = 0) {
  return root.root.findAll(
    (node) =>
      String(node.type) === 'Pressable' &&
      node.props.accessibilityLabel === title,
  )[index]!;
}
async function tap(title: string, index = 0) {
  const node = button(title, index);
  expect(node, title).toBeDefined();
  expect(node.props.disabled, title).toBeFalsy();
  await act(async () => {
    node.props.onPress();
  });
  await settle();
}
async function type(label: string, value: string, index = 0) {
  const field = root.root.findAll(
    (node) =>
      String(node.type) === 'TextInput' &&
      node.props.accessibilityLabel === label,
  )[index]!;
  expect(field, label).toBeDefined();
  await act(async () => {
    field.props.onChangeText(value);
  });
  await settle();
}
it('creates and edits a routine through the UI, then starts its real durable workout', async () => {
  await services.training.createExercise(exerciseInput);
  await mount();
  await type(fr.routineName, 'UI push');
  await tap(fr.createRoutine);
  await tap(fr.addExercise);
  await tap(`${fr.addExercise} · ${exerciseInput.name}`);
  await type(`${fr.weight} (kg)`, '100');
  await type(fr.reps, '8');
  await type(fr.exerciseNotes, 'UI note');
  await type(fr.restSeconds, '120');
  await tap(fr.close);
  await tap(fr.startRoutine);
  const state = await services.training.state();
  expect(state.active?.title).toBe('UI push');
  expect(state.sets[0]).toMatchObject({
    weightKg: 100,
    reps: 8,
    completedAt: null,
  });
  expect(state.workoutExercises[0]).toMatchObject({
    notes: 'UI note',
    restSeconds: 120,
  });
  expect(native.navigate).toHaveBeenCalledWith('/train');
});
it('requires review before sharing or importing and treats share-sheet cancellation as no publication', async () => {
  await services.routines.create('Portable');
  await mount();
  await tap(fr.shareRoutine);
  expect(native.share).not.toHaveBeenCalled();
  await tap(fr.shareSystem);
  const payload = native.share.mock.calls[0]![0] as { message: string };
  expect(payload.message).not.toContain(services.ownerId);
  await tap(fr.close);
  await tap(fr.importRoutine);
  await type(fr.importContent, payload.message);
  expect(button(fr.confirmImport)).toBeUndefined();
  await tap(fr.reviewImport);
  expect(await services.routines.list()).toHaveLength(1);
  await tap(fr.confirmImport);
  expect(await services.routines.list()).toHaveLength(2);
});
it('does not delete a routine until the destructive confirmation is accepted', async () => {
  await services.routines.create('Keep until confirmed');
  await mount();
  await tap(fr.remove);
  expect(await services.routines.list()).toHaveLength(1);
  const buttons = native.alert.mock.calls[0]![2] as {
    style?: string;
    onPress?: () => void;
  }[];
  await act(async () => {
    buttons.find((b) => b.style === 'destructive')?.onPress?.();
  });
  await settle();
  expect(await services.routines.list()).toHaveLength(0);
});
it('cold-loads and edits the routine screen while the network manager is offline', async () => {
  onlineManager.setOnline(false);
  await services.routines.create('Offline routine');
  await mount();
  await tap(fr.editRoutine);
  await type(fr.routineName, 'Still offline');
  await tap(fr.close);
  expect((await services.routines.list())[0]?.name).toBe('Still offline');
  expect(client.isFetching()).toBe(0);
});

it('shows previous performance offline in kg/lb and updates records through completion, undo and finishing', async () => {
  const exercise = await services.training.createExercise(exerciseInput);
  const prior = await services.training.start('Earlier');
  const item = await services.training.addExercise(prior.id, exercise.id);
  const set = (await services.training.state()).sets.find(
    (s) => s.workoutExerciseId === item.id,
  )!;
  await services.training.updateSet(set.id, {
    weightKg: 100,
    reps: 8,
    rpe: 8.5,
  });
  await services.training.completeSet(set.id, true);
  await services.training.finish(prior.id);
  services.clock.value = '2026-09-06T12:00:00.000Z';
  await services.workoutTemplates.repeatWorkout(prior.id);
  onlineManager.setOnline(false);
  await mount(<Train />);
  const text = () =>
    root.root
      .findAll((node) => String(node.type) === 'Text')
      .map((node) => node.children.join(''))
      .join('\n');
  expect(text()).toContain('100 kg · 8');
  expect(text()).toContain('RPE 8.5');
  expect(text()).not.toContain(fr.provisionalRecords);
  const queueBeforeUnits = await services.db.all('SELECT * FROM sync_queue');
  await act(async () => usePreferences.setState({ weightUnit: 'lb' }));
  expect(text()).toContain('220,46 lb');
  expect(await services.db.all('SELECT * FROM sync_queue')).toEqual(
    queueBeforeUnits,
  );
  await act(async () => usePreferences.setState({ weightUnit: 'kg' }));
  await type(`${fr.weight} (kg)`, '110');
  await type(fr.reps, '9');
  await tap(fr.complete);
  expect(text()).toContain(fr.provisionalRecords);
  expect(text()).toContain(fr.MAX_ESTIMATED_1RM);
  expect(text()).toContain(`${fr.previousRecord} 100 kg`);
  await tap(`✓ ${fr.uncomplete}`);
  expect(text()).not.toContain(fr.provisionalRecords);
  await tap(fr.complete);
  await tap(fr.finish);
  const confirmation = native.alert.mock.calls.at(-1)![2] as {
    text: string;
    onPress?: () => void;
  }[];
  await act(async () =>
    confirmation.find((b) => b.text === fr.finish)?.onPress?.(),
  );
  await settle();
  expect((await services.training.state()).active).toBeNull();
  await act(async () => root.unmount());
  await mount(<History />);
  await tap(fr.details);
  expect(text()).toContain(fr.personalRecords);
  expect(text()).toContain(fr.MAX_WORKOUT_VOLUME);
  expect(text()).not.toContain(fr.provisionalRecords);
});

it('shows an explicit empty previous state for a first workout and labels its first benchmarks', async () => {
  const exercise = await services.training.createExercise(exerciseInput);
  const workout = await services.training.start('First');
  await services.training.addExercise(workout.id, exercise.id);
  await mount(<Train />);
  const text = () =>
    root.root
      .findAll((node) => String(node.type) === 'Text')
      .map((node) => node.children.join(''))
      .join('\n');
  expect(text()).toContain(fr.noPreviousSet);
  await type(`${fr.weight} (kg)`, '20');
  await type(fr.reps, '1');
  await tap(fr.complete);
  expect(text()).toContain(fr.firstRecord);
  expect(text()).toContain(`${fr.MAX_ESTIMATED_1RM} · 20 kg`);
});
