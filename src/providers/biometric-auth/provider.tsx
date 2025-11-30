import * as LocalAuthentication from "expo-local-authentication";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  getBiometricEnabled,
  getCachedBiometricAvailable,
  getCachedBiometricType,
  setBiometricEnabled,
  setCachedBiometricAvailable,
  setCachedBiometricType,
} from "./storage";
import type { BiometricAuthContextValue, BiometricType } from "./types";
import { detectBiometricType } from "./utils";

const BiometricAuthContext = createContext<BiometricAuthContextValue | null>(null);

export function BiometricAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAvailable, setIsAvailable] = useState(() => getCachedBiometricAvailable());
  const [isEnabled, setIsEnabled] = useState(() => getBiometricEnabled());
  const [isLocked, setIsLocked] = useState(() => getBiometricEnabled());
  const [biometricType, setBiometricType] = useState<BiometricType>(() => getCachedBiometricType());

  // isLoading is false if we have cached values
  const [isLoading, setIsLoading] = useState(() => getCachedBiometricType() === null && !getCachedBiometricAvailable());

  useEffect(() => {
    async function checkBiometricAvailability() {
      try {
        const [hasHardware, isEnrolled, supportedTypes] = await Promise.all([
          LocalAuthentication.hasHardwareAsync(),
          LocalAuthentication.isEnrolledAsync(),
          LocalAuthentication.supportedAuthenticationTypesAsync(),
        ]);

        const type = detectBiometricType(supportedTypes);
        const available = hasHardware && isEnrolled;

        setIsAvailable(available);
        setBiometricType(type);
        setCachedBiometricType(type);
        setCachedBiometricAvailable(available);
      } catch {
        setIsAvailable(false);
        setCachedBiometricAvailable(false);
      } finally {
        setIsLoading(false);
      }
    }
    checkBiometricAvailability();
  }, []);

  const authenticate = useCallback(async (): Promise<boolean> => {
    if (!isAvailable) {
      return false;
    }

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to access the app",
        fallbackLabel: "Use passcode",
        cancelLabel: "Cancel",
        disableDeviceFallback: false,
      });
      return result.success;
    } catch {
      return false;
    }
  }, [isAvailable]);

  const enableBiometric = useCallback(async (): Promise<boolean> => {
    if (!isAvailable) {
      return false;
    }

    const authenticated = await authenticate();
    if (authenticated) {
      setBiometricEnabled(true);
      setIsEnabled(true);
      return true;
    }
    return false;
  }, [isAvailable, authenticate]);

  const disableBiometric = useCallback(() => {
    setBiometricEnabled(false);
    setIsEnabled(false);
  }, []);

  const toggleBiometric = useCallback(async (): Promise<boolean> => {
    if (isEnabled) {
      disableBiometric();
      return true;
    }
    return await enableBiometric();
  }, [isEnabled, enableBiometric, disableBiometric]);

  const lock = useCallback(() => {
    if (getBiometricEnabled()) {
      setIsLocked(true);
    }
  }, []);

  const unlock = useCallback(() => {
    setIsLocked(false);
  }, []);

  return (
    <BiometricAuthContext.Provider
      value={{
        isAvailable,
        isEnabled,
        isLoading,
        isLocked,
        biometricType,
        authenticate,
        enableBiometric,
        disableBiometric,
        toggleBiometric,
        lock,
        unlock,
      }}
    >
      {children}
    </BiometricAuthContext.Provider>
  );
}

export function useBiometricAuth() {
  const context = useContext(BiometricAuthContext);
  if (!context) {
    throw new Error("useBiometricAuth must be used within BiometricAuthProvider");
  }
  return context;
}
