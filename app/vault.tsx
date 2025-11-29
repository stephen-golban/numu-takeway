import { useAccount } from "@reown/appkit-react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BalanceCard } from "@/components/balance-card";
import { DepositForm } from "@/components/deposit-form";
import { WithdrawForm } from "@/components/withdraw-form";
import { useYoVault } from "@/lib/yo-protocol/hooks";

export default function VaultScreen() {
  const router = useRouter();
  const { address, isConnected, chainId } = useAccount();
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");

  const {
    yoUsdBalance,
    usdcBalance,
    isLoading,
    error,
    deposit,
    withdraw,
    quoteDeposit,
    quoteWithdraw,
    refreshBalances,
  } = useYoVault();

  // Redirect if not connected
  useEffect(() => {
    if (!isConnected) {
      router.replace("/");
    }
  }, [isConnected, router]);

  if (!isConnected) {
    return null;
  }

  const isCorrectNetwork = chainId === 8453;

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center justify-between border-border border-b px-4 py-3">
        <View>
          <Text className="font-medium text-foreground">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </Text>
          <Text className={`text-xs ${isCorrectNetwork ? "text-success" : "text-error"}`}>
            ● {isCorrectNetwork ? "Base Network" : "Wrong Network"}
          </Text>
        </View>

        <TouchableOpacity onPress={() => router.push("/settings")}>
          <Text className="text-2xl">⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Wrong Network Warning */}
      {!isCorrectNetwork && (
        <View className="border-error border-b bg-error/20 px-4 py-3">
          <Text className="text-center font-medium text-error">⚠️ Please switch to Base Network in your wallet</Text>
        </View>
      )}

      <ScrollView
        className="flex-1 px-4"
        refreshControl={<RefreshControl onRefresh={refreshBalances} refreshing={isLoading} />}
      >
        {/* Balance Card */}
        <View className="mt-4">
          <BalanceCard isLoading={isLoading} usdcBalance={usdcBalance} yoUsdBalance={yoUsdBalance} />
        </View>

        {/* Error Display */}
        {error && (
          <View className="mb-4 rounded-xl border border-error bg-error/20 p-4">
            <Text className="text-error">{error}</Text>
          </View>
        )}

        {/* Tab Selector */}
        <View className="mb-4 flex-row">
          <TouchableOpacity
            className={`flex-1 rounded-l-xl py-3 ${activeTab === "deposit" ? "bg-primary" : "border border-border bg-card"}`}
            onPress={() => setActiveTab("deposit")}
          >
            <Text className={`text-center font-medium ${activeTab === "deposit" ? "text-white" : "text-muted"}`}>
              Deposit
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 rounded-r-xl py-3 ${activeTab === "withdraw" ? "bg-primary" : "border border-border bg-card"}`}
            onPress={() => setActiveTab("withdraw")}
          >
            <Text className={`text-center font-medium ${activeTab === "withdraw" ? "text-white" : "text-muted"}`}>
              Withdraw
            </Text>
          </TouchableOpacity>
        </View>

        {/* Forms */}
        {activeTab === "deposit" ? (
          <DepositForm isLoading={isLoading} onDeposit={deposit} onQuote={quoteDeposit} usdcBalance={usdcBalance} />
        ) : (
          <WithdrawForm
            isLoading={isLoading}
            onQuote={quoteWithdraw}
            onWithdraw={withdraw}
            yoUsdBalance={yoUsdBalance}
          />
        )}

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
