import { SparklesIcon } from "lucide-react-native";
import { View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

const HeroSection = () => (
  <View className="items-center gap-6">
    <View className="relative">
      <View className="size-24 items-center justify-center rounded-3xl bg-primary/10">
        <Icon as={SparklesIcon} className="text-primary" size={32} />
      </View>
      <View className="-right-2 -top-2 absolute size-6 items-center justify-center rounded-full bg-primary">
        <Text className="font-bold text-primary-foreground text-xs">Y</Text>
      </View>
    </View>

    <View className="items-center gap-3">
      <Text className="font-bold text-3xl tracking-tight">Welcome to Numu</Text>
      <Text className="text-center text-base text-muted-foreground leading-relaxed">
        Your gateway to YO Protocol vaults on Base. Simple yields, low fees.
      </Text>
    </View>
  </View>
);

export default HeroSection;
