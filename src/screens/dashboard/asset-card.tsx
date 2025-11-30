import { CoinsIcon, WalletIcon } from "lucide-react-native";
import { View } from "react-native";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";

type AssetCardProps = {
  yoUsdBalance: string;
  usdcBalance: string;
  isLoading: boolean;
};

type AssetRowProps = {
  icon: typeof CoinsIcon;
  name: string;
  symbol: string;
  balance: string;
  isLoading: boolean;
  iconBgClass?: string;
};

function AssetRowSkeleton({ iconBgClass = "bg-primary/10" }: { iconBgClass?: string }) {
  return (
    <View className="flex-row items-center py-3">
      {/* Icon */}
      <View className={`mr-3 h-10 w-10 items-center justify-center rounded-full ${iconBgClass}`}>
        <Skeleton className="h-5 w-5 rounded-full" />
      </View>

      {/* Name & Symbol */}
      <View className="flex-1 gap-1">
        <Skeleton className="h-5 w-24 rounded" />
        <Skeleton className="h-3 w-20 rounded" />
      </View>

      {/* Balance */}
      <Skeleton className="h-5 w-20 rounded" />
    </View>
  );
}

function AssetRow({ icon, name, symbol, balance, isLoading, iconBgClass = "bg-primary/10" }: AssetRowProps) {
  const formattedBalance = Number.parseFloat(balance).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });

  if (isLoading) {
    return <AssetRowSkeleton iconBgClass={iconBgClass} />;
  }

  return (
    <View className="flex-row items-center py-3">
      {/* Icon */}
      <View className={`mr-3 h-10 w-10 items-center justify-center rounded-full ${iconBgClass}`}>
        <Icon as={icon} className="text-primary" size={20} />
      </View>

      {/* Name & Symbol */}
      <View className="flex-1">
        <Text className="font-medium text-foreground">{name}</Text>
        <Text className="text-muted-foreground text-xs">{symbol}</Text>
      </View>

      {/* Balance */}
      <Text className="font-semibold text-foreground">{formattedBalance}</Text>
    </View>
  );
}

export function AssetCard({ yoUsdBalance, usdcBalance, isLoading }: AssetCardProps) {
  return (
    <Card className="mx-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Your Assets</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {/* yoUSD Row */}
        <AssetRow
          balance={yoUsdBalance}
          icon={CoinsIcon}
          iconBgClass="bg-blue-500/10"
          isLoading={isLoading}
          name="yoUSD Vault"
          symbol="Earning yield"
        />

        {/* Divider */}
        <View className="h-px bg-border" />

        {/* USDC Row */}
        <AssetRow
          balance={usdcBalance}
          icon={WalletIcon}
          iconBgClass="bg-green-500/10"
          isLoading={isLoading}
          name="USDC"
          symbol="Available to deposit"
        />
      </CardContent>
    </Card>
  );
}
