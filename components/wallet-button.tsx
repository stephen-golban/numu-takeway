import { useAccount, useAppKit } from "@reown/appkit-react-native";
import { Wallet } from "lucide-react-native";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function WalletButton() {
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();

  function handlePress() {
    open();
  }

  if (isConnected && address) {
    return (
      <Button
        accessibilityHint="Tap to view wallet options"
        accessibilityLabel="Connected wallet address"
        accessibilityRole="button"
        className="flex-row items-center gap-2"
        onPress={handlePress}
        variant="outline"
      >
        <View className="h-2 w-2 rounded-full bg-green-500" />
        <Text>{formatAddress(address)}</Text>
      </Button>
    );
  }

  return (
    <Button
      accessibilityHint="Tap to connect your crypto wallet"
      accessibilityLabel="Connect wallet"
      accessibilityRole="button"
      className="flex-row items-center gap-2"
      onPress={handlePress}
    >
      <Icon as={Wallet} className="text-primary-foreground" size={18} />
      <Text>Connect Wallet</Text>
    </Button>
  );
}
