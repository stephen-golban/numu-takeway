import { useRouter } from "expo-router";
import { RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Alert } from "@/components/ui/alert";
import { BASE_CHAIN_ID } from "@/lib/appkit/chains";
import { useYoVault } from "@/lib/yo-protocol/hooks";
import { AssetCard } from "./asset-card";
import { BalanceHero } from "./balance-hero";
import { QuickActions } from "./quick-actions";

type DashboardScreenProps = {
  chainId: string | number | undefined;
};

export default function DashboardScreen({ chainId }: DashboardScreenProps) {
  const router = useRouter();

  const { yoUsdBalance, usdcBalance, isLoading, error, refreshBalances } = useYoVault();

  const isCorrectNetwork = chainId === BASE_CHAIN_ID;

  return (
    <SafeAreaView className="flex-1">
      {/* Wrong Network Warning */}
      {!isCorrectNetwork && <Alert message="Please switch to Base Network in your wallet" variant="warning" />}

      <ScrollView
        className="mt-8 flex-grow"
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={<RefreshControl onRefresh={refreshBalances} refreshing={isLoading} />}
      >
        {/* Balance Hero Section */}
        <BalanceHero isLoading={isLoading} yoUsdBalance={yoUsdBalance} />

        {/* Quick Actions */}
        <QuickActions onDeposit={() => router.push("/deposit")} onWithdraw={() => router.push("/withdraw")} />

        {/* Error Display */}
        {error && (
          <View className="px-4 pt-4">
            <Alert description={error} message="Error" variant="destructive" />
          </View>
        )}

        {/* Assets Section */}
        <View className="pt-6">
          <AssetCard isLoading={isLoading} usdcBalance={usdcBalance} yoUsdBalance={yoUsdBalance} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
