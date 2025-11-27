import { useAccount } from "@reown/appkit-react-native";
import { Stack } from "expo-router";
import { HeaderRightActions } from "@/components/header-right-actions";
import { NetworkBadge } from "@/components/ui/network-badge";

export default function ProtectedLayout() {
  const { isConnected } = useAccount();

  return (
    <Stack
      screenOptions={{
        headerTransparent: true,
        headerTitleStyle: { fontSize: 24 },
        headerRight: () => <HeaderRightActions />,
        headerLeft: () => <NetworkBadge isConnected={isConnected} name="Base" />,
      }}
    >
      <Stack.Screen name="index" options={{ headerTitle: isConnected ? "Home" : "Let's Connect" }} />
      <Stack.Screen name="settings" />
      <Stack.Screen name="vault/[vaultKey]" />
    </Stack>
  );
}
