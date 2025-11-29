import type { AppKitNetwork } from "@reown/appkit-react-native";

export const base: AppKitNetwork = {
  id: 8453,
  caipNetworkId: "eip155:8453", // CAIP-2 format: namespace:chainId
  chainNamespace: "eip155", // EVM chains use 'eip155'
  name: "Base",
  nativeCurrency: {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://mainnet.base.org"],
    },
  },
  blockExplorers: {
    default: {
      name: "BaseScan",
      url: "https://basescan.org",
    },
  },
};
