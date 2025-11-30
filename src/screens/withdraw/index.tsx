import { AlertTriangleIcon, ArrowUpFromLineIcon, CoinsIcon, LoaderIcon, TimerIcon } from "lucide-react-native";
import { Controller } from "react-hook-form";
import { Keyboard, Pressable, TextInput, View } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { PERCENTAGE_OPTIONS, useWithdrawScreen } from "./hook";

export default function WithdrawScreen() {
  const { form, quote, hasQuote, balance, isLoading, error, onSubmit, setPercentage } = useWithdrawScreen();

  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1 bg-background" keyboardVerticalOffset={60}>
      <Pressable className="flex-1 px-6 pt-8" onPress={Keyboard.dismiss}>
        {/* Header */}
        <View className="mb-10 items-center">
          <View className="mb-4 items-center justify-center rounded-full bg-blue-500/15 p-5">
            <Icon as={ArrowUpFromLineIcon} className="text-blue-600" size={32} />
          </View>
          <Text className="font-bold text-2xl text-foreground">Withdraw yoUSD</Text>
          <Text className="mt-2 text-muted-foreground">Convert back to USDC</Text>
        </View>

        {/* Current Balance Card */}
        <View className="mb-6 rounded-2xl border border-border bg-card p-5">
          <View className="flex-row items-center gap-4">
            <View className="rounded-full bg-primary/10 p-3">
              <Icon as={CoinsIcon} className="text-primary" size={24} />
            </View>
            <View className="flex-1">
              <Text className="text-muted-foreground">Your yoUSD Balance</Text>
              <Text className="font-bold text-foreground text-xl">{balance}</Text>
            </View>
          </View>
        </View>

        {/* Amount Input */}
        <View className="mb-4">
          <Text className="mb-3 text-muted-foreground">Amount to withdraw</Text>
          <View className="flex-row items-center rounded-2xl border-2 border-blue-500/30 bg-card px-5 py-5">
            <Controller
              control={form.control}
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
            <Text className="text-lg text-muted-foreground">yoUSD</Text>
          </View>
        </View>
        {/* Error */}
        {error && (
          <View className="mb-4 flex-row items-center gap-3 rounded-xl bg-destructive/10 p-4">
            <Icon as={AlertTriangleIcon} className="text-destructive" size={18} />
            <Text className="flex-1 text-destructive">{error}</Text>
          </View>
        )}

        {/* Percentage Buttons */}
        <View className="mb-8 flex-row gap-3">
          {PERCENTAGE_OPTIONS.map((pct) => (
            <Pressable
              className="flex-1 items-center rounded-xl border border-blue-500/20 bg-blue-500/5 py-4"
              key={pct}
              onPress={() => setPercentage(pct)}
            >
              <Text className="font-medium text-base text-blue-600">{pct}%</Text>
            </Pressable>
          ))}
        </View>

        {/* Quote Result */}
        {hasQuote && (
          <View className="mb-6 rounded-2xl bg-muted/50 p-5">
            <Text className="mb-2 text-muted-foreground">You'll receive (estimated)</Text>
            <Text className="font-bold text-2xl text-foreground">{quote} USDC</Text>
          </View>
        )}

        {/* Warning */}
        <View className="flex-row items-start gap-4 rounded-2xl bg-yellow-500/10 p-5">
          <Icon as={TimerIcon} className="mt-0.5 text-yellow-600" size={20} />
          <Text className="flex-1 text-yellow-700 dark:text-yellow-500">
            Withdrawals may take up to 24 hours if the vault lacks sufficient liquidity.
          </Text>
        </View>

        {/* Spacer */}
        <View className="flex-1" />

        {/* Submit Button */}
        <View className="pb-8">
          <Button
            className="w-full rounded-2xl bg-blue-600 py-5"
            disabled={isLoading || !form.formState.isValid}
            onPress={onSubmit}
            size="lg"
          >
            {isLoading && <Icon as={LoaderIcon} className="animate-spin text-white" />}
            <Text className="font-bold text-lg text-white">Withdraw</Text>
          </Button>
        </View>
      </Pressable>
    </KeyboardAvoidingView>
  );
}
