export const queryKeys = {
  yoVault: {
    all: ["yo-vault"] as const,
    balances: (address: string | undefined) => [...queryKeys.yoVault.all, "balances", address] as const,
    quoteDeposit: (amount: string) => [...queryKeys.yoVault.all, "quote-deposit", amount] as const,
    quoteWithdraw: (shares: string) => [...queryKeys.yoVault.all, "quote-withdraw", shares] as const,
    apy: (vaultAddress: string) => [...queryKeys.yoVault.all, "apy", vaultAddress] as const,
  },
  yoEthVault: {
    all: ["yo-eth-vault"] as const,
    balances: (address: string | undefined) => [...queryKeys.yoEthVault.all, "balances", address] as const,
    quoteDeposit: (amount: string) => [...queryKeys.yoEthVault.all, "quote-deposit", amount] as const,
    quoteWithdraw: (shares: string) => [...queryKeys.yoEthVault.all, "quote-withdraw", shares] as const,
  },
} as const;
