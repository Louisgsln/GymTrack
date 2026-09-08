import { useState } from 'react';
import { Button, Card, Field, Label } from '../../components/ui';
import { useTranslation } from '../../i18n/useTranslation';
import type { Exercise } from '../../types/entities';
import type { TrainingService } from '../../services/training';
export function ExercisePicker({
  exercises,
  onAdd,
  training,
  run,
  pending,
}: {
  exercises: Exercise[];
  onAdd: (exerciseId: string) => Promise<unknown>;
  training: TrainingService;
  run(action: () => Promise<unknown>): Promise<boolean>;
  pending: boolean;
}) {
  const t = useTranslation();
  const [name, setName] = useState('');
  const [muscle, setMuscle] = useState('');
  const [equipment, setEquipment] = useState('');
  const [rest, setRest] = useState('90');
  const [search, setSearch] = useState('');
  return (
    <Card>
      <Label>{t('library')}</Label>
      <Field label={t('search')} value={search} onChangeText={setSearch} />
      {exercises.length === 0 && <Label muted>{t('noExercises')}</Label>}
      {exercises
        .filter((e) =>
          e.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
        )
        .slice(0, 30)
        .map((exercise) => (
          <Button
            key={exercise.id}
            title={`${t('addExercise')} · ${exercise.name}`}
            secondary
            disabled={pending}
            onPress={() => {
              void run(() => onAdd(exercise.id));
            }}
          />
        ))}
      <Label muted>{t('exerciseHelp')}</Label>
      <Field
        label={t('exerciseName')}
        value={name}
        onChangeText={setName}
        maxLength={120}
      />
      <Field
        label={t('muscle')}
        value={muscle}
        onChangeText={setMuscle}
        maxLength={80}
      />
      <Field
        label={t('equipment')}
        value={equipment}
        onChangeText={setEquipment}
        maxLength={80}
      />
      <Field
        label={t('restSeconds')}
        value={rest}
        onChangeText={setRest}
        keyboardType="number-pad"
      />
      <Button
        title={t('createExercise')}
        disabled={
          pending ||
          !name.trim() ||
          !muscle.trim() ||
          !equipment.trim() ||
          !/^\d+$/.test(rest) ||
          Number(rest) > 3600
        }
        onPress={() => {
          void run(async () => {
            await training.createExercise({
              name,
              primaryMuscle: muscle,
              secondaryMuscles: [],
              equipment,
              trackingType: 'WEIGHT_REPS',
              instructions: '',
              defaultRestSeconds: Number(rest),
            });
            setName('');
          });
        }}
      />
    </Card>
  );
}
