import { useAccount, useAppKit } from "@reown/appkit-react-native";
import * as Application from "expo-application";
import { Stack, useRouter } from "expo-router";
import {
  CheckIcon,
  FingerprintIcon,
  InfoIcon,
  LogOutIcon,
  MonitorIcon,
  MoonStarIcon,
  PaletteIcon,
  ShieldIcon,
  SunIcon,
  WalletIcon,
} from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Pressable, ScrollView, View } from "react-native";
import { SettingsRow } from "@/components/settings/settings-row";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";

const SCREEN_OPTIONS = {
  title: "Settings",
  headerBackTitle: "Back",
  headerShadowVisible: false,
  headerLargeTitle: false,
};

type ThemeOption = "light" | "dark" | "system";

const THEME_OPTIONS: {
  value: ThemeOption;
  label: string;
  icon: typeof SunIcon;
}[] = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonStarIcon },
  { value: "system", label: "System", icon: MonitorIcon },
];

export default function SettingsScreen() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { disconnect } = useAppKit();
  const { colorScheme, setColorScheme } = useColorScheme();
  const { isAuthEnabled, isSupported, setAuthEnabled } = useAuth();

  const currentTheme = colorScheme ?? "system";

  function handleDisconnect() {
    disconnect();
    router.back();
  }

  function handleThemeChange(theme: ThemeOption) {
    setColorScheme(theme);
  }

  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS} />
      <ScrollView className="flex-1 bg-background" contentContainerClassName="gap-6 p-4 pb-12">
        {/* Account Section */}
        {isConnected && address && (
          <Card>
            <CardHeader>
              <View className="flex-row items-center gap-2">
                <Icon as={WalletIcon} className="text-muted-foreground" size={18} />
                <CardTitle>Account</CardTitle>
              </View>
              <CardDescription>Connected wallet information</CardDescription>
            </CardHeader>
            <CardContent className="gap-3">
              <View className="rounded-lg bg-muted/50 p-3">
                <Text className="text-muted-foreground text-xs">Wallet Address</Text>
                <Text className="font-mono text-sm">{address}</Text>
              </View>
              <Separator />
              <SettingsRow destructive icon={LogOutIcon} onPress={handleDisconnect} title="Disconnect Wallet" />
            </CardContent>
          </Card>
        )}

        {/* Appearance Section */}
        <Card>
          <CardHeader>
            <View className="flex-row items-center gap-2">
              <Icon as={PaletteIcon} className="text-muted-foreground" size={18} />
              <CardTitle>Appearance</CardTitle>
            </View>
            <CardDescription>Customize how the app looks</CardDescription>
          </CardHeader>
          <CardContent>
            <View className="gap-2">
              {THEME_OPTIONS.map((option) => (
                <ThemeOptionButton
                  icon={option.icon}
                  isSelected={currentTheme === option.value}
                  key={option.value}
                  label={option.label}
                  onPress={() => handleThemeChange(option.value)}
                />
              ))}
            </View>
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card>
          <CardHeader>
            <View className="flex-row items-center gap-2">
              <Icon as={ShieldIcon} className="text-muted-foreground" size={18} />
              <CardTitle>Security</CardTitle>
            </View>
            <CardDescription>Protect your app with biometrics</CardDescription>
          </CardHeader>
          <CardContent>
            <SettingsRow
              description={isSupported ? "Require authentication when opening the app" : "Not available on this device"}
              icon={FingerprintIcon}
              rightElement={
                <BiometricToggle disabled={!isSupported} enabled={isAuthEnabled} onToggle={setAuthEnabled} />
              }
              title="Biometric Lock"
            />
          </CardContent>
        </Card>

        {/* About Section */}
        <Card>
          <CardHeader>
            <View className="flex-row items-center gap-2">
              <Icon as={InfoIcon} className="text-muted-foreground" size={18} />
              <CardTitle>About</CardTitle>
            </View>
          </CardHeader>
          <CardContent className="gap-1">
            <View className="flex-row items-center justify-between py-2">
              <Text className="text-muted-foreground text-sm">App Name</Text>
              <Text className="text-sm">Numu Takeaway</Text>
            </View>
            <Separator />
            <View className="flex-row items-center justify-between py-2">
              <Text className="text-muted-foreground text-sm">Version</Text>
              <Text className="text-sm">{Application.nativeApplicationVersion ?? "1.0.0"}</Text>
            </View>
            <Separator />
            <View className="flex-row items-center justify-between py-2">
              <Text className="text-muted-foreground text-sm">Build</Text>
              <Text className="text-sm">{Application.nativeBuildVersion ?? "1"}</Text>
            </View>
          </CardContent>
        </Card>
      </ScrollView>
    </>
  );
}

type ThemeOptionButtonProps = {
  icon: typeof SunIcon;
  isSelected: boolean;
  label: string;
  onPress: () => void;
};

function ThemeOptionButton({ icon, isSelected, label, onPress }: ThemeOptionButtonProps) {
  return (
    <Pressable
      accessibilityLabel={`${label} theme`}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      className={cn(
        "flex-row items-center justify-between rounded-lg p-3",
        isSelected ? "bg-primary/10" : "bg-muted/30 active:bg-muted/50"
      )}
      onPress={onPress}
    >
      <View className="flex-row items-center gap-3">
        <Icon as={icon} className={isSelected ? "text-primary" : "text-muted-foreground"} size={20} />
        <Text className={cn("text-sm", isSelected && "font-medium text-primary")}>{label}</Text>
      </View>
      {isSelected && <Icon as={CheckIcon} className="text-primary" size={18} />}
    </Pressable>
  );
}

type BiometricToggleProps = {
  disabled: boolean;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
};

function BiometricToggle({ disabled, enabled, onToggle }: BiometricToggleProps) {
  return (
    <Pressable
      accessibilityLabel="Toggle biometric authentication"
      accessibilityRole="switch"
      accessibilityState={{ checked: enabled, disabled }}
      className={cn(
        "h-7 w-12 items-center justify-center rounded-full p-1",
        enabled ? "bg-primary" : "bg-muted",
        disabled && "opacity-50"
      )}
      disabled={disabled}
      onPress={() => onToggle(!enabled)}
    >
      <View className={cn("h-5 w-5 rounded-full bg-background shadow-sm", enabled ? "self-end" : "self-start")} />
    </Pressable>
  );
}
