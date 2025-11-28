export const DEFAULT_VAULT_KEY = "yoUSD";

export function formatVaultCount(count: number): string {
  return `${count} vault${count !== 1 ? "s" : ""}`;
}
