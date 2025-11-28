import { TrendingDownIcon, TrendingUpIcon } from "lucide-react-native";
import { View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { formatCurrency, formatPercent } from "@/lib/utils";

type PortfolioHeaderProps = {
  totalValue: number;
  change24h: number;
  changePercent: number;
  isLoading?: boolean;
};

const PortfolioHeader: React.FC<PortfolioHeaderProps> = ({
  totalValue,
  change24h,
  changePercent,
  isLoading = false,
}) => {
  const isPositive = change24h >= 0;

  if (isLoading) {
    return (
      <View className="items-center gap-2 py-6">
        <Skeleton className="h-4 w-24 bg-muted" />
        <Skeleton className="h-10 w-40 bg-muted" />
        <Skeleton className="h-5 w-32 bg-muted" />
      </View>
    );
  }

  return (
    <View className="items-center gap-1 py-6">
      <Text className="text-muted-foreground text-sm">Total Balance</Text>
      <Text className="font-bold text-4xl tracking-tight">{formatCurrency(totalValue)}</Text>
      <View
        className={`flex-row items-center gap-1 rounded-full px-3 py-1 ${
          isPositive ? "bg-green-500/10" : "bg-red-500/10"
        }`}
      >
        <Icon
          as={isPositive ? TrendingUpIcon : TrendingDownIcon}
          className={isPositive ? "text-green-500" : "text-red-500"}
          size={14}
        />
        <Text className={`font-medium text-sm ${isPositive ? "text-green-500" : "text-red-500"}`}>
          {formatCurrency(Math.abs(change24h))} ({formatPercent(changePercent)})
        </Text>
      </View>
    </View>
  );
};

export { PortfolioHeader };
