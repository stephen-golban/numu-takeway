import { ArrowDownToLineIcon, ArrowUpFromLineIcon } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type QuickActionsProps = {
  onDeposit: () => void;
  onWithdraw: () => void;
};

type ActionButtonProps = {
  icon: typeof ArrowDownToLineIcon;
  label: string;
  description: string;
  onPress: () => void;
  variant: "deposit" | "withdraw";
};

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

export function QuickActions({ onDeposit, onWithdraw }: QuickActionsProps) {
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
