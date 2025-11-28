import type { VaultConfig, VaultKey } from "@/config/yo-protocol";

export type VaultScreenParams = {
  vaultKey: VaultKey;
};

export type VaultData = {
  vault: VaultConfig;
  color: string;
  apy: number;
  price: number;
};

export type ActiveTab = "deposit" | "withdraw";
