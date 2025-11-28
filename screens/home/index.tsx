import { RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { ActivitySection } from "./activity-section";
import { AssetsSection } from "./assets-section";
import useHomeScreen from "./hook";
import { PortfolioHeader } from "./portfolio-header";
import { QuickActions } from "./quick-actions";

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
        <QuickActions
          isLoading={isLoading}
          onDeposit={handlers.handleVaultPress}
          onWithdraw={handlers.handleVaultPress}
        />
        <AssetsSection isLoading={isLoading} onVaultPress={handlers.handleVaultPress} vaults={vaults} />
        <View className="gap-3 px-4">
          {isLoading ? (
            <Skeleton className="h-5 w-32 bg-muted" />
          ) : (
            <Text className="font-semibold text-lg">Recent Activity</Text>
          )}
          <View className="rounded-2xl bg-card p-4">
            <ActivitySection activities={activities} isLoading={isLoading} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
