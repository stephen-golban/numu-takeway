# YO Protocol Vault App - Complete Implementation Plan

## 📋 Project Overview

A React Native Expo app that enables users to interact with YO Protocol vaults on Base network, featuring wallet connectivity via Reown AppKit and deposit/withdraw functionality.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         App Entry                               │
│  (SafeAreaProvider + AppKitProvider + Navigation)              │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│  Home Screen  │     │  Vault Screen │     │ Settings      │
│  (Connect     │     │  (Balance,    │     │ (Disconnect,  │
│   Wallet)     │     │   Deposit,    │     │  Network)     │
│               │     │   Withdraw)   │     │               │
└───────────────┘     └───────────────┘     └───────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Services Layer                             │
│  ┌──────────────────┐  ┌──────────────────┐                    │
│  │  Wallet Service  │  │  YoGateway       │                    │
│  │  (Reown AppKit)  │  │  Service         │                    │
│  └──────────────────┘  └──────────────────┘                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Base Network (Chain ID: 8453)                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ YoGateway: 0xF1EeE0957267b1A474323Ff9CfF7719E964969FA    │  │
│  │ yoUSD:     0x0000000f2eB9f69274678c76222B35eEc7588a65    │  │
│  │ USDC:      0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913    │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Folder Structure

```
yo-vault-app/
├── app/                          # Expo Router screens
│   ├── _layout.tsx              # Root layout with providers
│   ├── index.tsx                # Home/Connect screen
│   ├── vault.tsx                # Main vault interaction screen
│   └── settings.tsx             # Settings screen
├── components/
│   ├── ui/                      # React Native Reusables components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── text.tsx
│   │   ├── alert.tsx
│   │   └── ...
│   ├── wallet/
│   │   ├── ConnectButton.tsx    # Wallet connect button
│   │   ├── WalletInfo.tsx       # Display wallet address
│   │   └── NetworkBadge.tsx     # Show current network
│   └── vault/
│       ├── BalanceCard.tsx      # Show yoUSD balance
│       ├── DepositForm.tsx      # Deposit form
│       ├── WithdrawForm.tsx     # Withdraw form
│       └── TransactionStatus.tsx # TX status indicator
├── config/
│   ├── appkit.ts                # Reown AppKit configuration
│   ├── contracts.ts             # Contract addresses & ABIs
│   └── chains.ts                # Base network config
├── hooks/
│   ├── useYoVault.ts            # YoGateway interactions
│   ├── useBalance.ts            # Token balance hooks
│   └── useTransaction.ts        # TX status tracking
├── services/
│   ├── yoGateway.ts             # YoGateway service
│   └── storage.ts               # AsyncStorage wrapper
├── lib/
│   ├── cn.ts                    # classNames utility
│   ├── utils.ts                 # Helper functions
│   └── constants.ts             # App constants
├── theme/
│   └── colors.ts                # Theme colors
├── global.css                   # Tailwind CSS
├── tailwind.config.js
├── metro.config.js
├── babel.config.js
├── app.json
├── package.json
└── README.md
```

---

## 📱 App Flow & Wireframes

### Screen 1: Home/Connect Screen
```
┌─────────────────────────────────┐
│  ░░░░░░░ Status Bar ░░░░░░░░░  │
├─────────────────────────────────┤
│                                 │
│         ┌─────────────┐         │
│         │   YO Logo   │         │
│         │     🔵      │         │
│         └─────────────┘         │
│                                 │
│      YO Protocol Vault          │
│                                 │
│    Earn optimized yield on      │
│    your stablecoins             │
│                                 │
│                                 │
│   ┌───────────────────────┐     │
│   │   🔗 Connect Wallet   │     │
│   └───────────────────────┘     │
│                                 │
│   Powered by Reown AppKit       │
│                                 │
│                                 │
│   ⚡ Base Network               │
│                                 │
└─────────────────────────────────┘
```

### Screen 2: Vault Screen (Connected)
```
┌─────────────────────────────────┐
│  ░░░░░░░ Status Bar ░░░░░░░░░  │
├─────────────────────────────────┤
│  0x1234...5678    ⚙️ Settings  │
│  ● Base Network                 │
├─────────────────────────────────┤
│                                 │
│  ┌───────────────────────────┐  │
│  │     Your yoUSD Balance    │  │
│  │                           │  │
│  │       💰 1,234.56         │  │
│  │          yoUSD            │  │
│  │                           │  │
│  │   ≈ $1,247.89 USD         │  │
│  │   APY: ~8.5%              │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  USDC Balance: 500.00     │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌────────────┬──────────────┐  │
│  │  Deposit   │   Withdraw   │  │  ← Tab selector
│  └────────────┴──────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Amount                    │  │
│  │ ┌───────────────────────┐ │  │
│  │ │        100.00      MAX│ │  │
│  │ └───────────────────────┘ │  │
│  │                           │  │
│  │ You'll receive: ~99.85    │  │
│  │ yoUSD (1% slippage)       │  │
│  │                           │  │
│  │ ┌───────────────────────┐ │  │
│  │ │      💳 Deposit       │ │  │
│  │ └───────────────────────┘ │  │
│  └───────────────────────────┘  │
│                                 │
└─────────────────────────────────┘
```

### Screen 3: Transaction Pending Modal
```
┌─────────────────────────────────┐
│                                 │
│    ┌───────────────────────┐    │
│    │                       │    │
│    │    ⏳ Processing...   │    │
│    │                       │    │
│    │  Depositing 100 USDC  │    │
│    │                       │    │
│    │  Please confirm in    │    │
│    │  your wallet          │    │
│    │                       │    │
│    │  ──────────────────   │    │
│    │  Status: Pending      │    │
│    │                       │    │
│    │  [View on BaseScan]   │    │
│    │                       │    │
│    └───────────────────────┘    │
│                                 │
└─────────────────────────────────┘
```

### Screen 4: Settings Screen
```
┌─────────────────────────────────┐
│  ░░░░░░░ Status Bar ░░░░░░░░░  │
├─────────────────────────────────┤
│  ← Back           Settings      │
├─────────────────────────────────┤
│                                 │
│  Wallet                         │
│  ┌───────────────────────────┐  │
│  │ Address                   │  │
│  │ 0x1234567890...abcdef     │  │
│  │                     📋    │  │
│  └───────────────────────────┘  │
│                                 │
│  Network                        │
│  ┌───────────────────────────┐  │
│  │ Base                   ✓  │  │
│  │ Chain ID: 8453            │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │   🔴 Disconnect Wallet    │  │
│  └───────────────────────────┘  │
│                                 │
│                                 │
│  App Version: 1.0.0             │
│                                 │
└─────────────────────────────────┘
```

---

## 📦 Required Libraries

### Core Dependencies
```json
{
  "dependencies": {
    "expo": "~52.0.0",
    "expo-router": "~4.0.0",
    "expo-status-bar": "~2.0.0",
    "expo-application": "~6.0.0",
    "react": "18.3.1",
    "react-native": "0.76.x",
    
    "@reown/appkit-react-native": "^1.x.x",
    "@reown/appkit-ethers-react-native": "^1.x.x",
    "@walletconnect/react-native-compat": "^2.x.x",
    
    "@react-native-async-storage/async-storage": "^2.x.x",
    "@react-native-community/netinfo": "^11.x.x",
    
    "react-native-get-random-values": "^1.x.x",
    "react-native-svg": "^15.x.x",
    "react-native-safe-area-context": "^4.x.x",
    "react-native-reanimated": "~3.16.0",
    
    "nativewind": "^4.x.x",
    "class-variance-authority": "^0.7.x",
    "clsx": "^2.x.x",
    "tailwind-merge": "^2.x.x",
    
    "ethers": "^6.x.x",
    "viem": "^2.x.x"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.x",
    "@types/react": "~18.3.x",
    "typescript": "~5.3.x"
  }
}
```

### Installation Commands
```bash
# Create Expo app
npx create-expo-app@latest yo-vault-app --template tabs

# Install Reown AppKit
npx expo install @reown/appkit-react-native @reown/appkit-ethers-react-native @react-native-async-storage/async-storage react-native-get-random-values react-native-svg @react-native-community/netinfo @walletconnect/react-native-compat react-native-safe-area-context expo-application

# Install NativeWind
npx expo install nativewind tailwindcss react-native-reanimated react-native-safe-area-context

# Install utilities
npm install clsx tailwind-merge class-variance-authority

# Install ethers for contract interaction
npm install ethers viem

# Initialize Tailwind
npx tailwindcss init
```

---

## ⚙️ Configuration Files

### 1. tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        background: '#0f0f0f',
        foreground: '#ffffff',
        card: '#1a1a1a',
        border: '#2a2a2a',
        muted: '#6b7280',
        success: '#22c55e',
        error: '#ef4444',
      },
    },
  },
  plugins: [],
};
```

### 2. babel.config.js
```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { 
        jsxImportSource: "nativewind",
        unstable_transformImportMeta: true 
      }],
      "nativewind/babel"
    ],
  };
};
```

### 3. metro.config.js
```javascript
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { 
  input: "./global.css",
  inlineRem: 16 
});
```

### 4. global.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 5. nativewind-env.d.ts
```typescript
/// <reference types="nativewind/types" />
```

---

## 🔗 Contract Configuration

### config/contracts.ts
```typescript
// Base Network Contract Addresses
export const CONTRACTS = {
  // YoGateway - Single entry point for all vault interactions
  YO_GATEWAY: '0xF1EeE0957267b1A474323Ff9CfF7719E964969FA',
  
  // yoUSD Vault
  YO_USD_VAULT: '0x0000000f2eB9f69274678c76222B35eEc7588a65',
  
  // USDC on Base (underlying asset for yoUSD)
  USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  
  // Additional vaults (for reference)
  YO_ETH_VAULT: '0x3a43aec53490cb9fa922847385d82fe25d0e9de7',
  WETH: '0x4200000000000000000000000000000000000006',
} as const;

// Token decimals
export const DECIMALS = {
  USDC: 6,
  YO_USD: 6,
  WETH: 18,
  YO_ETH: 18,
} as const;

// Partner ID (get from YO team for attribution)
export const PARTNER_ID = 0; // Replace with actual partner ID
```

### config/chains.ts
```typescript
import type { AppKitNetwork } from '@reown/appkit-react-native';

export const base: AppKitNetwork = {
  id: 8453,
  name: 'Base',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://mainnet.base.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'BaseScan',
      url: 'https://basescan.org',
    },
  },
};
```

---

## 🔐 Reown AppKit Setup

### config/appkit.ts
```typescript
import "@walletconnect/react-native-compat";
import { createAppKit } from '@reown/appkit-react-native';
import { EthersAdapter } from '@reown/appkit-ethers-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { base } from './chains';

const projectId = process.env.EXPO_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

// Storage adapter for AsyncStorage
const storage = {
  async getKeys(): Promise<string[]> {
    const keys = await AsyncStorage.getAllKeys();
    return keys.filter(k => k.startsWith('appkit_'));
  },
  async getEntries<T>(): Promise<[string, T][]> {
    const keys = await this.getKeys();
    const entries = await AsyncStorage.multiGet(keys);
    return entries.map(([key, value]) => [key, value ? JSON.parse(value) : null]);
  },
  async getItem<T>(key: string): Promise<T | undefined> {
    const value = await AsyncStorage.getItem(`appkit_${key}`);
    return value ? JSON.parse(value) : undefined;
  },
  async setItem<T>(key: string, value: T): Promise<void> {
    await AsyncStorage.setItem(`appkit_${key}`, JSON.stringify(value));
  },
  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(`appkit_${key}`);
  },
};

const ethersAdapter = new EthersAdapter();

export const appKit = createAppKit({
  projectId,
  networks: [base],
  defaultNetwork: base,
  adapters: [ethersAdapter],
  storage,
  metadata: {
    name: 'YO Vault',
    description: 'Interact with YO Protocol vaults',
    url: 'https://yo.xyz',
    icons: ['https://yo.xyz/icon.png'],
    redirect: {
      native: 'yovault://',
      universal: 'https://yo.xyz',
    },
  },
  features: {
    email: false,
    socials: false,
    swaps: false,
    onramp: false,
  },
});
```

---

## 🏦 YoGateway Service

### services/yoGateway.ts
```typescript
import { ethers } from 'ethers';
import { CONTRACTS, DECIMALS, PARTNER_ID } from '../config/contracts';

// Minimal ABIs for required functions
const YO_GATEWAY_ABI = [
  'function quoteConvertToShares(address vault, uint256 assets) view returns (uint256)',
  'function quoteConvertToAssets(address vault, uint256 shares) view returns (uint256)',
  'function getShareAllowance(address vault, address owner) view returns (uint256)',
  'function getAssetAllowance(address vault, address owner) view returns (uint256)',
  'function deposit(address vault, uint256 assets, uint256 minSharesOut, address receiver, uint256 partnerId) returns (uint256)',
  'function redeem(address vault, uint256 shares, uint256 minAssetsOut, address receiver, uint256 partnerId) returns (uint256)',
];

const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
];

export class YoGatewayService {
  private provider: ethers.BrowserProvider;
  private gateway: ethers.Contract;
  
  constructor(provider: ethers.BrowserProvider) {
    this.provider = provider;
    this.gateway = new ethers.Contract(
      CONTRACTS.YO_GATEWAY,
      YO_GATEWAY_ABI,
      provider
    );
  }

  // Get yoUSD balance
  async getYoUsdBalance(address: string): Promise<string> {
    const yoUsd = new ethers.Contract(CONTRACTS.YO_USD_VAULT, ERC20_ABI, this.provider);
    const balance = await yoUsd.balanceOf(address);
    return ethers.formatUnits(balance, DECIMALS.YO_USD);
  }

  // Get USDC balance
  async getUsdcBalance(address: string): Promise<string> {
    const usdc = new ethers.Contract(CONTRACTS.USDC, ERC20_ABI, this.provider);
    const balance = await usdc.balanceOf(address);
    return ethers.formatUnits(balance, DECIMALS.USDC);
  }

  // Quote deposit (USDC -> yoUSD shares)
  async quoteDeposit(amount: string): Promise<string> {
    const assets = ethers.parseUnits(amount, DECIMALS.USDC);
    const shares = await this.gateway.quoteConvertToShares(CONTRACTS.YO_USD_VAULT, assets);
    return ethers.formatUnits(shares, DECIMALS.YO_USD);
  }

  // Quote withdraw (yoUSD shares -> USDC)
  async quoteWithdraw(shares: string): Promise<string> {
    const sharesAmount = ethers.parseUnits(shares, DECIMALS.YO_USD);
    const assets = await this.gateway.quoteConvertToAssets(CONTRACTS.YO_USD_VAULT, sharesAmount);
    return ethers.formatUnits(assets, DECIMALS.USDC);
  }

  // Deposit USDC to get yoUSD
  async deposit(
    signer: ethers.Signer,
    amount: string,
    receiver: string,
    slippageBps: number = 100 // 1% default
  ): Promise<ethers.TransactionReceipt> {
    const assets = ethers.parseUnits(amount, DECIMALS.USDC);
    
    // Get quote and calculate min shares with slippage
    const quotedShares = await this.gateway.quoteConvertToShares(CONTRACTS.YO_USD_VAULT, assets);
    const minSharesOut = quotedShares * BigInt(10000 - slippageBps) / BigInt(10000);

    // Check and approve USDC if needed
    const usdc = new ethers.Contract(CONTRACTS.USDC, ERC20_ABI, signer);
    const currentAllowance = await usdc.allowance(receiver, CONTRACTS.YO_GATEWAY);
    
    if (currentAllowance < assets) {
      const approveTx = await usdc.approve(CONTRACTS.YO_GATEWAY, assets);
      await approveTx.wait();
    }

    // Execute deposit
    const gatewayWithSigner = this.gateway.connect(signer);
    const tx = await gatewayWithSigner.deposit(
      CONTRACTS.YO_USD_VAULT,
      assets,
      minSharesOut,
      receiver,
      PARTNER_ID
    );

    return await tx.wait();
  }

  // Withdraw yoUSD to get USDC
  async withdraw(
    signer: ethers.Signer,
    shares: string,
    receiver: string,
    slippageBps: number = 100
  ): Promise<ethers.TransactionReceipt> {
    const sharesAmount = ethers.parseUnits(shares, DECIMALS.YO_USD);
    
    // Get quote and calculate min assets with slippage
    const quotedAssets = await this.gateway.quoteConvertToAssets(CONTRACTS.YO_USD_VAULT, sharesAmount);
    const minAssetsOut = quotedAssets * BigInt(10000 - slippageBps) / BigInt(10000);

    // Check and approve yoUSD shares if needed
    const yoUsd = new ethers.Contract(CONTRACTS.YO_USD_VAULT, ERC20_ABI, signer);
    const currentAllowance = await yoUsd.allowance(receiver, CONTRACTS.YO_GATEWAY);
    
    if (currentAllowance < sharesAmount) {
      const approveTx = await yoUsd.approve(CONTRACTS.YO_GATEWAY, sharesAmount);
      await approveTx.wait();
    }

    // Execute redeem
    const gatewayWithSigner = this.gateway.connect(signer);
    const tx = await gatewayWithSigner.redeem(
      CONTRACTS.YO_USD_VAULT,
      sharesAmount,
      minAssetsOut,
      receiver,
      PARTNER_ID
    );

    return await tx.wait();
  }
}
```

---

## 🪝 Custom Hooks

### hooks/useYoVault.ts
```typescript
import { useState, useCallback, useEffect } from 'react';
import { useAppKit, useAccount, useProvider } from '@reown/appkit-react-native';
import { ethers } from 'ethers';
import { YoGatewayService } from '../services/yoGateway';

export function useYoVault() {
  const { address, isConnected, chainId } = useAccount();
  const { provider } = useProvider();
  
  const [yoUsdBalance, setYoUsdBalance] = useState('0');
  const [usdcBalance, setUsdcBalance] = useState('0');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshBalances = useCallback(async () => {
    if (!isConnected || !address || !provider) return;
    
    try {
      setIsLoading(true);
      const ethersProvider = new ethers.BrowserProvider(provider);
      const service = new YoGatewayService(ethersProvider);
      
      const [yoUsd, usdc] = await Promise.all([
        service.getYoUsdBalance(address),
        service.getUsdcBalance(address),
      ]);
      
      setYoUsdBalance(yoUsd);
      setUsdcBalance(usdc);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch balances');
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, address, provider]);

  const deposit = useCallback(async (amount: string) => {
    if (!provider || !address) throw new Error('Wallet not connected');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();
      const service = new YoGatewayService(ethersProvider);
      
      const receipt = await service.deposit(signer, amount, address);
      await refreshBalances();
      return receipt;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Deposit failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [provider, address, refreshBalances]);

  const withdraw = useCallback(async (shares: string) => {
    if (!provider || !address) throw new Error('Wallet not connected');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();
      const service = new YoGatewayService(ethersProvider);
      
      const receipt = await service.withdraw(signer, shares, address);
      await refreshBalances();
      return receipt;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Withdrawal failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [provider, address, refreshBalances]);

  const quoteDeposit = useCallback(async (amount: string) => {
    if (!provider) return '0';
    const ethersProvider = new ethers.BrowserProvider(provider);
    const service = new YoGatewayService(ethersProvider);
    return service.quoteDeposit(amount);
  }, [provider]);

  const quoteWithdraw = useCallback(async (shares: string) => {
    if (!provider) return '0';
    const ethersProvider = new ethers.BrowserProvider(provider);
    const service = new YoGatewayService(ethersProvider);
    return service.quoteWithdraw(shares);
  }, [provider]);

  // Auto-refresh on connect
  useEffect(() => {
    if (isConnected) {
      refreshBalances();
    }
  }, [isConnected, refreshBalances]);

  return {
    yoUsdBalance,
    usdcBalance,
    isLoading,
    error,
    deposit,
    withdraw,
    quoteDeposit,
    quoteWithdraw,
    refreshBalances,
  };
}
```

---

## 📲 Key Components

### components/wallet/ConnectButton.tsx
```typescript
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAppKit, useAccount } from '@reown/appkit-react-native';

export function ConnectButton() {
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();

  if (isConnected) {
    return (
      <TouchableOpacity
        onPress={() => open({ view: 'Account' })}
        className="bg-card border border-border rounded-xl px-4 py-3"
      >
        <Text className="text-foreground font-medium">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={() => open()}
      className="bg-primary rounded-xl px-8 py-4"
    >
      <Text className="text-white font-semibold text-lg text-center">
        🔗 Connect Wallet
      </Text>
    </TouchableOpacity>
  );
}
```

### components/vault/BalanceCard.tsx
```typescript
import React from 'react';
import { View, Text } from 'react-native';

interface BalanceCardProps {
  yoUsdBalance: string;
  usdcBalance: string;
  isLoading: boolean;
}

export function BalanceCard({ yoUsdBalance, usdcBalance, isLoading }: BalanceCardProps) {
  const formattedYoUsd = parseFloat(yoUsdBalance).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <View className="bg-card border border-border rounded-2xl p-6 mb-4">
      <Text className="text-muted text-sm mb-2">Your yoUSD Balance</Text>
      
      {isLoading ? (
        <Text className="text-foreground text-3xl font-bold">Loading...</Text>
      ) : (
        <>
          <Text className="text-foreground text-4xl font-bold mb-1">
            💰 {formattedYoUsd}
          </Text>
          <Text className="text-primary text-lg">yoUSD</Text>
        </>
      )}

      <View className="mt-4 pt-4 border-t border-border">
        <Text className="text-muted text-sm">
          USDC Available: {parseFloat(usdcBalance).toFixed(2)}
        </Text>
      </View>
    </View>
  );
}
```

### components/vault/DepositForm.tsx
```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';

interface DepositFormProps {
  usdcBalance: string;
  onDeposit: (amount: string) => Promise<void>;
  onQuote: (amount: string) => Promise<string>;
  isLoading: boolean;
}

export function DepositForm({ usdcBalance, onDeposit, onQuote, isLoading }: DepositFormProps) {
  const [amount, setAmount] = useState('');
  const [quote, setQuote] = useState('0');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuote = async () => {
      if (!amount || parseFloat(amount) <= 0) {
        setQuote('0');
        return;
      }
      try {
        const result = await onQuote(amount);
        setQuote(result);
      } catch {
        setQuote('0');
      }
    };

    const timer = setTimeout(fetchQuote, 500);
    return () => clearTimeout(timer);
  }, [amount, onQuote]);

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Enter a valid amount');
      return;
    }
    if (parseFloat(amount) > parseFloat(usdcBalance)) {
      setError('Insufficient USDC balance');
      return;
    }

    setError('');
    try {
      await onDeposit(amount);
      setAmount('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Deposit failed');
    }
  };

  const setMaxAmount = () => {
    setAmount(usdcBalance);
  };

  return (
    <View className="bg-card border border-border rounded-2xl p-4">
      <Text className="text-foreground font-semibold mb-4">Deposit USDC</Text>

      <View className="flex-row items-center bg-background rounded-xl px-4 py-3 mb-4">
        <TextInput
          className="flex-1 text-foreground text-lg"
          placeholder="0.00"
          placeholderTextColor="#6b7280"
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
        />
        <TouchableOpacity onPress={setMaxAmount}>
          <Text className="text-primary font-medium">MAX</Text>
        </TouchableOpacity>
      </View>

      {parseFloat(quote) > 0 && (
        <Text className="text-muted text-sm mb-4">
          You'll receive: ~{parseFloat(quote).toFixed(2)} yoUSD
        </Text>
      )}

      {error && (
        <Text className="text-error text-sm mb-4">{error}</Text>
      )}

      <TouchableOpacity
        onPress={handleDeposit}
        disabled={isLoading}
        className={`rounded-xl py-4 ${isLoading ? 'bg-muted' : 'bg-primary'}`}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-semibold text-center text-lg">
            💳 Deposit
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
```

---

## 📱 Main App Screens

### app/_layout.tsx
```typescript
import "@walletconnect/react-native-compat";
import "../global.css";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppKitProvider, AppKit } from "@reown/appkit-react-native";
import { View } from "react-native";
import { appKit } from "../config/appkit";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppKitProvider instance={appKit}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#0f0f0f" },
          }}
        />
        {/* Expo Router Android fix */}
        <View style={{ position: "absolute", height: "100%", width: "100%" }}>
          <AppKit />
        </View>
      </AppKitProvider>
    </SafeAreaProvider>
  );
}
```

### app/index.tsx (Home Screen)
```typescript
import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { useAccount } from "@reown/appkit-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ConnectButton } from "../components/wallet/ConnectButton";

export default function HomeScreen() {
  const router = useRouter();
  const { isConnected, chainId } = useAccount();

  // Navigate to vault when connected
  useEffect(() => {
    if (isConnected && chainId === 8453) {
      router.replace("/vault");
    }
  }, [isConnected, chainId]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-center items-center px-6">
        <View className="items-center mb-12">
          <Text className="text-6xl mb-4">🔵</Text>
          <Text className="text-foreground text-3xl font-bold mb-2">
            YO Protocol
          </Text>
          <Text className="text-muted text-center text-lg">
            Earn optimized yield on your stablecoins
          </Text>
        </View>

        <ConnectButton />

        <View className="mt-8">
          <Text className="text-muted text-sm text-center">
            ⚡ Base Network
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
```

### app/vault.tsx
```typescript
import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAccount, useAppKit } from "@reown/appkit-react-native";
import { useYoVault } from "../hooks/useYoVault";
import { BalanceCard } from "../components/vault/BalanceCard";
import { DepositForm } from "../components/vault/DepositForm";
import { WithdrawForm } from "../components/vault/WithdrawForm";

export default function VaultScreen() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { open } = useAppKit();
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");

  const {
    yoUsdBalance,
    usdcBalance,
    isLoading,
    error,
    deposit,
    withdraw,
    quoteDeposit,
    quoteWithdraw,
    refreshBalances,
  } = useYoVault();

  // Redirect if not connected
  if (!isConnected) {
    router.replace("/");
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 py-3 border-b border-border">
        <TouchableOpacity onPress={() => open({ view: "Account" })}>
          <Text className="text-foreground font-medium">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </Text>
          <Text className="text-success text-xs">● Base Network</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/settings")}>
          <Text className="text-2xl">⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-4"
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refreshBalances} />
        }
      >
        {/* Balance Card */}
        <View className="mt-4">
          <BalanceCard
            yoUsdBalance={yoUsdBalance}
            usdcBalance={usdcBalance}
            isLoading={isLoading}
          />
        </View>

        {/* Error Display */}
        {error && (
          <View className="bg-error/20 border border-error rounded-xl p-4 mb-4">
            <Text className="text-error">{error}</Text>
          </View>
        )}

        {/* Tab Selector */}
        <View className="flex-row mb-4">
          <TouchableOpacity
            onPress={() => setActiveTab("deposit")}
            className={`flex-1 py-3 rounded-l-xl ${
              activeTab === "deposit" ? "bg-primary" : "bg-card"
            }`}
          >
            <Text
              className={`text-center font-medium ${
                activeTab === "deposit" ? "text-white" : "text-muted"
              }`}
            >
              Deposit
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("withdraw")}
            className={`flex-1 py-3 rounded-r-xl ${
              activeTab === "withdraw" ? "bg-primary" : "bg-card"
            }`}
          >
            <Text
              className={`text-center font-medium ${
                activeTab === "withdraw" ? "text-white" : "text-muted"
              }`}
            >
              Withdraw
            </Text>
          </TouchableOpacity>
        </View>

        {/* Forms */}
        {activeTab === "deposit" ? (
          <DepositForm
            usdcBalance={usdcBalance}
            onDeposit={deposit}
            onQuote={quoteDeposit}
            isLoading={isLoading}
          />
        ) : (
          <WithdrawForm
            yoUsdBalance={yoUsdBalance}
            onWithdraw={withdraw}
            onQuote={quoteWithdraw}
            isLoading={isLoading}
          />
        )}

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
```

---

## 🔑 Environment Variables

### .env
```
EXPO_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

### How to get WalletConnect Project ID:
1. Go to https://cloud.reown.com
2. Create account / Sign in
3. Create new project
4. Copy Project ID

---

## 📋 README Template

```markdown
# YO Vault - React Native Expo App

A mobile application for interacting with YO Protocol vaults on Base network.

## Features

- ✅ Wallet connection via Reown AppKit (WalletConnect)
- ✅ View yoUSD vault balance
- ✅ Deposit USDC into yoUSD vault
- ✅ Withdraw yoUSD back to USDC
- ✅ Real-time transaction status
- ✅ Base network support

## Prerequisites

- Node.js 18+
- Expo CLI
- WalletConnect Project ID from [Reown Dashboard](https://cloud.reown.com)
- A WalletConnect-compatible wallet (MetaMask, Rainbow, etc.)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```
   EXPO_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
   ```

4. Start development server:
   ```bash
   npx expo start
   ```

## Building APK

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build APK for testing
eas build -p android --profile preview
```

## Testing

1. Install Expo Go or build development client
2. Connect wallet on Base network
3. Request test USDC from shaan@numu.xyz
4. Test deposit and withdrawal flows

## Architecture

- **Framework**: React Native + Expo
- **Styling**: NativeWind (Tailwind CSS)
- **Wallet**: Reown AppKit
- **Web3**: Ethers.js v6
- **Network**: Base (Chain ID: 8453)

## Contract Addresses (Base)

- YoGateway: `0xF1EeE0957267b1A474323Ff9CfF7719E964969FA`
- yoUSD Vault: `0x0000000f2eB9f69274678c76222B35eEc7588a65`
- USDC: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`

## Design Decisions

1. **Single Vault Focus**: Implemented yoUSD vault as primary, extensible to other vaults
2. **1% Slippage Default**: Conservative slippage protection for user safety
3. **Pull-to-Refresh**: Manual balance refresh for better UX control
4. **Error Handling**: Comprehensive error states with user-friendly messages

## Known Limitations

- Redemptions may pend up to 24h if vault lacks liquidity
- Requires Expo Prebuild (not Expo Go) for full functionality
```

---

## 🚀 Development Checklist

### Phase 1: Setup (Day 1 Morning)
- [ ] Create Expo project with tabs template
- [ ] Install all dependencies
- [ ] Configure NativeWind
- [ ] Set up folder structure
- [ ] Configure Reown AppKit
- [ ] Get WalletConnect Project ID

### Phase 2: Wallet Integration (Day 1 Afternoon)
- [ ] Implement AppKit provider
- [ ] Create connect button
- [ ] Handle connection state
- [ ] Implement disconnect
- [ ] Switch to Base network
- [ ] Test wallet connection flow

### Phase 3: YO Protocol Integration (Day 2)
- [ ] Set up contract ABIs
- [ ] Implement YoGateway service
- [ ] Create balance fetching
- [ ] Implement deposit function
- [ ] Implement withdraw function
- [ ] Add quote functions
- [ ] Test on testnet

### Phase 4: UI/UX (Day 3 Morning)
- [ ] Build home screen
- [ ] Build vault screen
- [ ] Build settings screen
- [ ] Add loading states
- [ ] Add error handling
- [ ] Polish animations

### Phase 5: Testing & Deployment (Day 3 Afternoon)
- [ ] Test full flow in Expo
- [ ] Build APK with EAS
- [ ] Write README
- [ ] Request test funds
- [ ] Final testing with real transactions
- [ ] Push to GitHub

---

## ⚠️ Important Notes

1. **Expo Prebuild Required**: Reown AppKit doesn't work with Expo Go. Use `npx expo prebuild` or EAS Build.

2. **Base Network Only**: All operations on Base (Chain ID: 8453). The app should auto-switch or prompt users.

3. **Redemption Liquidity**: YO Protocol withdrawals may pend up to 24h if vault lacks liquidity. Handle this in UI.

4. **Partner ID**: Contact YO team (Discord/Telegram) for attribution tracking partner ID.

5. **Testing Funds**: Email shaan@numu.xyz for test USDC on Base network.

6. **ABI Files**: Download official ABIs from BaseScan for the contract addresses.