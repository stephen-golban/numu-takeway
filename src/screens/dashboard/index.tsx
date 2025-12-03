import { useRouter } from "expo-router";
import { useCallback } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Alert } from "@/components/ui/alert";
import { BASE_CHAIN_ID } from "@/lib/appkit/chains";
import { useVaultApy, useYoEthVaultBalances } from "@/lib/tanstack-query";
import { CONTRACTS } from "@/lib/yo-protocol/constants";
import { AssetCard } from "./asset-card";
import { BalanceHero } from "./balance-hero";
import { QuickActions } from "./quick-actions";

type DashboardScreenProps = {
  chainId: string | number | undefined;
};

export default function DashboardScreen({ chainId }: DashboardScreenProps) {
  const router = useRouter();

  const ethBalancesQuery = useYoEthVaultBalances();
  const ethApyQuery = useVaultApy(CONTRACTS.YO_ETH_VAULT);

  const yoEthBalance = ethBalancesQuery.data?.yoEth ?? "0";
  const ethBalance = ethBalancesQuery.data?.eth ?? "0";
  const ethApy = ethApyQuery.data?.apy;

  const isLoading = ethBalancesQuery.isLoading || ethApyQuery.isLoading;
  const isRefetching = ethBalancesQuery.isRefetching || ethApyQuery.isRefetching;
  const isCorrectNetwork = chainId === BASE_CHAIN_ID;

  const handleRefresh = useCallback(() => {
    ethBalancesQuery.refetch();
    ethApyQuery.refetch();
  }, [ethBalancesQuery, ethApyQuery]);

  return (
    <SafeAreaView className="flex-1">
      {/* Wrong Network Warning */}
      {!isCorrectNetwork && <Alert message="Please switch to Base Network in your wallet" variant="warning" />}

      <ScrollView
        className="mt-8 flex-grow"
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={<RefreshControl onRefresh={handleRefresh} refreshing={isRefetching} />}
      >
        {/* Balance Hero Section */}
        <BalanceHero apy={ethApy} isLoading={isLoading} yoEthBalance={yoEthBalance} />

        {/* Quick Actions */}
        <QuickActions
          isLoading={isLoading}
          onDeposit={() => router.push("/deposit-eth")}
          onWithdraw={() => router.push("/withdraw-eth")}
        />

        {/* Error Display */}
        {ethBalancesQuery.error && (
          <View className="px-4 pt-4">
            <Alert description={ethBalancesQuery.error.message} message="Error" variant="destructive" />
          </View>
        )}

        {/* Assets Section */}
        <View className="gap-4 pt-6">
          <AssetCard apy={ethApy} ethBalance={ethBalance} isLoading={isLoading} yoEthBalance={yoEthBalance} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
