import { useRouter } from "expo-router";
import { AlertTriangleIcon, ArrowUpFromLineIcon, CoinsIcon, TimerIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, TextInput, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useYoVault } from "@/lib/yo-protocol/hooks";

const PERCENTAGE_OPTIONS = [25, 50, 75, 100];

export default function WithdrawScreen() {
  const router = useRouter();
  const { yoUsdBalance, withdraw, quoteWithdraw, isLoading } = useYoVault();

  const [amount, setAmount] = useState("");
  const [quote, setQuote] = useState("0");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuote = async () => {
      if (!amount || Number.parseFloat(amount) <= 0) {
        setQuote("0");
        return;
      }
      try {
        const result = await quoteWithdraw(amount);
        setQuote(result);
      } catch {
        setQuote("0");
      }
    };
    const timer = setTimeout(fetchQuote, 500);
    return () => clearTimeout(timer);
  }, [amount, quoteWithdraw]);

  const handleSubmit = async () => {
    if (!amount || Number.parseFloat(amount) <= 0) {
      setError("Enter a valid amount");
      return;
    }
    if (Number.parseFloat(amount) > Number.parseFloat(yoUsdBalance)) {
      setError("Insufficient yoUSD balance");
      return;
    }
    setError("");
    try {
      await withdraw(amount);
      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Withdrawal failed");
    }
  };

  const setPercentage = (pct: number) => {
    const value = (Number.parseFloat(yoUsdBalance) * pct) / 100;
    setAmount(value.toFixed(2));
  };

  const formattedBalance = Number.parseFloat(yoUsdBalance).toFixed(2);
  const hasQuote = Number.parseFloat(quote) > 0;

  return (
    <View className="flex-1 bg-background p-5">
      {/* Header */}
      <View className="mb-6 items-center">
        <View className="mb-3 items-center justify-center rounded-full bg-blue-500/15 p-4">
          <Icon as={ArrowUpFromLineIcon} className="text-blue-600" size={28} />
        </View>
        <Text className="font-bold text-foreground text-xl">Withdraw yoUSD</Text>
        <Text className="mt-1 text-muted-foreground text-sm">Convert back to USDC</Text>
      </View>

      {/* Current Balance Card */}
      <View className="mb-5 rounded-2xl border border-border bg-card p-4">
        <View className="flex-row items-center gap-3">
          <View className="rounded-full bg-primary/10 p-2">
            <Icon as={CoinsIcon} className="text-primary" size={20} />
          </View>
          <View className="flex-1">
            <Text className="text-muted-foreground text-xs">Your yoUSD Balance</Text>
            <Text className="font-bold text-foreground text-lg">{formattedBalance}</Text>
          </View>
        </View>
      </View>

      {/* Amount Input */}
      <View className="mb-4">
        <Text className="mb-2 text-muted-foreground text-sm">Amount to withdraw</Text>
        <View className="flex-row items-center rounded-2xl border-2 border-blue-500/30 bg-card px-4 py-4">
          <TextInput
            className="flex-1 font-semibold text-2xl text-foreground"
            keyboardType="decimal-pad"
            onChangeText={setAmount}
            placeholder="0.00"
            placeholderTextColor="#9ca3af"
            value={amount}
          />
          <Text className="text-muted-foreground">yoUSD</Text>
        </View>
      </View>

      {/* Percentage Buttons */}
      <View className="mb-5 flex-row gap-2">
        {PERCENTAGE_OPTIONS.map((pct) => (
          <Pressable
            className="flex-1 items-center rounded-xl border border-blue-500/20 bg-blue-500/5 py-2.5"
            key={pct}
            onPress={() => setPercentage(pct)}
          >
            <Text className="font-medium text-blue-600 text-sm">{pct}%</Text>
          </Pressable>
        ))}
      </View>

      {/* Quote Result */}
      {hasQuote && (
        <View className="mb-4 rounded-xl bg-muted/50 p-4">
          <Text className="mb-1 text-muted-foreground text-xs">You'll receive (estimated)</Text>
          <Text className="font-bold text-foreground text-xl">{Number.parseFloat(quote).toFixed(2)} USDC</Text>
        </View>
      )}

      {/* Warning */}
      <View className="mb-4 flex-row items-start gap-3 rounded-xl bg-yellow-500/10 p-4">
        <Icon as={TimerIcon} className="mt-0.5 text-yellow-600" size={18} />
        <Text className="flex-1 text-xs text-yellow-700 dark:text-yellow-500">
          Withdrawals may take up to 24 hours if the vault lacks sufficient liquidity.
        </Text>
      </View>

      {/* Error */}
      {error && (
        <View className="mb-4 flex-row items-center gap-2 rounded-xl bg-destructive/10 p-3">
          <Icon as={AlertTriangleIcon} className="text-destructive" size={16} />
          <Text className="flex-1 text-destructive text-sm">{error}</Text>
        </View>
      )}

      {/* Submit Button */}
      <View className="mt-auto">
        <Button className="w-full rounded-xl bg-blue-600 py-4" disabled={isLoading} onPress={handleSubmit}>
          {isLoading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text className="font-bold text-base text-white">Withdraw</Text>
          )}
        </Button>
      </View>
    </View>
  );
}
