import { Stack } from "expo-router";
import { createHeaderConfig } from "@/components/header";
import { useCustomColorScheme } from "@/lib/hooks/use-custom-color-scheme";

export { ErrorBoundary } from "expo-router";

export default function ProtectedLayout() {
  const { isDark } = useCustomColorScheme();

  const header = createHeaderConfig({ isDark, isConnected: true, showNetworkBadge: false });

  return (
    <Stack screenOptions={header}>
      <Stack.Screen name="dashboard" options={{ title: "Dashboard" }} />
      <Stack.Screen name="settings" options={{ title: "Settings" }} />
      <Stack.Screen name="deposit" options={{ title: "Deposit" }} />
      <Stack.Screen name="withdraw" options={{ title: "Withdraw" }} />
    </Stack>
  );
}
