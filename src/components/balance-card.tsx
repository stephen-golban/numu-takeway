import { Text, View } from "react-native";

type BalanceCardProps = {
  yoUsdBalance: string;
  usdcBalance: string;
  isLoading: boolean;
};

export function BalanceCard({ yoUsdBalance, usdcBalance, isLoading }: BalanceCardProps) {
  const formattedYoUsd = Number.parseFloat(yoUsdBalance).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <View className="mb-4 rounded-2xl border border-border bg-card p-6">
      <Text className="mb-2 text-muted text-sm">Your yoUSD Balance</Text>

      {isLoading ? (
        <Text className="font-bold text-3xl text-foreground">Loading...</Text>
      ) : (
        <>
          <Text className="mb-1 font-bold text-4xl text-foreground">💰 {formattedYoUsd}</Text>
          <Text className="text-lg text-primary">yoUSD</Text>
        </>
      )}

      <View className="mt-4 border-border border-t pt-4">
        <Text className="text-muted text-sm">USDC Available: {Number.parseFloat(usdcBalance).toFixed(2)}</Text>
      </View>
    </View>
  );
}
