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

  const getEthersProvider = useCallback(() => {
    if (!provider) {
      return null;
    }
    return new ethers.BrowserProvider(provider as ethers.Eip1193Provider);
  }, [provider]);

  const refreshBalances = useCallback(async () => {
    if (!(isConnected && address)) {
      return;
    }

    const ethersProvider = getEthersProvider();
    if (!ethersProvider) {
      return;
    }

    try {
      setIsLoading(true);
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
  }, [isConnected, address, getEthersProvider]);

  const deposit = useCallback(
    async (amount: string): Promise<void> => {
      if (!address) {
        throw new Error("Wallet not connected");
      }

      const ethersProvider = getEthersProvider();
      if (!ethersProvider) {
        throw new Error("Provider not available");
      }

      setIsLoading(true);
      setError(null);

      try {
        const signer = await ethersProvider.getSigner();
        const service = new YoGatewayService(ethersProvider);

        await service.deposit(signer, amount, address);
        await refreshBalances();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Deposit failed";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [address, getEthersProvider, refreshBalances]
  );

  const withdraw = useCallback(
    async (shares: string): Promise<void> => {
      if (!address) {
        throw new Error("Wallet not connected");
      }

      const ethersProvider = getEthersProvider();
      if (!ethersProvider) {
        throw new Error("Provider not available");
      }

      setIsLoading(true);
      setError(null);

      try {
        const signer = await ethersProvider.getSigner();
        const service = new YoGatewayService(ethersProvider);

        await service.withdraw(signer, shares, address);
        await refreshBalances();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Withdrawal failed";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [address, getEthersProvider, refreshBalances]
  );

  const quoteDeposit = useCallback(
    async (amount: string): Promise<string> => {
      const ethersProvider = getEthersProvider();
      if (!ethersProvider) {
        return "0";
      }

      try {
        const service = new YoGatewayService(ethersProvider);
        return await service.quoteDeposit(amount);
      } catch {
        return "0";
      }
    },
    [getEthersProvider]
  );

  const quoteWithdraw = useCallback(
    async (shares: string): Promise<string> => {
      const ethersProvider = getEthersProvider();
      if (!ethersProvider) {
        return "0";
      }

      try {
        const service = new YoGatewayService(ethersProvider);
        return await service.quoteWithdraw(shares);
      } catch {
        return "0";
      }
    },
    [getEthersProvider]
  );

  // Auto-refresh on connect
  useEffect(() => {
    if (isConnected && address) {
      refreshBalances();
    }
  }, [isConnected, address, refreshBalances]);

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
