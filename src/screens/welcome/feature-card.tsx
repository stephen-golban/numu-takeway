import type { LucideIcon } from "lucide-react-native";
import { View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <View
      accessibilityLabel={`${title}: ${description}`}
      accessibilityRole="text"
      accessible
      className="flex-1 items-center rounded-xl border border-border p-4"
    >
      <Icon as={icon} className="mb-2 text-foreground" size={24} />
      <Text className="font-semibold text-foreground text-sm">{title}</Text>
      <Text className="text-center text-muted-foreground text-xs">{description}</Text>
    </View>
  );
}
