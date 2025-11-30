import { createMMKV } from "react-native-mmkv";
import type { BiometricType } from "./types";

const storage = createMMKV({ id: "biometric-auth" });

const BIOMETRIC_ENABLED_KEY = "biometricEnabled";
const BIOMETRIC_TYPE_KEY = "biometricType";
const BIOMETRIC_AVAILABLE_KEY = "biometricAvailable";

const BIOMETRIC_TYPE_VALUES = ["fingerprint", "faceId", "iris"] as const;

const isBiometricType = (value: unknown): value is BiometricType =>
  typeof value === "string" && BIOMETRIC_TYPE_VALUES.includes(value as (typeof BIOMETRIC_TYPE_VALUES)[number]);

export const getBiometricEnabled = (): boolean => storage.getBoolean(BIOMETRIC_ENABLED_KEY) ?? false;

export const setBiometricEnabled = (enabled: boolean): void => {
  storage.set(BIOMETRIC_ENABLED_KEY, enabled);
};

export const getCachedBiometricType = (): BiometricType => {
  const cached = storage.getString(BIOMETRIC_TYPE_KEY);
  return isBiometricType(cached) ? cached : null;
};

export const setCachedBiometricType = (type: BiometricType): void => {
  if (type) {
    storage.set(BIOMETRIC_TYPE_KEY, type);
  } else {
    storage.remove(BIOMETRIC_TYPE_KEY);
  }
};

export const getCachedBiometricAvailable = (): boolean => storage.getBoolean(BIOMETRIC_AVAILABLE_KEY) ?? false;

export const setCachedBiometricAvailable = (available: boolean): void => {
  storage.set(BIOMETRIC_AVAILABLE_KEY, available);
};
