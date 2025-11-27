// YO Protocol Configuration for Base Network
// Documentation: https://docs.yo.xyz/integrations/technical-guides/yogateway-integration-guide

export const YO_GATEWAY_ADDRESS = "0xF1EeE0957267b1A474323Ff9CfF7719E964969FA" as const;

// Vault addresses on Base
export const VAULTS = {
  yoUSD: {
    address: "0x0000000f2eb9f69274678c76222b35eec7588a65" as const,
    name: "yoUSD",
    symbol: "yoUSD",
    decimals: 6,
    asset: {
      address: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913" as const,
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
    },
  },
  yoETH: {
    address: "0x3a43aec53490cb9fa922847385d82fe25d0e9de7" as const,
    name: "yoETH",
    symbol: "yoETH",
    decimals: 18,
    asset: {
      address: "0x4200000000000000000000000000000000000006" as const,
      name: "Wrapped Ether",
      symbol: "WETH",
      decimals: 18,
    },
  },
  yoBTC: {
    address: "0xbcbc8cb4d1e8ed048a6276a5e94a3e952660bcbc" as const,
    name: "yoBTC",
    symbol: "yoBTC",
    decimals: 8,
    asset: {
      address: "0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf" as const,
      name: "Coinbase Wrapped BTC",
      symbol: "cbBTC",
      decimals: 8,
    },
  },
} as const;

export type VaultKey = keyof typeof VAULTS;
export type VaultConfig = (typeof VAULTS)[VaultKey];

// YoGateway ABI - minimal interface for deposit/redeem operations
export const YO_GATEWAY_ABI = [
  {
    inputs: [
      { internalType: "address", name: "yoVault", type: "address" },
      { internalType: "uint256", name: "assets", type: "uint256" },
      { internalType: "uint256", name: "minSharesOut", type: "uint256" },
      { internalType: "address", name: "receiver", type: "address" },
      { internalType: "uint32", name: "partnerId", type: "uint32" },
    ],
    name: "deposit",
    outputs: [{ internalType: "uint256", name: "sharesOut", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "yoVault", type: "address" },
      { internalType: "uint256", name: "shares", type: "uint256" },
      { internalType: "uint256", name: "minAssetsOut", type: "uint256" },
      { internalType: "address", name: "receiver", type: "address" },
      { internalType: "uint32", name: "partnerId", type: "uint32" },
    ],
    name: "redeem",
    outputs: [{ internalType: "uint256", name: "assetsOrRequestId", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "yoVault", type: "address" },
      { internalType: "uint256", name: "assets", type: "uint256" },
    ],
    name: "quoteConvertToShares",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "yoVault", type: "address" },
      { internalType: "uint256", name: "shares", type: "uint256" },
    ],
    name: "quoteConvertToAssets",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "yoVault", type: "address" },
      { internalType: "address", name: "owner", type: "address" },
    ],
    name: "getAssetAllowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "yoVault", type: "address" },
      { internalType: "address", name: "owner", type: "address" },
    ],
    name: "getShareAllowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// ERC20 ABI for token interactions
export const ERC20_ABI = [
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// Partner ID for attribution (0 = no partner)
export const PARTNER_ID = 0;
