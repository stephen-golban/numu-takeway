import { SplashScreen, Stack } from "expo-router";
import { createHeaderConfig } from "@/components/header";
import { useCustomColorScheme } from "@/lib/hooks/use-custom-color-scheme";

SplashScreen.preventAutoHideAsync();

export { ErrorBoundary } from "expo-router";

export default function UnProtectedLayout() {
  const { isDark } = useCustomColorScheme();

  const header = createHeaderConfig({ isDark, isConnected: false, showNetworkBadge: false });

  return (
    <Stack screenOptions={header}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
