import "@walletconnect/react-native-compat";
import "../global.css";

import { SplashScreen, Stack } from "expo-router";
import { useColorScheme } from "nativewind";
import Animated, { FadeIn } from "react-native-reanimated";
import { THEME } from "@/lib/theme";
import AppProviders from "@/providers";

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
  const backgroundColor = THEME[theme].background;

  const onLayout = () => SplashScreen.hide();

  return (
    <Animated.View className="flex-1 bg-background" entering={FadeIn.duration(300)} onLayout={onLayout}>
      <Stack
        screenOptions={{
          headerShadowVisible: false,
          contentStyle: { backgroundColor },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
        <Stack.Screen name="vault" options={{ headerShown: false }} />
      </Stack>
    </Animated.View>
  );
}
