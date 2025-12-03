import { useTransactionForm, useTransactionLogic } from "@/lib/hooks/use-transaction-screen";
import { useDepositEth, useQuoteDepositEth, useYoEthVaultBalances } from "@/lib/tanstack-query";

export function useDepositEthScreen() {
  const { data: balances } = useYoEthVaultBalances();
  const { form, amount } = useTransactionForm();

  const mutation = useDepositEth();
  const quoteQuery = useQuoteDepositEth(amount);

  const balance = balances?.eth ?? "0";

  return useTransactionLogic(
    form,
    {
      balance,
      insufficientBalanceMessage: "Insufficient ETH balance",
      failedMessage: "Deposit failed",
    },
    { mutation, quoteQuery }
  );
}
