import { createContext, type PropsWithChildren, use, useEffect, useRef, useState } from "react";
import { AppState, type AppStateStatus } from "react-native";
import { useMMKVBoolean } from "react-native-mmkv";
import { useBiometrics } from "@/hooks/use-biometrics";
import { STORAGE_KEYS, storage } from "@/lib/storage";

type AuthContextValue = {
  isLocked: boolean;
  isAuthEnabled: boolean;
  isSupported: boolean;
  isLoading: boolean;
  authenticate: () => Promise<boolean>;
  setAuthEnabled: (enabled: boolean) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const BACKGROUND_REGEX = /inactive|background/;

export function useAuth() {
  const context = use(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: PropsWithChildren) {
  const { isSupported, isLoading, authenticate: biometricAuth } = useBiometrics();
  const [isAuthEnabled = false, setAuthEnabledStorage] = useMMKVBoolean(STORAGE_KEYS.AUTH_ENABLED, storage);
  const [isLocked, setIsLocked] = useState(true);
  const appState = useRef(AppState.currentState);

  // Lock when app goes to background
  useEffect(() => {
    if (!(isAuthEnabled && isSupported)) {
      return;
    }

    const subscription = AppState.addEventListener("change", (nextState: AppStateStatus) => {
      if (appState.current === "active" && BACKGROUND_REGEX.test(nextState)) {
        setIsLocked(true);
      }
      appState.current = nextState;
    });

    return () => subscription.remove();
  }, [isAuthEnabled, isSupported]);

  // Compute effective lock state - never show lock if auth is disabled
  const effectiveIsLocked = isAuthEnabled && (isLoading || (isLocked && isSupported));

  async function authenticate(): Promise<boolean> {
    if (!(isSupported && isAuthEnabled)) {
      setIsLocked(false);
      return true;
    }

    const success = await biometricAuth("Authenticate to access Numu Takeaway");
    if (success) {
      setIsLocked(false);
    }
    return success;
  }

  async function setAuthEnabled(enabled: boolean): Promise<boolean> {
    if (enabled && isSupported) {
      const success = await biometricAuth("Authenticate to enable biometric lock");
      if (!success) {
        return false;
      }
    }
    setAuthEnabledStorage(enabled);
    return true;
  }

  const value: AuthContextValue = {
    isLocked: effectiveIsLocked,
    isAuthEnabled,
    isSupported,
    isLoading,
    authenticate,
    setAuthEnabled,
  };

  return <AuthContext value={value}>{children}</AuthContext>;
}
