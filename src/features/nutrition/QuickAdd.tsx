import { useState } from 'react';
import { Button, Card, Field, Label } from '../../components/ui';
import { useTranslation } from '../../i18n/useTranslation';
import { useServices } from '../../providers/AppProvider';
import { useAction } from '../../hooks/useAction';
import type { Nutrients } from '../../types/entities';
export function QuickAdd({ date }: { date: string }) {
  const t = useTranslation();
  const { nutrition } = useServices();
  const { run, pending, error } = useAction();
  const [name, setName] = useState('');
  const [meal, setMeal] = useState(t('lunch'));
  const [values, setValues] = useState({
    energy_kcal: '',
    protein: '',
    carbohydrates: '',
    fat: '',
  });
  const fields = [
    { key: 'energy_kcal', label: 'calories' },
    { key: 'protein', label: 'protein' },
    { key: 'carbohydrates', label: 'carbs' },
    { key: 'fat', label: 'fat' },
  ] as const;
  const valid =
    !!values.energy_kcal &&
    Object.values(values).every((v) => !v || /^\d+([.,]\d*)?$/.test(v));
  return (
    <Card>
      <Label>{t('quickAdd')}</Label>
      <Label muted>{t('quickAddHelp')}</Label>
      <Field
        label={t('foodName')}
        value={name}
        onChangeText={setName}
        maxLength={160}
      />
      <Field
        label={t('meal')}
        value={meal}
        onChangeText={setMeal}
        maxLength={100}
      />
      {fields.map(({ key, label }) => (
        <Field
          key={key}
          label={t(label)}
          value={values[key]}
          keyboardType="decimal-pad"
          onChangeText={(value) =>
            setValues((previous) => ({ ...previous, [key]: value }))
          }
        />
      ))}
      {error && <Label>{t('error')}</Label>}
      <Button
        title={t('log')}
        disabled={pending || !name.trim() || !meal.trim() || !valid}
        onPress={() => {
          const nutrients: Nutrients = {};
          for (const { key } of fields)
            if (values[key])
              nutrients[key] = {
                value: Number(values[key].replace(',', '.')),
                unit: key === 'energy_kcal' ? 'kcal' : 'g',
              };
          void run(async () => {
            await nutrition.quickAdd({
              name,
              meal,
              diaryDate: date,
              nutrients,
            });
            setName('');
            setValues({
              energy_kcal: '',
              protein: '',
              carbohydrates: '',
              fat: '',
            });
          });
        }}
      />
    </Card>
  );
}
