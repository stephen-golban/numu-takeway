import {
  ArrowDownToLineIcon,
  ArrowUpFromLineIcon,
  RefreshCwIcon,
  SendIcon,
} from "lucide-react-native";
import { Pressable, View } from "react-native";
import { Icon } from "@/components/ui/icon";
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
      <View
        className={`size-14 items-center justify-center rounded-full bg-primary ${
          disabled ? "opacity-50" : ""
        }`}
      >
        <Icon as={icon} className="text-primary-foreground" size={22} />
      </View>
      <Text className="text-muted-foreground text-xs">{label}</Text>
    </Pressable>
  );
}

type QuickActionsProps = {
  onDeposit: () => void;
  onWithdraw: () => void;
  onSwap?: () => void;
  onSend?: () => void;
  disabled?: boolean;
};

export function QuickActions({
  onDeposit,
  onWithdraw,
  onSwap,
  onSend,
  disabled = false,
}: QuickActionsProps) {
  return (
    <View className="flex-row items-center justify-center gap-8 py-4">
      <QuickAction
        disabled={disabled}
        icon={ArrowDownToLineIcon}
        label="Deposit"
        onPress={onDeposit}
      />
      <QuickAction
        disabled={disabled}
        icon={ArrowUpFromLineIcon}
        label="Withdraw"
        onPress={onWithdraw}
      />
      {onSwap && (
        <QuickAction
          disabled={disabled}
          icon={RefreshCwIcon}
          label="Swap"
          onPress={onSwap}
        />
      )}
      {onSend && (
        <QuickAction
          disabled={disabled}
          icon={SendIcon}
          label="Send"
          onPress={onSend}
        />
      )}
    </View>
  );
}
