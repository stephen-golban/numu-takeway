import { useAccount, useProvider } from "@reown/appkit-react-native";
import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { YoGatewayService } from "../service";

export function useYoVault() {
  const { address, isConnected } = useAccount();
  const { provider } = useProvider();

  const [yoUsdBalance, setYoUsdBalance] = useState("0");
  const [usdcBalance, setUsdcBalance] = useState("0");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshBalances = useCallback(async () => {
    if (!(isConnected && address && provider)) {
      return;
    }

    try {
      setIsLoading(true);
      const ethersProvider = new ethers.BrowserProvider(provider);
      const service = new YoGatewayService(ethersProvider);

      const [yoUsd, usdc] = await Promise.all([service.getYoUsdBalance(address), service.getUsdcBalance(address)]);

      setYoUsdBalance(yoUsd);
      setUsdcBalance(usdc);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch balances");
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, address, provider]);

  const deposit = useCallback(
    async (amount: string) => {
      if (!(provider && address)) {
        throw new Error("Wallet not connected");
      }

      setIsLoading(true);
      setError(null);

      try {
        const ethersProvider = new ethers.BrowserProvider(provider);
        const signer = await ethersProvider.getSigner();
        const service = new YoGatewayService(ethersProvider);

        const receipt = await service.deposit(signer, amount, address);
        await refreshBalances();
        return receipt;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Deposit failed";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [provider, address, refreshBalances]
  );

  const withdraw = useCallback(
    async (shares: string) => {
      if (!(provider && address)) {
        throw new Error("Wallet not connected");
      }

      setIsLoading(true);
      setError(null);

      try {
        const ethersProvider = new ethers.BrowserProvider(provider);
        const signer = await ethersProvider.getSigner();
        const service = new YoGatewayService(ethersProvider);

        const receipt = await service.withdraw(signer, shares, address);
        await refreshBalances();
        return receipt;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Withdrawal failed";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [provider, address, refreshBalances]
  );

  const quoteDeposit = useCallback(
    async (amount: string) => {
      if (!provider) {
        return "0";
      }
      const ethersProvider = new ethers.BrowserProvider(provider);
      const service = new YoGatewayService(ethersProvider);
      return await service.quoteDeposit(amount);
    },
    [provider]
  );

  const quoteWithdraw = useCallback(
    async (shares: string) => {
      if (!provider) {
        return "0";
      }
      const ethersProvider = new ethers.BrowserProvider(provider);
      const service = new YoGatewayService(ethersProvider);
      return await service.quoteWithdraw(shares);
    },
    [provider]
  );

  // Auto-refresh on connect
  useEffect(() => {
    if (isConnected) {
      refreshBalances();
    }
  }, [isConnected, refreshBalances]);

  return {
    yoUsdBalance,
    usdcBalance,
    isLoading,
    error,
    deposit,
    withdraw,
    quoteDeposit,
    quoteWithdraw,
    refreshBalances,
  };
}
