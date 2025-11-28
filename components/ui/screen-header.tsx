import { useAccount, useAppKit } from "@reown/appkit-react-native";
import { MoonStarIcon, SunIcon, WalletIcon } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { View } from "react-native";
import { SettingsDialog } from "@/components/settings-dialog";
import { Button } from "./button";
import { Icon } from "./icon";

/**
 * Header components for use with Stack.Screen options.
 * Use these with headerLeft/headerRight in screenOptions or individual Stack.Screen options.
 */

function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Button
      accessibilityLabel={`Switch to ${isDark ? "light" : "dark"} theme`}
      accessibilityRole="button"
      onPressIn={toggleColorScheme}
      size="icon"
      variant="ghost"
    >
      <Icon as={isDark ? MoonStarIcon : SunIcon} className="size-5 text-foreground" />
    </Button>
  );
}

/**
 * Compact wallet button for header. Opens AppKit modal for wallet management/disconnect.
 */
function WalletButton() {
  const { open } = useAppKit();
  const { isConnected } = useAccount();

  return (
    <Button
      accessibilityHint="Tap to manage wallet connection"
      accessibilityLabel="Wallet"
      accessibilityRole="button"
      onPress={() => open()}
      size="icon"
      variant="ghost"
    >
      <View className="relative">
        <Icon as={WalletIcon} className="size-5 text-foreground" />
        {isConnected && <View className="-right-0.5 -top-0.5 absolute size-2 rounded-full bg-green-500" />}
      </View>
    </Button>
  );
}

/**
 * Combined header right actions with theme toggle, settings, and wallet button.
 */
function HeaderRight() {
  const { isConnected } = useAccount();

  return (
    <View className="flex-row items-center gap-1">
      <ThemeToggle />
      {isConnected && (
        <>
          <SettingsDialog />
          <WalletButton />
        </>
      )}
    </View>
  );
}

export { ThemeToggle, WalletButton, HeaderRight };
