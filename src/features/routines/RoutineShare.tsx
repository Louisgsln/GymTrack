import { useQuery } from '@tanstack/react-query';
import { Share } from 'react-native';
import { Button, Card, Field, Label } from '../../components/ui';
import { useServices } from '../../providers/AppProvider';
import { useTranslation } from '../../i18n/useTranslation';
import { useAction } from '../../hooks/useAction';
export function RoutineShare({ id, onClose }: { id: string; onClose(): void }) {
  const t = useTranslation();
  const { routineSharing } = useServices();
  const { run, pending, error } = useAction();
  const query = useQuery({
    queryKey: ['routineShare', id],
    queryFn: () => routineSharing.export(id),
  });
  return (
    <Card>
      <Label large>{t('shareRoutine')}</Label>
      <Label>{t('shareReview')}</Label>
      {query.isPending && <Label>{t('loading')}</Label>}
      {query.isError && (
        <Button
          title={t('retry')}
          onPress={() => {
            void query.refetch();
          }}
        />
      )}
      {query.data && (
        <>
          <Field
            label={t('importContent')}
            value={query.data}
            multiline
            editable={false}
            selectTextOnFocus
          />
          <Button
            title={t('shareSystem')}
            disabled={pending}
            onPress={() => {
              void run(() =>
                Share.share({ message: query.data!, title: t('shareRoutine') }),
              );
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
