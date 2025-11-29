/**
 * Header components for use with Stack.Screen options.
 * Use these with headerLeft/headerRight in screenOptions or individual Stack.Screen options.
 */

import { MoonStarIcon, SunIcon } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Button } from "./ui/button";
import { Icon } from "./ui/icon";

const ThemeToggle = () => {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Button
      accessibilityLabel={`Switch to ${isDark ? "light" : "dark"} theme`}
      accessibilityRole="button"
      onPressIn={toggleColorScheme}
      size="icon"
      variant="ghost"
    >
      <Icon as={isDark ? MoonStarIcon : SunIcon} className="size-4 text-foreground" />
    </Button>
  );
};

export { ThemeToggle };
