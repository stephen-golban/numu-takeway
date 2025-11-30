import { CoinsIcon } from "lucide-react-native";
import { type Control, Controller, useWatch } from "react-hook-form";
import { Pressable, TextInput, View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type AmountInputVariant = "deposit" | "withdraw";

type AmountInputProps = {
  control: Control<{ amount: string }>;
  variant?: AmountInputVariant;
  balance?: string;
  balanceLabel?: string;
  onMaxPress: () => void;
  onAmountPress?: (amount: string) => void;
};

const QUICK_AMOUNTS = [25, 50, 75, 100] as const;

const variantStyles = {
  deposit: {
    border: "border-green-500/30",
    maxButton: "bg-green-500/15",
    maxText: "text-green-600",
    quickButton: "border-border bg-card",
    quickButtonActive: "border-green-500/50 bg-green-500/10",
    quickText: "text-foreground",
    quickTextActive: "text-green-600",
  },
  withdraw: {
    border: "border-blue-500/30",
    maxButton: "bg-blue-500/15",
    maxText: "text-blue-600",
    quickButton: "border-blue-500/20 bg-blue-500/5",
    quickButtonActive: "border-blue-500/50 bg-blue-500/15",
    quickText: "text-blue-600",
    quickTextActive: "text-blue-700 dark:text-blue-500",
  },
};

export function AmountInput({
  control,
  variant = "deposit",
  balance,
  balanceLabel,
  onMaxPress,
  onAmountPress,
}: AmountInputProps) {
  const styles = variantStyles[variant];
  const amountLabel = variant === "deposit" ? "Amount to deposit" : "Amount to withdraw";
  const currentAmount = useWatch({ control, name: "amount" });

  const isButtonActive = (value: number): boolean => {
    if (!currentAmount) {
      return false;
    }
    const amountStr = Number.parseFloat(currentAmount).toString();
    return amountStr === value.toString();
  };

  return (
    <View className="gap-y-3">
      <View className="flex-row items-center justify-between">
        <Text className="text-muted-foreground">{amountLabel}</Text>
        {balance !== undefined && (
          <View className="flex-row items-center gap-2">
            <Icon as={CoinsIcon} className="text-muted-foreground" size={14} />
            <Text className="text-muted-foreground text-sm">Balance: </Text>
            <Text className="font-semibold text-foreground text-sm">
              {balance} {balanceLabel}
            </Text>
          </View>
        )}
      </View>
      <View className={`flex-row items-center rounded-2xl border-2 ${styles.border} bg-card px-5 py-5`}>
        <Controller
          control={control}
          name="amount"
          render={({ field: { value, onChange } }) => (
            <TextInput
              className="flex-1 font-semibold text-3xl text-foreground"
              keyboardType="decimal-pad"
              onChangeText={onChange}
              placeholder="0.00"
              placeholderTextColor="#9ca3af"
              value={value}
            />
          )}
        />
        <Pressable className={cn("rounded-lg px-4 py-2", styles.maxButton)} onPress={onMaxPress}>
          <Text className={`font-semibold ${styles.maxText}`}>MAX</Text>
        </Pressable>
      </View>

      {/* Quick Amount Buttons */}
      {onAmountPress && (
        <View className="flex-row gap-x-3">
          {QUICK_AMOUNTS.map((value) => {
            const isActive = isButtonActive(value);
            const buttonStyle = isActive ? styles.quickButtonActive : styles.quickButton;
            const textStyle = isActive ? styles.quickTextActive : styles.quickText;

            return (
              <Pressable
                className={cn("flex-1 items-center rounded-xl border py-4", buttonStyle)}
                key={value}
                onPress={() => onAmountPress(value.toString())}
              >
                <Text className={cn("font-medium text-base", textStyle)}>${value}</Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}
