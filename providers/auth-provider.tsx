import { createContext, type PropsWithChildren, use, useCallback, useEffect, useRef, useState } from "react";
import { AppState, type AppStateStatus } from "react-native";
import { useMMKVBoolean } from "react-native-mmkv";
import { useBiometrics } from "@/hooks/use-biometrics";
import { STORAGE_KEYS, storage } from "@/lib/storage";

type AuthContextValue = {
  isLocked: boolean;
  isAuthEnabled: boolean;
  isSupported: boolean;
  isLoading: boolean;
  isAuthenticating: boolean;
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
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const appState = useRef(AppState.currentState);
  const isAuthenticatingRef = useRef(false);
  const isLockedRef = useRef(true);

  const authenticate = useCallback(async (): Promise<boolean> => {
    if (!(isSupported && isAuthEnabled)) {
      setIsLocked(false);
      return true;
    }

    // Already unlocked or already authenticating
    if (!isLockedRef.current || isAuthenticatingRef.current) {
      return false;
    }

    isAuthenticatingRef.current = true;
    setIsAuthenticating(true);

    const success = await biometricAuth("Authenticate to access Numu Takeaway");
    if (success) {
      isLockedRef.current = false;
      setIsLocked(false);
    }

    setIsAuthenticating(false);
    isAuthenticatingRef.current = false;
    return success;
  }, [isSupported, isAuthEnabled, biometricAuth]);

  // Handle app state changes: lock on background, authenticate on foreground
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally omit isLocked and authenticate to prevent re-triggering
  useEffect(() => {
    if (!(isAuthEnabled && isSupported)) {
      return;
    }

    // Auto-authenticate on mount if locked
    if (isLocked && appState.current === "active") {
      authenticate();
    }

    const subscription = AppState.addEventListener("change", (nextState: AppStateStatus) => {
      const wasActive = appState.current === "active";
      const isGoingToBackground = BACKGROUND_REGEX.test(nextState);
      const isComingToForeground = nextState === "active";

      if (wasActive && isGoingToBackground) {
        isLockedRef.current = true;
        setIsLocked(true);
      } else if (!wasActive && isComingToForeground) {
        authenticate();
      }

      appState.current = nextState;
    });

    return () => subscription.remove();
  }, [isAuthEnabled, isSupported]);

  // Compute effective lock state - never show lock if auth is disabled
  const effectiveIsLocked = isAuthEnabled && (isLoading || (isLocked && isSupported));

  async function setAuthEnabled(enabled: boolean): Promise<boolean> {
    if (enabled && isSupported) {
      const success = await biometricAuth("Authenticate to enable biometric lock");
      if (!success) {
        return false;
      }
      // User just authenticated to enable, so unlock immediately
      setIsLocked(false);
    }
    setAuthEnabledStorage(enabled);
    return true;
  }

  const value: AuthContextValue = {
    isLocked: effectiveIsLocked,
    isAuthEnabled,
    isSupported,
    isLoading,
    isAuthenticating,
    authenticate,
    setAuthEnabled,
  };

  return <AuthContext value={value}>{children}</AuthContext>;
}
