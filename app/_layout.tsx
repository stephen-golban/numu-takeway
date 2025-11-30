import "@walletconnect/react-native-compat";
import "../global.css";

import { useAccount } from "@reown/appkit-react-native";
import { SplashScreen, Stack } from "expo-router";
import Animated, { configureReanimatedLogger, FadeIn, ReanimatedLogLevel } from "react-native-reanimated";
import { useCustomColorScheme } from "@/lib/hooks/use-custom-color-scheme";
import { THEME } from "@/lib/theme";
import AppProviders from "@/providers";
import { useBiometricAuth } from "@/providers/biometric-auth";

configureReanimatedLogger({ level: ReanimatedLogLevel.warn, strict: false });

SplashScreen.preventAutoHideAsync();

export { ErrorBoundary } from "expo-router";

export default function RootLayout() {
  const { colorScheme } = useCustomColorScheme();

  return (
    <AppProviders theme={colorScheme}>
      <RootNavigator theme={colorScheme} />
    </AppProviders>
  );
}

function RootNavigator({ theme }: { theme: "light" | "dark" }) {
  const backgroundColor = THEME[theme].background;
  const { isConnected } = useAccount();
  const { isLocked } = useBiometricAuth();

  const onLayout = () => SplashScreen.hide();

  return (
    <Animated.View className="flex-1 bg-background" entering={FadeIn.duration(300)} onLayout={onLayout}>
      <Stack
        screenOptions={{
          headerShadowVisible: false,
          contentStyle: { backgroundColor },
        }}
      >
        <Stack.Protected guard={!(isConnected || isLocked)}>
          <Stack.Screen name="index" />
        </Stack.Protected>

        <Stack.Protected guard={isLocked}>
          <Stack.Screen name="(modal)/lock" options={{ headerShown: false, animation: "fade" }} />
        </Stack.Protected>

        <Stack.Protected guard={isConnected && !isLocked}>
          <Stack.Screen name="(protected)" options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
    </Animated.View>
  );
}
