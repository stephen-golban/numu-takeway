import { BanknoteArrowDownIcon, LoaderIcon, SendIcon } from "lucide-react-native";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

type SubmitButtonVariant = "deposit" | "withdraw";

type SubmitButtonProps = {
  variant?: SubmitButtonVariant;
  isLoading: boolean;
  isValid: boolean;
  onPress: () => void;
};

const variantStyles = {
  deposit: {
    backgroundColor: "bg-green-600",
    label: "Deposit",
    icon: BanknoteArrowDownIcon,
  },
  withdraw: {
    backgroundColor: "bg-blue-600",
    label: "Withdraw",
    icon: SendIcon,
  },
};

export function SubmitButton({ variant = "deposit", isLoading, isValid, onPress }: SubmitButtonProps) {
  const styles = variantStyles[variant];

  return (
    <View className="pb-8">
      <Button
        className={`h-16 w-full rounded-full ${styles.backgroundColor}`}
        disabled={isLoading || !isValid}
        onPress={onPress}
        size="lg"
      >
        <Icon
          as={isLoading ? LoaderIcon : styles.icon}
          className={isLoading ? "animate-spin" : "animate-none"}
          color="white"
          key={isLoading ? "loader" : "icon"}
          size={22}
        />
        <Text className="font-bold text-lg text-white">{styles.label}</Text>
      </Button>
    </View>
  );
}
