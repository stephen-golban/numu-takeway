import { useAccount } from "@reown/appkit-react-native";
import { Stack, useRouter } from "expo-router";
import {
  MoonStarIcon,
  SettingsIcon,
  SunIcon,
  WalletIcon,
} from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { ScrollView, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VaultCard } from "@/components/vault/vault-card";
import { WalletButton } from "@/components/wallet/wallet-button";

export default function Screen() {
  const { address, isConnected } = useAccount();

  return (
    <>
      <Stack.Screen
        options={{
          title: "Numu",
          headerTransparent: true,
          headerRight: () => <HeaderActions />,
        }}
      />
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-1 gap-6 p-4 pt-24"
      >
        {/* Hero Section */}
        <View className="items-center gap-1 py-4">
          <Text className="font-bold text-2xl tracking-tight">
            Numu Takeaway
          </Text>
          <Text className="text-muted-foreground text-sm">
            YO Protocol Vault Integration
          </Text>
        </View>

        {/* Wallet Section */}
        <View className="w-full gap-4 rounded-2xl bg-card p-5 shadow-sm">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <View
                className={`h-2.5 w-2.5 rounded-full ${isConnected ? "bg-green-500" : "bg-muted-foreground/30"}`}
              />
              <Text className="font-medium">
                {isConnected ? "Connected" : "Wallet"}
              </Text>
            </View>
            <WalletButton />
          </View>

          {isConnected && address && (
            <View className="rounded-lg bg-muted/30 px-3 py-2">
              <Text className="font-mono text-muted-foreground text-xs">
                {address}
              </Text>
            </View>
          )}
        </View>

        {/* Vault Section */}
        {isConnected ? <VaultCard vaultKey="yoUSD" /> : <EmptyState />}
      </ScrollView>
    </>
  );
}

function HeaderActions() {
  const router = useRouter();
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <View className="flex-row items-center gap-1">
      <Button
        accessibilityLabel="Toggle theme"
        accessibilityRole="button"
        className="ios:size-9 rounded-full"
        onPressIn={toggleColorScheme}
        size="icon"
        variant="ghost"
      >
        <Icon
          as={colorScheme === "dark" ? MoonStarIcon : SunIcon}
          className="size-5 text-foreground"
        />
      </Button>
      <Button
        accessibilityLabel="Open settings"
        accessibilityRole="button"
        className="ios:size-9 rounded-full"
        onPress={() => router.push("/settings")}
        size="icon"
        variant="ghost"
      >
        <Icon as={SettingsIcon} className="size-5 text-foreground" />
      </Button>
    </View>
  );
}

function EmptyState() {
  return (
    <View className="flex-1 items-center justify-center gap-4 py-12">
      <View className="items-center justify-center rounded-full bg-muted/50 p-6">
        <Icon as={WalletIcon} className="text-muted-foreground" size={32} />
      </View>
      <View className="items-center gap-1">
        <Text className="font-medium text-muted-foreground">
          No Wallet Connected
        </Text>
        <Text className="max-w-[240px] text-center text-muted-foreground/70 text-sm">
          Connect your wallet to interact with YO Protocol vaults on Base
          network
        </Text>
      </View>
    </View>
  );
}
