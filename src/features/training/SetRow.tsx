import { useState } from 'react';
import { Button, Field, Label, Row } from '../../components/ui';
import { useTranslation } from '../../i18n/useTranslation';
import { usePreferences } from '../../store/preferences';
import type { WorkoutSet } from '../../types/entities';
import type { TrainingService } from '../../services/training';
import { fromKg, toKg } from './calculations';

export function SetRow({
  set,
  index,
  training,
  run,
  pending,
  onValidity,
}: {
  set: WorkoutSet;
  index: number;
  training: TrainingService;
  pending: boolean;
  run(action: () => Promise<unknown>, key?: string): Promise<boolean>;
  onValidity(id: string, valid: boolean): void;
}) {
  const t = useTranslation();
  const unit = usePreferences((s) => s.weightUnit);
  const effort = usePreferences((s) => s.effort);
  const [invalid, setInvalid] = useState<Record<string, boolean>>({});
  const update = (field: 'weightKg' | 'reps' | 'rpe' | 'rir', text: string) => {
    const normalized = text.replace(',', '.');
    const nullable = field === 'rpe' || field === 'rir';
    let value: number | null = nullable && !text ? null : Number(normalized);
    const numeric =
      value === null ||
      (/^\d+(\.\d*)?$/.test(normalized) && Number.isFinite(value));
    const valid =
      numeric &&
      (value === null ||
        (field === 'weightKg'
          ? value >= 0 && toKg(value, unit) <= 2000
          : field === 'reps'
            ? Number.isInteger(value) &&
              value <= 10000 &&
              (!set.completedAt || value > 0)
            : field === 'rpe'
              ? value >= 6 && value <= 10 && (value * 2) % 1 === 0
              : Number.isInteger(value) && value <= 10));
    const nextInvalid = { ...invalid, [field]: !valid };
    setInvalid(nextInvalid);
    onValidity(set.id, !Object.values(nextInvalid).some(Boolean));
    if (!valid) return;
    if (field === 'weightKg' && value !== null) value = toKg(value, unit);
    void run(
      () => training.updateSet(set.id, { [field]: value }),
      `${set.id}-${field}`,
    );
  };
  return (
    <>
      <Label>{`${t('set')} ${index + 1}`}</Label>
      <Row>
        <Field
          label={`${t('weight')} (${unit})`}
          defaultValue={String(Number(fromKg(set.weightKg, unit).toFixed(4)))}
          keyboardType="decimal-pad"
          onChangeText={(text) => update('weightKg', text)}
          style={{ minWidth: 90 }}
        />
        <Field
          label={t('reps')}
          defaultValue={String(set.reps)}
          keyboardType="number-pad"
          onChangeText={(text) => update('reps', text)}
          style={{ minWidth: 70 }}
        />
        {effort !== 'OFF' && (
          <Field
            label={effort}
            defaultValue={String((effort === 'RPE' ? set.rpe : set.rir) ?? '')}
            keyboardType="decimal-pad"
            onChangeText={(text) =>
              update(effort === 'RPE' ? 'rpe' : 'rir', text)
            }
            style={{ minWidth: 70 }}
          />
        )}
      </Row>
      {Object.values(invalid).some(Boolean) && <Label>{t('validation')}</Label>}
      <Row>
        {(
          [
            { type: 'NORMAL', label: 'normal' },
            { type: 'WARMUP', label: 'warmup' },
            { type: 'DROP_SET', label: 'drop' },
            { type: 'FAILURE', label: 'failure' },
          ] as const
        ).map(({ type, label }) => (
          <Button
            key={type}
            title={`${set.type === type ? '✓ ' : ''}${t(label)}`}
            secondary={set.type !== type}
            disabled={pending}
            onPress={() => {
              void run(() => training.updateSet(set.id, { type }));
            }}
          />
        ))}
      </Row>
      <Button
        title={`${set.completedAt ? '✓ ' : ''}${t(set.completedAt ? 'uncomplete' : 'complete')}`}
        disabled={pending || Object.values(invalid).some(Boolean)}
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
