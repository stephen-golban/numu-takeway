export type BiometricType = "fingerprint" | "faceId" | "iris" | null;

export type BiometricAuthContextValue = {
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
