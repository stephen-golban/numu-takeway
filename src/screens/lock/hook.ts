import { useState } from "react";
import { useBiometricAuth } from "@/providers/biometric-auth";

export default function useLockScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { authenticate, biometricType, isLoading, unlock } = useBiometricAuth();

  const handleAuthenticate = async () => {
    setIsAuthenticating(true);
    const success = await authenticate();
    if (success) {
      unlock();
    }
    setIsAuthenticating(false);
  };

  return {
    handleAuthenticate,
    biometricType,
    isLoading,
    isAuthenticating,
  };
}
