import "@/config/appkit";
import "@/global.css";
import { SplashScreen, Stack } from "expo-router";
import { useColorScheme } from "nativewind";
import { THEME } from "@/lib/theme";
import AppProviders from "@/providers";
import { useAuth } from "@/providers/auth-provider";

SplashScreen.preventAutoHideAsync();

export { ErrorBoundary } from "expo-router";

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const theme = colorScheme ?? "light";

  return (
    <AppProviders theme={theme}>
      <RootNavigator theme={theme} />
    </AppProviders>
  );
}

function RootNavigator({ theme }: { theme: "light" | "dark" }) {
  const { isLocked, isLoading } = useAuth();
  const backgroundColor = THEME[theme].background;

  if (!isLoading) {
    SplashScreen.hide();
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerShadowVisible: false,
        contentStyle: { backgroundColor },
      }}
    >
      <Stack.Protected guard={isLocked}>
        <Stack.Screen name="lock" />
      </Stack.Protected>
      <Stack.Protected guard={!isLocked}>
        <Stack.Screen name="(protected)" />
      </Stack.Protected>
    </Stack>
  );
}
