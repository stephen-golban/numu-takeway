import { useAccount, useProvider } from "@reown/appkit-react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ethers } from "ethers";
import { YoGatewayService } from "@/lib/yo-protocol/service";
import { queryKeys } from "../keys";

export function useDepositEth() {
  const { address } = useAccount();
  const { provider } = useProvider();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (amount: string) => {
      if (!address) {
        throw new Error("Wallet not connected");
      }

      if (!provider) {
        throw new Error("Provider not available");
      }

      const ethersProvider = new ethers.BrowserProvider(provider as ethers.Eip1193Provider);
      const signer = await ethersProvider.getSigner();
      const service = new YoGatewayService(ethersProvider);

      await service.depositEth(signer, amount, address);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.yoEthVault.all });
    },
  });
}
