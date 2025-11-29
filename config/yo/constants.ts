// Base Network Contract Addresses
export const CONTRACTS = {
  // YoGateway - from https://docs.yo.xyz/integrations/technical-guides/yogateway-integration-guide#contract-addresses
  YO_GATEWAY: "0xF1EeE0957267b1A474323Ff9CfF7719E964969FA",

  // yoUSD Vault -  from https://docs.yo.xyz/protocol/contract-addresses#yovaults
  YO_USD_VAULT: "0x0000000f2eb9f69274678c76222b35eec7588a65",
  USDC: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913", // USDC on Base (underlying asset for yoUSD)

  // yoETH Vault -  from https://docs.yo.xyz/protocol/contract-addresses#yovaults
  YO_ETH_VAULT: "0x3a43aec53490cb9fa922847385d82fe25d0e9de7",
  WETH: "0x4200000000000000000000000000000000000006", // WETH on Base (underlying asset for yoETH)

  // yoBTC Vault -  from https://docs.yo.xyz/protocol/contract-addresses#yovaults
  YO_BTC_VAULT: "0xbcbc8cb4d1e8ed048a6276a5e94a3e952660bcbc",
  cbBTC: "0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf", // cbBTC on Base (underlying asset for yoBTC)
} as const;

// Token decimals
export const DECIMALS = {
  YO_USD_USDC: 6,
  YO_ETH_WETH: 18,
  YO_BTC_cbBTC: 8,
} as const;

// Partner ID for attribution (0 = no partner)
export const PARTNER_ID = 0;
