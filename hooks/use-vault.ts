import { useAccount, useProvider } from "@reown/appkit-react-native";
import { BrowserProvider, Contract, formatUnits, parseUnits } from "ethers";
import { useCallback, useEffect, useState } from "react";
import {
  ERC20_ABI,
  PARTNER_ID,
  VAULTS,
  type VaultKey,
  YO_GATEWAY_ABI,
  YO_GATEWAY_ADDRESS,
} from "@/config/yo-protocol";

type VaultState = {
  shareBalance: string;
  assetBalance: string;
  isLoading: boolean;
  error: string | null;
};

type TransactionState = {
  isLoading: boolean;
  error: string | null;
  txHash: string | null;
};

export function useVault(vaultKey: VaultKey = "yoUSD") {
  const { address, isConnected } = useAccount();
  const { provider } = useProvider();
  const vault = VAULTS[vaultKey];

  const [state, setState] = useState<VaultState>({
    shareBalance: "0",
    assetBalance: "0",
    isLoading: false,
    error: null,
  });

  const [txState, setTxState] = useState<TransactionState>({
    isLoading: false,
    error: null,
    txHash: null,
  });

  const getEthersProvider = useCallback(() => {
    if (!provider) {
      return null;
    }
    return new BrowserProvider(provider);
  }, [provider]);

  const fetchBalances = useCallback(async () => {
    if (!(isConnected && address && provider)) {
      setState((prev) => ({ ...prev, shareBalance: "0", assetBalance: "0" }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const ethersProvider = getEthersProvider();
      if (!ethersProvider) {
        throw new Error("No provider available");
      }

      const vaultContract = new Contract(
        vault.address,
        ERC20_ABI,
        ethersProvider
      );
      const assetContract = new Contract(
        vault.asset.address,
        ERC20_ABI,
        ethersProvider
      );

      const [shareBalanceRaw, assetBalanceRaw] = await Promise.all([
        vaultContract.balanceOf(address),
        assetContract.balanceOf(address),
      ]);

      setState({
        shareBalance: formatUnits(shareBalanceRaw, vault.decimals),
        assetBalance: formatUnits(assetBalanceRaw, vault.asset.decimals),
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch balances",
      }));
    }
  }, [isConnected, address, provider, vault, getEthersProvider]);

  const deposit = useCallback(
    async (amount: string): Promise<boolean> => {
      if (!(isConnected && address && provider)) {
        setTxState({
          isLoading: false,
          error: "Wallet not connected",
          txHash: null,
        });
        return false;
      }

      setTxState({ isLoading: true, error: null, txHash: null });

      try {
        const ethersProvider = getEthersProvider();
        if (!ethersProvider) {
          throw new Error("No provider available");
        }

        const signer = await ethersProvider.getSigner();
        const assets = parseUnits(amount, vault.asset.decimals);

        // Check and approve allowance
        const assetContract = new Contract(
          vault.asset.address,
          ERC20_ABI,
          signer
        );
        const allowance = await assetContract.allowance(
          address,
          YO_GATEWAY_ADDRESS
        );

        if (allowance < assets) {
          const approveTx = await assetContract.approve(
            YO_GATEWAY_ADDRESS,
            assets
          );
          await approveTx.wait();
        }

        // Get quote and deposit
        const gateway = new Contract(
          YO_GATEWAY_ADDRESS,
          YO_GATEWAY_ABI,
          signer
        );
        const quotedShares = await gateway.quoteConvertToShares(
          vault.address,
          assets
        );
        const minSharesOut = (quotedShares * 99n) / 100n; // 1% slippage

        const tx = await gateway.deposit(
          vault.address,
          assets,
          minSharesOut,
          address,
          PARTNER_ID
        );
        const receipt = await tx.wait();

        setTxState({ isLoading: false, error: null, txHash: receipt.hash });
        await fetchBalances();
        return true;
      } catch (error) {
        setTxState({
          isLoading: false,
          error: error instanceof Error ? error.message : "Deposit failed",
          txHash: null,
        });
        return false;
      }
    },
    [isConnected, address, provider, vault, getEthersProvider, fetchBalances]
  );

  const withdraw = useCallback(
    async (shares: string): Promise<boolean> => {
      if (!(isConnected && address && provider)) {
        setTxState({
          isLoading: false,
          error: "Wallet not connected",
          txHash: null,
        });
        return false;
      }

      setTxState({ isLoading: true, error: null, txHash: null });

      try {
        const ethersProvider = getEthersProvider();
        if (!ethersProvider) {
          throw new Error("No provider available");
        }

        const signer = await ethersProvider.getSigner();
        const sharesAmount = parseUnits(shares, vault.decimals);

        // Check and approve share allowance
        const vaultContract = new Contract(vault.address, ERC20_ABI, signer);
        const allowance = await vaultContract.allowance(
          address,
          YO_GATEWAY_ADDRESS
        );

        if (allowance < sharesAmount) {
          const approveTx = await vaultContract.approve(
            YO_GATEWAY_ADDRESS,
            sharesAmount
          );
          await approveTx.wait();
        }

        // Get quote and redeem
        const gateway = new Contract(
          YO_GATEWAY_ADDRESS,
          YO_GATEWAY_ABI,
          signer
        );
        const quotedAssets = await gateway.quoteConvertToAssets(
          vault.address,
          sharesAmount
        );
        const minAssetsOut = (quotedAssets * 99n) / 100n; // 1% slippage

        const tx = await gateway.redeem(
          vault.address,
          sharesAmount,
          minAssetsOut,
          address,
          PARTNER_ID
        );
        const receipt = await tx.wait();

        setTxState({ isLoading: false, error: null, txHash: receipt.hash });
        await fetchBalances();
        return true;
      } catch (error) {
        setTxState({
          isLoading: false,
          error: error instanceof Error ? error.message : "Withdrawal failed",
          txHash: null,
        });
        return false;
      }
    },
    [isConnected, address, provider, vault, getEthersProvider, fetchBalances]
  );

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  return {
    vault,
    ...state,
    ...txState,
    deposit,
    withdraw,
    refetch: fetchBalances,
  };
}
