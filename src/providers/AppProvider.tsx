import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createLocalQueryClient } from './localQueryClient';
import { getLocales } from 'expo-localization';
import { bootstrap, type Services } from '../services/bootstrap';
import { usePreferences } from '../store/preferences';
import { reportError } from '../utils/errors';
import { useTranslation } from '../i18n/useTranslation';
import { Button, Label, Page } from '../components/ui';

const Context = createContext<Services | null>(null);
const queryClient = createLocalQueryClient();
let initialization: ReturnType<typeof bootstrap> | null = null;
function initialize() {
  initialization ??= bootstrap().catch((error: unknown) => {
    initialization = null;
    throw error;
  });
  return initialization;
}
export function AppProvider({ children }: PropsWithChildren) {
  const [services, setServices] = useState<Services | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const t = useTranslation();
  useEffect(() => {
    let mounted = true;
    initialize()
      .then((value) => {
        if (!mounted) return;
        usePreferences.setState(
          value.preferences ?? {
            locale: getLocales()[0]?.languageCode === 'fr' ? 'fr' : 'en',
          },
        );
        setServices(value);
      })
      .catch((error: unknown) => {
        reportError('bootstrap', error);
        if (mounted) setFailed(true);
      });
    return () => {
      mounted = false;
    };
  }, [attempt]);
  if (!services)
    return (
      <Page>
        <Label>{t(failed ? 'startupError' : 'loading')}</Label>
        {failed && (
          <Button
            title={t('retry')}
            onPress={() => {
              setFailed(false);
              setAttempt((n) => n + 1);
            }}
          />
        )}
      </Page>
    );
  return (
    <Context.Provider value={services}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Context.Provider>
  );
}
export function useServices() {
  const services = useContext(Context);
  if (!services) throw new Error('SERVICES_NOT_READY');
  return services;
}
