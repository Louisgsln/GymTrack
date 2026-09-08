import { useState } from 'react';
import { Alert } from 'react-native';
import { Button, Card, Field, Label } from '../../components/ui';
import { ReorderButtons } from '../../components/ReorderButtons';
import { useServices } from '../../providers/AppProvider';
import { useTranslation } from '../../i18n/useTranslation';
import type { SupersetGroup } from '../../types/entities';
import type { GroupParent } from '../../services/supersets';
import { exerciseBlocks, groupLabels, type GroupedItem } from './supersets';
export function GroupEditor({
  parent,
  items,
  groups,
  run,
  pending,
}: {
  parent: GroupParent;
  items: (GroupedItem & { name: string })[];
  groups: SupersetGroup[];
  run(action: () => Promise<unknown>, key?: string): Promise<boolean>;
  pending: boolean;
}) {
  const t = useTranslation();
  const { supersets } = useServices();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [rest, setRest] = useState('90');
  const validRest = /^\d+$/.test(rest) && Number(rest) <= 3600;
  const blocks = exerciseBlocks(items);
  const labels = groupLabels(items);
  const selection = selected.filter((id) =>
    items.some((e) => e.id === id && !e.supersetGroupId),
  );
  return (
    <Card>
      <Button
        secondary
        title={t('organizeExercises')}
        disabled={pending}
        onPress={() => setOpen((v) => !v)}
      />
      {open && (
        <>
          <Label muted>{t('groupHelp')}</Label>
          <Field
            label={t('groupRest')}
            value={rest}
            onChangeText={setRest}
            keyboardType="number-pad"
            editable={!pending}
          />
          {!validRest && <Label>{t('validation')}</Label>}
          {blocks.map((block) => {
            const first = block[0]!;
            const group = groups.find((g) => g.id === first.supersetGroupId);
            return (
              <Card key={first.supersetGroupId ?? first.id}>
                <ReorderButtons
                  id={first.id}
                  ids={blocks.map((b) => b[0]!.id)}
                  disabled={pending}
                  onReorder={(ids) => {
                    void run(() =>
                      supersets.reorder(
                        parent,
                        ids.flatMap((id) =>
                          blocks.find((b) => b[0]!.id === id)!.map((e) => e.id),
                        ),
                      ),
                    );
                  }}
                />
                {group && (
                  <Label>{`${t(block.length === 2 ? 'superset' : block.length === 3 ? 'triSet' : 'giantSet')} · ${group.restSeconds} s`}</Label>
                )}
                {block.map((item) => (
                  <Card key={item.id}>
                    <Label>{`${labels[item.id] ? `${labels[item.id]} · ` : ''}${item.name}`}</Label>
                    {group ? (
                      <ReorderButtons
                        ids={block.map((e) => e.id)}
                        id={item.id}
                        disabled={pending}
                        onReorder={(ids) => {
                          void run(() =>
                            supersets.reorder(
                              parent,
                              blocks.flatMap((b) =>
                                b === block ? ids : b.map((e) => e.id),
                              ),
                            ),
                          );
                        }}
                      />
                    ) : (
                      <Button
                        secondary
                        title={`${selection.includes(item.id) ? t('deselectGroup') : t('selectGroup')} · ${item.name}`}
                        disabled={pending}
                        onPress={() =>
                          setSelected((ids) =>
                            ids.includes(item.id)
                              ? ids.filter((id) => id !== item.id)
                              : [...ids, item.id],
                          )
                        }
                      />
                    )}
                  </Card>
                ))}
                {group && (
                  <>
                    <Button
                      secondary
                      title={t('applyGroupRest')}
                      disabled={pending || !validRest}
                      onPress={() => {
                        void run(
                          () => supersets.updateRest(group.id, Number(rest)),
                          `group-rest-${group.id}`,
                        );
                      }}
                    />
                    <Button
                      secondary
                      title={t('dissolveGroup')}
                      disabled={pending}
                      onPress={() =>
                        Alert.alert(
                          t('dissolveGroup'),
                          t('dissolveGroupBody'),
                          [
                            { text: t('cancel'), style: 'cancel' },
                            {
                              text: t('confirm'),
                              onPress: () => {
                                void run(() => supersets.dissolve(group.id));
                              },
                            },
                          ],
                        )
                      }
                    />
                  </>
                )}
              </Card>
            );
          })}
          <Button
            title={`${t('createGroup')} (${selection.length})`}
            disabled={
              pending ||
              !validRest ||
              selection.length < 2 ||
              selection.length > 200
            }
            onPress={() => {
              void run(async () => {
                await supersets.create(parent, selection, Number(rest));
                setSelected([]);
              }, 'create-group');
            }}
          />
        </>
      )}
    </Card>
  );
}
