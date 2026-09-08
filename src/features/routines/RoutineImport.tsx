import { useState } from 'react';
import { Button, Card, Field, Label } from '../../components/ui';
import { useTranslation } from '../../i18n/useTranslation';
import { useServices } from '../../providers/AppProvider';
import { useAction } from '../../hooks/useAction';
import { MAX_SHARED_ROUTINE_LENGTH, type SharedRoutine } from './model';
export function RoutineImport({
  onImported,
  onClose,
}: {
  onImported(id: string): void;
  onClose(): void;
}) {
  const t = useTranslation();
  const { routineSharing } = useServices();
  const { run, pending, error } = useAction();
  const [text, setText] = useState('');
  const [preview, setPreview] = useState<SharedRoutine | null>(null);
  const [invalid, setInvalid] = useState(false);
  return (
    <Card>
      <Label large>{t('importRoutine')}</Label>
      <Field
        label={t('importContent')}
        value={text}
        editable={!pending}
        multiline
        maxLength={MAX_SHARED_ROUTINE_LENGTH + 1}
        onChangeText={(value) => {
          setText(value);
          setPreview(null);
          setInvalid(false);
        }}
      />
      <Button
        title={t('reviewImport')}
        disabled={pending || !text}
        onPress={() => {
          try {
            setPreview(routineSharing.preview(text));
            setInvalid(false);
          } catch {
            setInvalid(true);
            setPreview(null);
          }
        }}
      />
      {invalid && <Label>{t('invalidRoutine')}</Label>}
      {preview && (
        <>
          <Label large>{preview.name}</Label>
          <Label>{preview.notes}</Label>
          {'groups' in preview &&
            preview.groups.map((group, index) => (
              <Label
                key={index}
              >{`${t(group.members.length === 2 ? 'superset' : group.members.length === 3 ? 'triSet' : 'giantSet')} ${index + 1} · ${group.members.map((member) => preview.exercises[member]!.definition.name).join(' → ')} · ${group.restSeconds} s`}</Label>
            ))}
          {preview.exercises.map((entry, index) => (
            <Label
              key={index}
            >{`${entry.definition.name} · ${entry.sets.length} ${t('set')}`}</Label>
          ))}
          <Label muted>{t('importReview')}</Label>
          <Button
            title={t('confirmImport')}
            disabled={pending}
            onPress={() => {
              void run(async () => {
                const result = await routineSharing.import(text);
                onImported(result.id);
              });
            }}
          />
        </>
      )}
      {error && <Label>{t('error')}</Label>}
      <Button
        title={t('close')}
        secondary
        disabled={pending}
        onPress={onClose}
      />
    </Card>
  );
}
