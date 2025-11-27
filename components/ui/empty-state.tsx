import type { LucideIcon } from "lucide-react-native";
import { View } from "react-native";

import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

type EmptyStateProps = {
  icon: LucideIcon;
  message: string;
  iconSize?: number;
};

const EmptyState: React.FC<EmptyStateProps> = ({ icon, message, iconSize = 32 }) => (
  <View accessibilityLabel={message} accessibilityRole="text" className="items-center gap-3 rounded-2xl bg-card p-8">
    <Icon as={icon} className="text-muted-foreground" size={iconSize} />
    <Text className="text-center text-muted-foreground text-sm">{message}</Text>
  </View>
);

export { EmptyState };
