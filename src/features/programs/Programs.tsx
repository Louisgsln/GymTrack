import { useState } from 'react';
import { Alert } from 'react-native';
import { Button, Card, Field, Label, Row } from '../../components/ui';
import { ReorderButtons } from '../../components/ReorderButtons';
import { usePrograms } from '../../hooks/usePrograms';
import { useAction } from '../../hooks/useAction';
import { useTranslation } from '../../i18n/useTranslation';
import { ProgramEditor } from './ProgramEditor';
export function Programs({ onClose }: { onClose(): void }) {
  const [selected, setSelected] = useState<string | null>(null);
  return selected ? (
    <ProgramEditor id={selected} onClose={() => setSelected(null)} />
  ) : (
    <ProgramLibrary onEdit={setSelected} onClose={onClose} />
  );
}
function ProgramLibrary({
  onEdit,
  onClose,
}: {
  onEdit(id: string): void;
  onClose(): void;
}) {
  const t = useTranslation();
  const { programs, data, isError, refetch } = usePrograms();
  const { run, retry, pending, error } = useAction();
  const [name, setName] = useState('');
  const [page, setPage] = useState(0);
  const size = 20;
  const current = Math.min(
    page,
    Math.max(0, Math.ceil((data?.length ?? 0) / size) - 1),
  );
  return (
    <>
      <Label large>{t('programs')}</Label>
      <Label muted>{t('programHelp')}</Label>
      <Card>
        <Field
          label={t('programName')}
          value={name}
          onChangeText={setName}
          maxLength={160}
          editable={!pending}
        />
        <Button
          title={t('createProgram')}
          disabled={pending || !name.trim()}
          onPress={() => {
            void run(async () => {
              const created = await programs.create(name);
              setName('');
              onEdit(created.id);
            }, 'create-program');
          }}
        />
      </Card>
      {!data ? (
        <Card>
          <Label>{t(isError ? 'error' : 'loading')}</Label>
          <Button
            title={t('retry')}
            onPress={() => {
              void refetch();
            }}
          />
        </Card>
      ) : !data.length ? (
        <Label muted>{t('noPrograms')}</Label>
      ) : (
        data.slice(current * size, (current + 1) * size).map((program) => (
          <Card key={program.id}>
            <Label large>{program.name}</Label>
            <Label muted>{program.notes}</Label>
            <Button
              title={`${t('openProgram')} · ${program.name}`}
              disabled={pending}
              onPress={() => onEdit(program.id)}
            />
            <Button
              secondary
              title={t('duplicate')}
              disabled={pending}
              onPress={() => {
                void run(() =>
                  programs.duplicate(
                    program.id,
                    `${program.name.slice(0, 140)} · ${t('routineCopied')}`,
                  ),
                );
              }}
            />
            <ReorderButtons
              id={program.id}
              ids={data.map((p) => p.id)}
              disabled={pending}
              onReorder={(ids) => {
                void run(() => programs.reorder(ids), 'program-order');
              }}
            />
            <Button
              secondary
              title={`${t('deleteProgram')} · ${program.name}`}
              disabled={pending}
              onPress={() =>
                Alert.alert(t('deleteProgram'), t('deleteProgramBody'), [
                  { text: t('cancel'), style: 'cancel' },
                  {
                    text: t('remove'),
                    style: 'destructive',
                    onPress: () => {
                      void run(() => programs.remove(program.id));
                    },
                  },
                ])
              }
            />
          </Card>
        ))
      )}
      {data && data.length > size && (
        <Row>
          <Button
            title={t('previous')}
            disabled={pending || current === 0}
            onPress={() => setPage(current - 1)}
          />
          <Button
            title={t('next')}
            disabled={pending || (current + 1) * size >= data.length}
            onPress={() => setPage(current + 1)}
          />
        </Row>
      )}
      {error && (
        <Card>
          <Label>{t('error')}</Label>
          <Button
            title={t('retry')}
            disabled={pending}
            onPress={() => {
              void retry();
            }}
          />
        </Card>
      )}
      <Button title={t('close')} disabled={pending} onPress={onClose} />
    </>
  );
}
