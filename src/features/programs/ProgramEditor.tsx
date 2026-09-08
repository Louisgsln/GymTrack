import { useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { Button, Card, Field, Label } from '../../components/ui';
import { ReorderButtons } from '../../components/ReorderButtons';
import { useProgram } from '../../hooks/usePrograms';
import { useRoutines } from '../../hooks/useRoutines';
import { useTraining } from '../../hooks/useTraining';
import { useAction } from '../../hooks/useAction';
import { useTranslation } from '../../i18n/useTranslation';
export function ProgramEditor({
  id,
  onClose,
}: {
  id: string;
  onClose(): void;
}) {
  const t = useTranslation();
  const { programs, data, isError, refetch } = useProgram(id);
  const {
    routines,
    data: available,
    isError: optionsError,
    refetch: retryOptions,
  } = useRoutines();
  const { data: training } = useTraining();
  const { run, retry, pending, error } = useAction();
  const [valid, setValid] = useState(true);
  const [search, setSearch] = useState('');
  if (!data)
    return (
      <Card>
        <Label>{t(isError ? 'error' : 'loading')}</Label>
        <Button
          title={t('retry')}
          onPress={() => {
            void refetch();
          }}
        />
        <Button title={t('close')} onPress={onClose} />
      </Card>
    );
  return (
    <>
      <Label large>{t('editProgram')}</Label>
      <Label muted>
        {t(
          error ? 'error' : pending ? 'saving' : valid ? 'saved' : 'validation',
        )}
      </Label>
      <Field
        label={t('programName')}
        defaultValue={data.program.name}
        maxLength={160}
        onChangeText={(name) => {
          setValid(!!name.trim());
          if (name.trim())
            void run(() => programs.update(id, { name }), 'program-name');
        }}
      />
      <Field
        label={t('programNotes')}
        defaultValue={data.program.notes}
        maxLength={10000}
        multiline
        onChangeText={(notes) => {
          void run(() => programs.update(id, { notes }), 'program-notes');
        }}
      />
      <Label muted>{t('programLinkedRoutines')}</Label>
      {!data.entries.length && <Label muted>{t('emptyProgram')}</Label>}
      {training?.active && (
        <Card>
          <Label>{t('activeExists')}</Label>
          <Button
            title={t('resume')}
            onPress={() => router.navigate('/train')}
          />
        </Card>
      )}
      {data.entries.map(({ item, routine }, index) => (
        <Card key={item.id}>
          <Label large>{`${index + 1}. ${routine.name}`}</Label>
          <Button
            title={`${t('startRoutine')} · ${index + 1}`}
            disabled={
              pending || error || !valid || !training || !!training.active
            }
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
                await programs.startEntry(item.id);
                router.navigate('/train');
              }, `start-program-entry-${item.id}`);
            }}
          />
          <ReorderButtons
            id={item.id}
            ids={data.entries.map((e) => e.item.id)}
            disabled={pending}
            onReorder={(ids) => {
              void run(
                () => programs.reorderRoutines(id, ids),
                'program-routine-order',
              );
            }}
          />
          <Button
            secondary
            title={`${t('removeProgramRoutine')} · ${index + 1}`}
            disabled={pending}
            onPress={() => {
              void run(() => programs.removeRoutine(item.id));
            }}
          />
        </Card>
      ))}
      <Card>
        <Label large>{t('addProgramRoutine')}</Label>
        <Field
          label={t('findProgramRoutine')}
          value={search}
          onChangeText={setSearch}
        />
        {!available ? (
          <>
            <Label>{t(optionsError ? 'error' : 'loading')}</Label>
            <Button
              title={t('retry')}
              onPress={() => {
                void retryOptions();
              }}
            />
          </>
        ) : !available.length ? (
          <Label muted>{t('programNeedsRoutines')}</Label>
        ) : (
          available
            .filter((r) =>
              r.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
            )
            .map((r) => (
              <Button
                key={r.id}
                secondary
                title={`${t('addProgramRoutine')} · ${r.name}`}
                disabled={pending}
                onPress={() => {
                  void run(() => programs.addRoutine(id, r.id));
                }}
              />
            ))
        )}
      </Card>
      {error && (
        <Button
          title={t('retry')}
          disabled={pending}
          onPress={() => {
            void retry();
          }}
        />
      )}
      <Button
        title={t('close')}
        disabled={pending || error || !valid}
        onPress={onClose}
      />
    </>
  );
}
