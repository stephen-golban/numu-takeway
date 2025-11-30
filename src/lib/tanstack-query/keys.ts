export const queryKeys = {
  yoVault: {
    all: ["yo-vault"] as const,
    balances: (address: string | undefined) => [...queryKeys.yoVault.all, "balances", address] as const,
    quoteDeposit: (amount: string) => [...queryKeys.yoVault.all, "quote-deposit", amount] as const,
    quoteWithdraw: (shares: string) => [...queryKeys.yoVault.all, "quote-withdraw", shares] as const,
  },
} as const;
