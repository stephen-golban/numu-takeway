import { useRouter } from "expo-router";
import { ArrowDownToLineIcon, LoaderIcon, SparklesIcon, WalletIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useYoVault } from "@/lib/yo-protocol/hooks";

const QUICK_AMOUNTS = ["25", "50", "100"];

export default function DepositScreen() {
  const router = useRouter();
  const { usdcBalance, deposit, quoteDeposit, isLoading } = useYoVault();

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
        const result = await quoteDeposit(amount);
        setQuote(result);
      } catch {
        setQuote("0");
      }
    };
    const timer = setTimeout(fetchQuote, 500);
    return () => clearTimeout(timer);
  }, [amount, quoteDeposit]);

  const handleSubmit = async () => {
    if (!amount || Number.parseFloat(amount) <= 0) {
      setError("Enter a valid amount");
      return;
    }
    if (Number.parseFloat(amount) > Number.parseFloat(usdcBalance)) {
      setError("Insufficient USDC balance");
      return;
    }
    setError("");
    try {
      await deposit(amount);
      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Deposit failed");
    }
  };

  const formattedBalance = Number.parseFloat(usdcBalance).toFixed(2);
  const hasQuote = Number.parseFloat(quote) > 0;

  return (
    <View className="flex-1 bg-background p-5">
      {/* Header */}
      <View className="mb-6 items-center">
        <View className="mb-3 items-center justify-center rounded-full bg-green-500/15 p-4">
          <Icon as={ArrowDownToLineIcon} className="text-green-600" size={28} />
        </View>
        <Text className="font-bold text-foreground text-xl">Deposit USDC</Text>
        <Text className="mt-1 text-muted-foreground text-sm">Convert to yoUSD & earn yield</Text>
      </View>

      {/* Balance Display */}
      <View className="mb-4 flex-row items-center justify-between rounded-xl bg-muted/40 px-4 py-3">
        <View className="flex-row items-center gap-2">
          <Icon as={WalletIcon} className="text-muted-foreground" size={16} />
          <Text className="text-muted-foreground text-sm">Available</Text>
        </View>
        <Text className="font-semibold text-foreground">{formattedBalance} USDC</Text>
      </View>

      {/* Amount Input */}
      <View className="mb-4 flex-row items-center rounded-2xl border-2 border-green-500/30 bg-card px-4 py-4">
        <TextInput
          className="flex-1 font-semibold text-2xl text-foreground"
          keyboardType="decimal-pad"
          onChangeText={setAmount}
          placeholder="0.00"
          placeholderTextColor="#9ca3af"
          value={amount}
        />
        <Pressable className="rounded-lg bg-green-500/15 px-3 py-1.5" onPress={() => setAmount(usdcBalance)}>
          <Text className="font-semibold text-green-600 text-sm">MAX</Text>
        </Pressable>
      </View>

      {/* Quick Amounts */}
      <View className="mb-5 flex-row gap-2">
        {QUICK_AMOUNTS.map((amt) => (
          <Pressable
            className="flex-1 items-center rounded-xl border border-border bg-card py-3"
            key={amt}
            onPress={() => setAmount(amt)}
          >
            <Text className="font-medium text-foreground">${amt}</Text>
          </Pressable>
        ))}
      </View>

      {/* Quote Result */}
      {hasQuote && (
        <View className="mb-5 flex-row items-center justify-between rounded-xl bg-green-500/10 p-4">
          <View className="flex-row items-center gap-2">
            <Icon as={SparklesIcon} className="text-green-600" size={18} />
            <Text className="text-muted-foreground text-sm">You'll receive</Text>
          </View>
          <Text className="font-bold text-foreground text-lg">~{Number.parseFloat(quote).toFixed(2)} yoUSD</Text>
        </View>
      )}

      {/* Error */}
      {error && (
        <View className="mb-4 rounded-xl bg-destructive/10 p-3">
          <Text className="text-center text-destructive text-sm">{error}</Text>
        </View>
      )}

      {/* Submit Button */}
      <View className="mt-auto">
        <Button className="w-full rounded-xl bg-green-600" disabled={isLoading} onPress={handleSubmit} size="lg">
          {isLoading && <Icon as={LoaderIcon} className="animate-spin text-white" />}
          <Text className="font-bold text-base text-white">Deposit</Text>
        </Button>
      </View>
    </View>
  );
}
