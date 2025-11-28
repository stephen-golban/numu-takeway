import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WalletButton } from "@/components/wallet-button";
import { FeatureRow, HeroSection } from "./components";
import { FEATURES } from "./data";

const WelcomeScreen = () => (
  <SafeAreaView className="flex-1 bg-background" edges={["bottom", "top"]}>
    <View className="flex-1 justify-center gap-y-20 px-5">
      {/* Hero Section */}
      <View className="items-center gap-8">
        <HeroSection />
        <WalletButton />
      </View>

      {/* Features Section */}
      <View className="gap-5">
        <View className="mt-4 gap-5">
          {FEATURES.map((feature) => (
            <FeatureRow key={feature.title} {...feature} />
          ))}
        </View>
      </View>
    </View>
  </SafeAreaView>
);

export default WelcomeScreen;
