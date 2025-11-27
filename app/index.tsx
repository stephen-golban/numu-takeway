import { useAccount } from "@reown/appkit-react-native";
import { Stack } from "expo-router";
import { FingerprintIcon, MoonStarIcon, SunIcon } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { ScrollView, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { VaultCard } from "@/components/vault/vault-card";
import { WalletButton } from "@/components/wallet/wallet-button";
import { useAuth } from "@/hooks/use-auth";

const SCREEN_OPTIONS = {
  title: "Numu Takeaway",
  headerTransparent: true,
  headerRight: () => <ThemeToggle />,
};

export default function Screen() {
  const { address, isConnected } = useAccount();
  const { isAuthEnabled, isSupported, setAuthEnabled } = useAuth();

  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS} />
      <ScrollView
        className="flex-1"
        contentContainerClassName="items-center gap-6 p-4 pt-24"
      >
        <View className="items-center gap-2">
          <Text className="font-bold text-3xl">Numu Takeaway</Text>
          <Text className="text-center text-muted-foreground">
            YO Protocol Vault Integration
          </Text>
        </View>

        <View className="w-full max-w-sm gap-4 rounded-xl bg-card p-4">
          <View className="flex-row items-center justify-between">
            <Text className="font-semibold text-lg">
              {isConnected ? "Wallet Connected" : "Connect Wallet"}
            </Text>
            <WalletButton />
          </View>

          {isConnected && address && (
            <View className="rounded-lg bg-muted/50 p-2">
              <Text className="text-center font-mono text-muted-foreground text-xs">
                {address}
              </Text>
            </View>
          )}
        </View>

        {isConnected && <VaultCard vaultKey="yoUSD" />}

        {!isConnected && (
          <Text className="text-center text-muted-foreground text-sm">
            Connect your wallet to interact with YO Protocol vaults on Base
            network.
          </Text>
        )}

        {/* Settings Section */}
        <View className="w-full max-w-sm gap-4 rounded-xl bg-card p-4">
          <Text className="font-semibold text-lg">Settings</Text>

          <View className="flex-row items-center justify-between">
            <View className="flex-1 flex-row items-center gap-3">
              <Icon
                as={FingerprintIcon}
                className="text-muted-foreground"
                size={20}
              />
              <View className="flex-1">
                <Text className="text-sm">Biometric Lock</Text>
                <Text className="text-muted-foreground text-xs">
                  {isSupported
                    ? "Require authentication on app open"
                    : "Not available on this device"}
                </Text>
              </View>
            </View>
            <Switch
              checked={isAuthEnabled}
              disabled={!isSupported}
              onCheckedChange={setAuthEnabled}
            />
          </View>
        </View>
      </ScrollView>
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
