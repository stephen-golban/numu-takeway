import { ArrowDownToLineIcon, SparklesIcon, WalletIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, TextInput, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

type DepositModalProps = {
  isOpen: boolean;
  onClose: () => void;
  balance: string;
  onSubmit: (amount: string) => Promise<void>;
  onQuote: (amount: string) => Promise<string>;
  isLoading: boolean;
};

export function DepositModal({ isOpen, onClose, balance, onSubmit, onQuote, isLoading }: DepositModalProps) {
  const [amount, setAmount] = useState("");
  const [quote, setQuote] = useState("0");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setAmount("");
      setQuote("0");
      setError("");
    }
  }, [isOpen]);

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
      setError("Insufficient USDC balance");
      return;
    }
    setError("");
    try {
      await onSubmit(amount);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Deposit failed");
    }
  };

  const quickAmounts = ["25", "50", "100"];
  const formattedBalance = Number.parseFloat(balance).toFixed(2);
  const hasQuote = Number.parseFloat(quote) > 0;

  return (
    <Dialog onOpenChange={(open) => !open && onClose()} open={isOpen}>
      <DialogContent className="w-[92%] max-w-md border-0 bg-card p-0">
        {/* Header with gradient accent */}
        <View className="rounded-t-lg bg-green-500/10 px-5 pt-5 pb-4">
          <View className="mb-3 flex-row items-center gap-3">
            <View className="items-center justify-center rounded-full bg-green-500/20 p-2.5">
              <Icon as={ArrowDownToLineIcon} className="text-green-600" size={22} />
            </View>
            <View>
              <Text className="font-semibold text-foreground text-lg">Deposit USDC</Text>
              <Text className="text-muted-foreground text-xs">Convert to yoUSD & earn yield</Text>
            </View>
          </View>
        </View>

        <View className="gap-5 px-5 pt-4 pb-5">
          {/* Balance display */}
          <View className="flex-row items-center justify-between rounded-lg bg-muted/50 px-3 py-2.5">
            <View className="flex-row items-center gap-2">
              <Icon as={WalletIcon} className="text-muted-foreground" size={16} />
              <Text className="text-muted-foreground text-sm">Available</Text>
            </View>
            <Text className="font-medium text-foreground">{formattedBalance} USDC</Text>
          </View>

          {/* Amount input */}
          <View>
            <View className="flex-row items-center rounded-xl border-2 border-green-500/30 bg-background px-4 py-3">
              <Text className="mr-2 font-medium text-muted-foreground text-xl">$</Text>
              <TextInput
                className="flex-1 text-2xl text-foreground"
                keyboardType="decimal-pad"
                onChangeText={setAmount}
                placeholder="0.00"
                placeholderTextColor="#9ca3af"
                value={amount}
              />
              <Pressable className="rounded-md bg-green-500/10 px-3 py-1.5" onPress={() => setAmount(balance)}>
                <Text className="font-semibold text-green-600 text-sm">MAX</Text>
              </Pressable>
            </View>

            {/* Quick amounts */}
            <View className="mt-3 flex-row gap-2">
              {quickAmounts.map((amt) => (
                <Pressable
                  className="flex-1 items-center rounded-lg border border-border bg-muted/30 py-2"
                  key={amt}
                  onPress={() => setAmount(amt)}
                >
                  <Text className="font-medium text-foreground text-sm">${amt}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Quote result */}
          {hasQuote && (
            <View className="flex-row items-center justify-between rounded-xl bg-green-500/5 p-4">
              <View className="flex-row items-center gap-2">
                <Icon as={SparklesIcon} className="text-green-600" size={18} />
                <Text className="text-muted-foreground text-sm">You'll receive</Text>
              </View>
              <Text className="font-bold text-foreground text-lg">~{Number.parseFloat(quote).toFixed(2)} yoUSD</Text>
            </View>
          )}

          {error && (
            <View className="rounded-lg bg-destructive/10 px-3 py-2">
              <Text className="text-center text-destructive text-sm">{error}</Text>
            </View>
          )}

          <Button className="w-full bg-green-600 py-3" disabled={isLoading} onPress={handleSubmit}>
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text className="font-semibold text-white">Deposit Now</Text>
            )}
          </Button>
        </View>
      </DialogContent>
    </Dialog>
  );
}
