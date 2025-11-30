import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { useDeposit, useQuoteDeposit, useYoVaultBalances } from "@/lib/tanstack-query";
import { type DepositFormValues, depositDefaultValues, depositResolver } from "./schema";

export function useDepositScreen() {
  const router = useRouter();
  const { data: balances } = useYoVaultBalances();
  const depositMutation = useDeposit();

  const form = useForm<DepositFormValues>({
    resolver: depositResolver,
    defaultValues: depositDefaultValues,
    mode: "onChange",
  });

  const amount = form.watch("amount");
  const quoteQuery = useQuoteDeposit(amount);

  const usdcBalance = balances?.usdc ?? "0";

  const onSubmit = async (data: DepositFormValues) => {
    if (Number.parseFloat(data.amount) > Number.parseFloat(usdcBalance)) {
      form.setError("amount", { message: "Insufficient USDC balance" });
      return;
    }

    try {
      await depositMutation.mutateAsync(data.amount);
      router.back();
    } catch (err) {
      form.setError("amount", {
        message: err instanceof Error ? err.message : "Deposit failed",
      });
    }
  };

  const setAmount = (value: string) => {
    form.setValue("amount", value, { shouldValidate: true });
  };

  const setMaxAmount = () => {
    setAmount(usdcBalance);
  };

  const quote = quoteQuery.data ?? "0";
  const formattedBalance = Number.parseFloat(usdcBalance).toFixed(2);
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
    isLoading: depositMutation.isPending,
    error,
    onSubmit: form.handleSubmit(onSubmit),
    setAmount,
    setMaxAmount,
  };
}
