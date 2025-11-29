import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const withdrawSchema = z.object({
  amount: z
    .string()
    .min(1, "Enter an amount")
    .refine((val) => !Number.isNaN(Number.parseFloat(val)), "Enter a valid number")
    .refine((val) => Number.parseFloat(val) > 0, "Amount must be greater than 0"),
});

export type WithdrawFormValues = z.infer<typeof withdrawSchema>;

export const withdrawResolver = zodResolver(withdrawSchema);

export const withdrawDefaultValues: WithdrawFormValues = {
  amount: "",
};
