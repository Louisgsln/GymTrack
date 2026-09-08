import { useEffect, useRef, useState, type ReactNode } from 'react';
import { View, type GestureResponderEvent } from 'react-native';
import { Label } from '../../components/ui';
import { useTranslation } from '../../i18n/useTranslation';
import { useTheme } from '../../theme/useTheme';
import { dropTarget, type DropRect, type FolderRow } from './folderDrag';
export function FolderDragBoard({
  rows,
  pending,
  onDrop,
  controls,
}: {
  rows: FolderRow[];
  pending: boolean;
  onDrop(source: FolderRow, target: FolderRow): void;
  controls(row: FolderRow): ReactNode;
}) {
  const t = useTranslation();
  const theme = useTheme();
  const nodes = useRef(new Map<string, View>());
  const drag = useRef<{
    source: FolderRow;
    x: number;
    y: number;
    rects: Promise<DropRect[]>;
  } | null>(null);
  const [visual, setVisual] = useState<{
    key: string;
    dx: number;
    dy: number;
  } | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const cancel = () => {
    drag.current = null;
    setVisual(null);
    setHover(null);
  };
  useEffect(
    () => () => {
      drag.current = null;
    },
    [],
  );
  const start = (row: FolderRow, event: GestureResponderEvent) => {
    const { pageX: x, pageY: y } = event.nativeEvent;
    const rects = Promise.all(
      rows.map(
        (target) =>
          new Promise<DropRect | null>((resolve) => {
            const node = nodes.current.get(target.key);
            if (!node) {
              resolve(null);
              return;
            }
            const timeout = setTimeout(() => resolve(null), 300);
            node.measureInWindow((left, top, width, height) => {
              clearTimeout(timeout);
              resolve({ row: target, x: left, y: top, width, height });
            });
          }),
      ),
    ).then((values) => values.filter((v): v is DropRect => v !== null));
    drag.current = { source: row, x, y, rects };
    setVisual({ key: row.key, dx: 0, dy: 0 });
  };
  const move = (event: GestureResponderEvent) => {
    const current = drag.current;
    if (!current) return;
    const { pageX: x, pageY: y } = event.nativeEvent;
    setVisual({
      key: current.source.key,
      dx: x - current.x,
      dy: y - current.y,
    });
    void current.rects.then((rects) => {
      if (drag.current === current)
        setHover(dropTarget(current.source, rects, x, y)?.key ?? null);
    });
  };
  const release = async (event: GestureResponderEvent) => {
    const current = drag.current;
    if (!current) return;
    const { pageX: x, pageY: y } = event.nativeEvent;
    const rects = await current.rects;
    if (drag.current !== current) return;
    const target = dropTarget(current.source, rects, x, y);
    cancel();
    if (target && !pending) onDrop(current.source, target);
  };
  return (
    <View>
      <Label muted>{t('folderDragHelp')}</Label>
      {rows.map((row) => (
        <View
          key={row.key}
          nativeID={`drop-${row.key}`}
          collapsable={false}
          ref={(node) => {
            if (node) nodes.current.set(row.key, node);
            else nodes.current.delete(row.key);
          }}
          style={{
            padding: 12,
            marginVertical: 4,
            borderWidth: 2,
            borderRadius: 12,
            borderColor: hover === row.key ? theme.accent : theme.border,
            backgroundColor: theme.surface,
            zIndex: visual?.key === row.key ? 1 : 0,
          }}
        >
          <Label large={row.kind === 'folder' || row.kind === 'root'}>
            {row.label}
          </Label>
          {(row.kind === 'folder' || row.kind === 'routine') && (
            <View
              nativeID={`drag-${row.key}`}
              accessible
              accessibilityRole="button"
              accessibilityLabel={`${t('dragItem')} · ${row.label}`}
              accessibilityHint={t('folderDragHelp')}
              onStartShouldSetResponder={() => !pending}
              onResponderGrant={(event) => start(row, event)}
              onResponderMove={move}
              onResponderRelease={(event) => {
                void release(event);
              }}
              onResponderTerminationRequest={() => false}
              onResponderTerminate={cancel}
              style={{
                padding: 12,
                minHeight: 44,
                backgroundColor: theme.raised,
                borderRadius: 8,
                transform:
                  visual?.key === row.key
                    ? [{ translateX: visual.dx }, { translateY: visual.dy }]
                    : [],
              }}
            >
              <Label>{`${visual?.key === row.key ? t('draggingItem') : t('dragItem')} · ${row.label}`}</Label>
            </View>
          )}
          {controls(row)}
        </View>
      ))}
    </View>
  );
}
