export type { VaultAsset } from "./vault";

/**
 * Transaction activity type for vault deposits and withdrawals.
 */
export type TransactionType = "deposit" | "withdraw";

/**
 * Parsed transaction from blockchain history.
 * Used for displaying activity feeds.
 */
export type Transaction = {
  id: string;
  type: TransactionType;
  amount: string;
  symbol: string;
  timestamp: Date;
  txHash: string;
};

/**
 * Tab selection for vault action forms.
 */
export type VaultActionTab = "deposit" | "withdraw";
