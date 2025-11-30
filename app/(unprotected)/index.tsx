import { useAccount } from "@reown/appkit-react-native";
import { Redirect } from "expo-router";
import { BASE_CHAIN_ID } from "@/lib/appkit/chains";
import WelcomeScreen from "@/screens/welcome";

export default function HomeScreen() {
  const { isConnected, chainId } = useAccount();

  if (isConnected && chainId === BASE_CHAIN_ID) {
    return <Redirect href="/(protected)/dashboard" />;
  }

  return <WelcomeScreen />;
}
