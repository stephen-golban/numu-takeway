import { useAccount, useAppKit } from "@reown/appkit-react-native";
import * as Application from "expo-application";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import {
  CircleIcon,
  CopyIcon,
  ExternalLinkIcon,
  FingerprintIcon,
  GlobeIcon,
  LogOutIcon,
  NetworkIcon,
  ScanFaceIcon,
  UserCircleIcon,
  WalletIcon,
} from "lucide-react-native";
import { Linking, Pressable, Alert as RNAlert, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Alert } from "@/components/ui/alert";
import { Icon } from "@/components/ui/icon";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { BASE_CHAIN_ID } from "@/lib/appkit/chains";
import { type BiometricType, getBiometricLabel, useBiometricAuth } from "@/providers/biometric-auth";
import { MenuDivider, MenuItem, MenuSection } from "./menu-item";

const NETWORK_NAMES: Record<number, string> = {
  8453: "Base",
  1: "Ethereum",
};

const getNetworkName = (chainId: string | number | undefined): string => {
  if (chainId === undefined) {
    return "Unknown";
  }
  const numericChainId = typeof chainId === "string" ? Number.parseInt(chainId, 10) : chainId;
  return NETWORK_NAMES[numericChainId] ?? "Unknown";
};

const getBiometricIcon = (type: BiometricType) => (type === "faceId" ? ScanFaceIcon : FingerprintIcon);

const truncateAddress = (address: string): string => `${address.slice(0, 6)}...${address.slice(-4)}`;

export default function SettingsScreen() {
  const router = useRouter();
  const { address, chainId } = useAccount();
  const { open, disconnect } = useAppKit();
  const { isAvailable, isEnabled, biometricType, toggleBiometric, isLoading } = useBiometricAuth();

  const isCorrectNetwork = chainId === BASE_CHAIN_ID;

  const handleBiometricToggle = async () => {
    const success = await toggleBiometric();
    if (!(success || isEnabled)) {
      RNAlert.alert("Authentication Failed", "Could not enable biometric authentication. Please try again.");
    }
  };

  const handleDisconnect = () => {
    RNAlert.alert("Disconnect Wallet", "Are you sure you want to disconnect your wallet?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Disconnect",
        style: "destructive",
        onPress: () => {
          disconnect();
          router.replace("/");
        },
      },
    ]);
  };

  const copyAddress = async () => {
    if (address) {
      await Clipboard.setStringAsync(address);
      RNAlert.alert("Copied!", "Wallet address copied to clipboard");
    }
  };

  const openBaseScan = () => {
    if (address) {
      Linking.openURL(`https://basescan.org/address/${address}`);
    }
  };

  const truncatedAddress = address ? truncateAddress(address) : "Not connected";
  const biometricLabel = getBiometricLabel(biometricType);
  const BiometricIcon = getBiometricIcon(biometricType);

  const appVersion = Application.nativeApplicationVersion ?? "1.0.0";

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="mt-16 flex-grow px-4" contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Profile Header */}
        <View className="items-center py-6">
          <View className="mb-3 h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Icon as={UserCircleIcon} className="text-primary" size={48} />
          </View>
          <Text className="font-semibold text-foreground text-lg">My Wallet</Text>
          <Pressable onPress={copyAddress}>
            <Text className="text-center text-muted-foreground text-xs">{address ?? "Not connected"}</Text>
          </Pressable>
        </View>

        {/* Network Warning */}
        {!isCorrectNetwork && (
          <View className="mb-4">
            <Alert message="Please switch to Base Network" variant="warning" />
          </View>
        )}

        {/* Wallet Section */}
        <MenuSection title="Wallet">
          <MenuItem
            icon={WalletIcon}
            label="Address"
            onPress={copyAddress}
            rightElement={<Icon as={CopyIcon} className="text-primary" size={16} />}
            showChevron={false}
            value={truncatedAddress}
          />
          <MenuDivider />
          <MenuItem icon={ExternalLinkIcon} label="View on BaseScan" onPress={openBaseScan} />
        </MenuSection>

        {/* Network Section */}
        <MenuSection title="Network">
          <MenuItem
            icon={GlobeIcon}
            label="Current Network"
            rightElement={
              <View className="flex-row items-center gap-1">
                <Icon as={CircleIcon} className={isCorrectNetwork ? "text-green-500" : "text-destructive"} size={8} />
                <Text className="text-muted-foreground text-sm">{getNetworkName(chainId)}</Text>
              </View>
            }
            showChevron={false}
          />
          <MenuDivider />
          <MenuItem
            icon={NetworkIcon}
            label="Chain ID"
            rightElement={<Text className="text-muted-foreground text-sm">{chainId ?? "N/A"}</Text>}
            showChevron={false}
          />
          {!isCorrectNetwork && (
            <>
              <MenuDivider />
              <MenuItem
                icon={GlobeIcon}
                label="Switch to Base Network"
                onPress={() => open({ view: "Networks" })}
                variant="warning"
              />
            </>
          )}
        </MenuSection>

        {/* Security Section */}
        {isAvailable && (
          <MenuSection title="Security">
            <MenuItem
              icon={BiometricIcon}
              label={biometricLabel}
              onPress={handleBiometricToggle}
              rightElement={
                <Switch
                  accessibilityLabel={`${isEnabled ? "Disable" : "Enable"} ${biometricLabel}`}
                  checked={isEnabled}
                  disabled={isLoading}
                  onCheckedChange={handleBiometricToggle}
                />
              }
              showChevron={false}
              value="Require authentication to unlock the app"
            />
          </MenuSection>
        )}

        {/* Actions Section */}
        <MenuSection title="Account">
          <MenuItem icon={WalletIcon} label="Manage Wallet" onPress={() => open({ view: "Account" })} />
          <MenuDivider />
          <MenuItem icon={LogOutIcon} label="Disconnect Wallet" onPress={handleDisconnect} variant="destructive" />
        </MenuSection>

        {/* App Info */}
        <View className="items-center pt-4 pb-8">
          <Text className="text-muted-foreground text-sm">Numu Takeaway</Text>
          <Text className="text-muted-foreground text-xs">Version {appVersion}</Text>
          <Text className="mt-1 text-muted-foreground text-xs">Powered by YO Protocol</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
