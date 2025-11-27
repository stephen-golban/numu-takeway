import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useState } from "react";

const AUTH_ENABLED_KEY = "authEnabled";

type AuthState = {
  isLocked: boolean;
  isAuthEnabled: boolean;
  isSupported: boolean;
  authenticationType: LocalAuthentication.AuthenticationType[];
};

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    isLocked: true,
    isAuthEnabled: false,
    isSupported: false,
    authenticationType: [],
  });

  useEffect(() => {
    async function initialize() {
      const [hasHardware, isEnrolled, authTypes, storedEnabled] =
        await Promise.all([
          LocalAuthentication.hasHardwareAsync(),
          LocalAuthentication.isEnrolledAsync(),
          LocalAuthentication.supportedAuthenticationTypesAsync(),
          SecureStore.getItemAsync(AUTH_ENABLED_KEY),
        ]);

      const isSupported = hasHardware && isEnrolled;
      const isAuthEnabled = storedEnabled === "true";

      setState({
        isSupported,
        authenticationType: authTypes,
        isAuthEnabled,
        isLocked: isAuthEnabled && isSupported,
      });
    }

    initialize();
  }, []);

  const authenticate = useCallback(async (): Promise<boolean> => {
    if (!(state.isSupported && state.isAuthEnabled)) {
      setState((prev) => ({ ...prev, isLocked: false }));
      return true;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate to access Numu Takeaway",
      fallbackLabel: "Use Passcode",
      cancelLabel: "Cancel",
      disableDeviceFallback: false,
    });

    if (result.success) {
      setState((prev) => ({ ...prev, isLocked: false }));
      return true;
    }

    return false;
  }, [state.isSupported, state.isAuthEnabled]);

  const setAuthEnabled = useCallback(async (enabled: boolean) => {
    await SecureStore.setItemAsync(
      AUTH_ENABLED_KEY,
      enabled ? "true" : "false"
    );
    setState((prev) => ({
      ...prev,
      isAuthEnabled: enabled,
      isLocked: enabled && prev.isSupported,
    }));
  }, []);

  const lock = useCallback(() => {
    if (state.isAuthEnabled && state.isSupported) {
      setState((prev) => ({ ...prev, isLocked: true }));
    }
  }, [state.isAuthEnabled, state.isSupported]);

  return {
    ...state,
    authenticate,
    setAuthEnabled,
    lock,
  };
}
