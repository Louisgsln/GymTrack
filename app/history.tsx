import { useState } from 'react';
import { Page, Label, Card, Button, Row } from '../src/components/ui';
import { useTranslation } from '../src/i18n/useTranslation';
import { useTraining } from '../src/hooks/useTraining';
import { fromKg, summarizeSets } from '../src/features/training/calculations';
import { usePreferences } from '../src/store/preferences';
export default function History() {
  const t = useTranslation();
  const { data, isError, refetch } = useTraining();
  const unit = usePreferences((s) => s.weightUnit);
  const locale = usePreferences((s) => s.locale);
  const [selected, setSelected] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const pageSize = 20;
  return (
    <Page>
      <Label large>{t('history')}</Label>
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
      ) : data.history.length === 0 ? (
        <Label muted>{t('emptyHistory')}</Label>
      ) : (
        data.history
          .slice(page * pageSize, (page + 1) * pageSize)
          .map((workout) => {
            const items = data.workoutExercises.filter(
              (e) => e.workoutId === workout.id,
            );
            const ids = new Set(items.map((e) => e.id));
            const sets = data.sets.filter((s) => ids.has(s.workoutExerciseId));
            const summary = summarizeSets(sets);
            return (
              <Card key={workout.id}>
                <Label large>{workout.title}</Label>
                <Label muted>
                  {new Date(workout.startedAt).toLocaleDateString(locale)}
                </Label>
                <Label>{`${t('completedSets')} · ${summary.completedSets}`}</Label>
                <Label>{`${t('volume')} · ${Number(fromKg(summary.volumeKg, unit).toFixed(1))} ${unit}`}</Label>
                <Label>{`${t('elapsed')} · ${Math.max(0, Math.floor((Date.parse(workout.finishedAt ?? workout.startedAt) - Date.parse(workout.startedAt)) / 60000))} ${t('minutes')}`}</Label>
                <Button
                  title={t(selected === workout.id ? 'close' : 'details')}
                  secondary
                  onPress={() =>
                    setSelected(selected === workout.id ? null : workout.id)
                  }
                />
                {selected === workout.id && (
                  <>
                    <Label>{workout.notes}</Label>
                    {items.map((item) => (
                      <Card key={item.id}>
                        <Label>
                          {
                            data.exercises.find((e) => e.id === item.exerciseId)
                              ?.name
                          }
                        </Label>
                        {sets
                          .filter(
                            (s) =>
                              s.workoutExerciseId === item.id && s.completedAt,
                          )
                          .map((set) => (
                            <Label
                              key={set.id}
                            >{`${Number(fromKg(set.weightKg, unit).toFixed(2))} ${unit} × ${set.reps}${set.rpe !== null ? ` · RPE ${set.rpe}` : ''}${set.rir !== null ? ` · RIR ${set.rir}` : ''}`}</Label>
                          ))}
                      </Card>
                    ))}
                  </>
                )}
              </Card>
            );
          })
      )}
      {data && data.history.length > pageSize && (
        <Row>
          <Button
            title={t('previous')}
            disabled={page === 0}
            onPress={() => {
              setPage((p) => p - 1);
              setSelected(null);
            }}
          />
          <Button
            title={t('next')}
            disabled={(page + 1) * pageSize >= data.history.length}
            onPress={() => {
              setPage((p) => p + 1);
              setSelected(null);
            }}
          />
        </Row>
      )}
    </Page>
  );
}
