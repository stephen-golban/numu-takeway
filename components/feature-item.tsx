import { View } from "react-native";

import { Text } from "@/components/ui/text";

type FeatureItemProps = {
  title: string;
  description: string;
};

const FeatureItem: React.FC<FeatureItemProps> = ({ title, description }) => (
  <View className="flex-row items-start gap-3">
    <View className="mt-1 size-2 rounded-full bg-primary" />
    <View className="flex-1">
      <Text className="font-medium">{title}</Text>
      <Text className="text-muted-foreground text-sm">{description}</Text>
    </View>
  </View>
);

export { FeatureItem };
