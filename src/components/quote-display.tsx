import { LoaderIcon, SparklesIcon } from "lucide-react-native";
import { View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type QuoteDisplayVariant = "deposit" | "withdraw";

type QuoteDisplayProps = {
  variant?: QuoteDisplayVariant;
  quote: string;
  hasQuote: boolean;
  isQuoteLoading?: boolean;
  receiveLabel: string;
};

const variantStyles = {
  deposit: {
    container: "bg-green-500/10",
    icon: SparklesIcon,
    iconColor: "text-green-600",
    labelColor: "text-muted-foreground",
    amountColor: "text-foreground",
  },
  withdraw: {
    container: "bg-muted/50",
    icon: undefined,
    iconColor: "",
    labelColor: "text-muted-foreground",
    amountColor: "text-foreground",
  },
};

export function QuoteDisplay({
  variant = "deposit",
  quote,
  hasQuote,
  isQuoteLoading = false,
  receiveLabel,
}: QuoteDisplayProps) {
  const styles = variantStyles[variant];

  if (!hasQuote) {
    return null;
  }

  return (
    <View
      className={cn(
        "mb-6 rounded-2xl p-5",
        styles.container,
        variant === "deposit" && "flex-row items-center justify-between"
      )}
    >
      {variant === "deposit" ? (
        <>
          <View className="flex-row items-center gap-3">
            {isQuoteLoading ? (
              <Icon as={LoaderIcon} className={cn("animate-spin", styles.iconColor)} size={20} />
            ) : (
              styles.icon && <Icon as={styles.icon} className={styles.iconColor} size={20} />
            )}
            <Text className={styles.labelColor}>{receiveLabel}</Text>
          </View>
          {isQuoteLoading ? (
            <View className="h-6 w-20 animate-pulse rounded bg-muted" />
          ) : (
            <Text className={cn("font-bold text-xl", styles.amountColor)}>~{quote}</Text>
          )}
        </>
      ) : (
        <>
          <Text className={cn("mb-2", styles.labelColor)}>{receiveLabel}</Text>
          {isQuoteLoading ? (
            <View className="h-8 w-32 animate-pulse rounded bg-muted" />
          ) : (
            <Text className={cn("font-bold text-2xl", styles.amountColor)}>{quote}</Text>
          )}
        </>
      )}
    </View>
  );
}
