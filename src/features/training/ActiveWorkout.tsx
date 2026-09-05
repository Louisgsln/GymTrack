import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Button, Card, Field, Label, Row } from '../../components/ui';
import { useTranslation } from '../../i18n/useTranslation';
import { useAction } from '../../hooks/useAction';
import { usePreferences } from '../../store/preferences';
import type { TrainingService } from '../../services/training';
import type { Workout } from '../../types/entities';
import { remainingSeconds, summarizeSets, fromKg } from './calculations';
import { SetRow } from './SetRow';
import { ExercisePicker } from './ExercisePicker';

type TrainingState = Awaited<ReturnType<TrainingService['state']>>;
export function ActiveWorkout({
  workout,
  data,
  training,
}: {
  workout: Workout;
  data: TrainingState;
  training: TrainingService;
}) {
  const t = useTranslation();
  const { run, retry, pending, error } = useAction();
  const [picker, setPicker] = useState(false);
  const [invalidRows, setInvalidRows] = useState<Record<string, boolean>>({});
  const [now, setNow] = useState(new Date().toISOString());
  const unit = usePreferences((s) => s.weightUnit);
  const effort = usePreferences((s) => s.effort);
  useEffect(() => {
    const id = setInterval(() => setNow(new Date().toISOString()), 1000);
    return () => clearInterval(id);
  }, []);
  const items = data.workoutExercises
    .filter((e) => e.workoutId === workout.id)
    .sort((a, b) => a.position - b.position);
  const itemIds = new Set(items.map((e) => e.id));
  const summary = summarizeSets(
    data.sets.filter((set) => itemIds.has(set.workoutExerciseId)),
  );
  const remaining = remainingSeconds(workout.restEndsAt, now);
  const blocked = pending || Object.values(invalidRows).some(Boolean);
  const onValidity = (id: string, valid: boolean) =>
    setInvalidRows((previous) => ({ ...previous, [id]: !valid }));
  return (
    <>
      <Label large>{workout.title}</Label>
      <Label muted>
        {error
          ? t('error')
          : pending
            ? t('saving')
            : blocked
              ? t('validation')
              : t('saved')}
      </Label>
      <Row>
        <Label>{`${summary.completedSets} ${t('completedSets')}`}</Label>
        <Label>{`${Number(fromKg(summary.volumeKg, unit).toFixed(1))} ${unit}`}</Label>
        <Label>{`${Math.max(0, Math.floor((Date.parse(now) - Date.parse(workout.startedAt)) / 60000))} ${t('minutes')}`}</Label>
      </Row>
      <Card>
        <Field
          label={t('workoutTitle')}
          defaultValue={workout.title}
          maxLength={160}
          onChangeText={(title) => {
            onValidity('title', !!title.trim());
            if (title.trim())
              void run(
                () => training.editWorkout(workout.id, { title }),
                'title',
              );
          }}
        />
        <Field
          label={t('notes')}
          defaultValue={workout.notes}
          multiline
          maxLength={10000}
          onChangeText={(notes) => {
            void run(
              () => training.editWorkout(workout.id, { notes }),
              'notes',
            );
          }}
        />
      </Card>
      {workout.restEndsAt && (
        <Card>
          <Label
            large
          >{`${t('rest')} · ${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, '0')}`}</Label>
          <Row>
            <Button
              secondary
              title={t('minus15')}
              disabled={pending}
              onPress={() => {
                void run(() => training.adjustRest(workout.id, -15));
              }}
            />
            <Button
              secondary
              title={t('plus15')}
              disabled={pending}
              onPress={() => {
                void run(() => training.adjustRest(workout.id, 15));
              }}
            />
            <Button
              secondary
              title={t('skip')}
              disabled={pending}
              onPress={() => {
                void run(() => training.adjustRest(workout.id, null));
              }}
            />
          </Row>
          <Label muted>{t('timerNote')}</Label>
        </Card>
      )}
      {items.map((item) => (
        <Card key={item.id}>
          <Label large>
            {data.exercises.find((e) => e.id === item.exerciseId)?.name}
          </Label>
          {data.sets
            .filter((s) => s.workoutExerciseId === item.id)
            .sort((a, b) => a.position - b.position)
            .map((set, index) => (
              <SetRow
                key={`${set.id}-${unit}-${effort}`}
                {...{ set, index, training, run, pending, onValidity }}
              />
            ))}
          <Button
            title={t('addSet')}
            secondary
            disabled={pending}
            onPress={() => {
              void run(() => training.addSet(item.id));
            }}
          />
        </Card>
      ))}
      <Button
        title={t('addExercise')}
        secondary
        onPress={() => setPicker((open) => !open)}
      />
      {picker && (
        <ExercisePicker
          exercises={data.exercises}
          workoutId={workout.id}
          {...{ training, run, pending }}
        />
      )}
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
      <Button
        title={t('finish')}
        disabled={blocked || error}
        onPress={() =>
          Alert.alert(t('finishTitle'), t('finishBody'), [
            { text: t('cancel'), style: 'cancel' },
            {
              text: t('finish'),
              onPress: () => {
                void run(() => training.finish(workout.id));
              },
            },
          ])
        }
      />
      <Button
        title={t('discard')}
        secondary
        disabled={pending}
        onPress={() =>
          Alert.alert(t('discardTitle'), t('discardBody'), [
            { text: t('cancel'), style: 'cancel' },
            {
              text: t('discard'),
              style: 'destructive',
              onPress: () => {
                void run(() => training.finish(workout.id, true));
              },
            },
          ])
        }
      />
    </>
  );
}
