import { useAccount, useAppKit } from "@reown/appkit-react-native";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import { Alert, Linking, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const router = useRouter();
  const { address, chainId } = useAccount();
  const { open, disconnect } = useAppKit();

  const handleDisconnect = () => {
    Alert.alert("Disconnect Wallet", "Are you sure you want to disconnect your wallet?", [
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
      Alert.alert("Copied", "Wallet address copied to clipboard");
    }
  };

  const openBaseScan = () => {
    if (address) {
      Linking.openURL(`https://basescan.org/address/${address}`);
    }
  };

  const getNetworkName = (id: number | undefined) => {
    switch (id) {
      case 8453:
        return "Base";
      case 1:
        return "Ethereum";
      default:
        return "Unknown";
    }
  };

  const isCorrectNetwork = chainId === 8453;

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center border-border border-b px-4 py-3">
        <TouchableOpacity className="mr-4" onPress={() => router.back()}>
          <Text className="text-foreground text-lg">← Back</Text>
        </TouchableOpacity>
        <Text className="font-semibold text-foreground text-xl">Settings</Text>
      </View>

      <View className="flex-1 px-4 py-6">
        {/* Wallet Section */}
        <Text className="mb-2 text-muted text-sm uppercase">Wallet</Text>
        <View className="mb-6 rounded-2xl border border-border bg-card">
          <TouchableOpacity className="border-border border-b p-4" onPress={copyAddress}>
            <Text className="mb-1 text-muted text-sm">Address</Text>
            <View className="flex-row items-center justify-between">
              <Text className="font-mono text-foreground">
                {address ? `${address.slice(0, 10)}...${address.slice(-8)}` : "Not connected"}
              </Text>
              <Text className="text-primary">📋 Copy</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="p-4" onPress={openBaseScan}>
            <Text className="text-primary">View on BaseScan →</Text>
          </TouchableOpacity>
        </View>

        {/* Network Section */}
        <Text className="mb-2 text-muted text-sm uppercase">Network</Text>
        <View className="mb-6 rounded-2xl border border-border bg-card">
          <View className="border-border border-b p-4">
            <Text className="mb-1 text-muted text-sm">Current Network</Text>
            <View className="flex-row items-center">
              <Text className={`mr-2 ${isCorrectNetwork ? "text-success" : "text-error"}`}>●</Text>
              <Text className="font-medium text-foreground">{getNetworkName(chainId as number | undefined)}</Text>
            </View>
          </View>

          <View className="border-border border-b p-4">
            <Text className="mb-1 text-muted text-sm">Chain ID</Text>
            <Text className="text-foreground">{chainId || "N/A"}</Text>
          </View>

          {!isCorrectNetwork && (
            <TouchableOpacity className="p-4" onPress={() => open({ view: "Networks" })}>
              <Text className="font-medium text-error">⚠️ Switch to Base Network</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Actions */}
        <Text className="mb-2 text-muted text-sm uppercase">Actions</Text>
        <View className="mb-6 rounded-2xl border border-border bg-card">
          <TouchableOpacity className="border-border border-b p-4" onPress={() => open({ view: "Account" })}>
            <Text className="text-foreground">Manage Wallet</Text>
          </TouchableOpacity>

          <TouchableOpacity className="p-4" onPress={handleDisconnect}>
            <Text className="font-medium text-error">🔴 Disconnect Wallet</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View className="mt-auto">
          <Text className="text-center text-muted text-sm">YO Vault App v1.0.0</Text>
          <Text className="mt-1 text-center text-muted text-xs">Powered by YO Protocol</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
