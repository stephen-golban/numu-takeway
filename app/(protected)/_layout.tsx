import { Stack } from "expo-router";
import { NetworkBadge } from "@/components/ui/network-badge";
import { HeaderRight } from "@/components/ui/screen-header";
import { useHeaderOptions } from "@/lib/use-header-options";

export default function ProtectedLayout() {
  const headerOptions = useHeaderOptions();

  return (
    <Stack
      screenOptions={{
        ...headerOptions,
        headerRight: () => <HeaderRight />,
        headerLeft: ({ canGoBack }) => (canGoBack ? undefined : <NetworkBadge isConnected name="Base" />),
      }}
    >
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="vault/[vaultKey]" options={{ headerBackTitle: "Back" }} />
    </Stack>
  );
}
