import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useBiometricAuth } from "@/providers/biometric-auth";

export default function useLockScreen() {
  const router = useRouter();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { authenticate, biometricType, isLoading, unlock } = useBiometricAuth();

  const handleAuthenticate = useCallback(async () => {
    setIsAuthenticating(true);
    const success = await authenticate();
    if (success) {
      // Navigate first, then unlock in next frame to avoid hooks error
      router.replace("/(protected)/dashboard");
      requestAnimationFrame(() => {
        unlock();
      });
    } else {
      setIsAuthenticating(false);
    }
  }, [authenticate, unlock, router]);

  return {
    handleAuthenticate,
    biometricType,
    isLoading,
    isAuthenticating,
  };
}
