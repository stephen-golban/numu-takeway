import * as LocalAuthentication from "expo-local-authentication";
import { FingerprintIcon, ScanFaceIcon } from "lucide-react-native";
import type { BiometricType } from "./types";

export const detectBiometricType = (supportedTypes: LocalAuthentication.AuthenticationType[]): BiometricType => {
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

export const getBiometricIcon = (type: BiometricType) => (type === "faceId" ? ScanFaceIcon : FingerprintIcon);
