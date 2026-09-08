import { useState } from 'react';
import { router } from 'expo-router';
import { Button, Card, Field, Label } from '../../components/ui';
import { useTranslation } from '../../i18n/useTranslation';
import { useServices } from '../../providers/AppProvider';
import { useTraining } from '../../hooks/useTraining';
import { useAction } from '../../hooks/useAction';
import type { Workout } from '../../types/entities';
export function HistoryRoutineActions({ workout }: { workout: Workout }) {
  const t = useTranslation();
  const { workoutTemplates } = useServices();
  const { data } = useTraining();
  const { run, pending, error, retry } = useAction();
  const [name, setName] = useState(workout.title);
  return (
    <Card>
      {data?.active && (
        <>
          <Label>{t('activeExists')}</Label>
          <Button
            title={t('resume')}
            onPress={() => router.navigate('/train')}
          />
        </>
      )}
      <Button
        title={t('repeatWorkout')}
        disabled={pending || !!data?.active || !data}
        onPress={() => {
          void run(async () => {
            await workoutTemplates.repeatWorkout(workout.id);
            router.navigate('/train');
          });
        }}
      />
      <Field
        label={t('routineName')}
        value={name}
        onChangeText={setName}
        maxLength={160}
      />
      <Button
        title={t('saveAsRoutine')}
        disabled={pending || !name.trim()}
        onPress={() => {
          void run(async () => {
            await workoutTemplates.saveAsRoutine(workout.id, name);
            router.navigate('/plan');
          });
        }}
      />
      <Button
        title={t('copyWorkout')}
        secondary
        disabled={pending || !!data?.active || !data || !name.trim()}
        onPress={() => {
          void run(async () => {
            await workoutTemplates.repeatWorkout(workout.id, name);
            router.navigate('/train');
          });
        }}
      />
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
    </Card>
  );
}
