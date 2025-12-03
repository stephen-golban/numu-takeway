import { ethers } from "ethers";
import { ERC20_ABI, WETH_ABI, YO_GATEWAY_ABI } from "./abis";
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

  // ============ yoETH Vault Methods ============

  // Get native ETH balance
  async getEthBalance(address: string): Promise<string> {
    const balance = await this.provider.getBalance(address);
    return ethers.formatUnits(balance, DECIMALS.YO_ETH_WETH);
  }

  // Get WETH balance
  async getWethBalance(address: string): Promise<string> {
    const weth = new ethers.Contract(CONTRACTS.WETH, ERC20_ABI, this.provider);
    const balance = await weth.balanceOf(address);
    return ethers.formatUnits(balance, DECIMALS.YO_ETH_WETH);
  }

  // Get yoETH balance
  async getYoEthBalance(address: string): Promise<string> {
    const yoEth = new ethers.Contract(CONTRACTS.YO_ETH_VAULT, ERC20_ABI, this.provider);
    const balance = await yoEth.balanceOf(address);
    return ethers.formatUnits(balance, DECIMALS.YO_ETH_WETH);
  }

  // Quote deposit ETH (ETH/WETH -> yoETH shares)
  async quoteDepositEth(amount: string): Promise<string> {
    const assets = ethers.parseUnits(amount, DECIMALS.YO_ETH_WETH);
    const shares = await this.gateway.quoteConvertToShares(CONTRACTS.YO_ETH_VAULT, assets);
    return ethers.formatUnits(shares, DECIMALS.YO_ETH_WETH);
  }

  // Quote withdraw ETH (yoETH shares -> WETH)
  async quoteWithdrawEth(shares: string): Promise<string> {
    const sharesAmount = ethers.parseUnits(shares, DECIMALS.YO_ETH_WETH);
    const assets = await this.gateway.quoteConvertToAssets(CONTRACTS.YO_ETH_VAULT, sharesAmount);
    return ethers.formatUnits(assets, DECIMALS.YO_ETH_WETH);
  }

  // Deposit ETH to get yoETH (auto-wraps ETH -> WETH first)
  async depositEth(
    signer: ethers.Signer,
    amount: string,
    receiver: string,
    slippageBps = 100
  ): Promise<ethers.TransactionReceipt | null> {
    const assets = ethers.parseUnits(amount, DECIMALS.YO_ETH_WETH);

    // Step 1: Wrap ETH -> WETH
    const weth = new ethers.Contract(CONTRACTS.WETH, WETH_ABI, signer);
    const wrapTx = await weth.deposit({ value: assets });
    await wrapTx.wait();

    // Step 2: Get quote and calculate min shares with slippage
    const quotedShares = await this.gateway.quoteConvertToShares(CONTRACTS.YO_ETH_VAULT, assets);
    const minSharesOut = (quotedShares * BigInt(10_000 - slippageBps)) / BigInt(10_000);

    // Step 3: Approve WETH for gateway
    const currentAllowance = await weth.allowance(receiver, CONTRACTS.YO_GATEWAY);
    if (currentAllowance < assets) {
      const approveTx = await weth.approve(CONTRACTS.YO_GATEWAY, assets);
      await approveTx.wait();
    }

    // Step 4: Execute deposit
    const gatewayWithSigner = new ethers.Contract(CONTRACTS.YO_GATEWAY, YO_GATEWAY_ABI, signer);
    const tx = await gatewayWithSigner.deposit(CONTRACTS.YO_ETH_VAULT, assets, minSharesOut, receiver, PARTNER_ID);

    return await tx.wait();
  }

  // Withdraw yoETH to get ETH (redeems to WETH, then unwraps)
  async withdrawEth(
    signer: ethers.Signer,
    shares: string,
    receiver: string,
    slippageBps = 100
  ): Promise<ethers.TransactionReceipt | null> {
    const sharesAmount = ethers.parseUnits(shares, DECIMALS.YO_ETH_WETH);

    // Step 1: Get quote and calculate min assets with slippage
    const quotedAssets = await this.gateway.quoteConvertToAssets(CONTRACTS.YO_ETH_VAULT, sharesAmount);
    const minAssetsOut = (quotedAssets * BigInt(10_000 - slippageBps)) / BigInt(10_000);

    // Step 2: Approve yoETH shares for gateway
    const yoEth = new ethers.Contract(CONTRACTS.YO_ETH_VAULT, ERC20_ABI, signer);
    const currentAllowance = await yoEth.allowance(receiver, CONTRACTS.YO_GATEWAY);
    if (currentAllowance < sharesAmount) {
      const approveTx = await yoEth.approve(CONTRACTS.YO_GATEWAY, sharesAmount);
      await approveTx.wait();
    }

    // Step 3: Execute redeem to get WETH
    const gatewayWithSigner = new ethers.Contract(CONTRACTS.YO_GATEWAY, YO_GATEWAY_ABI, signer);
    const redeemTx = await gatewayWithSigner.redeem(
      CONTRACTS.YO_ETH_VAULT,
      sharesAmount,
      minAssetsOut,
      receiver,
      PARTNER_ID
    );
    await redeemTx.wait();

    // Step 4: Unwrap WETH -> ETH
    const weth = new ethers.Contract(CONTRACTS.WETH, WETH_ABI, signer);
    const wethBalance = await weth.balanceOf(receiver);
    const unwrapTx = await weth.withdraw(wethBalance);

    return await unwrapTx.wait();
  }
}
