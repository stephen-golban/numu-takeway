import * as Device from "expo-device";
import * as LocalAuthentication from "expo-local-authentication";
import { createContext, type PropsWithChildren, use, useCallback, useEffect, useState } from "react";
import { createMMKV } from "react-native-mmkv";

const storage = createMMKV({ id: "auth" });
const AUTH_ENABLED_KEY = "authEnabled";
const IS_SIMULATOR = !Device.isDevice;

type AuthState = {
  isLocked: boolean;
  isAuthEnabled: boolean;
  isSupported: boolean;
  isLoading: boolean;
  lockCount: number;
  authenticationType: LocalAuthentication.AuthenticationType[];
};

type AuthContextValue = AuthState & {
  authenticate: () => Promise<boolean>;
  setAuthEnabled: (enabled: boolean) => void;
  lock: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const context = use(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<AuthState>({
    isLocked: true,
    isAuthEnabled: false,
    isSupported: false,
    isLoading: true,
    lockCount: 0,
    authenticationType: [],
  });

  useEffect(() => {
    async function initialize() {
      const [hasHardware, isEnrolled, authTypes] = await Promise.all([
        LocalAuthentication.hasHardwareAsync(),
        LocalAuthentication.isEnrolledAsync(),
        LocalAuthentication.supportedAuthenticationTypesAsync(),
      ]);

      const isSupported = hasHardware && isEnrolled && !IS_SIMULATOR;
      const isAuthEnabled = storage.getBoolean(AUTH_ENABLED_KEY) ?? false;

      setState((prev) => ({
        ...prev,
        isSupported,
        authenticationType: authTypes,
        isAuthEnabled,
        isLocked: !IS_SIMULATOR && isAuthEnabled && isSupported,
        isLoading: false,
      }));
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
      setState((prev) => ({ ...prev, isLocked: true, lockCount: prev.lockCount + 1 }));
    }
  }, [state.isAuthEnabled, state.isSupported]);

  return <AuthContext value={{ ...state, authenticate, setAuthEnabled, lock }}>{children}</AuthContext>;
}
