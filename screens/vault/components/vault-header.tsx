import { View } from "react-native";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";

type VaultHeaderProps = {
  symbol: string;
  name: string;
  apy: number;
  color: string;
};

function VaultHeader({ symbol, name, apy, color }: VaultHeaderProps) {
  return (
    <View className="items-center gap-4 py-4">
      <View className="size-20 items-center justify-center rounded-full" style={{ backgroundColor: `${color}20` }}>
        <Text className="font-bold text-3xl" style={{ color }}>
          {symbol.charAt(0)}
        </Text>
      </View>
      <View className="items-center gap-1">
        <Text className="font-bold text-2xl">{name}</Text>
        <View className="rounded-full bg-green-500/10 px-3 py-1">
          <Text className="font-medium text-green-500 text-sm">{apy.toFixed(1)}% APY</Text>
        </View>
      </View>
    </View>
  );
}

function VaultHeaderSkeleton() {
  return (
    <View className="items-center gap-4 py-4">
      <Skeleton className="size-20 rounded-full bg-muted" />
      <View className="items-center gap-2">
        <Skeleton className="h-7 w-40 bg-muted" />
        <Skeleton className="h-6 w-24 rounded-full bg-muted" />
      </View>
    </View>
  );
}

export { VaultHeader, VaultHeaderSkeleton };
export type { VaultHeaderProps };
