import type { ActivityItem } from "@/components/activity-section";

// Mock activity data - in production this would come from transaction history
export const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: "1",
    type: "deposit",
    amount: "100",
    symbol: "USDC",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: "2",
    type: "withdraw",
    amount: "0.5",
    symbol: "ETH",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: "3",
    type: "deposit",
    amount: "0.01",
    symbol: "BTC",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  },
];

export const DEFAULT_VAULT_KEY = "yoUSD";

export function formatVaultCount(count: number): string {
  return `${count} vault${count !== 1 ? "s" : ""}`;
}
