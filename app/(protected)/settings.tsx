import { useAccount } from "@reown/appkit-react-native";
import { Redirect } from "expo-router";
import SettingsScreen from "@/screens/settings";

export default function Settings() {
  const { isConnected } = useAccount();

  // Redirect if not connected
  if (!isConnected) {
    return <Redirect href="/" />;
  }

  return <SettingsScreen />;
}
