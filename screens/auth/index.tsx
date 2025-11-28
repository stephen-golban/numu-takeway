import { LockIcon, ScanFaceIcon } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/providers/auth-provider";

const AuthScreen = () => {
  const { authenticate, isAuthenticating } = useAuth();

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-background p-6">
      <View className="items-center gap-8">
        <Pressable
          accessibilityHint="Double tap to unlock with Face ID"
          accessibilityLabel="Unlock app"
          accessibilityRole="button"
          className="h-28 w-28 items-center justify-center rounded-full bg-muted active:bg-muted/70"
          disabled={isAuthenticating}
          onPress={authenticate}
        >
          <Icon
            as={isAuthenticating ? ScanFaceIcon : LockIcon}
            className={isAuthenticating ? "text-primary" : "text-muted-foreground"}
            size={52}
          />
        </Pressable>

        <View className="items-center gap-2">
          <Text className="font-bold text-2xl">Numu Takeaway</Text>
          <Text className="text-center text-muted-foreground">
            {isAuthenticating ? "Authenticating..." : "Tap to unlock"}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AuthScreen;
