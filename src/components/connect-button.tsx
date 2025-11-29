import { useAccount, useAppKit } from "@reown/appkit-react-native";
import { Text } from "react-native";
import { Button } from "./ui/button";

export function ConnectButton() {
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();

  if (isConnected) {
    return (
      <Button onPress={() => open({ view: "Account" })}>
        <Text className="font-medium">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </Text>
      </Button>
    );
  }

  return (
    <Button onPress={() => open()}>
      <Text className="text-center font-semibold text-lg">🔗 Connect Wallet</Text>
    </Button>
  );
}
