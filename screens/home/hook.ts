import { useAccount } from "@reown/appkit-react-native";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { usePortfolio } from "@/hooks/use-portfolio";
import { fetchTransactionHistory } from "@/lib/api";
import type { ActivityItem } from "./activity-section";
import { DEFAULT_VAULT_KEY } from "./util";

export default function useHomeScreen() {
  const { address, isConnected } = useAccount();
  const { vaults, totalValue, change24h, changePercent, isLoading, refetch } = usePortfolio();

  const [refreshing, setRefreshing] = useState(false);
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  const loadActivities = useCallback(async () => {
    if (!(isConnected && address)) {
      setActivities([]);
      return;
    }
    const txHistory = await fetchTransactionHistory(address);
    setActivities(txHistory);
  }, [isConnected, address]);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetch(), loadActivities()]);
    setRefreshing(false);
  }, [refetch, loadActivities]);

  function handleVaultPress(vaultKey: string = DEFAULT_VAULT_KEY) {
    router.push(`/vault/${vaultKey}`);
  }

  return {
    vaults,
    totalValue,
    change24h,
    changePercent,
    isLoading,
    refreshing,
    activities,
    handleRefresh,
    handleVaultPress,
  };
}
