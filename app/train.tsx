import { useState } from 'react';
import { Page, Label, Card, Field, Button } from '../src/components/ui';
import { useTraining } from '../src/hooks/useTraining';
import { useAction } from '../src/hooks/useAction';
import { useTranslation } from '../src/i18n/useTranslation';
import { ActiveWorkout } from '../src/features/training/ActiveWorkout';
import { router } from 'expo-router';
export default function Train() {
  const t = useTranslation();
  const { data, training, isError, refetch } = useTraining();
  const { run, pending, error } = useAction();
  const [title, setTitle] = useState('');
  return (
    <Page>
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
      ) : data.active ? (
        <ActiveWorkout
          key={data.active.id}
          workout={data.active}
          {...{ data, training }}
        />
      ) : (
        <>
          <Label large>{t('train')}</Label>
          <Label muted>{t('emptyTraining')}</Label>
          <Button
            title={t('routines')}
            secondary
            onPress={() => router.navigate('/plan')}
          />
          <Card>
            <Field
              label={t('workoutTitle')}
              value={title}
              placeholder={t('defaultWorkout')}
              onChangeText={setTitle}
              maxLength={160}
            />
            <Button
              title={t('start')}
              disabled={pending}
              onPress={() => {
                void run(() =>
                  training.start(title.trim() || t('defaultWorkout')),
                );
              }}
            />
          </Card>
          {error && <Label>{t('error')}</Label>}
          <Label muted>{t('localMode')}</Label>
        </>
      )}
    </Page>
  );
}
