import { useAccount } from "@reown/appkit-react-native";
import { Stack, useRouter } from "expo-router";
import {
  MoonStarIcon,
  SettingsIcon,
  SunIcon,
  WalletIcon,
} from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import type { ActivityItem } from "@/components/home/activity-section";
import { ActivitySection } from "@/components/home/activity-section";
import { AssetCard } from "@/components/home/asset-card";
import { NetworkBadge } from "@/components/home/network-badge";
import { PortfolioHeader } from "@/components/home/portfolio-header";
import { QuickActions } from "@/components/home/quick-actions";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { WalletButton } from "@/components/wallet/wallet-button";
import { usePortfolio } from "@/hooks/use-portfolio";

// Mock activity data - in production this would come from transaction history
const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: "1",
    type: "deposit",
    amount: "100",
    symbol: "USDC",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: "2",
    type: "withdraw",
    amount: "0.5",
    symbol: "ETH",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: "3",
    type: "deposit",
    amount: "0.01",
    symbol: "BTC",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { vaults, totalValue, change24h, changePercent, isLoading, refetch } =
    usePortfolio();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleDeposit = () => {
    // Navigate to deposit flow - for now just show first vault
    router.push({
      pathname: "/vault/[vaultKey]",
      params: { vaultKey: "yoUSD" },
    });
  };

  const handleWithdraw = () => {
    router.push({
      pathname: "/vault/[vaultKey]",
      params: { vaultKey: "yoUSD" },
    });
  };

  const handleVaultPress = (vaultKey: string) => {
    router.push({ pathname: "/vault/[vaultKey]", params: { vaultKey } });
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "",
          headerTransparent: true,
          headerLeft: () => (
            <NetworkBadge isConnected={isConnected} name="Base" />
          ),
          headerRight: () => <HeaderActions />,
        }}
      />
      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="pb-8"
        refreshControl={
          <RefreshControl onRefresh={handleRefresh} refreshing={refreshing} />
        }
      >
        {isConnected ? (
          <ConnectedView
            activities={MOCK_ACTIVITIES}
            change24h={change24h}
            changePercent={changePercent}
            isLoading={isLoading}
            onDeposit={handleDeposit}
            onVaultPress={handleVaultPress}
            onWithdraw={handleWithdraw}
            totalValue={totalValue}
            vaults={vaults}
          />
        ) : (
          <DisconnectedView />
        )}
      </ScrollView>
    </>
  );
}

type ConnectedViewProps = {
  totalValue: number;
  change24h: number;
  changePercent: number;
  isLoading: boolean;
  vaults: Array<{
    vaultKey: string;
    symbol: string;
    name: string;
    assetSymbol: string;
    shareBalance: number;
    usdValue: number;
    apy: number;
    color: string;
  }>;
  activities: ActivityItem[];
  onDeposit: () => void;
  onWithdraw: () => void;
  onVaultPress: (vaultKey: string) => void;
};

function ConnectedView({
  totalValue,
  change24h,
  changePercent,
  isLoading,
  vaults,
  activities,
  onDeposit,
  onWithdraw,
  onVaultPress,
}: ConnectedViewProps) {
  return (
    <View className="gap-6 pt-24">
      {/* Portfolio Header */}
      <PortfolioHeader
        change24h={change24h}
        changePercent={changePercent}
        isLoading={isLoading}
        totalValue={totalValue}
      />

      {/* Quick Actions */}
      <QuickActions onDeposit={onDeposit} onWithdraw={onWithdraw} />

      {/* Assets Section */}
      <View className="gap-3 px-4">
        <View className="flex-row items-center justify-between">
          <Text className="font-semibold text-lg">Your Assets</Text>
          <Text className="text-muted-foreground text-sm">
            {vaults.length} vault{vaults.length !== 1 ? "s" : ""}
          </Text>
        </View>

        {vaults.length > 0 ? (
          <View className="gap-3">
            {vaults.map((vault) => (
              <AssetCard
                apy={vault.apy}
                balance={vault.shareBalance.toFixed(4)}
                color={vault.color}
                key={vault.vaultKey}
                name={vault.name}
                onPress={() => onVaultPress(vault.vaultKey)}
                symbol={vault.assetSymbol}
                usdValue={vault.usdValue}
              />
            ))}
          </View>
        ) : (
          <View className="items-center gap-3 rounded-2xl bg-card p-8">
            <Icon as={WalletIcon} className="text-muted-foreground" size={32} />
            <Text className="text-center text-muted-foreground text-sm">
              No vault positions yet. Deposit to get started.
            </Text>
          </View>
        )}
      </View>

      {/* Activity Section */}
      <View className="gap-3 px-4">
        <Text className="font-semibold text-lg">Recent Activity</Text>
        <View className="rounded-2xl bg-card p-4">
          <ActivitySection activities={activities} />
        </View>
      </View>
    </View>
  );
}

function DisconnectedView() {
  return (
    <View className="flex-1 gap-8 px-4 pt-32">
      {/* Hero Section */}
      <View className="items-center gap-4">
        <View className="size-20 items-center justify-center rounded-full bg-primary/10">
          <Icon as={WalletIcon} className="text-primary" size={40} />
        </View>
        <View className="items-center gap-2">
          <Text className="font-bold text-2xl tracking-tight">
            Welcome to Numu
          </Text>
          <Text className="max-w-[280px] text-center text-muted-foreground">
            Connect your wallet to access YO Protocol vaults on Base network
          </Text>
        </View>
      </View>

      {/* Connect Button */}
      <View className="items-center">
        <WalletButton />
      </View>

      {/* Features List */}
      <View className="gap-4 rounded-2xl bg-card p-6">
        <Text className="font-semibold">Why use Numu?</Text>
        <FeatureItem
          description="Deposit into yoUSD, yoETH, and yoBTC vaults"
          title="Earn Yield"
        />
        <FeatureItem
          description="Built on Base with low gas fees"
          title="Low Fees"
        />
        <FeatureItem
          description="Powered by YO Protocol smart contracts"
          title="Secure"
        />
      </View>
    </View>
  );
}

function FeatureItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <View className="flex-row items-start gap-3">
      <View className="mt-1 size-2 rounded-full bg-primary" />
      <View className="flex-1">
        <Text className="font-medium">{title}</Text>
        <Text className="text-muted-foreground text-sm">{description}</Text>
      </View>
    </View>
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
