import { useAccount, useProvider } from "@reown/appkit-react-native";
import { BrowserProvider, Contract, formatUnits } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { ERC20_ABI, VAULTS, type VaultKey } from "@/config/yo-protocol";

// Mock APY data - in production this would come from an API
const VAULT_APY: Record<VaultKey, number> = {
  yoUSD: 5.2,
  yoETH: 3.8,
  yoBTC: 4.2,
};

// Mock prices - in production this would come from a price oracle
const ASSET_PRICES: Record<string, number> = {
  USDC: 1.0,
  WETH: 3500.0,
  cbBTC: 97_500.0,
};

// Vault display colors
const VAULT_COLORS: Record<VaultKey, string> = {
  yoUSD: "#22c55e", // green
  yoETH: "#3b82f6", // blue
  yoBTC: "#f59e0b", // amber
};

type VaultBalance = {
  vaultKey: VaultKey;
  symbol: string;
  name: string;
  assetSymbol: string;
  shareBalance: number;
  assetBalance: number;
  usdValue: number;
  apy: number;
  color: string;
};

type PortfolioState = {
  vaults: VaultBalance[];
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

      const vaultKeys = Object.keys(VAULTS) as VaultKey[];
      const balancePromises = vaultKeys.map(async (vaultKey) => {
        const vault = VAULTS[vaultKey];
        const vaultContract = new Contract(vault.address, ERC20_ABI, ethersProvider);

        const shareBalanceRaw = await vaultContract.balanceOf(address);
        const shareBalance = Number.parseFloat(formatUnits(shareBalanceRaw, vault.decimals));

        // For simplicity, we're using share balance as asset balance
        // In production, you'd convert shares to assets using the vault's exchange rate
        const assetBalance = shareBalance;
        const price = ASSET_PRICES[vault.asset.symbol] || 0;
        const usdValue = assetBalance * price;

        return {
          vaultKey,
          symbol: vault.symbol,
          name: vault.name,
          assetSymbol: vault.asset.symbol,
          shareBalance,
          assetBalance,
          usdValue,
          apy: VAULT_APY[vaultKey],
          color: VAULT_COLORS[vaultKey],
        };
      });

      const vaults = await Promise.all(balancePromises);
      const totalValue = vaults.reduce((sum, v) => sum + v.usdValue, 0);

      // Mock 24h change - in production this would be calculated from historical data
      const change24h = totalValue * 0.0192; // Mock +1.92% change
      const changePercent = 1.92;

      setState({
        vaults,
        totalValue,
        change24h,
        changePercent,
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

export { VAULT_APY, ASSET_PRICES, VAULT_COLORS };
