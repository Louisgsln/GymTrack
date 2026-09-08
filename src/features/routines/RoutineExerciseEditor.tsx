import { useState } from 'react';
import { Button, Card, Field, Label } from '../../components/ui';
import { ReorderButtons } from '../../components/ReorderButtons';
import { SetTargetFields } from '../training/SetTargetFields';
import type { RoutineDetail } from './model';
import type { RoutineService } from '../../services/routines';
import { useTranslation } from '../../i18n/useTranslation';
import { usePreferences } from '../../store/preferences';
export function RoutineExerciseEditor({
  entry,
  routines,
  run,
  pending,
  onValidity,
}: {
  entry: RoutineDetail['exercises'][number];
  routines: RoutineService;
  pending: boolean;
  run(action: () => Promise<unknown>, key?: string): Promise<boolean>;
  onValidity(id: string, valid: boolean): void;
}) {
  const t = useTranslation();
  const unit = usePreferences((s) => s.weightUnit);
  const effort = usePreferences((s) => s.effort);
  const [restValid, setRestValid] = useState(true);
  return (
    <Card>
      <Label large>{entry.exercise.name}</Label>
      <Field
        label={t('exerciseNotes')}
        defaultValue={entry.item.notes}
        maxLength={5000}
        multiline
        onChangeText={(notes) => {
          void run(
            () => routines.updateExercise(entry.item.id, { notes }),
            `${entry.item.id}-notes`,
          );
        }}
      />
      <Field
        label={t('restSeconds')}
        defaultValue={String(entry.item.restSeconds)}
        keyboardType="number-pad"
        onChangeText={(value) => {
          const valid = /^\d+$/.test(value) && Number(value) <= 3600;
          setRestValid(valid);
          onValidity(`${entry.item.id}-rest`, valid);
          if (valid)
            void run(
              () =>
                routines.updateExercise(entry.item.id, {
                  restSeconds: Number(value),
                }),
              `${entry.item.id}-rest`,
            );
        }}
      />
      {!restValid && <Label>{t('validation')}</Label>}
      {entry.sets.map((set, index) => (
        <Card key={`${set.id}-${unit}-${effort}`}>
          <Label>{`${t('set')} ${index + 1}`}</Label>
          <SetTargetFields
            targets={set}
            trackingType={entry.exercise.trackingType}
            disabled={pending}
            onValidity={(valid) => onValidity(set.id, valid)}
            onChange={(patch, field) => {
              void run(
                () => routines.updateSet(set.id, patch),
                `${set.id}-${field}`,
              );
            }}
          />
          <ReorderButtons
            ids={entry.sets.map((s) => s.id)}
            id={set.id}
            disabled={pending}
            onReorder={(ids) => {
              void run(() => routines.reorderSets(entry.item.id, ids));
            }}
          />
          <Button
            title={t('duplicate')}
            secondary
            disabled={pending}
            onPress={() => {
              void run(() => routines.addSet(entry.item.id, set.id));
            }}
          />
          <Button
            title={t('remove')}
            secondary
            disabled={pending}
            onPress={() => {
              void run(async () => {
                await routines.removeSet(set.id);
                onValidity(set.id, true);
              });
            }}
          />
        </Card>
      ))}
      <Button
        title={t('addSet')}
        secondary
        disabled={pending}
        onPress={() => {
          void run(() => routines.addSet(entry.item.id));
        }}
      />
    </Card>
  );
}
