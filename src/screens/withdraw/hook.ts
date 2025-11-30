import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { useQuoteWithdraw, useWithdraw, useYoVaultBalances } from "@/lib/tanstack-query";
import { type WithdrawFormValues, withdrawDefaultValues, withdrawResolver } from "./schema";

export function useWithdrawScreen() {
  const router = useRouter();
  const { data: balances } = useYoVaultBalances();
  const withdrawMutation = useWithdraw();

  const form = useForm<WithdrawFormValues>({
    resolver: withdrawResolver,
    defaultValues: withdrawDefaultValues,
    mode: "onChange",
  });

  const amount = form.watch("amount");
  const quoteQuery = useQuoteWithdraw(amount);

  const yoUsdBalance = balances?.yoUsd ?? "0";

  const onSubmit = async (data: WithdrawFormValues) => {
    if (Number.parseFloat(data.amount) > Number.parseFloat(yoUsdBalance)) {
      form.setError("amount", { message: "Insufficient yoUSD balance" });
      return;
    }

    try {
      await withdrawMutation.mutateAsync(data.amount);
      router.back();
    } catch (err) {
      form.setError("amount", {
        message: err instanceof Error ? err.message : "Withdrawal failed",
      });
    }
  };

  const setAmount = (value: string) => {
    form.setValue("amount", value, { shouldValidate: true });
  };

  const setMaxAmount = () => {
    setAmount(yoUsdBalance);
  };

  const quote = quoteQuery.data ?? "0";
  const formattedBalance = Number.parseFloat(yoUsdBalance).toFixed(2);
  const formattedQuote = Number.parseFloat(quote).toFixed(2);
  const hasQuote = Number.parseFloat(quote) > 0;
  const error = form.formState.errors.amount?.message;

  return {
    control: form.control,
    isValid: form.formState.isValid,
    quote: formattedQuote,
    hasQuote,
    isQuoteLoading: quoteQuery.isFetching,
    balance: formattedBalance,
    isLoading: withdrawMutation.isPending,
    error,
    onSubmit: form.handleSubmit(onSubmit),
    setAmount,
    setMaxAmount,
  };
}
