import { useAccount, useAppKit } from "@reown/appkit-react-native";
import { Wallet } from "lucide-react-native";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

type WalletButtonProps = {
  variant?: "default" | "header";
};

/**
 * Wallet connection button with two variants:
 * - "default": Full button with "Connect Wallet" text for welcome/disconnected screens
 * - "header": Compact icon-only button for the header with connection status dot
 */
export function WalletButton({ variant = "default" }: WalletButtonProps) {
  const { open } = useAppKit();
  const { isConnected } = useAccount();

  if (variant === "header") {
    return (
      <Button
        accessibilityHint="Tap to manage wallet connection"
        accessibilityLabel="Wallet"
        accessibilityRole="button"
        onPress={() => open()}
        size="icon"
        variant="ghost"
      >
        <View className="relative">
          <Icon as={Wallet} className="size-5 text-foreground" />
          {isConnected && <View className="-right-0.5 -top-0.5 absolute size-2 rounded-full bg-green-500" />}
        </View>
      </Button>
    );
  }

  return (
    <Button
      accessibilityHint="Tap to connect your crypto wallet"
      accessibilityLabel="Connect wallet"
      accessibilityRole="button"
      className="flex-row items-center gap-2"
      onPress={() => open()}
    >
      <Icon as={Wallet} className="text-primary-foreground" size={18} />
      <Text>Connect Wallet</Text>
    </Button>
  );
}
