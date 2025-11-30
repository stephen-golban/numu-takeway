import { ArrowDownToLineIcon, ArrowUpFromLineIcon } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type QuickActionsProps = {
  onDeposit: () => void;
  onWithdraw: () => void;
  isLoading?: boolean;
};

type ActionButtonProps = {
  icon: typeof ArrowDownToLineIcon;
  label: string;
  description: string;
  onPress: () => void;
  variant: "deposit" | "withdraw";
};

function ActionButtonSkeleton({ variant }: { variant: "deposit" | "withdraw" }) {
  const isDeposit = variant === "deposit";

  return (
    <View className="flex-1 items-center gap-2 rounded-lg border border-border bg-card p-3 shadow-sm">
      {/* Icon Container */}
      <View
        className={cn("items-center justify-center rounded-full p-2", isDeposit ? "bg-green-500/10" : "bg-blue-500/10")}
      >
        <Skeleton className="h-5 w-5 rounded-full" />
      </View>

      {/* Label */}
      <View className="items-center gap-1">
        <Skeleton className="h-4 w-14 rounded" />
        <Skeleton className="h-3 w-16 rounded" />
      </View>
    </View>
  );
}

function ActionButton({ icon, label, description, onPress, variant }: ActionButtonProps) {
  const isDeposit = variant === "deposit";

  return (
    <Pressable
      className={cn(
        "flex-1 rounded-lg border border-border bg-card p-3 shadow-sm",
        "active:bg-accent dark:active:bg-accent/50",
        "transition-colors"
      )}
      onPress={onPress}
    >
      <View className="items-center gap-2">
        {/* Icon Container */}
        <View
          className={cn(
            "items-center justify-center rounded-full p-2",
            isDeposit ? "bg-green-500/10" : "bg-blue-500/10"
          )}
        >
          <Icon
            as={icon}
            className={cn(
              "size-5",
              isDeposit ? "text-green-600 dark:text-green-500" : "text-blue-600 dark:text-blue-500"
            )}
          />
        </View>

        {/* Label */}
        <View className="items-center gap-0.5">
          <Text className="font-semibold text-foreground text-sm">{label}</Text>
          <Text className="text-center text-muted-foreground text-xs">{description}</Text>
        </View>
      </View>
    </Pressable>
  );
}

export function QuickActions({ onDeposit, onWithdraw, isLoading }: QuickActionsProps) {
  if (isLoading) {
    return (
      <View className="flex-row gap-3 px-4">
        <ActionButtonSkeleton variant="deposit" />
        <ActionButtonSkeleton variant="withdraw" />
      </View>
    );
  }

  return (
    <View className="flex-row gap-3 px-4">
      <ActionButton
        description="Add funds"
        icon={ArrowDownToLineIcon}
        label="Deposit"
        onPress={onDeposit}
        variant="deposit"
      />
      <ActionButton
        description="Remove funds"
        icon={ArrowUpFromLineIcon}
        label="Withdraw"
        onPress={onWithdraw}
        variant="withdraw"
      />
    </View>
  );
}
