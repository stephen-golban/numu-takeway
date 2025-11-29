import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";

type DepositFormProps = {
  usdcBalance: string;
  onDeposit: (amount: string) => Promise<void>;
  onQuote: (amount: string) => Promise<string>;
  isLoading: boolean;
};

export function DepositForm({ usdcBalance, onDeposit, onQuote, isLoading }: DepositFormProps) {
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

  const handleDeposit = async () => {
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
      await onDeposit(amount);
      setAmount("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Deposit failed");
    }
  };

  const setMaxAmount = () => {
    setAmount(usdcBalance);
  };

  return (
    <View className="rounded-2xl border border-border bg-card p-4">
      <Text className="mb-4 font-semibold text-foreground">Deposit USDC</Text>

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
        <Text className="mb-4 text-muted text-sm">You'll receive: ~{Number.parseFloat(quote).toFixed(2)} yoUSD</Text>
      )}

      {error && <Text className="mb-4 text-error text-sm">{error}</Text>}

      <TouchableOpacity
        className={`rounded-xl py-4 ${isLoading ? "bg-muted" : "bg-primary"}`}
        disabled={isLoading}
        onPress={handleDeposit}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-center font-semibold text-lg text-white">💳 Deposit</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
