import { router } from "expo-router";
import { useCallback, useState } from "react";
import { usePortfolio } from "@/hooks/use-portfolio";
import { DEFAULT_VAULT_KEY, MOCK_ACTIVITIES } from "./util";

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
    activities: MOCK_ACTIVITIES,
    handleRefresh,
    handleVaultPress,
  };
}
