import { VAULTS, type VaultKey } from "@/config/yo-protocol";
import { ASSET_PRICES, VAULT_APY, VAULT_COLORS } from "@/hooks/use-portfolio";
import type { VaultData } from "./type";

export function getVaultData(vaultKey: string | undefined): VaultData & { validVaultKey: VaultKey } {
  const validVaultKey = (vaultKey && vaultKey in VAULTS ? vaultKey : "yoUSD") as VaultKey;
  const vault = VAULTS[validVaultKey];

  return {
    validVaultKey,
    vault,
    color: VAULT_COLORS[validVaultKey],
    apy: VAULT_APY[validVaultKey],
    price: ASSET_PRICES[vault.asset.symbol] || 0,
  };
}

export function formatTxHash(hash: string): string {
  return `${hash.slice(0, 16)}...${hash.slice(-12)}`;
}
