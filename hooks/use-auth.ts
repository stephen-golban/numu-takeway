import * as LocalAuthentication from "expo-local-authentication";
import { useCallback, useEffect, useState } from "react";
import { createMMKV } from "react-native-mmkv";

const storage = createMMKV({ id: "auth" });

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
    isAuthEnabled: storage.getBoolean(AUTH_ENABLED_KEY) ?? false,
    isSupported: false,
    authenticationType: [],
  });

  useEffect(() => {
    async function checkSupport() {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const authTypes =
        await LocalAuthentication.supportedAuthenticationTypesAsync();

      setState((prev) => ({
        ...prev,
        isSupported: hasHardware && isEnrolled,
        authenticationType: authTypes,
        // If auth is not enabled, don't lock
        isLocked: prev.isAuthEnabled && hasHardware && isEnrolled,
      }));
    }

    checkSupport();
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

  const setAuthEnabled = useCallback((enabled: boolean) => {
    storage.set(AUTH_ENABLED_KEY, enabled);
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
