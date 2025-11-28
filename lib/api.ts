import type { Transaction } from "@/typings";
import { DEFAULT_APYS, DEFAULT_PRICES, TRANSACTION_FETCH_LIMIT } from "./defaults";

// CoinGecko API for token prices (free tier, no API key required)
const COINGECKO_API = "https://api.coingecko.com/api/v3";

// DefiLlama API for yields (free, no API key required)
const DEFILLAMA_YIELDS_API = "https://yields.llama.fi/pools";

// Map our asset symbols to CoinGecko IDs
const COINGECKO_IDS: Record<string, string> = {
  USDC: "usd-coin",
  WETH: "weth",
  cbBTC: "coinbase-wrapped-btc",
};

// Map vault symbols to DefiLlama pool addresses (lowercased)
const VAULT_TO_DEFILLAMA: Record<string, string> = {
  yoUSD: "0x0000000f2eb9f69274678c76222b35eec7588a65",
  yoETH: "0x3a43aec53490cb9fa922847385d82fe25d0e9de7",
  yoBTC: "0xbcbc8cb4d1e8ed048a6276a5e94a3e952660bcbc",
};

type PriceResponse = Record<string, { usd: number; usd_24h_change?: number }>;

export async function fetchTokenPrices(): Promise<Record<string, { price: number; change24h: number }>> {
  try {
    const ids = Object.values(COINGECKO_IDS).join(",");
    const url = `${COINGECKO_API}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data: PriceResponse = await response.json();

    const prices: Record<string, { price: number; change24h: number }> = {};
    for (const [symbol, geckoId] of Object.entries(COINGECKO_IDS)) {
      const tokenData = data[geckoId];
      if (tokenData) {
        prices[symbol] = {
          price: tokenData.usd,
          change24h: tokenData.usd_24h_change ?? 0,
        };
      }
    }

    return prices;
  } catch {
    // Return fallback prices when API fails
    const fallback: Record<string, { price: number; change24h: number }> = {};
    for (const [symbol, price] of Object.entries(DEFAULT_PRICES)) {
      fallback[symbol] = { price, change24h: 0 };
    }
    return fallback;
  }
}

// DefiLlama pool response type
type DefiLlamaPool = {
  chain: string;
  symbol: string;
  apy: number;
  apyBase: number | null;
  tvlUsd: number;
  underlyingTokens?: string[];
};

type DefiLlamaResponse = {
  data: DefiLlamaPool[];
};

export async function fetchVaultAPYs(): Promise<Record<string, number>> {
  try {
    const response = await fetch(DEFILLAMA_YIELDS_API);

    if (!response.ok) {
      throw new Error(`DefiLlama API error: ${response.status}`);
    }

    const data: DefiLlamaResponse = await response.json();

    // Find YO Protocol pools on Base by matching underlying token addresses
    const apys: Record<string, number> = {};

    for (const [vaultSymbol, vaultAddress] of Object.entries(VAULT_TO_DEFILLAMA)) {
      // Find pools that have this vault address as underlying token
      const matchingPools = data.data.filter(
        (pool) => pool.chain === "Base" && pool.underlyingTokens?.some((token) => token.toLowerCase() === vaultAddress)
      );

      // Get the best APY from matching pools, or use the pool with highest TVL
      if (matchingPools.length > 0) {
        // Sort by TVL to get the most relevant pool
        const bestPool = matchingPools.sort((a, b) => b.tvlUsd - a.tvlUsd)[0];
        apys[vaultSymbol] = bestPool.apy ?? bestPool.apyBase ?? 0;
      }
    }

    return apys;
  } catch {
    // Return fallback APYs when API fails
    return { ...DEFAULT_APYS };
  }
}

// Basescan API for transaction history (free tier)
const BASESCAN_API = "https://api.basescan.org/api";

type BasescanTx = {
  hash: string;
  from: string;
  to: string;
  value: string;
  timeStamp: string;
  functionName: string;
  isError: string;
};

type BasescanResponse = {
  status: string;
  result: BasescanTx[];
};

const YO_GATEWAY = "0xF1EeE0957267b1A474323Ff9CfF7719E964969FA".toLowerCase();

export async function fetchTransactionHistory(address: string): Promise<Transaction[]> {
  try {
    // Fetch transactions to/from the YoGateway contract
    const response = await fetch(
      `${BASESCAN_API}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&page=1&offset=${TRANSACTION_FETCH_LIMIT}`
    );

    if (!response.ok) {
      throw new Error(`Basescan API error: ${response.status}`);
    }

    const data: BasescanResponse = await response.json();

    if (data.status !== "1" || !Array.isArray(data.result)) {
      return [];
    }

    // Filter transactions related to YoGateway
    const yoTransactions = data.result.filter((tx) => tx.to.toLowerCase() === YO_GATEWAY && tx.isError === "0");

    return yoTransactions.map((tx) => {
      const isDeposit = tx.functionName.toLowerCase().includes("deposit");
      return {
        id: tx.hash,
        type: isDeposit ? "deposit" : "withdraw",
        amount: "—", // Amount parsing from tx input is complex, show placeholder
        symbol: "YO Vault",
        timestamp: new Date(Number.parseInt(tx.timeStamp, 10) * 1000),
        txHash: tx.hash,
      };
    });
  } catch {
    // Return empty array when API fails
    return [];
  }
}
