import { Button, Row } from './ui';
import { useTranslation } from '../i18n/useTranslation';
export function ReorderButtons({
  ids,
  id,
  disabled,
  onReorder,
}: {
  ids: string[];
  id: string;
  disabled: boolean;
  onReorder(ids: string[]): void;
}) {
  const t = useTranslation();
  const index = ids.indexOf(id);
  const move = (offset: number) => {
    const next = [...ids];
    const target = next[index + offset];
    if (!target || index < 0) return;
    next[index] = target;
    next[index + offset] = id;
    onReorder(next);
  };
  return (
    <Row>
      <Button
        title={t('moveUp')}
        secondary
        disabled={disabled || index <= 0}
        onPress={() => move(-1)}
      />
      <Button
        title={t('moveDown')}
        secondary
        disabled={disabled || index < 0 || index >= ids.length - 1}
        onPress={() => move(1)}
      />
    </Row>
  );
}
