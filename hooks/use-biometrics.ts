import * as Device from "expo-device";
import * as LocalAuthentication from "expo-local-authentication";
import { useCallback, useEffect, useState } from "react";

const IS_SIMULATOR = !Device.isDevice;

type BiometricsState = {
  isSupported: boolean;
  isLoading: boolean;
  authenticationTypes: LocalAuthentication.AuthenticationType[];
};

export function useBiometrics() {
  const [state, setState] = useState<BiometricsState>({
    isSupported: false,
    isLoading: true,
    authenticationTypes: [],
  });

  useEffect(() => {
    async function checkBiometrics() {
      const [hasHardware, isEnrolled, authTypes] = await Promise.all([
        LocalAuthentication.hasHardwareAsync(),
        LocalAuthentication.isEnrolledAsync(),
        LocalAuthentication.supportedAuthenticationTypesAsync(),
      ]);

      setState({
        isSupported: hasHardware && isEnrolled && !IS_SIMULATOR,
        isLoading: false,
        authenticationTypes: authTypes,
      });
    }

    checkBiometrics();
  }, []);

  const authenticate = useCallback(
    async (promptMessage: string): Promise<boolean> => {
      if (!state.isSupported) {
        return true;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        fallbackLabel: "Use Passcode",
        cancelLabel: "Cancel",
        disableDeviceFallback: false,
      });

      return result.success;
    },
    [state.isSupported]
  );

  return {
    ...state,
    authenticate,
  };
}
