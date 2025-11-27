import type { Storage } from "@reown/appkit-react-native";
import { safeJsonParse, safeJsonStringify } from "@walletconnect/safe-json";
import { createMMKV } from "react-native-mmkv";

const mmkv = createMMKV({ id: "appkit" });

export const appKitStorage: Storage = {
  getKeys: async () => await Promise.resolve(mmkv.getAllKeys()),
  getEntries: async <T = unknown>(): Promise<[string, T][]> => {
    function parseEntry(key: string): [string, T] {
      const value = mmkv.getString(key);
      return [key, safeJsonParse(value ?? "") as T];
    }

    const keys = mmkv.getAllKeys();
    return await Promise.resolve(keys.map(parseEntry));
  },
  setItem: async <T = unknown>(key: string, value: T) => await Promise.resolve(mmkv.set(key, safeJsonStringify(value))),
  getItem: async <T = unknown>(key: string): Promise<T | undefined> => {
    const item = mmkv.getString(key);
    if (typeof item === "undefined" || item === null) {
      return await Promise.resolve(undefined);
    }

    return await Promise.resolve(safeJsonParse(item) as T);
  },
  removeItem: async (key: string) => {
    await Promise.resolve(mmkv.remove(key));
  },
};
