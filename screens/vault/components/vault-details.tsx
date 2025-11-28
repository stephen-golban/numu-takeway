import { View } from "react-native";
import { DataRow } from "@/components/data-row";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type VaultDetailsProps = {
  assetName: string;
  symbol: string;
  address: string;
  network?: string;
};

function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function VaultDetails({ assetName, symbol, address, network = "Base" }: VaultDetailsProps) {
  return (
    <Card className="border-0">
      <CardHeader>
        <CardTitle>Vault Details</CardTitle>
      </CardHeader>
      <CardContent>
        <View className="gap-2">
          <DataRow label="Asset" value={assetName} />
          <DataRow label="Symbol" value={symbol} />
          <DataRow label="Network" value={network} />
          <DataRow label="Contract" value={formatAddress(address)} />
        </View>
      </CardContent>
    </Card>
  );
}

function VaultDetailsSkeleton() {
  return (
    <Card className="border-0">
      <CardHeader>
        <Skeleton className="h-5 w-28 bg-muted" />
      </CardHeader>
      <CardContent>
        <View className="gap-2">
          <View className="flex-row items-center justify-between py-1">
            <Skeleton className="h-4 w-12 bg-muted" />
            <Skeleton className="h-4 w-16 bg-muted" />
          </View>
          <View className="flex-row items-center justify-between py-1">
            <Skeleton className="h-4 w-16 bg-muted" />
            <Skeleton className="h-4 w-12 bg-muted" />
          </View>
          <View className="flex-row items-center justify-between py-1">
            <Skeleton className="h-4 w-16 bg-muted" />
            <Skeleton className="h-4 w-10 bg-muted" />
          </View>
          <View className="flex-row items-center justify-between py-1">
            <Skeleton className="h-4 w-16 bg-muted" />
            <Skeleton className="h-4 w-24 bg-muted" />
          </View>
        </View>
      </CardContent>
    </Card>
  );
}

export { VaultDetails, VaultDetailsSkeleton };
export type { VaultDetailsProps };
