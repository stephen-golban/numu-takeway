import { View } from "react-native";
import { Text } from "@/components/ui/text";

type NetworkBadgeProps = {
  name: string;
  isConnected: boolean;
};

const NetworkBadge: React.FC<NetworkBadgeProps> = ({ name, isConnected }) => (
  <View className="flex-row items-center gap-2 rounded-full bg-transparent px-3 py-1.5">
    <View className={`size-2 rounded-full ${isConnected ? "bg-green-500" : "bg-muted-foreground/50"}`} />
    <Text className="font-medium text-muted-foreground text-xs">{name}</Text>
  </View>
);

export { NetworkBadge };
