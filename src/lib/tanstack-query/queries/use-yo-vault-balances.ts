import { useAccount, useProvider } from "@reown/appkit-react-native";
import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { YoGatewayService } from "@/lib/yo-protocol/service";
import { queryKeys } from "../keys";

export function useYoVaultBalances() {
  const { address, isConnected } = useAccount();
  const { provider } = useProvider();

  return useQuery({
    queryKey: queryKeys.yoVault.balances(address),
    queryFn: async () => {
      if (!address) {
        return { yoUsd: "0", usdc: "0" };
      }
      if (!provider) {
        return { yoUsd: "0", usdc: "0" };
      }

      const ethersProvider = new ethers.BrowserProvider(provider as ethers.Eip1193Provider);
      const service = new YoGatewayService(ethersProvider);

      const [yoUsd, usdc] = await Promise.all([service.getYoUsdBalance(address), service.getUsdcBalance(address)]);

      return { yoUsd, usdc };
    },
    enabled: isConnected && !!address && !!provider,
  });
}
