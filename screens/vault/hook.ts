import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useVault } from "@/hooks/use-vault";
import { fetchTokenPrices, fetchVaultAPYs } from "@/lib/api";
import type { ActiveTab } from "./type";
import { getVaultData } from "./util";

type PriceData = Record<string, { price: number; change24h: number }>;
type APYData = Record<string, number>;

export default function useVaultScreen() {
  const { vaultKey } = useLocalSearchParams<{ vaultKey: string }>();
  const [prices, setPrices] = useState<PriceData | undefined>(undefined);
  const [apys, setApys] = useState<APYData | undefined>(undefined);

  const { validVaultKey, vault, color, apy, price } = getVaultData(vaultKey, prices, apys);
  const { shareBalance, assetBalance, isLoading, error, txHash, deposit, withdraw } = useVault(validVaultKey);

  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [activeTab, setActiveTab] = useState<ActiveTab>("deposit");

  const loadData = useCallback(async () => {
    const [priceData, apyData] = await Promise.all([fetchTokenPrices(), fetchVaultAPYs()]);
    setPrices(priceData);
    setApys(apyData);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const shareBalanceNum = Number.parseFloat(shareBalance);
  const usdValue = shareBalanceNum * price;

  async function handleDeposit() {
    if (!depositAmount || Number.parseFloat(depositAmount) <= 0) {
      return;
    }
    const success = await deposit(depositAmount);
    if (success) {
      setDepositAmount("");
    }
  }

  async function handleWithdraw() {
    if (!withdrawAmount || Number.parseFloat(withdrawAmount) <= 0) {
      return;
    }
    const success = await withdraw(withdrawAmount);
    if (success) {
      setWithdrawAmount("");
    }
  }

  return {
    vault,
    color,
    apy,
    shareBalanceNum,
    usdValue,
    assetBalance,
    isLoading,
    error,
    txHash,
    activeTab,
    depositAmount,
    withdrawAmount,
    setActiveTab,
    setDepositAmount,
    setWithdrawAmount,
    handleDeposit,
    handleWithdraw,
  };
}
