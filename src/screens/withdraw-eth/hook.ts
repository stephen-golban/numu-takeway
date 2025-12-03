import { useTransactionForm, useTransactionLogic } from "@/lib/hooks/use-transaction-screen";
import { useQuoteWithdrawEth, useWithdrawEth, useYoEthVaultBalances } from "@/lib/tanstack-query";

export function useWithdrawEthScreen() {
  const { data: balances } = useYoEthVaultBalances();
  const { form, amount } = useTransactionForm();

  const mutation = useWithdrawEth();
  const quoteQuery = useQuoteWithdrawEth(amount);

  const balance = balances?.yoEth ?? "0";

  return useTransactionLogic(
    form,
    {
      balance,
      insufficientBalanceMessage: "Insufficient yoETH balance",
      failedMessage: "Withdrawal failed",
    },
    { mutation, quoteQuery }
  );
}
