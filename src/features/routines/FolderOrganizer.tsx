import { useState } from 'react';
import { Alert } from 'react-native';
import { Button, Card, Field, Label } from '../../components/ui';
import { ReorderButtons } from '../../components/ReorderButtons';
import { useTranslation } from '../../i18n/useTranslation';
import { useServices } from '../../providers/AppProvider';
import type { Routine, RoutineFolder } from '../../types/entities';
import { folderRows } from './folderDrag';
import { FolderDragBoard } from './FolderDragBoard';
export function FolderOrganizer({
  folders,
  routines,
  run,
  pending,
}: {
  folders: RoutineFolder[];
  routines: Routine[];
  pending: boolean;
  run(action: () => Promise<unknown>, key?: string): Promise<boolean>;
}) {
  const t = useTranslation();
  const { routineFolders, routines: service } = useServices();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [moving, setMoving] = useState<string | null>(null);
  const moveRoutine = routines.find((r) => r.id === moving);
  return (
    <Card>
      <Button
        secondary
        title={t('organizeFolders')}
        disabled={pending}
        onPress={() => setOpen((v) => !v)}
      />
      {open && (
        <>
          <Field
            label={t('folderName')}
            value={name}
            onChangeText={setName}
            maxLength={160}
            editable={!pending}
          />
          <Button
            title={t(editing ? 'renameFolder' : 'createFolder')}
            disabled={pending || !name.trim()}
            onPress={() => {
              void run(async () => {
                if (editing) await routineFolders.rename(editing, name);
                else await routineFolders.create(name);
                setName('');
                setEditing(null);
              }, 'folder-name');
            }}
          />
          {editing && (
            <Button
              secondary
              title={t('cancel')}
              disabled={pending}
              onPress={() => {
                setEditing(null);
                setName('');
              }}
            />
          )}
          {moveRoutine && (
            <Card>
              <Label>{`${t('moveRoutine')} · ${moveRoutine.name}`}</Label>
              {[null, ...folders].map((folder) => (
                <Button
                  key={folder?.id ?? 'root'}
                  title={`${t('moveToFolder')} · ${folder?.name ?? t('unfiledRoutines')}`}
                  disabled={
                    pending || moveRoutine.folderId === (folder?.id ?? null)
                  }
                  onPress={() => {
                    void run(async () => {
                      await routineFolders.moveRoutine(
                        moveRoutine.id,
                        folder?.id ?? null,
                      );
                      setMoving(null);
                    }, 'move-routine');
                  }}
                />
              ))}
              <Button
                secondary
                title={t('cancel')}
                disabled={pending}
                onPress={() => setMoving(null)}
              />
            </Card>
          )}
          <FolderDragBoard
            rows={folderRows(
              folders,
              routines,
              t('unfiledRoutines'),
              t('foldersEnd'),
            )}
            pending={pending}
            onDrop={(source, target) => {
              void run(
                () =>
                  source.kind === 'folder'
                    ? routineFolders.moveFolder(source.id!, target.id)
                    : routineFolders.moveRoutine(
                        source.id!,
                        target.folderId,
                        target.kind === 'routine' ? target.id : null,
                      ),
                'folder-drop',
              );
            }}
            controls={(row) => (
              <>
                {(row.kind === 'folder' || row.kind === 'routine') && (
                  <ReorderButtons
                    id={row.id!}
                    ids={
                      row.kind === 'folder'
                        ? folders.map((f) => f.id)
                        : routines
                            .filter((r) => r.folderId === row.folderId)
                            .map((r) => r.id)
                    }
                    disabled={pending}
                    onReorder={(ids) => {
                      void run(
                        () =>
                          row.kind === 'folder'
                            ? routineFolders.reorder(ids)
                            : service.reorder(ids, row.folderId),
                        `reorder-${row.key}`,
                      );
                    }}
                  />
                )}
                {row.kind === 'routine' && (
                  <Button
                    secondary
                    title={`${t('moveRoutine')} · ${row.label}`}
                    disabled={pending}
                    onPress={() => setMoving(row.id)}
                  />
                )}
                {row.kind === 'folder' && (
                  <>
                    <Button
                      secondary
                      title={`${t('renameFolder')} · ${row.label}`}
                      disabled={pending}
                      onPress={() => {
                        setEditing(row.id);
                        setName(row.label);
                      }}
                    />
                    <Button
                      secondary
                      title={`${t('deleteFolder')} · ${row.label}`}
                      disabled={pending}
                      onPress={() =>
                        Alert.alert(t('deleteFolder'), t('deleteFolderBody'), [
                          { text: t('cancel'), style: 'cancel' },
                          {
                            text: t('remove'),
                            style: 'destructive',
                            onPress: () => {
                              void run(async () => {
                                await routineFolders.remove(row.id!);
                                if (editing === row.id) {
                                  setEditing(null);
                                  setName('');
                                }
                              }, `delete-folder-${row.id}`);
                            },
                          },
                        ])
                      }
                    />
                  </>
                )}
              </>
            )}
          />
        </>
      )}
    </Card>
  );
}
