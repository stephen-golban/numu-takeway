import { startTransition, useEffect, useRef, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivitySection } from "@/components/activity-section";
import { AssetsSection } from "@/components/assets-section";
import { PortfolioHeader } from "@/components/portfolio-header";
import { QuickActions } from "@/components/quick-actions";
import { Text } from "@/components/ui/text";
import DisconnectedView from "./disconnected-view";
import useHomeScreen from "./hook";

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

type HomeScreenProps = {
  isConnected: boolean;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ isConnected }) => {
  const { vaults, totalValue, change24h, changePercent, isLoading, refreshing, activities, ...handlers } =
    useHomeScreen();

  const previousConnectedRef = useRef(isConnected);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (previousConnectedRef.current !== isConnected) {
      previousConnectedRef.current = isConnected;
      startTransition(() => {
        setShouldAnimate(true);
      });
    }
  }, [isConnected]);

  const enteringAnimation = shouldAnimate ? FadeIn.duration(300) : undefined;
  const exitingAnimation = shouldAnimate ? FadeOut.duration(200) : undefined;

  const _refreshControl = <RefreshControl onRefresh={handlers.handleRefresh} refreshing={refreshing} />;

  return (
    <SafeAreaView className="flex-1 bg-background">
      {isConnected ? (
        <AnimatedScrollView
          className="flex-1 gap-6 bg-background"
          contentContainerClassName="pb-8"
          entering={enteringAnimation}
          exiting={exitingAnimation}
          refreshControl={_refreshControl}
        >
          <PortfolioHeader
            change24h={change24h}
            changePercent={changePercent}
            isLoading={isLoading}
            totalValue={totalValue}
          />
          <QuickActions onDeposit={handlers.handleVaultPress} onWithdraw={handlers.handleVaultPress} />
          <AssetsSection onVaultPress={handlers.handleVaultPress} vaults={vaults} />
          <View className="gap-3 px-4">
            <Text className="font-semibold text-lg">Recent Activity</Text>
            <View className="rounded-2xl bg-card p-4">
              <ActivitySection activities={activities} />
            </View>
          </View>
        </AnimatedScrollView>
      ) : (
        <Animated.View className="flex-1" entering={enteringAnimation} exiting={exitingAnimation}>
          <DisconnectedView />
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;
