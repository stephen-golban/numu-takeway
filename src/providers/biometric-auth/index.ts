// Provider and hook
export { BiometricAuthProvider, useBiometricAuth } from "./provider";

// Storage utilities
export { getBiometricEnabled, setBiometricEnabled } from "./storage";
// Types
export type { BiometricAuthContextValue, BiometricType } from "./types";
// Utility functions
export { detectBiometricType, getBiometricIcon, getBiometricLabel } from "./utils";
