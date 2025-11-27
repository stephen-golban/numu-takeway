import type { LucideIcon } from "lucide-react-native";
import { ChevronRightIcon } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type SettingsRowProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  rightElement?: React.ReactNode;
  onPress?: () => void;
  showChevron?: boolean;
  destructive?: boolean;
};

export function SettingsRow({
  icon,
  title,
  description,
  rightElement,
  onPress,
  showChevron = false,
  destructive = false,
}: SettingsRowProps) {
  const content = (
    <View className="flex-row items-center gap-3 py-3">
      {icon && (
        <Icon
          as={icon}
          className={cn(
            "text-muted-foreground",
            destructive && "text-destructive"
          )}
          size={20}
        />
      )}
      <View className="flex-1">
        <Text className={cn("text-sm", destructive && "text-destructive")}>
          {title}
        </Text>
        {description && (
          <Text className="text-muted-foreground text-xs">{description}</Text>
        )}
      </View>
      {rightElement}
      {showChevron && (
        <Icon
          as={ChevronRightIcon}
          className="text-muted-foreground"
          size={18}
        />
      )}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityHint={description}
        accessibilityLabel={title}
        accessibilityRole="button"
        className="active:opacity-70"
        onPress={onPress}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}
