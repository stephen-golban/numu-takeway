import { RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivitySection } from "@/components/activity-section";
import { AssetsSection } from "@/components/assets-section";
import { PortfolioHeader } from "@/components/portfolio-header";
import { QuickActions } from "@/components/quick-actions";
import { Text } from "@/components/ui/text";
import useHomeScreen from "./hook";

const HomeScreen = () => {
  const { vaults, totalValue, change24h, changePercent, isLoading, refreshing, activities, ...handlers } =
    useHomeScreen();

  const _refreshControl = <RefreshControl onRefresh={handlers.handleRefresh} refreshing={refreshing} />;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="mt-8 flex-1 gap-6"
        contentContainerClassName="pb-8"
        refreshControl={_refreshControl}
        showsVerticalScrollIndicator={false}
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
