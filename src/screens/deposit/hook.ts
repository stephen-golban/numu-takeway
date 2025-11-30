import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useYoVault } from "@/lib/yo-protocol/hooks";
import { type DepositFormValues, depositDefaultValues, depositResolver } from "./schema";

export function useDepositScreen() {
  const router = useRouter();
  const { usdcBalance, deposit, quoteDeposit, isLoading } = useYoVault();

  const [quote, setQuote] = useState("0");
  const [isQuoteLoading, setIsQuoteLoading] = useState(false);

  const form = useForm<DepositFormValues>({
    resolver: depositResolver,
    defaultValues: depositDefaultValues,
    mode: "onChange",
  });

  const amount = form.watch("amount");

  // Debounced quote fetching
  useEffect(() => {
    const fetchQuote = async () => {
      if (!amount || Number.parseFloat(amount) <= 0) {
        setQuote("0");
        setIsQuoteLoading(false);
        return;
      }
      setIsQuoteLoading(true);
      try {
        const result = await quoteDeposit(amount);
        setQuote(result);
      } catch {
        setQuote("0");
      } finally {
        setIsQuoteLoading(false);
      }
    };

    const timer = setTimeout(fetchQuote, 500);
    return () => clearTimeout(timer);
  }, [amount, quoteDeposit]);

  const onSubmit = async (data: DepositFormValues) => {
    if (Number.parseFloat(data.amount) > Number.parseFloat(usdcBalance)) {
      form.setError("amount", { message: "Insufficient USDC balance" });
      return;
    }

    try {
      await deposit(data.amount);
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

  const formattedBalance = Number.parseFloat(usdcBalance).toFixed(2);
  const formattedQuote = Number.parseFloat(quote).toFixed(2);
  const hasQuote = Number.parseFloat(quote) > 0;
  const error = form.formState.errors.amount?.message;

  return {
    form,
    quote: formattedQuote,
    hasQuote,
    isQuoteLoading,
    balance: formattedBalance,
    isLoading,
    error,
    onSubmit: form.handleSubmit(onSubmit),
    setAmount,
    setMaxAmount,
  };
}
