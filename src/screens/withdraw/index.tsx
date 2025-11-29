import { AlertTriangleIcon, ArrowUpFromLineIcon, CoinsIcon, LoaderIcon, TimerIcon } from "lucide-react-native";
import { Controller } from "react-hook-form";
import { Pressable, TextInput, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { PERCENTAGE_OPTIONS, useWithdrawScreen } from "./hook";

export default function WithdrawScreen() {
  const { form, quote, hasQuote, balance, isLoading, error, onSubmit, setPercentage } = useWithdrawScreen();

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
            <Text className="font-bold text-foreground text-lg">{balance}</Text>
          </View>
        </View>
      </View>

      {/* Amount Input */}
      <View className="mb-4">
        <Text className="mb-2 text-muted-foreground text-sm">Amount to withdraw</Text>
        <View className="flex-row items-center rounded-2xl border-2 border-blue-500/30 bg-card px-4 py-4">
          <Controller
            control={form.control}
            name="amount"
            render={({ field: { value, onChange } }) => (
              <TextInput
                className="flex-1 font-semibold text-2xl text-foreground"
                keyboardType="decimal-pad"
                onChangeText={onChange}
                placeholder="0.00"
                placeholderTextColor="#9ca3af"
                value={value}
              />
            )}
          />
          <Text className="text-muted-foreground">yoUSD</Text>
        </View>
      </View>
      {/* Error */}
      {error && (
        <View className="mb-4 flex-row items-center gap-2 rounded-xl bg-destructive/10 p-3">
          <Icon as={AlertTriangleIcon} className="text-destructive" size={16} />
          <Text className="flex-1 text-destructive text-sm">{error}</Text>
        </View>
      )}

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
          <Text className="font-bold text-foreground text-xl">{quote} USDC</Text>
        </View>
      )}

      {/* Warning */}
      <View className="mb-4 flex-row items-start gap-3 rounded-xl bg-yellow-500/10 p-4">
        <Icon as={TimerIcon} className="mt-0.5 text-yellow-600" size={18} />
        <Text className="flex-1 text-xs text-yellow-700 dark:text-yellow-500">
          Withdrawals may take up to 24 hours if the vault lacks sufficient liquidity.
        </Text>
      </View>

      {/* Submit Button */}
      <View className="mt-auto">
        <Button
          className="w-full rounded-xl bg-blue-600"
          disabled={isLoading || !form.formState.isValid}
          onPress={onSubmit}
          size="lg"
        >
          {isLoading && <Icon as={LoaderIcon} className="animate-spin text-white" />}
          <Text className="font-bold text-base text-white">Withdraw</Text>
        </Button>
      </View>
    </View>
  );
}
