import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { useColorScheme } from "nativewind";
import { NAV_THEME } from "./theme";

export function useHeaderOptions(title?: string): NativeStackNavigationOptions {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return {
    title,
    headerTransparent: true,
    headerBlurEffect: isDark ? undefined : "light",
    headerStyle: isDark ? { backgroundColor: NAV_THEME.dark.colors.background } : undefined,
  };
}
