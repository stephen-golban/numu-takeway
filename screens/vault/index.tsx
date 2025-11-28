import { Stack } from "expo-router";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Alert } from "@/components/ui/alert";
import {
  ActionCard,
  ActionCardSkeleton,
  PositionCard,
  PositionCardSkeleton,
  VaultDetails,
  VaultDetailsSkeleton,
  VaultHeader,
  VaultHeaderSkeleton,
} from "./components";
import useVaultScreen from "./hook";
import { formatTxHash } from "./util";

function VaultScreenSkeleton() {
  return (
    <>
      <VaultHeaderSkeleton />
      <PositionCardSkeleton />
      <ActionCardSkeleton />
      <VaultDetailsSkeleton />
    </>
  );
}

function VaultScreen() {
  const {
    vault,
    color,
    apy,
    position,
    txState,
    isDataLoading,
    activeTab,
    setActiveTab,
    depositConfig,
    withdrawConfig,
  } = useVaultScreen();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <Stack.Screen options={{ title: vault.name }} />
      <ScrollView className="flex-1 bg-background" contentContainerClassName="p-4 pt-24 gap-4">
        {isDataLoading ? (
          <VaultScreenSkeleton />
        ) : (
          <>
            <VaultHeader apy={apy} color={color} name={vault.name} symbol={vault.symbol} />
            <PositionCard
              assetBalance={position.assetBalance}
              assetSymbol={vault.asset.symbol}
              shareBalance={position.shareBalance}
              symbol={vault.symbol}
              usdValue={position.usdValue}
            />
            <ActionCard
              activeTab={activeTab}
              deposit={depositConfig}
              isLoading={txState.isLoading}
              onTabChange={setActiveTab}
              withdraw={withdrawConfig}
            />
            <VaultDetails address={vault.address} assetName={vault.asset.name} symbol={vault.symbol} />
          </>
        )}
        {txState.error && <Alert message={txState.error} variant="destructive" />}
        {txState.txHash && (
          <Alert description={formatTxHash(txState.txHash)} message="Transaction successful!" variant="success" />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default VaultScreen;
