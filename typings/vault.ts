import type { VaultKey } from "@/config/yo-protocol";

/**
 * Vault position data with balance and display information.
 * Used for portfolio display and vault listings.
 */
export type VaultPosition = {
  vaultKey: VaultKey;
  symbol: string;
  name: string;
  assetSymbol: string;
  shareBalance: number;
  assetBalance: number;
  usdValue: number;
  apy: number;
  color: string;
  priceChange24h?: number;
};

/**
 * @deprecated Use VaultPosition instead
 */
export type VaultAsset = VaultPosition;

/**
 * @deprecated Use VaultPosition instead
 */
export type VaultBalance = VaultPosition;
