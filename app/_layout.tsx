import "@/config/appkit";
import "@/global.css";

import { ThemeProvider } from "@react-navigation/native";
import { AppKit, AppKitProvider } from "@reown/appkit-react-native";
import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { View } from "react-native";
import { LockScreen } from "@/components/auth/lock-screen";
import { appKit } from "@/config/appkit";
import { useAuth } from "@/hooks/use-auth";
import { NAV_THEME } from "@/lib/theme";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const { isLocked, authenticate } = useAuth();

  return (
    <AppKitProvider instance={appKit}>
      <ThemeProvider value={NAV_THEME[colorScheme ?? "light"]}>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        {isLocked ? (
          <LockScreen onUnlock={authenticate} />
        ) : (
          <>
            <Stack />
            <PortalHost />
            <View
              style={{ position: "absolute", height: "100%", width: "100%" }}
            >
              <AppKit />
            </View>
          </>
        )}
      </ThemeProvider>
    </AppKitProvider>
  );
}
