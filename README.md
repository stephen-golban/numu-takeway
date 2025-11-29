# Numu Takeaway

A React Native mobile application built with Expo that enables users to interact with YO Protocol vaults on the Base network. Features wallet connectivity via Reown AppKit, DeFi vault operations (deposit/withdraw), and optional biometric authentication.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Running the Project](#running-the-project)
- [Testing Instructions](#testing-instructions)
- [Project Structure](#project-structure)
- [Implementation Details](#implementation-details)
- [Assumptions & Design Decisions](#assumptions--design-decisions)
- [Tech Stack](#tech-stack)
- [Resources](#resources)

---

## Features

- **Wallet Connection** - Connect WalletConnect-compatible wallets via Reown AppKit
- **YO Protocol Integration** - View balances, deposit, and withdraw from yoUSD, yoETH, and yoBTC vaults
- **Base Network** - All operations execute on Base mainnet
- **Biometric Authentication** - Optional Face ID/Touch ID lock (disabled by default)
- **Dark/Light Theme** - Automatic theme support
- **Real-time Data** - Live prices from CoinGecko, APYs from DefiLlama, transaction history from Basescan

---

## Prerequisites

- Node.js 18+ or Bun
- iOS Simulator (Mac) or Android Emulator
- [Reown Project ID](https://dashboard.reown.com) - Free to create

---

## Setup Instructions

### 1. Install Dependencies

```bash
bun install
```

### 2. Environment Variables

Create a `.env.local` file in the project root:

```env
EXPO_PUBLIC_REOWN_PROJECT_ID=your_project_id_here
```

Get your Project ID from [Reown Dashboard](https://dashboard.reown.com):
1. Create a new project
2. Copy the Project ID
3. Add `numu-takeaway://` as an allowed redirect URI

### 3. iOS Setup (Mac only)

```bash
bun run prebuild
bun run ios
```

---

## Running the Project

### Development (with dev client)

```bash
bun run start
```

Then press:
- `i` - iOS Simulator
- `a` - Android Emulator

### Native Build

```bash
bun run ios      # iOS device/simulator
bun run android  # Android device/emulator
```

---

## Testing Instructions

### Manual Testing Flow

1. **Launch app** → Welcome screen appears
2. **Connect wallet** → Tap "Connect Wallet" and select a WalletConnect wallet
3. **Switch to Base network** if prompted
4. **View portfolio** → Home screen shows vault balances
5. **Deposit** → Select vault → Enter amount → Confirm transaction
6. **Withdraw** → Select vault → Enter shares amount → Confirm transaction
7. **Enable biometrics** (optional) → Settings → Toggle "Biometric Lock"

### Testing with Funds

Contact `shaan@numu.xyz` for testing funds on Base network.

### APK Testing

Build APK:
```bash
eas build --platform android --profile preview
```

Install on device:
```bash
adb install path/to/app.apk
```

---

## Project Structure

```
├── app/                        # Expo Router - file-based routing
│   ├── _layout.tsx             # Root layout with navigation guards
│   ├── welcome.tsx             # Welcome screen route
│   ├── auth.tsx                # Biometric lock screen route
│   └── (protected)/            # Authenticated screens group
│       ├── _layout.tsx         # Protected layout with header
│       ├── index.tsx           # Home screen route
│       └── vault/[vaultKey].tsx # Dynamic vault screen route
│
├── screens/                    # Screen implementations (logic separated from routes)
│   ├── auth/index.tsx          # Lock screen UI
│   ├── home/
│   │   ├── index.tsx           # Portfolio UI
│   │   ├── hook.ts             # Portfolio logic
│   │   ├── util.ts             # Helper functions
│   │   └── components/         # Home-specific components
│   ├── vault/
│   │   ├── index.tsx           # Vault operations UI
│   │   ├── hook.ts             # Deposit/withdraw logic
│   │   ├── type.ts             # TypeScript types
│   │   ├── util.ts             # Vault helpers
│   │   └── components/         # Vault-specific components
│   └── welcome/
│       ├── index.tsx           # Onboarding UI
│       ├── data.ts             # Feature list data
│       └── components/         # Welcome-specific components
│
├── components/                 # Shared UI components
│   ├── wallet-button.tsx       # Wallet connect button
│   ├── header.tsx              # Navigation header factory
│   ├── network-badge.tsx       # Network indicator
│   ├── theme-toggle.tsx        # Dark/light mode toggle
│   └── ui/                     # Base UI primitives (React Native Reusables)
│
├── config/
│   ├── appkit.ts               # Reown AppKit initialization
│   ├── appkit-storage.ts       # Custom MMKV storage adapter for AppKit
│   └── yo-protocol.ts          # Vault addresses, ABIs, and constants
│
├── hooks/
│   ├── use-vault.ts            # Single vault operations (deposit/withdraw)
│   ├── use-portfolio.ts        # All vaults portfolio aggregation
│   ├── use-biometrics.ts       # Face ID/Touch ID abstraction
│   └── use-custom-color-scheme.ts # Theme hook wrapper
│
├── providers/
│   ├── index.tsx               # Provider composition (SafeArea, Theme, AppKit, Auth)
│   └── auth-provider.tsx       # Biometric authentication context
│
├── lib/
│   ├── api.ts                  # External API calls (CoinGecko, DefiLlama, Basescan)
│   ├── defaults.ts             # Fallback values and constants
│   ├── storage.ts              # MMKV storage instances
│   ├── theme.ts                # Theme configuration
│   └── utils.ts                # Formatting and validation utilities
│
└── typings/                    # Shared TypeScript types
    ├── index.ts                # Transaction types
    └── vault.ts                # Vault position types
```

---

## Implementation Details

This section documents what was built, why certain decisions were made, and which documentation sources were used.

### 1. Wallet Connection (Reown AppKit)

**What we built:** Wallet connectivity using Reown AppKit (formerly WalletConnect) with a custom MMKV storage adapter.

**Why this approach:**
- The assignment specified "Reown AppKit for React Native" which is the official WalletConnect SDK rebranded
- We needed persistent wallet sessions across app restarts, which required a custom storage implementation

**How it works:**
- `config/appkit.ts` - Initializes AppKit with Base network configuration, project metadata, and disabled social/onramp features (not needed for this assignment)
- `config/appkit-storage.ts` - Custom storage adapter using MMKV instead of AsyncStorage for faster performance. AppKit requires a `Storage` interface with `getKeys`, `getEntries`, `setItem`, `getItem`, `removeItem` methods
- `components/wallet-button.tsx` - Two variants: full button for welcome screen, icon button for header

**Documentation used:**
- [Reown AppKit React Native Installation](https://docs.reown.com/appkit/react-native/core/installation)
- [Reown AppKit Ethers Adapter](https://docs.reown.com/appkit/react-native/core/installation#ethers)

**Key decision:** We use the Ethers adapter instead of Wagmi because ethers.js v6 provides more direct control over contract interactions, which was needed for the YoGateway integration.

### 2. YO Protocol Integration

**What we built:** Full deposit/withdraw functionality using the YoGateway contract on Base.

**Why this approach:**
- The YoGateway is the recommended entry point per YO Protocol docs - it handles approvals and conversions in a single transaction
- We integrated all three vaults (yoUSD, yoETH, yoBTC) to demonstrate the pattern works across different asset types

**How it works:**
- `config/yo-protocol.ts` - Contains:
  - `YO_GATEWAY_ADDRESS` - The gateway contract on Base
  - `VAULTS` - Configuration for each vault (address, decimals, underlying asset)
  - `YO_GATEWAY_ABI` - Minimal ABI with only the functions we use: `deposit`, `redeem`, `quoteConvertToShares`, `quoteConvertToAssets`
  - `ERC20_ABI` - Standard approve/balanceOf/allowance for token interactions

- `hooks/use-vault.ts` - Core vault operations hook:
  1. **Deposit flow:** Check balance → Get quote → Ensure allowance → Call `gateway.deposit()`
  2. **Withdraw flow:** Check shares → Get quote → Ensure allowance → Call `gateway.redeem()`
  3. Uses `applySlippage()` to protect against price movements (1% tolerance)

- `hooks/use-portfolio.ts` - Aggregates all vault balances and calculates portfolio totals

**Documentation used:**
- [YoGateway Integration Guide](https://docs.yo.xyz/integrations/technical-guides/yogateway-integration-guide)
- Contract addresses found on [Basescan](https://basescan.org) by searching for YO Protocol

**Key decisions:**
- 1% slippage tolerance (`SLIPPAGE_TOLERANCE_BPS = 100`) - Industry standard for DeFi
- Auto-approval pattern: We check allowance and approve if needed before each transaction
- Partner ID = 0 (no referral attribution needed for this demo)

### 3. External APIs (Prices, APYs, Transaction History)

**What we built:** Real-time data fetching from free public APIs with graceful fallbacks.

**Why this approach:**
- No API keys required for CoinGecko (free tier) and DefiLlama (fully free)
- Basescan public API for transaction history (rate-limited but sufficient for demo)
- Fallback values ensure the app works even when APIs are down

**How it works:**
- `lib/api.ts`:
  - `fetchTokenPrices()` - CoinGecko's `/simple/price` endpoint for USDC, WETH, cbBTC prices and 24h changes
  - `fetchVaultAPYs()` - DefiLlama's `/pools` endpoint, filtered by Base chain and vault addresses
  - `fetchTransactionHistory()` - Basescan's `/api?module=account&action=txlist` to get YoGateway transactions

- `lib/defaults.ts` - Fallback values when APIs fail:
  - `DEFAULT_PRICES` - Hardcoded prices (USDC: $1, WETH: $3500, cbBTC: $97,500)
  - `DEFAULT_APYS` - Estimated APYs (yoUSD: 5.2%, yoETH: 3.8%, yoBTC: 4.2%)

**Documentation used:**
- [CoinGecko API Docs](https://docs.coingecko.com/v3.0.1/reference/simple-price)
- [DefiLlama Yields API](https://defillama.com/docs/api#yields)
- [Basescan API Docs](https://docs.basescan.org/api-endpoints/accounts)

### 4. Biometric Authentication (Passkey - Option A)

**What we built:** Optional Face ID/Touch ID lock screen that activates when the app goes to background.

**Why this approach:**
- Assignment specified passkey auth should be "opt-in" - users must explicitly enable it
- Lock on background/unlock on foreground is the standard mobile banking pattern
- Using `expo-local-authentication` provides native biometric prompts on both platforms

**How it works:**
- `hooks/use-biometrics.ts`:
  - Checks for hardware support and enrolled biometrics on mount
  - Provides `authenticate()` function that shows native prompt
  - Disabled on simulators (no biometric hardware)

- `providers/auth-provider.tsx`:
  - `isLocked` state - true when app should show lock screen
  - `isAuthEnabled` persisted in MMKV - user's preference
  - `AppState` listener - locks on `background/inactive`, unlocks via biometric on `active`
  - Uses refs (`isLockedRef`, `isAuthenticatingRef`) to prevent race conditions during state transitions

- `screens/auth/index.tsx`:
  - Simple lock screen with Face ID icon
  - Tap to authenticate
  - Shows "Authenticating..." state during biometric prompt

**Navigation flow:** (in `app/_layout.tsx`)
```
Stack.Protected guards:
1. guard={isLocked} → Show auth.tsx (lock screen)
2. guard={!isLocked && !isConnected} → Show welcome.tsx
3. guard={!isLocked && isConnected} → Show (protected)/ screens
```

**Documentation used:**
- [Expo Local Authentication](https://docs.expo.dev/versions/latest/sdk/local-authentication/)
- [React Native AppState](https://reactnative.dev/docs/appstate)

**Key decisions:**
- OFF by default - user must opt-in via settings toggle
- Immediate lock on background - no grace period (more secure)
- Fallback to device passcode if biometric fails

### 5. Navigation Architecture (Expo Router)

**What we built:** File-based routing with protected route groups and clean separation of route definitions from screen implementations.

**Why this approach:**
- Expo Router v6 provides `Stack.Protected` for conditional navigation guards
- Separating `app/` (routes) from `screens/` (implementations) keeps route files minimal and logic testable

**How it works:**
- `app/_layout.tsx` - Root layout with three protected guards based on `isLocked` and `isConnected` state
- `app/(protected)/_layout.tsx` - Nested layout for authenticated screens with shared header configuration
- `app/(protected)/vault/[vaultKey].tsx` - Dynamic route for vault details (yoUSD, yoETH, yoBTC)

**Route files pattern:**
```tsx
// Minimal route file - just exports the screen
export { default } from "@/screens/vault";
```

**Documentation used:**
- [Expo Router Protected Routes](https://docs.expo.dev/router/reference/protected-routes/)
- [Expo Router Dynamic Routes](https://docs.expo.dev/router/create-pages/#dynamic-routes)

### 6. Screen Architecture Pattern

**What we built:** Consistent screen organization with separated concerns.

**Pattern for each screen:**
```
screens/{feature}/
├── index.tsx      # UI component (render only, no business logic)
├── hook.ts        # Custom hook with all logic, state, and handlers
├── util.ts        # Pure helper functions
├── type.ts        # TypeScript interfaces
└── components/    # Screen-specific sub-components
```

**Why this approach:**
- **Testability:** Hooks and utils can be unit tested without rendering
- **Readability:** UI components are pure rendering, easy to scan
- **Reusability:** Hook logic could be reused in different UI contexts
- **SOLID:** Single responsibility - each file has one job

**Example - Vault Screen:**
- `screens/vault/index.tsx` - Renders VaultHeader, PositionCard, ActionCard, VaultDetails
- `screens/vault/hook.ts` - Manages deposit/withdraw amounts, validation, API calls, tab state
- `screens/vault/util.ts` - `getVaultData()` helper to look up vault by key
- `screens/vault/type.ts` - `ActiveTab` type definition

### 7. Styling (NativeWind)

**What we built:** Tailwind CSS styling via NativeWind with dark mode support.

**Why this approach:**
- Assignment specified "NativeWind CSS for all styling"
- Tailwind's utility classes are faster to write than StyleSheet objects
- Built-in dark mode with `className="bg-background text-foreground"` pattern

**How it works:**
- `tailwind.config.js` - Extends default theme with semantic colors (background, foreground, card, etc.)
- `global.css` - CSS variables for light/dark mode colors
- `lib/utils.ts` - `cn()` utility merges Tailwind classes with proper precedence
- Components use `className` prop exclusively, no inline styles

**Documentation used:**
- [NativeWind v4 Documentation](https://www.nativewind.dev/v4/overview)
- [React Native Reusables Theming](https://reactnativereusables.com/docs/theming)

### 8. Storage Architecture

**What we built:** Two MMKV storage instances for different purposes.

**Why MMKV over AsyncStorage:**
- 10x faster than AsyncStorage (synchronous native access)
- No JSON parsing overhead for simple values
- Required for AppKit's storage adapter to work reliably

**Storage instances (`lib/storage.ts`):**
- `storage` (id: "app") - App preferences like `AUTH_ENABLED`
- `appKitStorage` (id: "appkit") - WalletConnect session data (separate to avoid conflicts)

**Key stored values:**
- `auth.enabled` - Boolean for biometric lock preference (MMKV)
- WalletConnect session - Managed by AppKit via our custom adapter

---

## Assumptions & Design Decisions

### Architecture
- **Screen organization**: Each feature has `index.tsx` (UI), `hook.ts` (logic), `util.ts`, `type.ts` following DRY/SOLID principles
- **State management**: React context for auth state, local state in hooks for screen data
- **Storage**: MMKV for fast key-value storage (wallet sessions, preferences)

### Authentication
- Biometric lock is **OFF by default** - users must explicitly enable it in settings
- App locks automatically when backgrounded (if enabled)
- Uses `expo-local-authentication` for Face ID/Touch ID
- Disabled on simulators since they lack biometric hardware

### Web3 Integration
- Uses ethers.js v6 for contract interactions (not wagmi, for more direct control)
- 1% slippage tolerance on vault operations (industry standard)
- Handles token approvals automatically before deposit/withdraw
- All operations on Base mainnet only (chain ID 8453)

### UI/UX
- NativeWind (Tailwind CSS) for all styling - no StyleSheet objects
- React Native Reusables component library for base primitives
- Functional over pixel-perfect design (as specified in assignment)
- Skeleton loaders during data fetching for better perceived performance

### API Resilience
- All external APIs have fallback values if they fail
- No API keys required (CoinGecko free tier, DefiLlama public, Basescan public)
- Transaction history limited to 20 most recent for performance

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React Native 0.81 + Expo SDK 54 |
| Routing | Expo Router v6 |
| Styling | NativeWind v4 (Tailwind CSS) |
| UI Components | React Native Reusables |
| Wallet | Reown AppKit (WalletConnect) |
| Web3 | ethers.js v6 |
| Storage | react-native-mmkv |
| Biometrics | expo-local-authentication |
| Linting | Biome (Ultracite preset) |

---

## Scripts

```bash
bun run start     # Start Expo dev server
bun run ios       # Run on iOS device
bun run android   # Run on Android
bun run check     # Lint and format with Biome
bun run clean     # Clean install dependencies
bun run prebuild  # Generate native iOS project
```

---

## Resources

**YO Protocol:**
- [YoGateway Integration Guide](https://docs.yo.xyz/integrations/technical-guides/yogateway-integration-guide) - Primary reference for vault operations

**Wallet Connection:**
- [Reown AppKit React Native](https://docs.reown.com/appkit/react-native/core/installation) - Wallet connectivity setup
- [Reown Dashboard](https://dashboard.reown.com) - Project ID management

**React Native:**
- [Expo Documentation](https://docs.expo.dev/) - SDK and router references
- [NativeWind v4](https://www.nativewind.dev/v4/overview) - Tailwind for React Native
- [React Native Reusables](https://reactnativereusables.com/) - UI component library

**APIs:**
- [CoinGecko API](https://docs.coingecko.com/) - Token prices
- [DefiLlama Yields](https://defillama.com/docs/api#yields) - Vault APYs
- [Basescan API](https://docs.basescan.org/) - Transaction history
