import { LoaderIcon, LockIcon } from "lucide-react-native";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { getBiometricIcon, getBiometricLabel } from "@/providers/biometric-auth";
import useLockScreen from "@/screens/lock/hook";

export default function LockScreen() {
  const { handleAuthenticate, biometricType, isLoading, isAuthenticating } = useLockScreen();

  const biometricLabel = getBiometricLabel(biometricType);
  const BiometricIcon = getBiometricIcon(biometricType);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View accessible className="flex-1 items-center justify-center gap-8 px-8">
        <View accessibilityRole="header" className="items-center gap-4">
          <View className="h-24 w-24 items-center justify-center rounded-full bg-primary/10">
            <Icon as={LockIcon} className="text-primary" size={48} />
          </View>
          <Text accessibilityRole="header" className="font-semibold text-foreground text-xl">
            App Locked
          </Text>
          <Text className="text-center text-muted-foreground">Authenticate to access your wallet and continue</Text>
        </View>

        {isLoading ? (
          <Skeleton className="h-12 w-full rounded-lg" />
        ) : (
          <Button
            accessibilityHint={`Authenticate using ${biometricLabel} to unlock the app`}
            accessibilityLabel={isAuthenticating ? "Authenticating" : `Unlock with ${biometricLabel}`}
            accessibilityRole="button"
            accessibilityState={{ disabled: isAuthenticating, busy: isAuthenticating }}
            accessible
            className="h-auto w-full flex-col gap-2 py-4"
            disabled={isAuthenticating}
            onPress={handleAuthenticate}
          >
            {isAuthenticating ? (
              <Icon as={LoaderIcon} className="animate-spin text-primary-foreground" size={32} />
            ) : (
              <Icon as={BiometricIcon} className="text-primary-foreground" size={32} />
            )}
            <Text>Unlock with {biometricLabel}</Text>
          </Button>
        )}
      </View>
    </SafeAreaView>
  );
}
