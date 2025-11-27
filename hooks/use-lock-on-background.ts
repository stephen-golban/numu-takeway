import { useEffect, useRef } from "react";
import { AppState, type AppStateStatus } from "react-native";

const BACKGROUND_REGEX = /inactive|background/;

export function useLockOnBackground(lock: () => void) {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState: AppStateStatus) => {
      if (appState.current === "active" && BACKGROUND_REGEX.test(nextState)) {
        lock();
      }
      appState.current = nextState;
    });

    return () => subscription.remove();
  }, [lock]);
}
