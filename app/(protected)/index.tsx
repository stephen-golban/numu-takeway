import { useAccount } from "@reown/appkit-react-native";
import HomeScreen from "@/screens/home";

export default function Home() {
  const { isConnected } = useAccount();

  return <HomeScreen isConnected={isConnected} />;
}
