import { useAccount, useAppKit } from "@reown/appkit-react-native";
import * as Application from "expo-application";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import {
  CircleIcon,
  CopyIcon,
  ExternalLinkIcon,
  GlobeIcon,
  LogOutIcon,
  NetworkIcon,
  UserCircleIcon,
  WalletIcon,
} from "lucide-react-native";
import { Linking, Pressable, Alert as RNAlert, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Alert } from "@/components/ui/alert";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { BASE_CHAIN_ID } from "@/lib/appkit/chains";
import { MenuDivider, MenuItem, MenuSection } from "./menu-item";

export default function SettingsScreen() {
  const router = useRouter();
  const { address, chainId } = useAccount();
  const { open, disconnect } = useAppKit();

  const isCorrectNetwork = chainId === BASE_CHAIN_ID;

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

  const getNetworkName = (id: string | number | undefined): string => {
    if (id === 8453 || id === "8453") {
      return "Base";
    }
    if (id === 1 || id === "1") {
      return "Ethereum";
    }
    return "Unknown";
  };

  const truncatedAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not connected";

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
