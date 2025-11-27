import { ChartLineIcon, CoinsIcon, ShieldCheckIcon, SparklesIcon } from "lucide-react-native";
import { View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { WalletButton } from "@/components/wallet/wallet-button";

type FeatureRowProps = {
  icon: typeof CoinsIcon;
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

const DisconnectedView = () => (
  <View className="flex-1 justify-center gap-y-20 px-5">
    {/* Hero Section */}
    <View className="items-center gap-8">
      {/* Animated Logo Area */}
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
          <Text className="max-w-[300px] text-center text-base text-muted-foreground leading-relaxed">
            Your gateway to YO Protocol vaults on Base. Simple yields, low fees.
          </Text>
        </View>
      </View>

      {/* CTA Button */}
      <WalletButton />
    </View>

    {/* Features Section */}
    <View className="gap-5">
      <Text className="text-center font-medium text-xl">Why Numu?</Text>
      <View className="mt-4 gap-5">
        <FeatureRow
          description="Deposit into yoUSD, yoETH & yoBTC vaults"
          icon={CoinsIcon}
          iconBg="bg-emerald-500/15"
          iconColor="text-emerald-500"
          title="Earn Yield"
        />
        <FeatureRow
          description="Built on Base with minimal gas costs"
          icon={ChartLineIcon}
          iconBg="bg-blue-500/15"
          iconColor="text-blue-500"
          title="Low Fees"
        />
        <FeatureRow
          description="Audited YO Protocol smart contracts"
          icon={ShieldCheckIcon}
          iconBg="bg-violet-500/15"
          iconColor="text-violet-500"
          title="Secure"
        />
      </View>
    </View>
  </View>
);

export default DisconnectedView;
