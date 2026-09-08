import { useState } from 'react';
import { Alert } from 'react-native';
import { Button, Card, Field, Label } from '../../components/ui';
import { useRoutine } from '../../hooks/useRoutines';
import { useTraining } from '../../hooks/useTraining';
import { useAction } from '../../hooks/useAction';
import { useTranslation } from '../../i18n/useTranslation';
import { RoutineExerciseEditor } from './RoutineExerciseEditor';
import { ExercisePicker } from '../training/ExercisePicker';
import { GroupEditor } from '../training/GroupEditor';
import { groupLabels } from '../training/supersets';
export function RoutineEditor({
  id,
  onClose,
}: {
  id: string;
  onClose(): void;
}) {
  const t = useTranslation();
  const { data, routines, isError, refetch } = useRoutine(id);
  const { data: trainingData, training } = useTraining();
  const { run, retry, pending, error } = useAction();
  const [invalid, setInvalid] = useState<Record<string, boolean>>({});
  const [picker, setPicker] = useState(false);
  const onValidity = (key: string, valid: boolean) =>
    setInvalid((previous) => ({ ...previous, [key]: !valid }));
  const blocked = pending || error || Object.values(invalid).some(Boolean);
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
      <Label large>{t('editRoutine')}</Label>
      <Label muted>
        {t(
          error
            ? 'error'
            : pending
              ? 'saving'
              : blocked
                ? 'validation'
                : 'saved',
        )}
      </Label>
      {error && (
        <Button
          title={t('retry')}
          disabled={pending}
          onPress={() => {
            void retry();
          }}
        />
      )}
      <Field
        label={t('routineName')}
        defaultValue={data.routine.name}
        maxLength={160}
        onChangeText={(name) => {
          onValidity('name', !!name.trim());
          if (name.trim())
            void run(() => routines.update(id, { name }), 'name');
        }}
      />
      <Field
        label={t('routineNotes')}
        defaultValue={data.routine.notes}
        multiline
        maxLength={10000}
        onChangeText={(notes) => {
          void run(() => routines.update(id, { notes }), 'notes');
        }}
      />
      {!data.exercises.length && <Label muted>{t('routineEmpty')}</Label>}
      <GroupEditor
        parent={{ routineId: id }}
        items={data.exercises.map(({ item, exercise }) => ({
          ...item,
          name: exercise.name,
        }))}
        groups={data.groups}
        {...{ run, pending }}
      />
      {data.exercises.map((entry) => (
        <Card key={entry.item.id}>
          {entry.item.supersetGroupId && (
            <Label large>
              {groupLabels(data.exercises.map((e) => e.item))[entry.item.id]}
            </Label>
          )}
          <RoutineExerciseEditor
            {...{ entry, routines, run, pending, onValidity }}
          />
          <Button
            title={t('removeExercise')}
            secondary
            disabled={pending}
            onPress={() =>
              Alert.alert(
                t('removeExercise'),
                entry.item.supersetGroupId
                  ? t('removeGroupedExercise')
                  : entry.exercise.name,
                [
                  { text: t('cancel'), style: 'cancel' },
                  {
                    text: t('remove'),
                    style: 'destructive',
                    onPress: () => {
                      void run(async () => {
                        await routines.removeExercise(entry.item.id);
                        onValidity(`${entry.item.id}-rest`, true);
                        for (const set of entry.sets) onValidity(set.id, true);
                      });
                    },
                  },
                ],
              )
            }
          />
        </Card>
      ))}
      <Button
        title={t('addExercise')}
        secondary
        onPress={() => setPicker((v) => !v)}
      />
      {picker && trainingData && (
        <ExercisePicker
          exercises={trainingData.exercises}
          training={training}
          run={run}
          pending={pending}
          onAdd={(exerciseId) => routines.addExercise(id, exerciseId)}
        />
      )}
      <Button title={t('close')} disabled={blocked} onPress={onClose} />
    </>
  );
}
