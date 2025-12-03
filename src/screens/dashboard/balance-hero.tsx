import { ArrowUpIcon } from "lucide-react-native";
import { View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";

type BalanceHeroProps = {
  yoEthBalance: string;
  apy: string | undefined;
  isLoading: boolean;
};

export function BalanceHero({ yoEthBalance, apy, isLoading }: BalanceHeroProps) {
  const formattedBalance = Number.parseFloat(yoEthBalance).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });

  return (
    <View className="items-center py-8">
      {/* Label */}
      {isLoading ? (
        <Skeleton className="mb-2 h-4 w-24 rounded" />
      ) : (
        <Text className="mb-2 text-muted-foreground text-sm">Total Balance</Text>
      )}

      {/* Main Balance */}
      {isLoading ? (
        <Skeleton className="mb-1 h-12 w-48 rounded-lg" />
      ) : (
        <View className="mb-1 flex-row items-baseline">
          <Text className="font-bold text-5xl text-foreground">{formattedBalance}</Text>
        </View>
      )}

      {/* yoETH Label */}
      {isLoading ? (
        <Skeleton className="mb-4 h-4 w-16 rounded" />
      ) : (
        <View className="mb-4 flex-row items-center gap-1">
          <View className="h-2 w-2 rounded-full bg-purple-500" />
          <Text className="text-muted-foreground text-sm">yoETH</Text>
        </View>
      )}

      {/* APY Badge */}
      {isLoading ? (
        <Skeleton className="h-7 w-24 rounded-full" />
      ) : (
        <View className="flex-row items-center gap-1 rounded-full bg-green-500/10 px-3 py-1">
          <Icon as={ArrowUpIcon} className="text-green-600" size={12} />
          <Text className="font-medium text-green-600 text-sm">{apy ?? "—"} APY</Text>
        </View>
      )}
    </View>
  );
}
