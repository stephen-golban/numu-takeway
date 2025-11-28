import { VAULTS, type VaultKey } from "@/config/yo-protocol";
import { DEFAULT_APYS, DEFAULT_PRICES, VAULT_COLORS } from "@/lib/defaults";
import type { VaultData } from "./type";

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
