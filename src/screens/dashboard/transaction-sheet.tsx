import { useEffect, useState } from "react";
import { ActivityIndicator, TextInput, View } from "react-native";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Text } from "@/components/ui/text";

type TransactionSheetProps = {
  type: "deposit" | "withdraw";
  isOpen: boolean;
  onClose: () => void;
  balance: string;
  onSubmit: (amount: string) => Promise<void>;
  onQuote: (amount: string) => Promise<string>;
  isLoading: boolean;
};

export function TransactionSheet({
  type,
  isOpen,
  onClose,
  balance,
  onSubmit,
  onQuote,
  isLoading,
}: TransactionSheetProps) {
  const [amount, setAmount] = useState("");
  const [quote, setQuote] = useState("0");
  const [error, setError] = useState("");

  const isDeposit = type === "deposit";
  const title = isDeposit ? "Deposit USDC" : "Withdraw yoUSD";
  const subtitle = isDeposit ? "Convert USDC to yoUSD and start earning yield" : "Convert yoUSD back to USDC";
  const inputLabel = isDeposit ? "USDC" : "yoUSD";
  const outputLabel = isDeposit ? "yoUSD" : "USDC";
  const buttonText = isDeposit ? "Deposit" : "Withdraw";

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setAmount("");
      setQuote("0");
      setError("");
    }
  }, [isOpen]);

  // Debounced quote fetching
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

  const handleSubmit = async () => {
    if (!amount || Number.parseFloat(amount) <= 0) {
      setError("Enter a valid amount");
      return;
    }
    if (Number.parseFloat(amount) > Number.parseFloat(balance)) {
      setError(`Insufficient ${inputLabel} balance`);
      return;
    }

    setError("");
    try {
      await onSubmit(amount);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transaction failed");
    }
  };

  const setMaxAmount = () => {
    setAmount(balance);
  };

  const formattedBalance = Number.parseFloat(balance).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formattedQuote = Number.parseFloat(quote).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <Dialog onOpenChange={(open) => !open && onClose()} open={isOpen}>
      <DialogContent className="w-[90%] max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{subtitle}</DialogDescription>
        </DialogHeader>

        <View className="gap-4 py-4">
          {/* Amount Input */}
          <View>
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-muted-foreground text-sm">Amount</Text>
              <Text className="text-muted-foreground text-xs">
                Balance: {formattedBalance} {inputLabel}
              </Text>
            </View>
            <View className="flex-row items-center rounded-xl border border-border bg-muted/50 px-4 py-3">
              <TextInput
                className="flex-1 text-foreground text-xl"
                keyboardType="decimal-pad"
                onChangeText={setAmount}
                placeholder="0.00"
                placeholderTextColor="#6b7280"
                value={amount}
              />
              <Button onPress={setMaxAmount} size="sm" variant="ghost">
                <Text className="font-medium text-primary text-sm">MAX</Text>
              </Button>
            </View>
          </View>

          {/* Quote Display */}
          {Number.parseFloat(quote) > 0 && (
            <View className="rounded-xl bg-muted/50 p-4">
              <Text className="mb-1 text-muted-foreground text-xs">You'll receive (estimated)</Text>
              <Text className="font-semibold text-foreground text-lg">
                ~{formattedQuote} {outputLabel}
              </Text>
            </View>
          )}

          {/* Warning for withdrawals */}
          {!isDeposit && (
            <View className="rounded-xl bg-yellow-500/10 p-3">
              <Text className="text-center text-xs text-yellow-600">
                Withdrawals may take up to 24h if vault lacks liquidity
              </Text>
            </View>
          )}

          {/* Error Display */}
          {error && (
            <View className="rounded-xl bg-destructive/10 p-3">
              <Text className="text-center text-destructive text-sm">{error}</Text>
            </View>
          )}
        </View>

        <DialogFooter>
          <Button className="w-full" disabled={isLoading} onPress={handleSubmit}>
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text className="font-semibold text-primary-foreground">{buttonText}</Text>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
