import { View } from "react-native";
import { DataRow } from "@/components/data-row";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type PositionCardProps = {
  shareBalance: number;
  symbol: string;
  usdValue: number;
  assetSymbol: string;
  assetBalance: string;
};

function PositionCard({ shareBalance, symbol, usdValue, assetSymbol, assetBalance }: PositionCardProps) {
  const formattedAssetBalance = Number.parseFloat(assetBalance).toFixed(4);

  return (
    <Card className="border-0">
      <CardHeader>
        <CardTitle>Your Position</CardTitle>
      </CardHeader>
      <CardContent>
        <View className="gap-3 rounded-xl bg-muted/30 p-4">
          <DataRow label="Vault Balance" value={`${shareBalance.toFixed(4)} ${symbol}`} />
          <DataRow label="USD Value" value={`$${usdValue.toFixed(2)}`} />
          <DataRow label={`${assetSymbol} Available`} value={formattedAssetBalance} />
        </View>
      </CardContent>
    </Card>
  );
}

function PositionCardSkeleton() {
  return (
    <Card className="border-0">
      <CardHeader>
        <Skeleton className="h-5 w-28 bg-muted" />
      </CardHeader>
      <CardContent>
        <View className="gap-3 rounded-xl bg-muted/30 p-4">
          <View className="flex-row items-center justify-between py-1">
            <Skeleton className="h-4 w-24 bg-muted" />
            <Skeleton className="h-4 w-20 bg-muted" />
          </View>
          <View className="flex-row items-center justify-between py-1">
            <Skeleton className="h-4 w-20 bg-muted" />
            <Skeleton className="h-4 w-16 bg-muted" />
          </View>
          <View className="flex-row items-center justify-between py-1">
            <Skeleton className="h-4 w-28 bg-muted" />
            <Skeleton className="h-4 w-16 bg-muted" />
          </View>
        </View>
      </CardContent>
    </Card>
  );
}

export { PositionCard, PositionCardSkeleton };
export type { PositionCardProps };
