import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useYoVault } from "@/lib/yo-protocol/hooks";
import { type WithdrawFormValues, withdrawDefaultValues, withdrawResolver } from "./schema";

export const PERCENTAGE_OPTIONS = [25, 50, 75, 100] as const;

export function useWithdrawScreen() {
  const router = useRouter();
  const { yoUsdBalance, withdraw, quoteWithdraw, isLoading } = useYoVault();

  const [quote, setQuote] = useState("0");

  const form = useForm<WithdrawFormValues>({
    resolver: withdrawResolver,
    defaultValues: withdrawDefaultValues,
    mode: "onChange",
  });

  const amount = form.watch("amount");

  // Debounced quote fetching
  useEffect(() => {
    const fetchQuote = async () => {
      if (!amount || Number.parseFloat(amount) <= 0) {
        setQuote("0");
        return;
      }
      try {
        const result = await quoteWithdraw(amount);
        setQuote(result);
      } catch {
        setQuote("0");
      }
    };

    const timer = setTimeout(fetchQuote, 500);
    return () => clearTimeout(timer);
  }, [amount, quoteWithdraw]);

  const onSubmit = async (data: WithdrawFormValues) => {
    if (Number.parseFloat(data.amount) > Number.parseFloat(yoUsdBalance)) {
      form.setError("amount", { message: "Insufficient yoUSD balance" });
      return;
    }

    try {
      await withdraw(data.amount);
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

  const setPercentage = (pct: number) => {
    const value = (Number.parseFloat(yoUsdBalance) * pct) / 100;
    setAmount(value.toFixed(2));
  };

  const formattedBalance = Number.parseFloat(yoUsdBalance).toFixed(2);
  const formattedQuote = Number.parseFloat(quote).toFixed(2);
  const hasQuote = Number.parseFloat(quote) > 0;
  const error = form.formState.errors.amount?.message;

  return {
    form,
    quote: formattedQuote,
    hasQuote,
    balance: formattedBalance,
    isLoading,
    error,
    onSubmit: form.handleSubmit(onSubmit),
    setAmount,
    setPercentage,
  };
}
