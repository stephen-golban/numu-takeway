import { SplashScreen, Stack } from "expo-router";
import type { ExtendedStackNavigationOptions } from "expo-router/build/layouts/StackClient";
import { createHeaderConfig } from "@/components/header";
import { useCustomColorScheme } from "@/lib/hooks/use-custom-color-scheme";
import { THEME } from "@/lib/theme";

SplashScreen.preventAutoHideAsync();

export { ErrorBoundary } from "expo-router";

export default function ProtectedLayout() {
  const { isDark, colorScheme } = useCustomColorScheme();

  const backgroundColor = THEME[colorScheme].background;
  const header = createHeaderConfig({ isDark, isConnected: true, showNetworkBadge: false });

  const commonSheetOptions = {
    headerShown: false,
    sheetCornerRadius: 24,
    presentation: "formSheet",
    sheetGrabberVisible: true,
    contentStyle: { backgroundColor },
  } as ExtendedStackNavigationOptions;

  return (
    <Stack screenOptions={header}>
      <Stack.Screen name="dashboard" options={{ title: "Dashboard" }} />
      <Stack.Screen name="settings" options={{ title: "Settings" }} />
      <Stack.Screen name="deposit" options={{ ...commonSheetOptions, sheetAllowedDetents: [0.65] }} />
      <Stack.Screen name="withdraw" options={{ ...commonSheetOptions, sheetAllowedDetents: [0.95] }} />
    </Stack>
  );
}
