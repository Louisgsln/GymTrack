import { Card, Label } from '../../components/ui';
import { useTranslation } from '../../i18n/useTranslation';
import { usePreferences } from '../../store/preferences';
import type { Exercise } from '../../types/entities';
import { fromKg } from './calculations';
import type { PersonalRecord, PreviousPerformance } from './performance';

export function PreviousSet({
  previous,
  trackingType,
}: {
  previous?: PreviousPerformance;
  trackingType: Exercise['trackingType'];
}) {
  const t = useTranslation();
  const unit = usePreferences((s) => s.weightUnit);
  const locale = usePreferences((s) => s.locale);
  const number = (n: number) =>
    n.toLocaleString(locale, { maximumFractionDigits: 2 });
  if (!previous) return <Label muted>{t('noPreviousSet')}</Label>;
  const set = previous.set;
  const values: string[] = [];
  if (
    [
      'WEIGHT_REPS',
      'BODYWEIGHT_REPS',
      'ASSISTED_BODYWEIGHT',
      'WEIGHT_DURATION',
    ].includes(trackingType)
  )
    values.push(
      `${trackingType === 'ASSISTED_BODYWEIGHT' ? `${t('assistance')} ` : ''}${number(fromKg(set.weightKg, unit))} ${unit}`,
    );
  if (
    ['WEIGHT_REPS', 'BODYWEIGHT_REPS', 'ASSISTED_BODYWEIGHT'].includes(
      trackingType,
    )
  )
    values.push(`${set.reps} ${t('reps')}`);
  if (
    ['WEIGHT_DURATION', 'DURATION', 'DISTANCE_DURATION'].includes(trackingType)
  )
    values.push(`${number(set.durationSeconds ?? 0)} s`);
  if (['DISTANCE', 'DISTANCE_DURATION'].includes(trackingType))
    values.push(`${number(set.distanceMeters ?? 0)} m`);
  values.push(`RPE ${set.rpe ?? '—'}`);
  return (
    <Label
      muted
    >{`${t('previousPerformance')} · ${new Date(previous.startedAt).toLocaleDateString(locale)} · ${values.join(' · ')}`}</Label>
  );
}

export function WorkoutRecords({
  records,
  exercises,
  provisional = false,
}: {
  records: PersonalRecord[];
  exercises: Exercise[];
  provisional?: boolean;
}) {
  const t = useTranslation();
  const unit = usePreferences((s) => s.weightUnit);
  const locale = usePreferences((s) => s.locale);
  if (!records.length) return null;
  const value = (record: PersonalRecord, amount: number) => {
    const numeric = record.type === 'MAX_REPS' ? amount : fromKg(amount, unit);
    const suffix =
      record.type === 'MAX_REPS'
        ? t('reps')
        : ['MAX_SET_VOLUME', 'MAX_WORKOUT_VOLUME'].includes(record.type)
          ? `${unit} × ${t('reps')}`
          : unit;
    return `${numeric.toLocaleString(locale, { maximumFractionDigits: 2 })} ${suffix}`;
  };
  return (
    <Card>
      <Label large>
        {t(provisional ? 'provisionalRecords' : 'personalRecords')}
      </Label>
      {records.map((record) => (
        <Label key={`${record.exerciseId}-${record.type}`}>
          {`${exercises.find((e) => e.id === record.exerciseId)?.name ?? ''} · ${t(record.type)} · ${value(record, record.value)} · ${record.previousValue === null ? t('firstRecord') : `${t('previousRecord')} ${value(record, record.previousValue)}`}`}
        </Label>
      ))}
      <Label muted>{t('recordsRule')}</Label>
    </Card>
  );
}
