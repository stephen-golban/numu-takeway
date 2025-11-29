import "@walletconnect/react-native-compat";
import "@/global.css";

import { Slot, SplashScreen, Stack } from "expo-router";
import { useColorScheme } from "nativewind";
import { View } from "react-native";
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
    <View onLayout={onLayout} style={{ flex: 1, backgroundColor }}>
      <Stack
        screenOptions={{
          headerShadowVisible: false,
          contentStyle: { backgroundColor },
        }}
      >
        <Slot />
      </Stack>
    </View>
  );
}
