import type { LucideIcon } from "lucide-react-native";
import { ChevronRightIcon } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type MenuItemProps = {
  icon: LucideIcon;
  label: string;
  value?: string;
  onPress?: () => void;
  variant?: "default" | "destructive" | "success" | "warning";
  showChevron?: boolean;
  rightElement?: React.ReactNode;
};

export function MenuItem({
  icon,
  label,
  value,
  onPress,
  variant = "default",
  showChevron = true,
  rightElement,
}: MenuItemProps) {
  const iconColorClass = {
    default: "text-muted-foreground",
    destructive: "text-destructive",
    success: "text-green-600 dark:text-green-500",
    warning: "text-yellow-600 dark:text-yellow-500",
  }[variant];

  const labelColorClass = {
    default: "text-foreground",
    destructive: "text-destructive",
    success: "text-green-600 dark:text-green-500",
    warning: "text-yellow-600 dark:text-yellow-500",
  }[variant];

  const content = (
    <View className="flex-row items-center py-3">
      {/* Icon */}
      <View className="mr-3 h-9 w-9 items-center justify-center rounded-lg bg-muted">
        <Icon as={icon} className={iconColorClass} size={18} />
      </View>

      {/* Label & Value */}
      <View className="flex-1">
        <Text className={cn("font-medium", labelColorClass)}>{label}</Text>
        {value && <Text className="text-muted-foreground text-xs">{value}</Text>}
      </View>

      {/* Right Element or Chevron */}
      {rightElement ??
        (showChevron && onPress && <Icon as={ChevronRightIcon} className="text-muted-foreground" size={18} />)}
    </View>
  );

  if (onPress) {
    return (
      <Pressable className="active:bg-muted/50" onPress={onPress}>
        {content}
      </Pressable>
    );
  }

  return content;
}

type MenuSectionProps = {
  title: string;
  children: React.ReactNode;
};

export function MenuSection({ title, children }: MenuSectionProps) {
  return (
    <View className="mb-6">
      <Text className="mb-2 px-1 font-medium text-muted-foreground text-xs uppercase tracking-wide">{title}</Text>
      <View className="rounded-xl border border-border bg-card px-3">{children}</View>
    </View>
  );
}

export function MenuDivider() {
  return <View className="h-px bg-border" />;
}
