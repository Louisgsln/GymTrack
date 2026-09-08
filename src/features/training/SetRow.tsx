import { useState } from 'react';
import { Button, Label, Row } from '../../components/ui';
import { useTranslation } from '../../i18n/useTranslation';
import type { WorkoutSet, Exercise } from '../../types/entities';
import type { TrainingService } from '../../services/training';
import { SetTargetFields } from './SetTargetFields';
export function SetRow({
  set,
  index,
  training,
  run,
  pending,
  onValidity,
  trackingType,
}: {
  set: WorkoutSet;
  index: number;
  training: TrainingService;
  pending: boolean;
  trackingType: Exercise['trackingType'];
  run(action: () => Promise<unknown>, key?: string): Promise<boolean>;
  onValidity(id: string, valid: boolean): void;
}) {
  const t = useTranslation();
  const [valid, setValid] = useState(true);
  return (
    <>
      <Label>{`${t('set')} ${index + 1}`}</Label>
      <SetTargetFields
        targets={set}
        trackingType={trackingType}
        disabled={pending}
        onValidity={(value) => {
          setValid(value);
          onValidity(set.id, value);
        }}
        onChange={(patch, field) => {
          void run(
            () => training.updateSet(set.id, patch),
            `${set.id}-${field}`,
          );
        }}
      />
      <Button
        title={`${set.completedAt ? '✓ ' : ''}${t(set.completedAt ? 'uncomplete' : 'complete')}`}
        disabled={pending || !valid}
        onPress={() => {
          void run(() => training.completeSet(set.id, !set.completedAt));
        }}
      />
      <Row>
        <Button
          title={t('duplicate')}
          secondary
          disabled={pending}
          onPress={() => {
            void run(() => training.duplicateSet(set.id));
          }}
        />
        <Button
          title={t('remove')}
          secondary
          disabled={pending}
          onPress={() => {
            void run(async () => {
              await training.deleteSet(set.id);
              onValidity(set.id, true);
            });
          }}
        />
      </Row>
    </>
  );
}
