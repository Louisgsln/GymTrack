import { useState } from 'react';
import { Field, Label, Row, Button } from '../../components/ui';
import { useTranslation } from '../../i18n/useTranslation';
import type { MessageKey } from '../../i18n/messages';
import { usePreferences } from '../../store/preferences';
import { setTypes, type SetTargets, type Exercise } from '../../types/entities';
import { fromKg } from './calculations';
import {
  parseTargetInput,
  trackingFields,
  type TargetNumber,
} from './setInput';
const typeLabels: Record<SetTargets['type'], MessageKey> = {
  NORMAL: 'normal',
  WARMUP: 'warmup',
  DROP_SET: 'drop',
  FAILURE: 'failure',
  AMRAP: 'amrap',
  BACKOFF: 'backoff',
  MYO_REP: 'myoRep',
  CUSTOM: 'customSet',
};
export function SetTargetFields({
  targets,
  trackingType,
  disabled,
  onChange,
  onValidity,
}: {
  targets: SetTargets;
  trackingType: Exercise['trackingType'];
  disabled: boolean;
  onChange(patch: Partial<SetTargets>, field: keyof SetTargets): void;
  onValidity(valid: boolean): void;
}) {
  const t = useTranslation();
  const unit = usePreferences((s) => s.weightUnit);
  const effort = usePreferences((s) => s.effort);
  const [invalid, setInvalid] = useState<
    Partial<Record<TargetNumber, boolean>>
  >({});
  const fields = trackingFields(trackingType);
  if (effort !== 'OFF') fields.push(effort === 'RPE' ? 'rpe' : 'rir');
  const labels: Record<TargetNumber, string> = {
    weightKg: `${t(trackingType === 'ASSISTED_BODYWEIGHT' ? 'assistance' : 'weight')} (${unit})`,
    reps: t('reps'),
    rpe: 'RPE',
    rir: 'RIR',
    durationSeconds: t('durationSeconds'),
    distanceMeters: t('distanceMeters'),
  };
  const update = (field: TargetNumber, text: string) => {
    let value: number | null;
    try {
      value = parseTargetInput(field, text, unit);
    } catch {
      setInvalid({ ...invalid, [field]: true });
      onValidity(false);
      return;
    }
    const next = { ...invalid, [field]: false };
    setInvalid(next);
    onValidity(!Object.values(next).some(Boolean));
    onChange({ [field]: value }, field);
  };
  return (
    <>
      <Row>
        {fields.map((field) => (
          <Field
            key={`${field}-${unit}`}
            label={labels[field]}
            defaultValue={String(
              field === 'weightKg'
                ? Number(fromKg(targets.weightKg, unit).toFixed(4))
                : (targets[field] ?? ''),
            )}
            keyboardType={
              field === 'reps' || field === 'rir' ? 'number-pad' : 'decimal-pad'
            }
            onChangeText={(text) => update(field, text)}
            style={{ minWidth: 80 }}
          />
        ))}
      </Row>
      {Object.values(invalid).some(Boolean) && <Label>{t('validation')}</Label>}
      <Row>
        {setTypes.map((type) => (
          <Button
            key={type}
            title={`${targets.type === type ? '✓ ' : ''}${t(typeLabels[type])}`}
            secondary={targets.type !== type}
            disabled={disabled}
            onPress={() => onChange({ type }, 'type')}
          />
        ))}
      </Row>
    </>
  );
}
