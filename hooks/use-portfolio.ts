import { useAccount, useProvider } from "@reown/appkit-react-native";
import { BrowserProvider, Contract, formatUnits } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { ERC20_ABI, VAULTS, type VaultKey } from "@/config/yo-protocol";
import { fetchTokenPrices, fetchVaultAPYs } from "@/lib/api";
import { VAULT_COLORS } from "@/lib/defaults";
import type { VaultPosition } from "@/typings";

type PortfolioState = {
  vaults: VaultPosition[];
  totalValue: number;
  change24h: number;
  changePercent: number;
  isLoading: boolean;
  error: string | null;
};

export function usePortfolio() {
  const { address, isConnected } = useAccount();
  const { provider } = useProvider();

  const [state, setState] = useState<PortfolioState>({
    vaults: [],
    totalValue: 0,
    change24h: 0,
    changePercent: 0,
    isLoading: false,
    error: null,
  });

  const getEthersProvider = useCallback(() => {
    if (!provider) {
      return null;
    }
    return new BrowserProvider(provider);
  }, [provider]);

  const fetchPortfolio = useCallback(async () => {
    if (!(isConnected && address && provider)) {
      setState({
        vaults: [],
        totalValue: 0,
        change24h: 0,
        changePercent: 0,
        isLoading: false,
        error: null,
      });
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const ethersProvider = getEthersProvider();
      if (!ethersProvider) {
        throw new Error("No provider available");
      }

      // Fetch real-time prices and APYs in parallel
      const [prices, apys] = await Promise.all([fetchTokenPrices(), fetchVaultAPYs()]);

      const vaultKeys = Object.keys(VAULTS) as VaultKey[];
      const balancePromises = vaultKeys.map(async (vaultKey) => {
        const vault = VAULTS[vaultKey];
        const vaultContract = new Contract(vault.address, ERC20_ABI, ethersProvider);

        const shareBalanceRaw = await vaultContract.balanceOf(address);
        const shareBalance = Number.parseFloat(formatUnits(shareBalanceRaw, vault.decimals));

        // For simplicity, we're using share balance as asset balance
        // In production, you'd convert shares to assets using the vault's exchange rate
        const assetBalance = shareBalance;
        const priceData = prices[vault.asset.symbol] || { price: 0, change24h: 0 };
        const usdValue = assetBalance * priceData.price;

        return {
          vaultKey,
          symbol: vault.symbol,
          name: vault.name,
          assetSymbol: vault.asset.symbol,
          shareBalance,
          assetBalance,
          usdValue,
          apy: apys[vaultKey] ?? 0,
          color: VAULT_COLORS[vaultKey],
          priceChange24h: priceData.change24h,
        };
      });

      const vaults = await Promise.all(balancePromises);
      const totalValue = vaults.reduce((sum, v) => sum + v.usdValue, 0);

      // Calculate weighted average 24h change based on portfolio composition
      const weightedChange =
        totalValue > 0 ? vaults.reduce((sum, v) => sum + (v.usdValue / totalValue) * v.priceChange24h, 0) : 0;
      const change24h = (totalValue * weightedChange) / 100;

      setState({
        vaults,
        totalValue,
        change24h,
        changePercent: weightedChange,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to fetch portfolio",
      }));
    }
  }, [isConnected, address, provider, getEthersProvider]);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  return {
    ...state,
    refetch: fetchPortfolio,
  };
}
