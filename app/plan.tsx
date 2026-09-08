import { useState } from 'react';
import { Page, Button } from '../src/components/ui';
import { Programs } from '../src/features/programs/Programs';
import { useTranslation } from '../src/i18n/useTranslation';
import { RoutineLibrary } from '../src/features/routines/RoutineLibrary';
import { RoutineEditor } from '../src/features/routines/RoutineEditor';
import { RoutineImport } from '../src/features/routines/RoutineImport';
import { RoutineShare } from '../src/features/routines/RoutineShare';
type Screen =
  | { type: 'library' }
  | { type: 'programs' }
  | { type: 'edit'; id: string }
  | { type: 'share'; id: string }
  | { type: 'import' };
export default function Plan() {
  const t = useTranslation();
  const [screen, setScreen] = useState<Screen>({ type: 'library' });
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const close = () => setScreen({ type: 'library' });
  const edit = (id: string) => setScreen({ type: 'edit', id });
  return (
    <Page>
      {screen.type === 'programs' ? (
        <Programs onClose={close} />
      ) : screen.type === 'edit' ? (
        <RoutineEditor key={screen.id} id={screen.id} onClose={close} />
      ) : screen.type === 'share' ? (
        <RoutineShare id={screen.id} onClose={close} />
      ) : screen.type === 'import' ? (
        <RoutineImport
          onImported={(id) => {
            setSelectedFolder(null);
            edit(id);
          }}
          onClose={close}
        />
      ) : (
        <>
          <Button
            title={t('programs')}
            onPress={() => setScreen({ type: 'programs' })}
          />
          <RoutineLibrary
            selectedFolder={selectedFolder}
            onSelectFolder={setSelectedFolder}
            onEdit={edit}
            onImport={() => setScreen({ type: 'import' })}
            onShare={(id) => setScreen({ type: 'share', id })}
          />
        </>
      )}
    </Page>
  );
}
