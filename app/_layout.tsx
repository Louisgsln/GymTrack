import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text } from 'react-native';
import { AppProvider } from '../src/providers/AppProvider';
import { useTheme } from '../src/theme/useTheme';
import { useTranslation } from '../src/i18n/useTranslation';
import { icons } from '../src/theme/icons';
function Navigation() {
  const c = useTheme();
  const t = useTranslation();
  return (
    <>
      <StatusBar style={c.background === '#0C1418' ? 'light' : 'dark'} />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: c.accent,
          tabBarInactiveTintColor: c.muted,
          tabBarStyle: { backgroundColor: c.surface, borderTopColor: c.border },
          sceneStyle: { backgroundColor: c.background },
        }}
      >
        {(
          [
            { name: 'index', key: 'today' },
            { name: 'train', key: 'train' },
            { name: 'history', key: 'history' },
            { name: 'profile', key: 'profile' },
          ] as const
        ).map(({ name, key }) => (
          <Tabs.Screen
            key={name}
            name={name}
            options={{
              title: t(key),
              tabBarIcon: ({ color }) => (
                <Text style={{ color, fontSize: 24 }}>{icons[key]}</Text>
              ),
            }}
          />
        ))}
      </Tabs>
    </>
  );
}
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <Navigation />
      </AppProvider>
    </SafeAreaProvider>
  );
}
