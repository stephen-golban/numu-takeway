import "@walletconnect/react-native-compat";

import { EthersAdapter } from "@reown/appkit-ethers-react-native";
import { type AppKitNetwork, createAppKit } from "@reown/appkit-react-native";
import { appKitStorage } from "./appkit-storage";

const base: AppKitNetwork = {
  id: 8453,
  name: "Base",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://mainnet.base.org"] },
  },
  blockExplorers: {
    default: { name: "Basescan", url: "https://basescan.org" },
  },
  chainNamespace: "eip155",
  caipNetworkId: "eip155:8453",
};

const projectId = process.env.EXPO_PUBLIC_REOWN_PROJECT_ID;

if (!projectId) {
  throw new Error("Missing EXPO_PUBLIC_REOWN_PROJECT_ID environment variable. Get one at https://dashboard.reown.com");
}

const ethersAdapter = new EthersAdapter();

const metadata = {
  name: "Numu Takeaway",
  description: "YO Protocol Vault Integration App",
  url: "https://numu.xyz",
  icons: ["https://numu.xyz/icon.png"],
  redirect: {
    native: "numu-takeaway://",
    universal: "numu.xyz",
  },
};

export const appKit = createAppKit({
  projectId,
  networks: [base],
  defaultNetwork: base,
  adapters: [ethersAdapter],
  storage: appKitStorage,
  metadata,
  features: {
    socials: false,
    swaps: false,
    onramp: false,
  },
});
