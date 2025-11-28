import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { useVault } from "@/hooks/use-vault";
import type { ActiveTab } from "./type";
import { getVaultData } from "./util";

export default function useVaultScreen() {
  const { vaultKey } = useLocalSearchParams<{ vaultKey: string }>();
  const { validVaultKey, vault, color, apy, price } = getVaultData(vaultKey);

  const { shareBalance, assetBalance, isLoading, error, txHash, deposit, withdraw } = useVault(validVaultKey);

  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [activeTab, setActiveTab] = useState<ActiveTab>("deposit");

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
