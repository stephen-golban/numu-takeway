import { SplashScreen, Stack } from "expo-router";
import { createHeaderConfig } from "@/components/header";
import { useCustomColorScheme } from "@/lib/hooks/use-custom-color-scheme";
import { THEME } from "@/lib/theme";

SplashScreen.preventAutoHideAsync();

export { ErrorBoundary } from "expo-router";

export default function ProtectedLayout() {
  const { isDark, colorScheme } = useCustomColorScheme();

  const backgroundColor = THEME[colorScheme].background;
  const header = createHeaderConfig({ isDark, isConnected: true, showNetworkBadge: false });

  return (
    <Stack screenOptions={header}>
      <Stack.Screen name="dashboard" options={{ title: "Dashboard" }} />
      <Stack.Screen name="settings" options={{ title: "Settings" }} />
      <Stack.Screen
        name="deposit"
        options={{
          headerShown: false,
          presentation: "formSheet",
          sheetCornerRadius: 24,
          sheetAllowedDetents: [0.65],
          sheetGrabberVisible: true,
          contentStyle: { backgroundColor },
        }}
      />
      <Stack.Screen
        name="withdraw"
        options={{
          headerShown: false,
          sheetCornerRadius: 24,
          presentation: "formSheet",
          sheetAllowedDetents: [0.95],
          sheetGrabberVisible: true,
          contentStyle: { backgroundColor },
        }}
      />
    </Stack>
  );
}
