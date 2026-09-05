import { useColorScheme } from 'react-native';
import { usePreferences } from '../store/preferences';
import { palettes } from './colors';
export function useTheme() {
  const preference = usePreferences((s) => s.theme);
  const system = useColorScheme();
  return palettes[
    preference === 'system'
      ? system === 'light'
        ? 'light'
        : 'dark'
      : preference
  ];
}
