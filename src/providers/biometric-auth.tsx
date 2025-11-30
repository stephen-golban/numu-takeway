import * as LocalAuthentication from "expo-local-authentication";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { createMMKV } from "react-native-mmkv";

const storage = createMMKV({ id: "biometric-auth" });

const BIOMETRIC_ENABLED_KEY = "biometricEnabled";
const BIOMETRIC_TYPE_KEY = "biometricType";
const BIOMETRIC_AVAILABLE_KEY = "biometricAvailable";

export const getBiometricEnabled = (): boolean => storage.getBoolean(BIOMETRIC_ENABLED_KEY) ?? false;

export const setBiometricEnabled = (enabled: boolean): void => storage.set(BIOMETRIC_ENABLED_KEY, enabled);

export type BiometricType = "fingerprint" | "faceId" | "iris" | null;

const BIOMETRIC_TYPE_VALUES = ["fingerprint", "faceId", "iris"] as const;

const isBiometricType = (value: unknown): value is BiometricType =>
  typeof value === "string" && BIOMETRIC_TYPE_VALUES.includes(value as (typeof BIOMETRIC_TYPE_VALUES)[number]);

const getCachedBiometricType = (): BiometricType => {
  const cached = storage.getString(BIOMETRIC_TYPE_KEY);
  return isBiometricType(cached) ? cached : null;
};

const detectBiometricType = (supportedTypes: LocalAuthentication.AuthenticationType[]): BiometricType => {
  if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
    return "faceId";
  }
  if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
    return "fingerprint";
  }
  if (supportedTypes.includes(LocalAuthentication.AuthenticationType.IRIS)) {
    return "iris";
  }
  return null;
};

export const getBiometricLabel = (type: BiometricType): string => {
  switch (type) {
    case "faceId":
      return "Face ID";
    case "fingerprint":
      return "Touch ID";
    case "iris":
      return "Iris";
    default:
      return "Biometric";
  }
};

const setCachedBiometricType = (type: BiometricType): void => {
  if (type) {
    storage.set(BIOMETRIC_TYPE_KEY, type);
  } else {
    storage.remove(BIOMETRIC_TYPE_KEY);
  }
};

const getCachedBiometricAvailable = (): boolean => storage.getBoolean(BIOMETRIC_AVAILABLE_KEY) ?? false;

const setCachedBiometricAvailable = (available: boolean): void => storage.set(BIOMETRIC_AVAILABLE_KEY, available);

type BiometricAuthContextValue = {
  isAvailable: boolean;
  isEnabled: boolean;
  isLoading: boolean;
  isLocked: boolean;
  biometricType: BiometricType;
  authenticate: () => Promise<boolean>;
  enableBiometric: () => Promise<boolean>;
  disableBiometric: () => void;
  toggleBiometric: () => Promise<boolean>;
  lock: () => void;
  unlock: () => void;
};

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
