import { BlurView } from "expo-blur";
import { AlertTriangleIcon, LoaderIcon, type LucideIcon, SparklesIcon, WalletIcon } from "lucide-react-native";
import { memo, useMemo } from "react";
import { View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type FormFeedbackVariant = "deposit" | "withdraw";

type FormFeedbackProps = {
  variant?: FormFeedbackVariant;
  quote: string;
  hasQuote: boolean;
  isQuoteLoading?: boolean;
  receiveLabel: string;
  error?: string;
};

type VariantStyle = {
  container: string;
  icon: LucideIcon | undefined;
  iconColor: string;
};

const VARIANT_STYLES: Record<FormFeedbackVariant, VariantStyle> = {
  deposit: {
    container: "bg-green-500/10",
    icon: SparklesIcon,
    iconColor: "text-green-600",
  },
  withdraw: {
    container: "bg-blue-500/10",
    icon: WalletIcon,
    iconColor: "text-blue-600",
  },
};

const ICON_SIZE = 20;
const BASE_CONTAINER_STYLES = "my-3 h-16 flex-row items-center justify-between rounded-2xl p-5";

function ErrorContent({ message }: { message: string }) {
  return (
    <Animated.View
      className="absolute inset-0 flex-row items-center gap-3 px-5"
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(150)}
    >
      <Icon as={AlertTriangleIcon} className="text-destructive" size={ICON_SIZE} />
      <Text className="flex-1 text-destructive">{message}</Text>
    </Animated.View>
  );
}

function QuoteContent({
  isLoading,
  quote,
  receiveLabel,
  variantStyle,
}: {
  isLoading: boolean;
  quote: string;
  receiveLabel: string;
  variantStyle: VariantStyle;
}) {
  const iconElement = isLoading ? (
    <Icon as={LoaderIcon} className={cn("animate-spin", variantStyle.iconColor)} key="loader" size={ICON_SIZE} />
  ) : (
    variantStyle.icon && (
      <Icon as={variantStyle.icon} className={cn("animate-none", variantStyle.iconColor)} key="icon" size={ICON_SIZE} />
    )
  );

  const valueElement = (
    <View className="relative">
      <Text className="font-bold text-foreground text-xl">~{quote}</Text>
      {isLoading && (
        <BlurView
          intensity={30}
          style={{ position: "absolute", top: -8, left: -12, right: -12, bottom: -8 }}
          tint="regular"
        />
      )}
    </View>
  );

  return (
    <Animated.View
      className="absolute inset-0 flex-row items-center justify-between px-5"
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(150)}
    >
      <View className="shrink flex-row items-center gap-3">
        {iconElement}
        <Text className="shrink text-muted-foreground" numberOfLines={1}>
          {receiveLabel}
        </Text>
      </View>
      {valueElement}
    </Animated.View>
  );
}

export const FormFeedback = memo(function FormFeedbackComponent({
  variant = "deposit",
  quote,
  hasQuote,
  isQuoteLoading = false,
  receiveLabel,
  error,
}: FormFeedbackProps) {
  const variantStyle = VARIANT_STYLES[variant];
  const showQuote = hasQuote || isQuoteLoading;

  const containerStyle = useMemo(() => {
    if (error) {
      return "bg-destructive/10";
    }
    if (showQuote) {
      return variantStyle.container;
    }
    return "bg-transparent";
  }, [error, showQuote, variantStyle.container]);

  return (
    <View className={cn(BASE_CONTAINER_STYLES, containerStyle)}>
      {error && <ErrorContent key="error" message={error} />}
      {!error && showQuote && (
        <QuoteContent
          isLoading={isQuoteLoading}
          key="quote"
          quote={quote}
          receiveLabel={receiveLabel}
          variantStyle={variantStyle}
        />
      )}
    </View>
  );
});
