import { useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { Button, Card, Field, Label, Row } from '../../components/ui';
import { ReorderButtons } from '../../components/ReorderButtons';
import { useRoutines } from '../../hooks/useRoutines';
import { useTraining } from '../../hooks/useTraining';
import { useAction } from '../../hooks/useAction';
import { useServices } from '../../providers/AppProvider';
import { useTranslation } from '../../i18n/useTranslation';
import { FolderOrganizer } from './FolderOrganizer';
export function RoutineLibrary({
  onEdit,
  onImport,
  onShare,
  selectedFolder,
  onSelectFolder,
}: {
  onEdit(id: string): void;
  onImport(): void;
  onShare(id: string): void;
  selectedFolder: string | null;
  onSelectFolder(id: string | null): void;
}) {
  const t = useTranslation();
  const {
    routines,
    data: allRoutines,
    folders,
    isError,
    refetch,
  } = useRoutines();
  const folderId = folders?.some((f) => f.id === selectedFolder)
    ? selectedFolder
    : null;
  const data = allRoutines?.filter((r) => r.folderId === folderId);
  const { data: training } = useTraining();
  const { workoutTemplates } = useServices();
  const { run, retry, pending, error } = useAction();
  const [name, setName] = useState('');
  const [page, setPage] = useState(0);
  const pageSize = 20;
  const currentPage = Math.min(
    page,
    Math.max(0, Math.ceil((data?.length ?? 0) / pageSize) - 1),
  );
  return (
    <>
      <Label large>{t('routines')}</Label>
      {folders && allRoutines && (
        <>
          <Row>
            {[null, ...folders].map((folder) => (
              <Button
                key={folder?.id ?? 'root'}
                title={folder?.name ?? t('unfiledRoutines')}
                secondary={folderId !== (folder?.id ?? null)}
                disabled={pending}
                onPress={() => {
                  onSelectFolder(folder?.id ?? null);
                  setPage(0);
                }}
              />
            ))}
          </Row>
          <FolderOrganizer
            folders={folders}
            routines={allRoutines}
            {...{ run, pending }}
          />
        </>
      )}
      {training?.active && (
        <Card>
          <Label>{t('activeExists')}</Label>
          <Button
            title={t('resume')}
            onPress={() => router.navigate('/train')}
          />
        </Card>
      )}
      <Card>
        <Field
          label={t('routineName')}
          value={name}
          onChangeText={setName}
          maxLength={160}
        />
        <Button
          title={t('createRoutine')}
          disabled={pending || !name.trim()}
          onPress={() => {
            void run(async () => {
              const created = await routines.create(name, folderId);
              setName('');
              onEdit(created.id);
            });
          }}
        />
        <Button
          title={t('importRoutine')}
          secondary
          disabled={pending}
          onPress={onImport}
        />
      </Card>
      {error && (
        <>
          <Label>{t('error')}</Label>
          <Button
            title={t('retry')}
            disabled={pending}
            onPress={() => {
              void retry();
            }}
          />
        </>
      )}
      {!data ? (
        <>
          <Label>{t(isError ? 'error' : 'loading')}</Label>
          {isError && (
            <Button
              title={t('retry')}
              onPress={() => {
                void refetch();
              }}
            />
          )}
        </>
      ) : data.length === 0 ? (
        <Label muted>{t('noRoutines')}</Label>
      ) : (
        data
          .slice(currentPage * pageSize, (currentPage + 1) * pageSize)
          .map((routine) => (
            <Card key={routine.id}>
              <Label large>{routine.name}</Label>
              <Label muted>{routine.notes}</Label>
              <Button
                title={t('startRoutine')}
                disabled={pending || !!training?.active || !training}
                onPress={() => {
                  void run(async () => {
                    const detail = await routines.detail(routine.id);
                    if (
                      !detail.exercises.length ||
                      detail.exercises.some((e) => !e.sets.length)
                    ) {
                      Alert.alert(t('routineEmpty'));
                      return;
                    }
                    await workoutTemplates.startRoutine(routine.id);
                    router.navigate('/train');
                  });
                }}
              />
              <Button
                title={t('editRoutine')}
                secondary
                disabled={pending}
                onPress={() => onEdit(routine.id)}
              />
              <Row>
                <Button
                  title={t('duplicate')}
                  secondary
                  disabled={pending}
                  onPress={() => {
                    void run(() =>
                      routines.duplicate(
                        routine.id,
                        `${routine.name.slice(0, 140)} · ${t('routineCopied')}`,
                      ),
                    );
                  }}
                />
                <Button
                  title={t('shareRoutine')}
                  secondary
                  disabled={pending}
                  onPress={() => onShare(routine.id)}
                />
              </Row>
              <ReorderButtons
                ids={data.map((r) => r.id)}
                id={routine.id}
                disabled={pending}
                onReorder={(ids) => {
                  void run(() => routines.reorder(ids, folderId));
                }}
              />
              <Button
                title={t('remove')}
                secondary
                disabled={pending}
                onPress={() =>
                  Alert.alert(t('deleteRoutine'), t('deleteRoutineBody'), [
                    { text: t('cancel'), style: 'cancel' },
                    {
                      text: t('remove'),
                      style: 'destructive',
                      onPress: () => {
                        void run(() => routines.remove(routine.id));
                      },
                    },
                  ])
                }
              />
            </Card>
          ))
      )}
      {data && data.length > pageSize && (
        <Row>
          <Button
            title={t('previous')}
            disabled={currentPage === 0}
            onPress={() => setPage(currentPage - 1)}
          />
          <Button
            title={t('next')}
            disabled={(currentPage + 1) * pageSize >= data.length}
            onPress={() => setPage(currentPage + 1)}
          />
        </Row>
      )}
    </>
  );
}
