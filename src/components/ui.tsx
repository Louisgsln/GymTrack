import type { PropsWithChildren } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/useTheme';
import { spacing } from '../theme/spacing';
import { radius } from '../theme/radius';
import { typography } from '../theme/typography';

export function Page({ children }: PropsWithChildren) {
  const c = useTheme();
  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={{ flex: 1, backgroundColor: c.background }}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.page}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
export function Label({
  children,
  muted = false,
  large = false,
}: PropsWithChildren<{ muted?: boolean; large?: boolean }>) {
  const c = useTheme();
  return (
    <Text
      style={{
        color: muted ? c.muted : c.text,
        fontSize: large ? typography.title : typography.body,
        fontWeight: large ? '700' : '400',
      }}
    >
      {children}
    </Text>
  );
}
export function Card({ children }: PropsWithChildren) {
  const c = useTheme();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: c.surface, borderColor: c.border },
      ]}
    >
      {children}
    </View>
  );
}
export function Button({
  title,
  onPress,
  secondary = false,
  disabled = false,
}: {
  title: string;
  onPress(): void;
  secondary?: boolean;
  disabled?: boolean;
}) {
  const c = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: secondary ? c.raised : c.accent,
          opacity: disabled ? 0.45 : pressed ? 0.7 : 1,
        },
      ]}
    >
      <Text
        style={{
          color: secondary ? c.text : c.accentText,
          fontSize: typography.body,
          fontWeight: '600',
          textAlign: 'center',
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
}
export function Field({ label, ...props }: TextInputProps & { label: string }) {
  const c = useTheme();
  return (
    <View style={{ flexGrow: 1, gap: spacing.xs }}>
      <Label muted>{label}</Label>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={c.muted}
        selectTextOnFocus
        {...props}
        style={[
          styles.input,
          {
            color: c.text,
            backgroundColor: c.background,
            borderColor: c.border,
          },
          props.style,
        ]}
      />
    </View>
  );
}
export function Row({ children }: PropsWithChildren) {
  return <View style={styles.row}>{children}</View>;
}
export const styles = StyleSheet.create({
  page: {
    padding: spacing.lg,
    gap: spacing.lg,
    paddingBottom: spacing.xxl,
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
  },
  card: {
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
  },
  button: {
    minHeight: 48,
    padding: spacing.md,
    borderRadius: radius.sm,
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: radius.sm,
    padding: spacing.md,
    minHeight: 48,
    fontSize: typography.body,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    alignItems: 'center',
  },
});
