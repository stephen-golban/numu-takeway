import { useAccount } from "@reown/appkit-react-native";
import { Stack } from "expo-router";
import { HeaderRightActions } from "@/components/header-right-actions";
import { NetworkBadge } from "@/components/ui/network-badge";
import HomeScreen from "@/screens/home";

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <>
      <Stack.Screen
        options={{
          title: "",
          headerTransparent: true,
          headerLeft: () => <NetworkBadge isConnected={isConnected} name="Base" />,
          headerRight: () => <HeaderRightActions />,
        }}
      />
      <HomeScreen isConnected={isConnected} />
    </>
  );
}
