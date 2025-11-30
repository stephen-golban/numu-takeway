import { ArrowUpFromLineIcon, TimerIcon } from "lucide-react-native";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AmountInput } from "@/components/amount-input";
import { QuoteDisplay } from "@/components/quote-display";
import { SubmitButton } from "@/components/submit-button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useWithdrawScreen } from "./hook";

export default function WithdrawScreen() {
  const { form, quote, hasQuote, isQuoteLoading, balance, isLoading, error, onSubmit, setAmount, setPercentage } =
    useWithdrawScreen();

  return (
    <SafeAreaView className="flex-1 bg-background px-4 pt-20">
      <View className="flex-1">
        {/* Header */}
        <View className="mb-10 items-center">
          <View className="mb-4 items-center justify-center rounded-full bg-blue-500/15 p-5">
            <Icon as={ArrowUpFromLineIcon} className="text-blue-600" size={32} />
          </View>
          <Text className="font-bold text-2xl text-foreground">Withdraw yoUSD</Text>
          <Text className="mt-2 text-muted-foreground">Convert back to USDC</Text>
        </View>

        {/* Amount Input */}
        <AmountInput
          balance={balance}
          balanceLabel="yoUSD"
          control={form.control}
          error={error}
          onAmountPress={setAmount}
          onMaxPress={() => setPercentage(100)}
          variant="withdraw"
        />

        {/* Quote Result */}
        <QuoteDisplay
          hasQuote={hasQuote}
          isQuoteLoading={isQuoteLoading}
          quote={`${quote} USDC`}
          receiveLabel="You'll receive (estimated)"
          variant="withdraw"
        />

        {/* Warning */}
        <View className="flex-row items-start gap-4 rounded-2xl bg-yellow-500/10 p-5">
          <Icon as={TimerIcon} className="mt-0.5 text-yellow-600" size={20} />
          <Text className="flex-1 text-yellow-700 dark:text-yellow-500">
            Withdrawals may take up to 24 hours if the vault lacks sufficient liquidity.
          </Text>
        </View>
      </View>

      {/* Submit Button */}
      <SubmitButton isLoading={isLoading} isValid={form.formState.isValid} onPress={onSubmit} variant="withdraw" />
    </SafeAreaView>
  );
}
