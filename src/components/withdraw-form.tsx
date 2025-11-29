import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";

type WithdrawFormProps = {
  yoUsdBalance: string;
  onWithdraw: (shares: string) => Promise<void>;
  onQuote: (shares: string) => Promise<string>;
  isLoading: boolean;
};

export function WithdrawForm({ yoUsdBalance, onWithdraw, onQuote, isLoading }: WithdrawFormProps) {
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
        const result = await onQuote(amount);
        setQuote(result);
      } catch {
        setQuote("0");
      }
    };

    const timer = setTimeout(fetchQuote, 500);
    return () => clearTimeout(timer);
  }, [amount, onQuote]);

  const handleWithdraw = async () => {
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
      await onWithdraw(amount);
      setAmount("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Withdrawal failed");
    }
  };

  const setMaxAmount = () => {
    setAmount(yoUsdBalance);
  };

  return (
    <View className="rounded-2xl border border-border bg-card p-4">
      <Text className="mb-4 font-semibold text-foreground">Withdraw yoUSD</Text>

      <View className="mb-4 flex-row items-center rounded-xl bg-background px-4 py-3">
        <TextInput
          className="flex-1 text-foreground text-lg"
          keyboardType="decimal-pad"
          onChangeText={setAmount}
          placeholder="0.00"
          placeholderTextColor="#6b7280"
          value={amount}
        />
        <TouchableOpacity onPress={setMaxAmount}>
          <Text className="font-medium text-primary">MAX</Text>
        </TouchableOpacity>
      </View>

      {Number.parseFloat(quote) > 0 && (
        <Text className="mb-4 text-muted text-sm">You'll receive: ~{Number.parseFloat(quote).toFixed(2)} USDC</Text>
      )}

      <Text className="mb-4 text-muted text-xs">⚠️ Withdrawals may take up to 24h if vault lacks liquidity</Text>

      {error && <Text className="mb-4 text-error text-sm">{error}</Text>}

      <TouchableOpacity
        className={`rounded-xl py-4 ${isLoading ? "bg-muted" : "bg-secondary"}`}
        disabled={isLoading}
        onPress={handleWithdraw}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-center font-semibold text-lg text-white">💸 Withdraw</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
