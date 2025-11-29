import { useAccount } from "@reown/appkit-react-native";
import { Redirect, Stack } from "expo-router";
import { createHeaderConfig } from "@/components/header";
import { BASE_CHAIN_ID } from "@/lib/appkit/chains";
import { useCustomColorScheme } from "@/lib/hooks/use-custom-color-scheme";
import WelcomeScreen from "@/screens/welcome";

export default function HomeScreen() {
  const { isDark } = useCustomColorScheme();
  const { isConnected, chainId } = useAccount();

  if (isConnected && chainId === BASE_CHAIN_ID) {
    return <Redirect href="/vault" />;
  }

  const header = createHeaderConfig({ title: "Welcome", isDark, isConnected: false, showNetworkBadge: false });

  return (
    <>
      <Stack.Screen options={header} />

      <WelcomeScreen />
    </>
  );
}
