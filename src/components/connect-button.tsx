import { useAccount, useAppKit } from "@reown/appkit-react-native";
import { WalletIcon } from "lucide-react-native";
import { Button } from "./ui/button";
import { Icon } from "./ui/icon";
import { Text } from "./ui/text";

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
    <Button className="rounded-full px-8" onPress={() => open({ view: "Connect" })} variant="default">
      <Icon as={WalletIcon} className="text-primary-foreground" />
      <Text>Connect Wallet</Text>
    </Button>
  );
}
