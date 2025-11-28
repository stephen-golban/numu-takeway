import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type DataRowProps = {
  label: string;
  value: string;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
};

function DataRow({ label, value, className, labelClassName, valueClassName }: DataRowProps) {
  return (
    <View className={cn("flex-row items-center justify-between py-1", className)}>
      <Text className={cn("text-muted-foreground text-sm", labelClassName)}>{label}</Text>
      <Text className={cn("font-medium text-sm", valueClassName)}>{value}</Text>
    </View>
  );
}

export { DataRow };
