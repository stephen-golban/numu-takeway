import { ArrowDownToLineIcon } from "lucide-react-native";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AmountInput } from "@/components/amount-input";
import { FormFeedback } from "@/components/form-feedback";
import { KeyboardAware } from "@/components/keyboard-aware";
import { SubmitButton } from "@/components/submit-button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useDepositScreen } from "./hook";

export default function DepositScreen() {
  const { form, quote, hasQuote, isQuoteLoading, balance, isLoading, error, onSubmit, setAmount, setMaxAmount } =
    useDepositScreen();

  return (
    <SafeAreaView className="flex-1 bg-background px-4 pt-20">
      <KeyboardAware bottomOffset={500}>
        <View className="flex-1">
          {/* Header */}
          <View className="mb-10 items-center">
            <View className="mb-4 items-center justify-center rounded-full bg-green-500/15 p-5">
              <Icon as={ArrowDownToLineIcon} className="text-green-600" size={32} />
            </View>
            <Text className="font-bold text-2xl text-foreground">Deposit USDC</Text>
            <Text className="mt-2 text-muted-foreground">Convert to yoUSD & earn yield</Text>
          </View>

          {/* Amount Input */}
          <AmountInput
            balance={balance}
            balanceLabel="USDC"
            control={form.control}
            onAmountPress={setAmount}
            onMaxPress={setMaxAmount}
            variant="deposit"
          />

          {/* Quote or Error Display */}
          <FormFeedback
            error={error}
            hasQuote={hasQuote}
            isQuoteLoading={isQuoteLoading}
            quote={`${quote} yoUSD`}
            receiveLabel="You'll receive"
            variant="deposit"
          />
        </View>

        {/* Submit Button */}
        <SubmitButton isLoading={isLoading} isValid={form.formState.isValid} onPress={onSubmit} variant="deposit" />
      </KeyboardAware>
    </SafeAreaView>
  );
}
