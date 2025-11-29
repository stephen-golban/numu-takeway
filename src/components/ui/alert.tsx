import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

const alertVariants = cva("rounded-xl p-4", {
  variants: {
    variant: {
      default: "bg-muted",
      success: "bg-green-500/10",
      destructive: "bg-destructive/10",
      warning: "bg-yellow-500/10",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const alertTextVariants = cva("text-center text-sm", {
  variants: {
    variant: {
      default: "text-foreground",
      success: "text-green-600",
      destructive: "text-destructive",
      warning: "text-yellow-600",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type AlertProps = React.ComponentProps<typeof View> &
  VariantProps<typeof alertVariants> & {
    message: string;
    description?: string;
  };

function Alert({ className, variant, message, description, ...props }: AlertProps) {
  return (
    <View className={cn(alertVariants({ variant }), className)} {...props}>
      <Text className={cn(alertTextVariants({ variant }))}>{message}</Text>
      {description && (
        <Text className={cn(alertTextVariants({ variant }), "mt-1 font-mono text-xs opacity-70")}>{description}</Text>
      )}
    </View>
  );
}

export { Alert, alertVariants };
