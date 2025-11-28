import { useAccount } from "@reown/appkit-react-native";
import { Stack } from "expo-router";
import { useColorScheme } from "nativewind";
import { NetworkBadge } from "@/components/ui/network-badge";
import { HeaderRight } from "@/components/ui/screen-header";
import { NAV_THEME } from "@/lib/theme";

export default function ProtectedLayout() {
  const { isConnected } = useAccount();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Stack
      screenOptions={{
        headerTransparent: true,
        headerBlurEffect: isDark ? undefined : "light",
        headerStyle: isDark ? { backgroundColor: NAV_THEME.dark.colors.background } : undefined,
        headerLeft: ({ canGoBack }) => (canGoBack ? undefined : <NetworkBadge isConnected={isConnected} name="Base" />),
        headerRight: () => <HeaderRight />,
      }}
    >
      <Stack.Screen name="index" options={{ title: isConnected ? "Home" : "Welcome" }} />
      <Stack.Screen name="vault/[vaultKey]" options={{ headerBackTitle: "Back" }} />
    </Stack>
  );
}
