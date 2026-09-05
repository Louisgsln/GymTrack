import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { z } from 'zod';
import { Page, Label, Card, Field, Button, Row } from '../src/components/ui';
import { useTranslation } from '../src/i18n/useTranslation';
import { useServices } from '../src/providers/AppProvider';
import { useTraining } from '../src/hooks/useTraining';
import { useAction } from '../src/hooks/useAction';
import { APP_NAME } from '../src/constants/brand';
import { localDiaryDate } from '../src/features/nutrition/calculations';
import { QuickAdd } from '../src/features/nutrition/QuickAdd';
export default function Today() {
  const t = useTranslation();
  const { nutrition } = useServices();
  const { data: training } = useTraining();
  const { run, pending, error } = useAction();
  const [date, setDate] = useState(localDiaryDate(new Date()));
  const [add, setAdd] = useState(false);
  const validDate = z.iso.date().safeParse(date).success;
  const diary = useQuery({
    queryKey: ['diary', date],
    queryFn: () => nutrition.diary(date),
    enabled: validDate,
  });
  return (
    <Page>
      <Label muted>{APP_NAME}</Label>
      <Label large>{t('welcome')}</Label>
      <Button
        title={t(training?.active ? 'resume' : 'start')}
        onPress={() => router.navigate('/train')}
      />
      <Label large>{t('nutrition')}</Label>
      <Field
        label={t('date')}
        value={date}
        onChangeText={setDate}
        maxLength={10}
      />
      {!validDate && <Label>{t('validation')}</Label>}
      {validDate && (
        <>
          {diary.data && (
            <Card>
              <Label muted>{t('consumed')}</Label>
              <Label
                large
              >{`${Number((diary.data.totals.energy_kcal?.value ?? 0).toFixed(1))} kcal`}</Label>
              <Row>
                {(['protein', 'carbohydrates', 'fat'] as const).map((key) => (
                  <Label
                    key={key}
                  >{`${t(key === 'carbohydrates' ? 'carbs' : key)} : ${diary.data?.totals[key] ? Number(diary.data.totals[key].value.toFixed(1)) : '—'}`}</Label>
                ))}
              </Row>
              {diary.data.entries.some((entry) =>
                ['energy_kcal', 'protein', 'carbohydrates', 'fat'].some(
                  (key) => !entry.nutrients[key],
                ),
              ) && <Label muted>{t('partial')}</Label>}
            </Card>
          )}
          {diary.isError ? (
            <Button
              title={t('retry')}
              onPress={() => {
                void diary.refetch();
              }}
            />
          ) : diary.isPending ? (
            <Label>{t('loading')}</Label>
          ) : diary.data.entries.length === 0 ? (
            <Label muted>{t('emptyDiary')}</Label>
          ) : (
            diary.data.entries.map((entry) => (
              <Card key={entry.id}>
                <Label>{entry.name}</Label>
                <Label
                  muted
                >{`${entry.meal} · ${Number((entry.nutrients.energy_kcal?.value ?? 0).toFixed(1))} kcal`}</Label>
                <Button
                  title={t('remove')}
                  secondary
                  disabled={pending}
                  onPress={() => {
                    void run(() => nutrition.remove(entry.id));
                  }}
                />
              </Card>
            ))
          )}
          <Button
            title={`+ ${t('quickAdd')}`}
            onPress={() => setAdd((value) => !value)}
          />
          {add && <QuickAdd date={date} />}
        </>
      )}
      {error && <Label>{t('error')}</Label>}
      <Label muted>{t('localMode')}</Label>
    </Page>
  );
}
