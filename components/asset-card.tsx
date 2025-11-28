import { ChevronRightIcon } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { formatCurrency } from "@/lib/utils";

type AssetCardProps = {
  symbol: string;
  name: string;
  balance: string;
  usdValue: number;
  apy: number;
  color: string;
  onPress?: () => void;
};

const AssetCard: React.FC<AssetCardProps> = ({ symbol, name, balance, usdValue, apy, color, onPress }) => {
  return (
    <Pressable
      accessibilityLabel={`${name} vault with ${balance} balance`}
      accessibilityRole="button"
      className="flex-row items-center gap-4 rounded-2xl bg-card p-4 active:opacity-80"
      onPress={onPress}
    >
      {/* Token Icon */}
      <View className="size-12 items-center justify-center rounded-full" style={{ backgroundColor: `${color}20` }}>
        <Text className="font-bold text-lg" style={{ color }}>
          {symbol.charAt(0)}
        </Text>
      </View>

      {/* Token Info */}
      <View className="flex-1 gap-0.5">
        <View className="flex-row items-center gap-2">
          <Text className="font-semibold">{name}</Text>
          <View className="rounded-full bg-green-500/10 px-2 py-0.5">
            <Text className="font-medium text-green-500 text-xs">{apy.toFixed(1)}% APY</Text>
          </View>
        </View>
        <Text className="text-muted-foreground text-sm">
          {balance} {symbol}
        </Text>
      </View>

      {/* USD Value */}
      <View className="items-end gap-0.5">
        <Text className="font-semibold">{formatCurrency(usdValue)}</Text>
        <Icon as={ChevronRightIcon} className="text-muted-foreground" size={16} />
      </View>
    </Pressable>
  );
};

export { AssetCard };
