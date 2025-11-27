import { createMMKV } from "react-native-mmkv";

// Centralized MMKV instances
export const storage = createMMKV({ id: "app" });
export const appKitStorage = createMMKV({ id: "appkit" });

// Storage keys
export const STORAGE_KEYS = {
  AUTH_ENABLED: "auth.enabled",
} as const;
