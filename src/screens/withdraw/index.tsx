import { ArrowUpFromLineIcon } from "lucide-react-native";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AmountInput } from "@/components/amount-input";
import { FormFeedback } from "@/components/form-feedback";
import { KeyboardAware } from "@/components/keyboard-aware";
import { SubmitButton } from "@/components/submit-button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useWithdrawScreen } from "./hook";

export default function WithdrawScreen() {
  const {
    control,
    isValid,
    quote,
    hasQuote,
    isQuoteLoading,
    isLoading,
    error,
    onSubmit,
    setAmount,
    setMaxAmount,
    balance,
  } = useWithdrawScreen();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAware bottomOffset={255} className="flex-1 px-6 pt-20">
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
            control={control}
            onAmountPress={setAmount}
            onMaxPress={setMaxAmount}
            variant="withdraw"
          />

          {/* Quote & Error Feedback */}
          <FormFeedback
            error={error}
            hasQuote={hasQuote}
            isQuoteLoading={isQuoteLoading}
            quote={`${quote} USDC`}
            receiveLabel="You'll receive"
            variant="withdraw"
          />
        </View>

        {/* Submit Button */}
        <SubmitButton isLoading={isLoading} isValid={isValid} onPress={onSubmit} variant="withdraw" />
      </KeyboardAware>
    </SafeAreaView>
  );
}
