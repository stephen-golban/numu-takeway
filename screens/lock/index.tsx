import { LockIcon } from "lucide-react-native";
import { useEffect } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/providers/auth-provider";

const LockScreen = () => {
  const { authenticate } = useAuth();

  useEffect(() => {
    authenticate();
  }, [authenticate]);

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-background p-6">
      <View className="items-center gap-6">
        <View className="h-24 w-24 items-center justify-center rounded-full bg-muted">
          <Icon as={LockIcon} className="text-muted-foreground" size={48} />
        </View>

        <View className="items-center gap-2">
          <Text className="font-bold text-2xl">Numu Takeaway</Text>
          <Text className="text-center text-muted-foreground">Authenticating...</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LockScreen;
