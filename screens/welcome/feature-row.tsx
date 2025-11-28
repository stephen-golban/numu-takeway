import type { LucideIcon } from "lucide-react-native";
import { View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

type FeatureRowProps = {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
};

const FeatureRow = ({ icon, iconBg, iconColor, title, description }: FeatureRowProps) => (
  <View className="flex-row items-center gap-4">
    <View className={`size-11 items-center justify-center rounded-xl ${iconBg}`}>
      <Icon as={icon} className={iconColor} size={22} />
    </View>
    <View className="flex-1 gap-0.5">
      <Text className="font-semibold">{title}</Text>
      <Text className="text-muted-foreground text-sm">{description}</Text>
    </View>
  </View>
);

export default FeatureRow;
