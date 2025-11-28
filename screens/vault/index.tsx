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
    shareBalanceNum,
    usdValue,
    assetBalance,
    isLoading,
    isDataLoading,
    error,
    txHash,
    activeTab,
    depositAmount,
    withdrawAmount,
    setActiveTab,
    setDepositAmount,
    setWithdrawAmount,
    handleDeposit,
    handleWithdraw,
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
              assetBalance={assetBalance}
              assetSymbol={vault.asset.symbol}
              shareBalance={shareBalanceNum}
              symbol={vault.symbol}
              usdValue={usdValue}
            />
            <ActionCard
              activeTab={activeTab}
              assetSymbol={vault.asset.symbol}
              depositAmount={depositAmount}
              isLoading={isLoading}
              onDeposit={handleDeposit}
              onDepositAmountChange={setDepositAmount}
              onTabChange={setActiveTab}
              onWithdraw={handleWithdraw}
              onWithdrawAmountChange={setWithdrawAmount}
              symbol={vault.symbol}
              withdrawAmount={withdrawAmount}
            />
            <VaultDetails address={vault.address} assetName={vault.asset.name} symbol={vault.symbol} />
          </>
        )}
        {error && <Alert message={error} variant="destructive" />}
        {txHash && <Alert description={formatTxHash(txHash)} message="Transaction successful!" variant="success" />}
      </ScrollView>
    </SafeAreaView>
  );
}

export default VaultScreen;
