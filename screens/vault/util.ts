import { VAULTS, type VaultKey } from "@/config/yo-protocol";
import { VAULT_COLORS } from "@/hooks/use-portfolio";
import type { VaultData } from "./type";

// Default prices as fallback
const DEFAULT_PRICES: Record<string, number> = {
  USDC: 1.0,
  WETH: 3500,
  cbBTC: 97_500,
};

// Default APYs as fallback
const DEFAULT_APYS: Record<VaultKey, number> = {
  yoUSD: 5.2,
  yoETH: 3.8,
  yoBTC: 4.2,
};

export function getVaultData(
  vaultKey: string | undefined,
  prices?: Record<string, { price: number; change24h: number }>,
  apys?: Record<string, number>
): VaultData & { validVaultKey: VaultKey } {
  const validVaultKey = (vaultKey && vaultKey in VAULTS ? vaultKey : "yoUSD") as VaultKey;
  const vault = VAULTS[validVaultKey];
  const price = prices?.[vault.asset.symbol]?.price ?? DEFAULT_PRICES[vault.asset.symbol] ?? 0;
  const apy = apys?.[validVaultKey] ?? DEFAULT_APYS[validVaultKey];

  return {
    validVaultKey,
    vault,
    color: VAULT_COLORS[validVaultKey],
    apy,
    price,
  };
}

export function formatTxHash(hash: string): string {
  return `${hash.slice(0, 16)}...${hash.slice(-12)}`;
}
