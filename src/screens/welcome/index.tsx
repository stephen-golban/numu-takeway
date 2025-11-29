import { Link2Icon, LockIcon, ShieldIcon, TrendingUpIcon, ZapIcon } from "lucide-react-native";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ConnectButton } from "@/components/connect-button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import FeatureCard from "./feature-card";

export default function WelcomeScreen() {
  return (
    <SafeAreaView className="flex-1 justify-center px-6">
      {/* Hero Section */}
      <View className="mb-10 items-center">
        {/* Logo Placeholder */}
        <View className="mb-4 h-20 w-20 items-center justify-center rounded-2xl border-2 border-border border-dashed">
          <Text className="text-muted-foreground text-xs">Logo</Text>
        </View>
        <Text className="mb-2 font-bold text-3xl text-foreground">Numu Takeaway</Text>
        <Text className="text-center text-lg text-muted-foreground">Earn optimized yield on your stablecoins</Text>
      </View>

      {/* Feature Cards */}
      <View className="mb-10 flex-row gap-3">
        <FeatureCard description="Smart strategies" icon={TrendingUpIcon} title="Yields" />
        <FeatureCard description="Non-custodial" icon={ShieldIcon} title="Secure" />
        <FeatureCard description="Easy to use" icon={ZapIcon} title="Simple" />
      </View>

      {/* CTA Section */}
      <View className="mb-10 items-center">
        <ConnectButton />
        <Text className="mt-3 text-muted-foreground text-sm">via Reown</Text>
      </View>

      {/* Trust Badges */}
      <View className="mb-4 flex-row justify-center gap-4">
        <View className="flex-row items-center gap-1">
          <Icon as={LockIcon} className="text-muted-foreground" size={14} />
          <Text className="text-muted-foreground text-sm">Non-custodial</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Icon as={Link2Icon} className="text-muted-foreground" size={14} />
          <Text className="text-muted-foreground text-sm">On-chain</Text>
        </View>
      </View>

      {/* Network Badge */}
      <View className="items-center">
        <Text className="text-muted-foreground text-sm">⚡ Base Network</Text>
      </View>
    </SafeAreaView>
  );
}
