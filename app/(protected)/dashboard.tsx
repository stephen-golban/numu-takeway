import { useAccount } from "@reown/appkit-react-native";
import { Redirect } from "expo-router";
import VaultDashboard from "@/screens/dashboard";

export default function Dashboard() {
  const { isConnected, chainId } = useAccount();

  // Redirect if not connected
  if (!isConnected) {
    return <Redirect href="/" />;
  }

  return <VaultDashboard chainId={chainId} />;
}
