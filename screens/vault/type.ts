import type { VaultConfig, VaultKey } from "@/config/yo-protocol";
import type { VaultActionTab } from "@/typings";

export type VaultScreenParams = {
  vaultKey: VaultKey;
};

export type VaultData = {
  vault: VaultConfig;
  color: string;
  apy: number;
  price: number;
};

// Re-export for backwards compatibility
export type ActiveTab = VaultActionTab;
