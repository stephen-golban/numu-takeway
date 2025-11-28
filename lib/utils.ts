import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Regex for validating number format (digits and at most one decimal point)
const VALID_NUMBER_REGEX = /^\d*\.?\d*$/;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export const formatPercent = (value: number) => {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
};

export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) {
    return "Just now";
  }
  if (diffMins < 60) {
    return `${diffMins}m ago`;
  }
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  return `${diffDays}d ago`;
};

/**
 * Truncates a string (address, tx hash, etc.) showing first and last N characters.
 * @param value The string to truncate
 * @param startChars Number of characters to show at start (default: 6)
 * @param endChars Number of characters to show at end (default: 4)
 */
export const formatTruncated = (value: string, startChars = 6, endChars = 4): string =>
  `${value.slice(0, startChars)}...${value.slice(-endChars)}`;

/**
 * Formats a wallet address for display (0x1234...5678)
 */
export const formatAddress = (address: string): string => formatTruncated(address, 6, 4);

/**
 * Formats a transaction hash for display (0x12345678901234...123456789012)
 */
export const formatTxHash = (hash: string): string => formatTruncated(hash, 16, 12);

/**
 * Validation result for transaction amounts
 */
export type AmountValidation = {
  isValid: boolean;
  error: string | null;
};

/**
 * Validates a transaction amount string.
 * @param amount The amount string to validate
 * @param decimals The number of decimal places allowed for this token
 * @param maxAmount Optional maximum amount (as string) to validate against
 */
export function validateAmount(amount: string, decimals: number, maxAmount?: string): AmountValidation {
  // Empty or whitespace-only
  if (!amount || amount.trim() === "") {
    return { isValid: false, error: null }; // Not an error, just empty
  }

  // Check for valid number format (digits and at most one decimal point)
  if (!VALID_NUMBER_REGEX.test(amount)) {
    return { isValid: false, error: "Invalid number format" };
  }

  const parsed = Number.parseFloat(amount);

  // Check for NaN (shouldn't happen with regex, but safety check)
  if (Number.isNaN(parsed)) {
    return { isValid: false, error: "Invalid number" };
  }

  // Check for zero or negative
  if (parsed <= 0) {
    return { isValid: false, error: "Amount must be greater than zero" };
  }

  // Check decimal places
  const decimalPart = amount.split(".")[1];
  if (decimalPart && decimalPart.length > decimals) {
    return { isValid: false, error: `Maximum ${decimals} decimal places allowed` };
  }

  // Check against maximum amount if provided
  if (maxAmount) {
    const maxParsed = Number.parseFloat(maxAmount);
    if (!Number.isNaN(maxParsed) && parsed > maxParsed) {
      return { isValid: false, error: "Amount exceeds available balance" };
    }
  }

  return { isValid: true, error: null };
}
