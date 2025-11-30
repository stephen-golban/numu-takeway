import { useTransactionForm, useTransactionLogic } from "@/lib/hooks/use-transaction-screen";
import { useDeposit, useQuoteDeposit, useYoVaultBalances } from "@/lib/tanstack-query";

export function useDepositScreen() {
  const { data: balances } = useYoVaultBalances();
  const { form, amount } = useTransactionForm();

  const mutation = useDeposit();
  const quoteQuery = useQuoteDeposit(amount);

  const balance = balances?.usdc ?? "0";

  return useTransactionLogic(
    form,
    {
      balance,
      insufficientBalanceMessage: "Insufficient USDC balance",
      failedMessage: "Deposit failed",
    },
    { mutation, quoteQuery }
  );
}
