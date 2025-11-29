import { ArrowDownToLineIcon, LoaderIcon, SparklesIcon, WalletIcon } from "lucide-react-native";
import { Controller } from "react-hook-form";
import { Pressable, TextInput, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { QUICK_AMOUNTS, useDepositScreen } from "./hook";

export default function DepositScreen() {
  const { form, quote, hasQuote, balance, isLoading, error, onSubmit, setAmount, setMaxAmount } = useDepositScreen();

  return (
    <View className="flex-1 bg-background p-5">
      {/* Header */}
      <View className="mb-6 items-center">
        <View className="mb-3 items-center justify-center rounded-full bg-green-500/15 p-4">
          <Icon as={ArrowDownToLineIcon} className="text-green-600" size={28} />
        </View>
        <Text className="font-bold text-foreground text-xl">Deposit USDC</Text>
        <Text className="mt-1 text-muted-foreground text-sm">Convert to yoUSD & earn yield</Text>
      </View>

      {/* Balance Display */}
      <View className="mb-4 flex-row items-center justify-between rounded-xl bg-muted/40 px-4 py-3">
        <View className="flex-row items-center gap-2">
          <Icon as={WalletIcon} className="text-muted-foreground" size={16} />
          <Text className="text-muted-foreground text-sm">Available</Text>
        </View>
        <Text className="font-semibold text-foreground">{balance} USDC</Text>
      </View>

      {/* Amount Input */}
      <View className="mb-2 flex-row items-center rounded-2xl border-2 border-green-500/30 bg-card px-4 py-4">
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
        <Pressable className="rounded-lg bg-green-500/15 px-3 py-1.5" onPress={setMaxAmount}>
          <Text className="font-semibold text-green-600 text-sm">MAX</Text>
        </Pressable>
      </View>
      {/* Error */}
      {error && <Text className="mb-4 text-destructive text-sm">{error}</Text>}

      {/* Quick Amounts */}
      <View className="mb-5 flex-row gap-2">
        {QUICK_AMOUNTS.map((amt) => (
          <Pressable
            className="flex-1 items-center rounded-xl border border-border bg-card py-3"
            key={amt}
            onPress={() => setAmount(amt)}
          >
            <Text className="font-medium text-foreground">${amt}</Text>
          </Pressable>
        ))}
      </View>

      {/* Quote Result */}
      {hasQuote && (
        <View className="mb-5 flex-row items-center justify-between rounded-xl bg-green-500/10 p-4">
          <View className="flex-row items-center gap-2">
            <Icon as={SparklesIcon} className="text-green-600" size={18} />
            <Text className="text-muted-foreground text-sm">You'll receive</Text>
          </View>
          <Text className="font-bold text-foreground text-lg">~{quote} yoUSD</Text>
        </View>
      )}

      {/* Submit Button */}
      <View className="mt-auto">
        <Button
          className="w-full rounded-xl bg-green-600"
          disabled={isLoading || !form.formState.isValid}
          onPress={onSubmit}
          size="lg"
        >
          {isLoading && <Icon as={LoaderIcon} className="animate-spin text-white" />}
          <Text className="font-bold text-base text-white">Deposit</Text>
        </Button>
      </View>
    </View>
  );
}
