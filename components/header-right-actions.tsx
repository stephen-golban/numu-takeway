import { useRouter } from "expo-router";
import { MoonStarIcon, SettingsIcon, SunIcon } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { View } from "react-native";
import { Button } from "./ui/button";
import { Icon } from "./ui/icon";

const HeaderRightActions = () => {
  const router = useRouter();
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <View className="flex-row items-center gap-1">
      <Button
        accessibilityLabel="Toggle theme"
        accessibilityRole="button"
        className="ios:size-9 rounded-full"
        onPressIn={toggleColorScheme}
        size="icon"
        variant="ghost"
      >
        <Icon as={colorScheme === "dark" ? MoonStarIcon : SunIcon} className="size-5 text-foreground" />
      </Button>
      <Button
        accessibilityLabel="Open settings"
        accessibilityRole="button"
        className="ios:size-9 rounded-full"
        onPress={() => router.push("/settings")}
        size="icon"
        variant="ghost"
      >
        <Icon as={SettingsIcon} className="size-5 text-foreground" />
      </Button>
    </View>
  );
};

export { HeaderRightActions };
