import { useAccount, useProvider } from "@reown/appkit-react-native";
import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { YoGatewayService } from "@/lib/yo-protocol/service";
import { queryKeys } from "../keys";

export function useYoEthVaultBalances() {
  const { address, isConnected } = useAccount();
  const { provider } = useProvider();

  return useQuery({
    queryKey: queryKeys.yoEthVault.balances(address),
    queryFn: async () => {
      if (!address) {
        return { yoEth: "0", weth: "0", eth: "0" };
      }
      if (!provider) {
        return { yoEth: "0", weth: "0", eth: "0" };
      }

      const ethersProvider = new ethers.BrowserProvider(provider as ethers.Eip1193Provider);
      const service = new YoGatewayService(ethersProvider);

      const [yoEth, weth, eth] = await Promise.all([
        service.getYoEthBalance(address),
        service.getWethBalance(address),
        service.getEthBalance(address),
      ]);

      return { yoEth, weth, eth };
    },
    enabled: isConnected && !!address && !!provider,
  });
}
