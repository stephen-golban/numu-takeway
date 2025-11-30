import { useCallback, useEffect, useRef } from "react";
import { AppState, type AppStateStatus } from "react-native";
import { useBiometricAuth } from "./biometric-auth";

const AppActivityProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const { lock } = useBiometricAuth();

  const handleAppStateChange = useCallback(
    (nextAppState: AppStateStatus) => {
      if (nextAppState === "inactive") {
        lock();
      }

      appState.current = nextAppState;
    },
    [lock]
  );

  useEffect(() => {
    const subscribe = AppState.addEventListener("change", handleAppStateChange);
    return () => subscribe.remove();
  }, [handleAppStateChange]);

  return <>{children}</>;
};

export default AppActivityProvider;
