import { useAccount } from "@reown/appkit-react-native";
import { Stack } from "expo-router";
import { MoonStarIcon, SunIcon } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { WalletButton } from "@/components/wallet/wallet-button";

const SCREEN_OPTIONS = {
  title: "Numu Takeaway",
  headerTransparent: true,
  headerRight: () => <ThemeToggle />,
};

export default function Screen() {
  const { address, isConnected } = useAccount();

  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS} />
      <View className="flex-1 items-center justify-center gap-8 p-4">
        <View className="items-center gap-4">
          <Text className="font-bold text-3xl">Numu Takeaway</Text>
          <Text className="text-center text-muted-foreground">
            YO Protocol Vault Integration
          </Text>
        </View>

        <View className="w-full max-w-sm gap-4 rounded-xl bg-card p-6">
          <Text className="text-center font-semibold text-lg">
            {isConnected ? "Wallet Connected" : "Connect Your Wallet"}
          </Text>

          {isConnected && address ? (
            <View className="items-center gap-2">
              <Text className="text-muted-foreground text-sm">
                Connected Address
              </Text>
              <Text className="font-mono text-sm">{address}</Text>
            </View>
          ) : (
            <Text className="text-center text-muted-foreground text-sm">
              Connect your wallet to interact with YO Protocol vaults on Base
              network.
            </Text>
          )}

          <View className="items-center pt-2">
            <WalletButton />
          </View>
        </View>
      </View>
    </>
  );
}

const THEME_ICONS = {
  light: SunIcon,
  dark: MoonStarIcon,
};

function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <Button
      accessibilityLabel="Toggle theme"
      accessibilityRole="button"
      className="web:mx-4 ios:size-9 rounded-full"
      onPressIn={toggleColorScheme}
      size="icon"
      variant="ghost"
    >
      <Icon as={THEME_ICONS[colorScheme ?? "light"]} className="size-5" />
    </Button>
  );
}
