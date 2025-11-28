import { ArrowDownToLineIcon, ArrowUpFromLineIcon, RefreshCwIcon, SendIcon } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";

type QuickActionProps = {
  icon: typeof ArrowDownToLineIcon;
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

function QuickAction({ icon, label, onPress, disabled }: QuickActionProps) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      className="items-center gap-2"
      disabled={disabled}
      onPress={onPress}
    >
      <View className={`size-14 items-center justify-center rounded-full bg-primary ${disabled ? "opacity-50" : ""}`}>
        <Icon as={icon} className="text-primary-foreground" size={22} />
      </View>
      <Text className="text-muted-foreground text-xs">{label}</Text>
    </Pressable>
  );
}

function QuickActionSkeleton() {
  return (
    <View className="items-center gap-2">
      <Skeleton className="size-14 rounded-full bg-muted" />
      <Skeleton className="h-3 w-12 bg-muted" />
    </View>
  );
}

type QuickActionsProps = {
  onDeposit: () => void;
  onWithdraw: () => void;
  onSwap?: () => void;
  onSend?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
};

function QuickActions({
  onDeposit,
  onWithdraw,
  onSwap,
  onSend,
  disabled = false,
  isLoading = false,
}: QuickActionsProps) {
  if (isLoading) {
    return (
      <View className="flex-row items-center justify-center gap-8 py-4">
        <QuickActionSkeleton />
        <QuickActionSkeleton />
      </View>
    );
  }

  return (
    <View className="flex-row items-center justify-center gap-8 py-4">
      <QuickAction disabled={disabled} icon={ArrowDownToLineIcon} label="Deposit" onPress={onDeposit} />
      <QuickAction disabled={disabled} icon={ArrowUpFromLineIcon} label="Withdraw" onPress={onWithdraw} />
      {onSwap && <QuickAction disabled={disabled} icon={RefreshCwIcon} label="Swap" onPress={onSwap} />}
      {onSend && <QuickAction disabled={disabled} icon={SendIcon} label="Send" onPress={onSend} />}
    </View>
  );
}

export { QuickActions };
export type { QuickActionsProps };
