import { ThemeProvider } from "@react-navigation/native";
import { AppKit, AppKitProvider } from "@reown/appkit-react-native";
import { PortalHost } from "@rn-primitives/portal";
import { QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View } from "react-native";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context";
import { appKit } from "@/lib/appkit";
import { queryClient } from "@/lib/tanstack-query";
import { NAV_THEME } from "@/lib/theme";
import AppActivityProvider from "./app-activity";
import { BiometricAuthProvider } from "./biometric-auth";

/**
 * Suppress WalletConnect "session_request without listeners" errors.
 * This occurs when the app is locked and WalletConnect tries to emit
 * events to screens that are unmounted. It's safe to ignore.
 */
function useWalletConnectErrorSuppressor() {
  useEffect(() => {
    const originalConsoleError = console.error;
    console.error = (...args: unknown[]) => {
      const hasSessionRequestError = args.some((arg) => {
        if (typeof arg === "string") {
          return arg.includes("session_request") && arg.includes("without any listeners");
        }
        if (arg instanceof Error) {
          return arg.message.includes("session_request") && arg.message.includes("without any listeners");
        }
        return false;
      });

      if (hasSessionRequestError) {
        return;
      }
      originalConsoleError.apply(console, args);
    };

    return () => {
      console.error = originalConsoleError;
    };
  }, []);
}

type AppProvidersProps = React.PropsWithChildren<{
  theme: "light" | "dark";
}>;

const AppProviders: React.FC<AppProvidersProps> = ({ children, theme }) => {
  const statusBarStyle = theme === "dark" ? "light" : "dark";

  useWalletConnectErrorSuppressor();

  return (
    <BiometricAuthProvider>
      <AppActivityProvider>
        <QueryClientProvider client={queryClient}>
          <SafeAreaProvider initialMetrics={initialWindowMetrics}>
            <KeyboardProvider>
              <AppKitProvider instance={appKit}>
                <ThemeProvider value={NAV_THEME[theme]}>
                  <StatusBar style={statusBarStyle} />
                  {children}
                  <PortalHost />
                  <View pointerEvents="box-none" style={{ position: "absolute", height: "100%", width: "100%" }}>
                    <AppKit />
                  </View>
                </ThemeProvider>
              </AppKitProvider>
            </KeyboardProvider>
          </SafeAreaProvider>
        </QueryClientProvider>
      </AppActivityProvider>
    </BiometricAuthProvider>
  );
};

export default AppProviders;
