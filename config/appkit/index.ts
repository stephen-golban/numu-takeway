import { EthersAdapter } from "@reown/appkit-ethers-react-native";
import { createAppKit } from "@reown/appkit-react-native";
import { base } from "./chains";
import { appKitStorage } from "./storage";

const projectId = process.env.EXPO_PUBLIC_REOWN_PROJECT_ID;

if (!projectId) {
  throw new Error("Missing EXPO_PUBLIC_REOWN_PROJECT_ID environment variable. Get one at https://dashboard.reown.com");
}

const ethersAdapter = new EthersAdapter();

export const appKit = createAppKit({
  projectId,
  networks: [base],
  defaultNetwork: base,
  adapters: [ethersAdapter],
  storage: appKitStorage,
  metadata: {
    name: "Numu Takeaway",
    description: "YO Protocol Vault Integration App",
    url: "https://www.stephen-golban.com",
    icons: ["https://www.stephen-golban.com/favicon.ico"],
    redirect: {
      native: "numu-takeaway://",
      universal: "www.stephen-golban.com",
    },
  },
  features: {
    swaps: false,
    onramp: false,
    socials: false,
  },
});
