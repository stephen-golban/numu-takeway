import "@/config/appkit";
import "@/global.css";
import { useAccount } from "@reown/appkit-react-native";
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
  const { isConnected } = useAccount();
  const backgroundColor = THEME[theme].background;

  if (!isLoading) {
    SplashScreen.hide();
  }

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        contentStyle: { backgroundColor },
      }}
    >
      <Stack.Protected guard={isLocked}>
        <Stack.Screen name="auth" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!(isLocked || isConnected)}>
        <Stack.Screen name="welcome" />
      </Stack.Protected>
      <Stack.Protected guard={!isLocked && isConnected}>
        <Stack.Screen name="(protected)" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}
