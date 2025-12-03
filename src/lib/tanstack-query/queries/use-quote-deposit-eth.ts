import { useProvider } from "@reown/appkit-react-native";
import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { YoGatewayService } from "@/lib/yo-protocol/service";
import { queryKeys } from "../keys";

export function useQuoteDepositEth(amount: string) {
  const { provider } = useProvider();
  const isValidAmount = !!amount && Number.parseFloat(amount) > 0;

  return useQuery({
    queryKey: queryKeys.yoEthVault.quoteDeposit(amount),
    queryFn: async () => {
      if (!provider) {
        return "0";
      }

      const ethersProvider = new ethers.BrowserProvider(provider as ethers.Eip1193Provider);
      const service = new YoGatewayService(ethersProvider);
      return await service.quoteDepositEth(amount);
    },
    enabled: !!provider && isValidAmount,
    placeholderData: "0",
  });
}
