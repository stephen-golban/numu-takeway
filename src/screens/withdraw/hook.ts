import { useTransactionForm, useTransactionLogic } from "@/lib/hooks/use-transaction-screen";
import { useQuoteWithdraw, useWithdraw, useYoVaultBalances } from "@/lib/tanstack-query";

export function useWithdrawScreen() {
  const { data: balances } = useYoVaultBalances();
  const { form, amount } = useTransactionForm();

  const mutation = useWithdraw();
  const quoteQuery = useQuoteWithdraw(amount);

  const balance = balances?.yoUsd ?? "0";

  return useTransactionLogic(
    form,
    {
      balance,
      insufficientBalanceMessage: "Insufficient yoUSD balance",
      failedMessage: "Withdrawal failed",
    },
    { mutation, quoteQuery }
  );
}
