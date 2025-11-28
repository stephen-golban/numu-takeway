import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VAULTS, type VaultKey } from "@/config/yo-protocol";
import { ASSET_PRICES, VAULT_APY, VAULT_COLORS } from "@/hooks/use-portfolio";
import { useVault } from "@/hooks/use-vault";

export default function VaultDetailScreen() {
  const { vaultKey } = useLocalSearchParams<{ vaultKey: string }>();

  // Validate vault key
  const validVaultKey = (vaultKey && vaultKey in VAULTS ? vaultKey : "yoUSD") as VaultKey;
  const vault = VAULTS[validVaultKey];
  const color = VAULT_COLORS[validVaultKey];
  const apy = VAULT_APY[validVaultKey];
  const price = ASSET_PRICES[vault.asset.symbol] || 0;

  const { shareBalance, assetBalance, isLoading, error, txHash, deposit, withdraw } = useVault(validVaultKey);

  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");

  const shareBalanceNum = Number.parseFloat(shareBalance);
  const usdValue = shareBalanceNum * price;

  async function handleDeposit() {
    if (!depositAmount || Number.parseFloat(depositAmount) <= 0) {
      return;
    }
    const success = await deposit(depositAmount);
    if (success) {
      setDepositAmount("");
    }
  }

  async function handleWithdraw() {
    if (!withdrawAmount || Number.parseFloat(withdrawAmount) <= 0) {
      return;
    }
    const success = await withdraw(withdrawAmount);
    if (success) {
      setWithdrawAmount("");
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <Stack.Screen options={{ title: vault.name }} />
      <ScrollView className="flex-1 bg-background" contentContainerClassName="p-4 pt-24 gap-6">
        {/* Vault Header */}
        <View className="items-center gap-4 py-4">
          <View className="size-20 items-center justify-center rounded-full" style={{ backgroundColor: `${color}20` }}>
            <Text className="font-bold text-3xl" style={{ color }}>
              {vault.symbol.charAt(0)}
            </Text>
          </View>
          <View className="items-center gap-1">
            <Text className="font-bold text-2xl">{vault.name}</Text>
            <View className="rounded-full bg-green-500/10 px-3 py-1">
              <Text className="font-medium text-green-500 text-sm">{apy.toFixed(1)}% APY</Text>
            </View>
          </View>
        </View>

        {/* Balance Card */}
        <View className="gap-4 rounded-2xl bg-card p-5">
          <Text className="font-semibold text-lg">Your Position</Text>

          <View className="gap-3 rounded-xl bg-muted/30 p-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-muted-foreground">Vault Balance</Text>
              <Text className="font-mono font-semibold">
                {shareBalanceNum.toFixed(4)} {vault.symbol}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-muted-foreground">USD Value</Text>
              <Text className="font-mono font-semibold">${usdValue.toFixed(2)}</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-muted-foreground">{vault.asset.symbol} Available</Text>
              <Text className="font-mono font-semibold">{Number.parseFloat(assetBalance).toFixed(4)}</Text>
            </View>
          </View>
        </View>

        {/* Action Tabs */}
        <View className="gap-4 rounded-2xl bg-card p-5">
          {/* Tab Buttons */}
          <View className="flex-row gap-2">
            <Button
              accessibilityRole="tab"
              accessibilityState={{ selected: activeTab === "deposit" }}
              className="flex-1"
              onPress={() => setActiveTab("deposit")}
              variant={activeTab === "deposit" ? "default" : "outline"}
            >
              <Text>Deposit</Text>
            </Button>
            <Button
              accessibilityRole="tab"
              accessibilityState={{ selected: activeTab === "withdraw" }}
              className="flex-1"
              onPress={() => setActiveTab("withdraw")}
              variant={activeTab === "withdraw" ? "default" : "outline"}
            >
              <Text>Withdraw</Text>
            </Button>
          </View>

          {/* Deposit Form */}
          {activeTab === "deposit" && (
            <View className="gap-4">
              <View className="gap-2">
                <Text className="text-muted-foreground text-sm">Amount ({vault.asset.symbol})</Text>
                <Input
                  keyboardType="decimal-pad"
                  onChangeText={setDepositAmount}
                  placeholder="0.00"
                  value={depositAmount}
                />
              </View>
              <Button
                accessibilityLabel={`Deposit ${vault.asset.symbol}`}
                className="h-12"
                disabled={isLoading || !depositAmount}
                onPress={handleDeposit}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text>Deposit {vault.asset.symbol}</Text>
                )}
              </Button>
            </View>
          )}

          {/* Withdraw Form */}
          {activeTab === "withdraw" && (
            <View className="gap-4">
              <View className="gap-2">
                <Text className="text-muted-foreground text-sm">Amount ({vault.symbol})</Text>
                <Input
                  keyboardType="decimal-pad"
                  onChangeText={setWithdrawAmount}
                  placeholder="0.00"
                  value={withdrawAmount}
                />
              </View>
              <Button
                accessibilityLabel={`Withdraw ${vault.symbol}`}
                className="h-12"
                disabled={isLoading || !withdrawAmount}
                onPress={handleWithdraw}
              >
                {isLoading ? <ActivityIndicator color="white" size="small" /> : <Text>Withdraw {vault.symbol}</Text>}
              </Button>
            </View>
          )}
        </View>

        {/* Error Display */}
        {error && (
          <View className="rounded-xl bg-destructive/10 p-4">
            <Text className="text-center text-destructive text-sm">{error}</Text>
          </View>
        )}

        {/* Transaction Hash */}
        {txHash && (
          <View className="rounded-xl bg-green-500/10 p-4">
            <Text className="text-center text-green-600 text-sm">Transaction successful!</Text>
            <Text className="mt-1 text-center font-mono text-green-600/70 text-xs">
              {txHash.slice(0, 16)}...{txHash.slice(-12)}
            </Text>
          </View>
        )}

        {/* Vault Info */}
        <View className="gap-3 rounded-2xl bg-card p-5">
          <Text className="font-semibold">Vault Details</Text>
          <View className="gap-2">
            <InfoRow label="Asset" value={vault.asset.name} />
            <InfoRow label="Symbol" value={vault.symbol} />
            <InfoRow label="Network" value="Base" />
            <InfoRow label="Contract" value={`${vault.address.slice(0, 6)}...${vault.address.slice(-4)}`} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between py-1">
      <Text className="text-muted-foreground text-sm">{label}</Text>
      <Text className="font-medium text-sm">{value}</Text>
    </View>
  );
}
