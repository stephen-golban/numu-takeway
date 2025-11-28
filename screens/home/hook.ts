import { router } from "expo-router";
import { useCallback, useState } from "react";
import type { ActivityItem } from "@/components/activity-section";
import { usePortfolio } from "@/hooks/use-portfolio";
import { DEFAULT_VAULT_KEY } from "./util";

// Activities would come from an indexer or transaction history API
// For now, we show empty state since there's no real-time tx history from Reown
const EMPTY_ACTIVITIES: ActivityItem[] = [];

export default function useHomeScreen() {
  const { vaults, totalValue, change24h, changePercent, isLoading, refetch } = usePortfolio();

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

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
    activities: EMPTY_ACTIVITIES,
    handleRefresh,
    handleVaultPress,
  };
}
