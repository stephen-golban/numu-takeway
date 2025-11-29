import { ethers } from "ethers";
import { ERC20_ABI, YO_GATEWAY_ABI } from "./abis";
import { CONTRACTS, DECIMALS, PARTNER_ID } from "./constants";

export class YoGatewayService {
  private readonly provider: ethers.BrowserProvider;
  private readonly gateway: ethers.Contract;

  constructor(provider: ethers.BrowserProvider) {
    this.provider = provider;
    this.gateway = new ethers.Contract(CONTRACTS.YO_GATEWAY, YO_GATEWAY_ABI, provider);
  }

  // Get yoUSD balance
  async getYoUsdBalance(address: string): Promise<string> {
    const yoUsd = new ethers.Contract(CONTRACTS.YO_USD_VAULT, ERC20_ABI, this.provider);
    const balance = await yoUsd.balanceOf(address);
    return ethers.formatUnits(balance, DECIMALS.YO_USD_USDC);
  }

  // Get USDC balance
  async getUsdcBalance(address: string): Promise<string> {
    const usdc = new ethers.Contract(CONTRACTS.USDC, ERC20_ABI, this.provider);
    const balance = await usdc.balanceOf(address);
    return ethers.formatUnits(balance, DECIMALS.YO_USD_USDC);
  }

  // Quote deposit (USDC -> yoUSD shares)
  async quoteDeposit(amount: string): Promise<string> {
    const assets = ethers.parseUnits(amount, DECIMALS.YO_USD_USDC);
    const shares = await this.gateway.quoteConvertToShares(CONTRACTS.YO_USD_VAULT, assets);
    return ethers.formatUnits(shares, DECIMALS.YO_USD_USDC);
  }

  // Quote withdraw (yoUSD shares -> USDC)
  async quoteWithdraw(shares: string): Promise<string> {
    const sharesAmount = ethers.parseUnits(shares, DECIMALS.YO_USD_USDC);
    const assets = await this.gateway.quoteConvertToAssets(CONTRACTS.YO_USD_VAULT, sharesAmount);
    return ethers.formatUnits(assets, DECIMALS.YO_USD_USDC);
  }

  // Deposit USDC to get yoUSD
  async deposit(
    signer: ethers.Signer,
    amount: string,
    receiver: string,
    slippageBps = 100 // 1% default
  ): Promise<ethers.TransactionReceipt | null> {
    const assets = ethers.parseUnits(amount, DECIMALS.YO_USD_USDC);

    // Get quote and calculate min shares with slippage
    const quotedShares = await this.gateway.quoteConvertToShares(CONTRACTS.YO_USD_VAULT, assets);
    const minSharesOut = (quotedShares * BigInt(10_000 - slippageBps)) / BigInt(10_000);

    // Check and approve USDC if needed
    const usdc = new ethers.Contract(CONTRACTS.USDC, ERC20_ABI, signer);
    const currentAllowance = await usdc.allowance(receiver, CONTRACTS.YO_GATEWAY);

    if (currentAllowance < assets) {
      const approveTx = await usdc.approve(CONTRACTS.YO_GATEWAY, assets);
      await approveTx.wait();
    }

    // Execute deposit
    const gatewayWithSigner = new ethers.Contract(CONTRACTS.YO_GATEWAY, YO_GATEWAY_ABI, signer);
    const tx = await gatewayWithSigner.deposit(CONTRACTS.YO_USD_VAULT, assets, minSharesOut, receiver, PARTNER_ID);

    return await tx.wait();
  }

  // Withdraw yoUSD to get USDC
  async withdraw(
    signer: ethers.Signer,
    shares: string,
    receiver: string,
    slippageBps = 100
  ): Promise<ethers.TransactionReceipt | null> {
    const sharesAmount = ethers.parseUnits(shares, DECIMALS.YO_USD_USDC);

    // Get quote and calculate min assets with slippage
    const quotedAssets = await this.gateway.quoteConvertToAssets(CONTRACTS.YO_USD_VAULT, sharesAmount);
    const minAssetsOut = (quotedAssets * BigInt(10_000 - slippageBps)) / BigInt(10_000);

    // Check and approve yoUSD shares if needed
    const yoUsd = new ethers.Contract(CONTRACTS.YO_USD_VAULT, ERC20_ABI, signer);
    const currentAllowance = await yoUsd.allowance(receiver, CONTRACTS.YO_GATEWAY);

    if (currentAllowance < sharesAmount) {
      const approveTx = await yoUsd.approve(CONTRACTS.YO_GATEWAY, sharesAmount);
      await approveTx.wait();
    }

    // Execute redeem
    const gatewayWithSigner = new ethers.Contract(CONTRACTS.YO_GATEWAY, YO_GATEWAY_ABI, signer);
    const tx = await gatewayWithSigner.redeem(CONTRACTS.YO_USD_VAULT, sharesAmount, minAssetsOut, receiver, PARTNER_ID);

    return await tx.wait();
  }
}
