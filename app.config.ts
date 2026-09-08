import type { ExpoConfig } from 'expo/config';
import BRAND_CONFIG from './brand.json';
const config: ExpoConfig = {
  ...BRAND_CONFIG,
  version: '0.1.0',
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  platforms: ['ios', 'android'],
  plugins: [
    'expo-router',
    'expo-sqlite',
    'expo-secure-store',
    'expo-localization',
    'expo-status-bar',
  ],
  ios: { bundleIdentifier: 'app.gymtrack.mobile', supportsTablet: true },
  android: { package: 'app.gymtrack.mobile' },
};
export default config;
