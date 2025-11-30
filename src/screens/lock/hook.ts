import { useCallback, useState } from "react";
import { useBiometricAuth } from "@/providers/biometric-auth";

export default function useLockScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { authenticate, biometricType, isLoading, unlock } = useBiometricAuth();

  const handleAuthenticate = useCallback(async () => {
    setIsAuthenticating(true);
    try {
      const success = await authenticate();
      if (success) {
        unlock();
      }
    } finally {
      setIsAuthenticating(false);
    }
  }, [authenticate, unlock]);

  return {
    handleAuthenticate,
    biometricType,
    isLoading,
    isAuthenticating,
  };
}
