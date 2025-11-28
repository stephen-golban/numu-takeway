import { useAccount, useProvider } from "@reown/appkit-react-native";
import { BrowserProvider, Contract, formatUnits, parseUnits } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { ERC20_ABI, PARTNER_ID, VAULTS, type VaultKey, YO_GATEWAY_ABI, YO_GATEWAY_ADDRESS } from "@/config/yo-protocol";
import { SLIPPAGE_DENOMINATOR, SLIPPAGE_TOLERANCE_BPS } from "@/lib/defaults";

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

// Calculate minimum output with slippage tolerance
function applySlippage(amount: bigint): bigint {
  return (amount * (SLIPPAGE_DENOMINATOR - SLIPPAGE_TOLERANCE_BPS)) / SLIPPAGE_DENOMINATOR;
}

// Check and approve token allowance if needed
async function ensureAllowance(tokenContract: Contract, owner: string, spender: string, amount: bigint): Promise<void> {
  const allowance = await tokenContract.allowance(owner, spender);
  if (allowance < amount) {
    const approveTx = await tokenContract.approve(spender, amount);
    await approveTx.wait();
  }
}

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

      const vaultContract = new Contract(vault.address, ERC20_ABI, ethersProvider);
      const assetContract = new Contract(vault.asset.address, ERC20_ABI, ethersProvider);

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
        error: error instanceof Error ? error.message : "Failed to fetch balances",
      }));
    }
  }, [isConnected, address, provider, vault, getEthersProvider]);

  const deposit = useCallback(
    async (amount: string): Promise<boolean> => {
      if (!(isConnected && address && provider)) {
        setTxState({ isLoading: false, error: "Wallet not connected", txHash: null });
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

        // Ensure approval and execute deposit
        const assetContract = new Contract(vault.asset.address, ERC20_ABI, signer);
        await ensureAllowance(assetContract, address, YO_GATEWAY_ADDRESS, assets);

        const gateway = new Contract(YO_GATEWAY_ADDRESS, YO_GATEWAY_ABI, signer);
        const quotedShares = await gateway.quoteConvertToShares(vault.address, assets);
        const minSharesOut = applySlippage(quotedShares);

        const tx = await gateway.deposit(vault.address, assets, minSharesOut, address, PARTNER_ID);
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
        setTxState({ isLoading: false, error: "Wallet not connected", txHash: null });
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

        // Ensure approval and execute withdrawal
        const vaultContract = new Contract(vault.address, ERC20_ABI, signer);
        await ensureAllowance(vaultContract, address, YO_GATEWAY_ADDRESS, sharesAmount);

        const gateway = new Contract(YO_GATEWAY_ADDRESS, YO_GATEWAY_ABI, signer);
        const quotedAssets = await gateway.quoteConvertToAssets(vault.address, sharesAmount);
        const minAssetsOut = applySlippage(quotedAssets);

        const tx = await gateway.redeem(vault.address, sharesAmount, minAssetsOut, address, PARTNER_ID);
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
