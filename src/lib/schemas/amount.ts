import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const amountSchema = z.object({
  amount: z
    .string()
    .min(1, "Enter an amount")
    .refine((val) => !Number.isNaN(Number.parseFloat(val)), "Enter a valid number")
    .refine((val) => Number.parseFloat(val) > 0, "Amount must be greater than 0"),
});

export type AmountFormValues = z.infer<typeof amountSchema>;

export const amountResolver = zodResolver(amountSchema);

export const amountDefaultValues: AmountFormValues = {
  amount: "",
};
