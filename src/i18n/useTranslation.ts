import { usePreferences } from '../store/preferences';
import { en, fr, type MessageKey } from './messages';
export function useTranslation() {
  const locale = usePreferences((s) => s.locale);
  return (key: MessageKey): string => (locale === 'fr' ? fr : en)[key];
}
