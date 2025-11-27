import { WalletIcon } from "lucide-react-native";
import { View } from "react-native";
import { FeatureItem } from "@/components/ui/feature-item";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { WalletButton } from "@/components/wallet/wallet-button";

const DisconnectedView = () => (
  <View className="flex-1 gap-8 px-4 pt-32">
    <View className="items-center gap-4">
      <View className="size-20 items-center justify-center rounded-full bg-primary/10">
        <Icon as={WalletIcon} className="text-primary" size={40} />
      </View>
      <View className="items-center gap-2">
        <Text className="font-bold text-2xl tracking-tight">Welcome to Numu</Text>
        <Text className="max-w-[280px] text-center text-muted-foreground">
          Connect your wallet to access YO Protocol vaults on Base network
        </Text>
      </View>
    </View>
    <View className="items-center">
      <WalletButton />
    </View>
    <View className="gap-4 rounded-2xl bg-card p-6">
      <Text className="font-semibold">Why use Numu?</Text>
      <FeatureItem description="Deposit into yoUSD, yoETH, and yoBTC vaults" title="Earn Yield" />
      <FeatureItem description="Built on Base with low gas fees" title="Low Fees" />
      <FeatureItem description="Powered by YO Protocol smart contracts" title="Secure" />
    </View>
  </View>
);
export default DisconnectedView;
