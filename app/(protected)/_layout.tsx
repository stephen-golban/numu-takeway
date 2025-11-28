import { useAccount } from "@reown/appkit-react-native";
import { Stack } from "expo-router";
import { createHeaderConfig } from "@/components/header";
import { useCustomColorScheme } from "@/hooks/use-custom-color-scheme";

export default function ProtectedLayout() {
  const { isConnected } = useAccount();
  const { isDark } = useCustomColorScheme();
  const headerOptions = createHeaderConfig({ title: "Home", isDark, isConnected });

  return (
    <Stack screenOptions={headerOptions}>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen
        name="vault/[vaultKey]"
        options={{ headerBackTitle: "Back", headerBackButtonDisplayMode: "minimal" }}
      />
    </Stack>
  );
}
