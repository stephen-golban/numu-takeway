import { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import type { VaultKey } from "@/config/yo-protocol";
import { useVault } from "@/hooks/use-vault";

type VaultCardProps = {
  vaultKey?: VaultKey;
};

export function VaultCard({ vaultKey = "yoUSD" }: VaultCardProps) {
  const { vault, shareBalance, assetBalance, isLoading, error, txHash, deposit, withdraw, refetch } =
    useVault(vaultKey);

  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");

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
    <View className="w-full gap-4 rounded-xl bg-card p-4">
      <View className="flex-row items-center justify-between">
        <Text className="font-semibold text-lg">{vault.name} Vault</Text>
        <Button accessibilityLabel="Refresh balances" disabled={isLoading} onPress={refetch} size="sm" variant="ghost">
          <Text>{isLoading ? "..." : "↻"}</Text>
        </Button>
      </View>

      {/* Balances */}
      <View className="gap-2 rounded-lg bg-muted/50 p-3">
        <View className="flex-row justify-between">
          <Text className="text-muted-foreground text-sm">{vault.asset.symbol} Balance</Text>
          <Text className="font-mono text-sm">{Number.parseFloat(assetBalance).toFixed(4)}</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-muted-foreground text-sm">{vault.symbol} Balance</Text>
          <Text className="font-mono text-sm">{Number.parseFloat(shareBalance).toFixed(4)}</Text>
        </View>
      </View>

      {/* Tab Buttons */}
      <View className="flex-row gap-2">
        <Button
          className="flex-1"
          onPress={() => setActiveTab("deposit")}
          variant={activeTab === "deposit" ? "default" : "outline"}
        >
          <Text>Deposit</Text>
        </Button>
        <Button
          className="flex-1"
          onPress={() => setActiveTab("withdraw")}
          variant={activeTab === "withdraw" ? "default" : "outline"}
        >
          <Text>Withdraw</Text>
        </Button>
      </View>

      {/* Deposit Form */}
      {activeTab === "deposit" && (
        <View className="gap-3">
          <Input
            keyboardType="decimal-pad"
            onChangeText={setDepositAmount}
            placeholder={`Amount in ${vault.asset.symbol}`}
            value={depositAmount}
          />
          <Button
            accessibilityLabel={`Deposit ${vault.asset.symbol}`}
            disabled={isLoading || !depositAmount}
            onPress={handleDeposit}
          >
            {isLoading ? <ActivityIndicator color="white" size="small" /> : <Text>Deposit {vault.asset.symbol}</Text>}
          </Button>
        </View>
      )}

      {/* Withdraw Form */}
      {activeTab === "withdraw" && (
        <View className="gap-3">
          <Input
            keyboardType="decimal-pad"
            onChangeText={setWithdrawAmount}
            placeholder={`Amount in ${vault.symbol}`}
            value={withdrawAmount}
          />
          <Button
            accessibilityLabel={`Withdraw ${vault.symbol}`}
            disabled={isLoading || !withdrawAmount}
            onPress={handleWithdraw}
          >
            {isLoading ? <ActivityIndicator color="white" size="small" /> : <Text>Withdraw {vault.symbol}</Text>}
          </Button>
        </View>
      )}

      {/* Error Display */}
      {error && <Text className="text-center text-destructive text-sm">{error}</Text>}

      {/* Transaction Hash */}
      {txHash && (
        <View className="rounded-lg bg-green-500/10 p-2">
          <Text className="text-center text-green-600 text-xs">
            Tx: {txHash.slice(0, 10)}...{txHash.slice(-8)}
          </Text>
        </View>
      )}
    </View>
  );
}
