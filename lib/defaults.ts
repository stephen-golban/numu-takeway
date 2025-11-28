import type { VaultKey } from "@/config/yo-protocol";

/**
 * Centralized fallback values for API data.
 * Used when external APIs (CoinGecko, DefiLlama) fail or are unavailable.
 */

// Default token prices in USD
export const DEFAULT_PRICES: Record<string, number> = {
  USDC: 1.0,
  WETH: 3500,
  cbBTC: 97_500,
};

// Default vault APYs (percentage)
export const DEFAULT_APYS: Record<VaultKey, number> = {
  yoUSD: 5.2,
  yoETH: 3.8,
  yoBTC: 4.2,
};

// Vault display colors
export const VAULT_COLORS: Record<VaultKey, string> = {
  yoUSD: "#22c55e", // green
  yoETH: "#3b82f6", // blue
  yoBTC: "#f59e0b", // amber
};

// Transaction settings
export const SLIPPAGE_TOLERANCE_BPS = 100n; // 1% = 100 basis points
export const SLIPPAGE_DENOMINATOR = 10000n;

// API limits
export const TRANSACTION_FETCH_LIMIT = 20;
