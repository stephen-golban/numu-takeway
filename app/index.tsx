import { useAccount } from "@reown/appkit-react-native";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ConnectButton } from "@/components/connect-button";
import { BASE_CHAIN_ID } from "@/lib/appkit/chains";

export default function HomeScreen() {
  const router = useRouter();
  const { isConnected, chainId } = useAccount();

  // Navigate to vault when connected
  // biome-ignore lint/correctness/useExhaustiveDependencies: router.replace should not be a dependency of this hook
  useEffect(() => {
    if (isConnected && chainId === BASE_CHAIN_ID) {
      router.replace("/vault");
    }
  }, [isConnected, chainId]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-6">
        <View className="mb-12 items-center">
          <Text className="mb-4 text-6xl">🔵</Text>
          <Text className="mb-2 font-bold text-3xl text-foreground">YO Protocol</Text>
          <Text className="text-center text-lg text-muted">Earn optimized yield on your stablecoins</Text>
        </View>

        <ConnectButton />

        <View className="mt-8">
          <Text className="text-center text-muted text-sm">⚡ Base Network</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
