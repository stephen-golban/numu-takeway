import { ArrowDownToLineIcon, LoaderIcon, SparklesIcon, WalletIcon } from "lucide-react-native";
import { Controller } from "react-hook-form";
import { Pressable, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAware } from "@/components/keyboard-aware";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { QUICK_AMOUNTS, useDepositScreen } from "./hook";

export default function DepositScreen() {
  const { form, quote, hasQuote, balance, isLoading, error, onSubmit, setAmount, setMaxAmount } = useDepositScreen();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAware className="flex-1 px-6 pt-20">
        {/* Header */}
        <View className="mb-10 items-center">
          <View className="mb-4 items-center justify-center rounded-full bg-green-500/15 p-5">
            <Icon as={ArrowDownToLineIcon} className="text-green-600" size={32} />
          </View>
          <Text className="font-bold text-2xl text-foreground">Deposit USDC</Text>
          <Text className="mt-2 text-muted-foreground">Convert to yoUSD & earn yield</Text>
        </View>

        {/* Balance Display */}
        <View className="mb-6 flex-row items-center justify-between rounded-2xl bg-muted/40 px-5 py-4">
          <View className="flex-row items-center gap-3">
            <Icon as={WalletIcon} className="text-muted-foreground" size={18} />
            <Text className="text-muted-foreground">Available</Text>
          </View>
          <Text className="font-semibold text-foreground text-lg">{balance} USDC</Text>
        </View>

        {/* Amount Input */}
        <View className="mb-3 flex-row items-center rounded-2xl border-2 border-green-500/30 bg-card px-5 py-5">
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
          <Pressable className="rounded-lg bg-green-500/15 px-4 py-2" onPress={setMaxAmount}>
            <Text className="font-semibold text-green-600">MAX</Text>
          </Pressable>
        </View>
        {/* Error */}
        {error && <Text className="mb-4 text-destructive">{error}</Text>}

        {/* Quick Amounts */}
        <View className="mb-8 flex-row gap-3">
          {QUICK_AMOUNTS.map((amt) => (
            <Pressable
              className="flex-1 items-center rounded-xl border border-border bg-card py-4"
              key={amt}
              onPress={() => setAmount(amt)}
            >
              <Text className="font-medium text-base text-foreground">${amt}</Text>
            </Pressable>
          ))}
        </View>

        {/* Quote Result */}
        {hasQuote && (
          <View className="flex-row items-center justify-between rounded-2xl bg-green-500/10 p-5">
            <View className="flex-row items-center gap-3">
              <Icon as={SparklesIcon} className="text-green-600" size={20} />
              <Text className="text-muted-foreground">You'll receive</Text>
            </View>
            <Text className="font-bold text-foreground text-xl">~{quote} yoUSD</Text>
          </View>
        )}

        {/* Submit Button */}
        <View className="pb-8">
          <Button
            className="w-full rounded-2xl bg-green-600"
            disabled={isLoading || !form.formState.isValid}
            onPress={onSubmit}
            size="lg"
          >
            {isLoading && <Icon as={LoaderIcon} className="animate-spin text-white" />}
            <Text className="font-bold text-lg text-white">Deposit</Text>
          </Button>
        </View>
      </KeyboardAware>
    </SafeAreaView>
  );
}
