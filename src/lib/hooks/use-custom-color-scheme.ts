import { useColorScheme as useNativeColorScheme } from "nativewind";

export function useCustomColorScheme() {
  const { colorScheme, ...rest } = useNativeColorScheme();
  const isDark = colorScheme === "dark";

  return {
    colorScheme: (isDark ? "dark" : "light") as "light" | "dark",
    isDark,
    ...rest,
  };
}
