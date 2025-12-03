import { ArrowDownToLineIcon } from "lucide-react-native";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AmountInput } from "@/components/amount-input";
import { FormFeedback } from "@/components/form-feedback";
import { KeyboardAware } from "@/components/keyboard-aware";
import { SubmitButton } from "@/components/submit-button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useDepositEthScreen } from "./hook";

export default function DepositEthScreen() {
  const { control, isValid, quote, hasQuote, isQuoteLoading, isLoading, error, onSubmit, setAmount, setMaxAmount } =
    useDepositEthScreen();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAware bottomOffset={255} className="flex-1 px-6 pt-20">
        <View className="flex-1">
          {/* Header */}
          <View className="mb-10 items-center">
            <View className="mb-4 items-center justify-center rounded-full bg-purple-500/15 p-5">
              <Icon as={ArrowDownToLineIcon} className="text-purple-600" size={32} />
            </View>
            <Text className="font-bold text-2xl text-foreground">Deposit ETH</Text>
            <Text className="mt-2 text-muted-foreground">Convert to yoETH & earn yield</Text>
          </View>

          {/* Amount Input */}
          <AmountInput
            balanceLabel="ETH"
            control={control}
            onAmountPress={setAmount}
            onMaxPress={setMaxAmount}
            variant="deposit"
          />

          {/* Quote & Error Feedback */}
          <FormFeedback
            error={error}
            hasQuote={hasQuote}
            isQuoteLoading={isQuoteLoading}
            quote={`${quote} yoETH`}
            receiveLabel="You'll receive"
            variant="deposit"
          />
        </View>

        {/* Submit Button */}
        <SubmitButton isLoading={isLoading} isValid={isValid} onPress={onSubmit} variant="deposit" />
      </KeyboardAware>
    </SafeAreaView>
  );
}
