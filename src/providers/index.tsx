import { ThemeProvider } from "@react-navigation/native";
import { AppKit, AppKitProvider } from "@reown/appkit-react-native";
import { PortalHost } from "@rn-primitives/portal";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context";
import { appKit } from "@/lib/appkit";
import { NAV_THEME } from "@/lib/theme";

type AppProvidersProps = React.PropsWithChildren<{
  theme: "light" | "dark";
}>;

const AppProviders: React.FC<AppProvidersProps> = ({ children, theme }) => {
  const statusBarStyle = theme === "dark" ? "light" : "dark";

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
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
    </SafeAreaProvider>
  );
};

export default AppProviders;
