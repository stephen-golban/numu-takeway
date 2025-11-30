import { useQuery } from "@tanstack/react-query";
import { CONTRACTS } from "@/lib/yo-protocol/constants";
import { queryKeys } from "../keys";

const YO_API_BASE_URL = "https://api.yo.xyz";
const NETWORK = "base";

type VaultApiResponse = {
  data: {
    stats: {
      tvl: {
        raw: string;
        formatted: string;
      };
      yield: {
        "1d": string;
        "7d": string;
        "30d": string;
      };
      rewardYield: string;
    };
  };
  message: string;
  statusCode: number;
};

async function fetchVaultData(vaultAddress: string): Promise<VaultApiResponse> {
  const response = await fetch(`${YO_API_BASE_URL}/api/v1/vault/${NETWORK}/${vaultAddress}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch vault data: ${response.statusText}`);
  }

  return response.json();
}

export function useVaultApy(vaultAddress: string = CONTRACTS.YO_USD_VAULT) {
  return useQuery({
    queryKey: queryKeys.yoVault.apy(vaultAddress),
    queryFn: async () => {
      const { data } = await fetchVaultData(vaultAddress);
      const baseApy = Number.parseFloat(data.stats.yield["7d"]);
      const rewardApy = Number.parseFloat(data.stats.rewardYield);
      const totalApy = baseApy + rewardApy;

      return {
        apy: `${totalApy.toFixed(2)}%`,
        apyRaw: totalApy,
        baseApy: `${baseApy.toFixed(2)}%`,
        rewardApy: `${rewardApy.toFixed(2)}%`,
        tvl: data.stats.tvl.formatted,
        tvlRaw: data.stats.tvl.raw,
      };
    },
    staleTime: 1000 * 60 * 10, // 10 minutes - APY doesn't change frequently
  });
}
