import { RefreshControl, ScrollView, View } from "react-native";
import { ActivitySection } from "@/components/activity-section";
import { AssetsSection } from "@/components/assets-section";
import { PortfolioHeader } from "@/components/portfolio-header";
import { QuickActions } from "@/components/quick-actions";
import { Text } from "@/components/ui/text";
import DisconnectedView from "./disconnected-view";
import useHomeScreen from "./hook";

type HomeScreenProps = {
  isConnected: boolean;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ isConnected }) => {
  const { vaults, totalValue, change24h, changePercent, isLoading, refreshing, activities, ...handlers } =
    useHomeScreen();

  const _refreshControl = <RefreshControl onRefresh={handlers.handleRefresh} refreshing={refreshing} />;

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="pb-8" refreshControl={_refreshControl}>
      {isConnected ? (
        <View className="gap-6 pt-24">
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
        </View>
      ) : (
        <DisconnectedView />
      )}
    </ScrollView>
  );
};

export default HomeScreen;
