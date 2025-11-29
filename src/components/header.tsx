import type { ExtendedStackNavigationOptions } from "expo-router/build/layouts/StackClient";
import { View } from "react-native";
import { NAV_THEME } from "@/lib/theme";
import { ConnectButton } from "./connect-button";
import { NetworkBadge } from "./network-badge";
import { ThemeToggle } from "./theme-toggle";

export const createHeaderLeft = (isConnected: boolean, showNetworkBadge = false) => {
  if (showNetworkBadge) {
    return <NetworkBadge isConnected={isConnected} name="Base" />;
  }
  return;
};

export const createHeaderRight = (isConnected: boolean) => (
  <View className="flex-row items-center gap-1">
    <ThemeToggle />
    {isConnected && <ConnectButton />}
  </View>
);

type HeaderConfigProps = {
  title?: string;
  isDark: boolean;
  isConnected: boolean;
  showNetworkBadge?: boolean;
};

export const createHeaderConfig = ({ title, isDark, isConnected, showNetworkBadge = false }: HeaderConfigProps) =>
  ({
    title,
    headerTransparent: true,
    headerBackTitleStyle: { fontSize: 14 },
    headerBlurEffect: isDark ? undefined : "light",
    headerRight: () => createHeaderRight(isConnected),
    headerLeft: () => createHeaderLeft(isConnected, showNetworkBadge),
    headerStyle: isDark ? { backgroundColor: NAV_THEME.dark.colors.background } : undefined,
  }) as ExtendedStackNavigationOptions;
