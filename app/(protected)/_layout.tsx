import { SplashScreen, Stack } from "expo-router";
import { createHeaderConfig } from "@/components/header";
import { useCustomColorScheme } from "@/lib/hooks/use-custom-color-scheme";

SplashScreen.preventAutoHideAsync();

export { ErrorBoundary } from "expo-router";

export default function ProtectedLayout() {
  const { isDark } = useCustomColorScheme();

  const header = createHeaderConfig({ isDark, isConnected: true, showNetworkBadge: false });

  return (
    <Stack screenOptions={header}>
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}
