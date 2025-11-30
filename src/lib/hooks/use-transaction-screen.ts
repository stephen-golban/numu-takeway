import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import type { Control } from "react-hook-form";
import { useForm } from "react-hook-form";
import { type AmountFormValues, amountDefaultValues, amountResolver } from "@/lib/schemas/amount";

type TransactionConfig = {
  balance: string;
  insufficientBalanceMessage: string;
  failedMessage: string;
};

type TransactionHooks = {
  mutation: UseMutationResult<void, Error, string>;
  quoteQuery: UseQueryResult<string, Error>;
};

/**
 * Hook to create and manage the transaction form.
 * Returns the form control and watched amount for use with quote hooks.
 */
export function useTransactionForm() {
  const form = useForm<AmountFormValues>({
    resolver: amountResolver,
    defaultValues: amountDefaultValues,
    mode: "onChange",
  });

  const amount = form.watch("amount");

  return { form, amount };
}

/**
 * Hook factory for deposit/withdraw transaction screens.
 * Handles form submission, validation, and state management.
 */
export function useTransactionLogic(
  form: ReturnType<typeof useForm<AmountFormValues>>,
  config: TransactionConfig,
  hooks: TransactionHooks
) {
  const router = useRouter();
  const { mutation, quoteQuery } = hooks;
  const { balance, insufficientBalanceMessage, failedMessage } = config;

  const onSubmit = async (data: AmountFormValues) => {
    if (Number.parseFloat(data.amount) > Number.parseFloat(balance)) {
      form.setError("amount", { message: insufficientBalanceMessage });
      return;
    }

    try {
      await mutation.mutateAsync(data.amount);
      router.back();
    } catch (err) {
      form.setError("amount", {
        message: err instanceof Error ? err.message : failedMessage,
      });
    }
  };

  const setAmount = (value: string) => {
    form.setValue("amount", value, { shouldValidate: true });
  };

  const setMaxAmount = () => {
    setAmount(balance);
  };

  const quote = quoteQuery.data ?? "0";
  const formattedBalance = Number.parseFloat(balance).toFixed(2);
  const formattedQuote = Number.parseFloat(quote).toFixed(2);
  const hasQuote = Number.parseFloat(quote) > 0;
  const error = form.formState.errors.amount?.message;

  return {
    control: form.control as Control<{ amount: string }>,
    isValid: form.formState.isValid,
    quote: formattedQuote,
    hasQuote,
    isQuoteLoading: quoteQuery.isFetching,
    balance: formattedBalance,
    isLoading: mutation.isPending,
    error,
    onSubmit: form.handleSubmit(onSubmit),
    setAmount,
    setMaxAmount,
  };
}
