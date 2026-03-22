# StakeLiGames - Stake on LinkedIn Games Scores
<a href="https://www.producthunt.com/products/stakeligames?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-stakeligames" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1044696&theme=neutral&t=1764664965863" alt="StakeLiGames - Protocol&#0032;to&#0032;stake&#0032;on&#0032;your&#0032;LinkedIn&#0032;games&#0032;performance | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

Stake on your LinkedIn Games performance using stablecoins and earn rewards based on real, verified results. Built for LinkedIn Games fans on **Ethereum Sepolia** using **Solidity**, **TypeScript**, **Tailwind**, and **Next.js**.

![StakeLiGames](https://img.shields.io/badge/chain-Sepolia-00D4AA?style=for-the-badge)
![Solidity](https://img.shields.io/badge/contracts-Solidity-363636?style=for-the-badge)
![Next.js](https://img.shields.io/badge/frontend-Next.js-000000?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/language-TypeScript-3178C6?style=for-the-badge)

## Demo pics

<img width="933" height="968" alt="updated-contract-depl" src="https://github.com/user-attachments/assets/2df16a71-fd08-4146-bfee-6f033dd8df12" />
<img width="1919" height="991" alt="updated-hero-section" src="https://github.com/user-attachments/assets/5b9a618d-0fbb-4735-a381-b578ff3ddb44" />
<img width="1919" height="882" alt="updated-why" src="https://github.com/user-attachments/assets/9c519abe-44e3-4b15-a51b-ac5423e5f7b1" />
<img width="1919" height="809" alt="updated-pipeline" src="https://github.com/user-attachments/assets/bff4fb93-4fee-4fa6-9276-0b438b2ef4cc" />
<img width="1136" height="905" alt="updated-staking" src="https://github.com/user-attachments/assets/739e3c9a-e2aa-44fb-8875-f612b578259b" />
<img width="1759" height="641" alt="updated-footer" src="https://github.com/user-attachments/assets/947dcbbf-de33-4d45-a0ac-3cf588e455fa" />
<img width="1442" height="882" alt="updated-dashboard" src="https://github.com/user-attachments/assets/85f2ad01-9789-4978-ac96-cad27adff061" />
<img width="1595" height="498" alt="dashboard-l-2" src="https://github.com/user-attachments/assets/5d27228d-2c0b-496f-9c10-bc173cbdaf1c" />
<img width="1638" height="503" alt="dashboard-l-3" src="https://github.com/user-attachments/assets/7fb360f6-ec27-47d7-aecb-1885c715c9cb" />
<img width="1632" height="421" alt="dashboard-l-4" src="https://github.com/user-attachments/assets/12034a45-3538-4973-92fc-5d8ebacbea5a" />



## Features

- Sepolia Testnet - All staking and rewards use the Ethereum Sepolia testnet for fast, low-cost testing
- USDC Stablecoin - Stake and earn rewards using Sepolia USDC (ERC20)
- Auto Sepolia Switch - Wallet auto-prompts network switch during connect/stake/submit flows
- Play Now Links - Per-game quick launch buttons open LinkedIn game links in a new tab
- USDC Staking - Stake stablecoins on your LinkedIn Games scores
- Attested Verification - Result settlement requires server-signed attestation (nonce + deadline + signature)
- Historical Dashboard Aggregation - Charts aggregate across current, second-last, and legacy contracts
- Instant Rewards - Earn rewards when you meet your target score
- MetaMask Wallet - Browser wallet integration for Sepolia
- Pleasant UI - Clean, minimal design inspired by competitive gaming and LinkedIn Games
- Zero Gas Fees - Free testnet transactions, minimal mainnet costs

## How It Works

1. Connect Wallet - Link your MetaMask wallet (app auto-prompts Sepolia switch if needed)
2. Choose Game - Select a LinkedIn Game (Queens, Crossclimb, Pinpoint, Tango, Zip, Mini Sudoku, Patches)
3. Stake USDC - Set your target and stake amount (minimum: 0.01 USDC)
4. Play Now - Use the in-app Play Now button to open the selected LinkedIn game in a new tab
5. Verify Result - Submit your score/time; app requests nonce, gets verifier attestation, then settles on-chain
6. Earn Rewards - Meet your target and receive payout based on game reward configuration

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **TailwindCSS** - For the styling
- **Framer Motion** - Smooth animations
- **Chart.js** - For the result analytics on dashboard
- **ethers** - Wallet interaction and contract calls
- **Solidity** - For 1 smart contract

### Smart Contracts (Blockchain)
- **Solidity** - On-chain staking and payout contract
- **OpenZeppelin** - Security primitives (Ownable, ReentrancyGuard, ECDSA)
- **Sepolia Testnet** - Fast and low-cost Ethereum test network

### Backend/Scripts
- **Next.js API Routes** - Nonce issuance and attestation endpoints
- **Python 3.8+** - Existing contract compilation/deployment scripts

## Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.8+ and pip
- **MetaMask Wallet** (mobile or browser extension)
- **Sepolia Testnet Account** (created via wallet)

## Quick Start

### 1. Clone & Install

```bash
cd StakeLiGames
npm install
```

### 2. Set Up Python Environment for Smart Contracts

```bash
cd contracts

pip install -r requirements.txt
```

### 3. Compile Smart Contracts (Solidity)

```bash
# From contracts directory
python compile_solidity.py
```

This generates:
- `abi.json` - Contract ABI
- `bytecode.txt` - Compiled bytecode
- `compiled_contract.json` - Full compilation artifact

### 4. Get Testnet USDC (Sepolia)

The testnet now uses Sepolia USDC (ERC20) for simulation and staking.

1. Visit the official Circle Sepolia USDC faucet: https://faucet.circle.com/
2. Connect your wallet (e.g., MetaMask) and select the Sepolia network.
3. Paste your wallet address and request testnet USDC.
4. Confirm the transaction in your wallet.
5. You will receive Sepolia USDC directly to your wallet (no asset opt-in required).

**Note:** The old Algorand testnet asset (ID 10458941) is no longer used. All staking and rewards now use Sepolia USDC.

### 5. Deploy Smart Contract

```bash
# From contracts directory
python deploy_sepolia.py
```

**Options:**
- **Enter existing mnemonic** (25 words from your wallet) OR
- **Press Enter** to generate a new account (you'll need to fund it)

The deployment script will:
- Compile Solidity contract
- Deploy to Ethereum Sepolia testnet
- Output deployed contract address
- Create/update `.env.local` with config

**Output:**
```
Contract deployed successfully!
Contract Address: 0x...
```

### 6. Configure Frontend

The deployment script automatically creates `.env.local`:

```env
# Ethereum Sepolia Configuration
NEXT_PUBLIC_CHAIN_ID=
NEXT_PUBLIC_RPC_URL=https://rpc.sepolia.org
RPC_URL=https://ethereum-sepolia.publicnode.com
NEXT_PUBLIC_NETWORK_NAME=Sepolia Testnet

# Smart Contract Addresses
NEXT_PUBLIC_CONTRACT_ADDRESS=
NEXT_PUBLIC_USDC_ADDRESS=
PRIVATE_KEY=
VERIFIER_PRIVATE_KEY=

# Historical / Legacy Contracts (optional)
# Direct previous deployment (2nd last). Dashboard/chart reads this
# alongside NEXT_PUBLIC_CONTRACT_ADDRESS.
NEXT_PUBLIC_SECOND_LAST_CONTRACT_ADDRESS=

# Comma-separated list of previous contract addresses to include
# in the read-only dashboard and charts. This is only used for
# displaying historical stakes; new stakes always go to
# NEXT_PUBLIC_CONTRACT_ADDRESS.
NEXT_PUBLIC_LEGACY_CONTRACT_ADDRESSES=

# Application Settings
NEXT_PUBLIC_APP_NAME=

```

### 7. Run Development Server

```bash
# From project root
npm run dev
```

Open http://localhost:3000

## Using the Platform

### Stake on a Game

1. Connect Wallet - Click "Connect Wallet" (top right)
2. Select Game:
   - Queens (Hard) → 25% reward
   - Crossclimb (Hard) → 25% reward
   - Mini Sudoku (Medium) → 20% reward
   - Tango (Medium) → 20% reward
   - Zip (Easy) → 15% reward
   - Pinpoint (Special) → 30% reward
   - Patches (Easy) → 10% reward

3. Configure Stake:
   - Enter USDC amount (min: 0.01 USDC)
   - Set your target (time or score, as per game)
   - Review estimated returns

4. Create Stake - Approve USDC then create stake transaction

5. Play Game - Use Play Now and complete your LinkedIn Game

6. Verify Result - Submit result (nonce + signed attestation) to claim rewards

### Verify & Claim Rewards

```javascript
// Frontend flow before settlement call:
// 1) POST /api/verification/nonce
// 2) POST /api/verification/attest
// 3) call verifyAndPayoutWithAttestation(...) on contract
```

## Available Scripts

```bash
# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Smart Contracts
npm run contracts:compile   # Compile Solidity contract
npm run contracts:deploy    # Deploy to Sepolia

# Python (from contracts/)
python compile_solidity.py    # Compile contracts
python deploy_sepolia.py     # Deploy to testnet
```

## Testnet Resources

- **Faucet**: https://sepolia-faucet.pk910.de/#/ (Get free Sepolia ETH - Official)
- **Explorer Options**:
   - https://sepolia.etherscan.io (Etherscan)
- **Sepolia Docs**: https://ethereum.org/en/developers/docs/networks/#sepolia
- **OpenZeppelin Contracts**: https://docs.openzeppelin.com/contracts

## Smart Contract Details

### State Schema

**Global State:**
- `total_staked` - Total USDC locked in platform
- `total_games` - Number of games created
- `platform_fee` - Fee percentage (250 = 2.5%)
- `owner` - Platform owner address

**Local State (per user):**
- `staked_amount` - User's active stakes
- `games_participated` - Total games count
- `total_winnings` - Cumulative winnings
- `total_losses` - Cumulative losses

**Game Storage:**
- Game data: player, target score, stake amount, flawless stake, timestamp, status
- Security data: verifier signer, used nonces, attestation window

### Contract Methods

1. `createGame` - Create new stake on game result
   - Args: gameId, gameType, targetScore, stakeAmount, flawlessStake
   - Requires: USDC transfer to contract (min: 0.01 USDC)

2. `verifyAndPayoutWithAttestation` - Verify signed result and distribute rewards
   - Args: gameId, actualScore, flawlessClaimed, nonce, deadline, signature
   - Requires: valid verifier signature + unused nonce + unexpired deadline
   - Logic: If result meets target rule for game type -> payout, else stake flows to pool

3. `setVerifierSigner` / `setDefaultAttestationWindow`
   - Owner-configurable verifier and attestation policy

4. `withdrawFees` - Owner withdraws platform fees
   - Args: amount

## UI Design Philosophy

- **Clean & Minimal** - Inspired by the challenge and excitement of LinkedIn Games
- **Accessible** - High contrast, readable fonts
- **Responsive** - Mobile-first design

## Security Features

- **OpenZeppelin patterns** for access control and signature recovery
- **Reentrancy protection** via ReentrancyGuard
- **ECDSA attestation checks** with nonce replay protection
- **Access control** for admin functions
- **Nonce + deadline validation** for result submissions
- **Testnet first** - Deploy safely before mainnet

## Deployment to Production

### Frontend Hosting

**Vercel (Recommended):**
```bash
npm install -g vercel
vercel deploy
```

**Netlify:**
```bash
npm run build
netlify deploy --prod --dir=.next
```

## Customization

### Add New Games

Edit `components/StakingInterface.tsx`:

```typescript
const games = [
   { id: "new_game", name: "New Game", difficulty: "Hard", targetTime: 60, unit: "sec", reward: "25%" },
   // ... existing games
];
```

### Adjust Rewards

Edit `contracts/staking_contract.py`:

```python
reward := stake_amount / Int(5),  # 20% reward (1/5)
# Change to stake_amount / Int(4) for 25%
# Change to stake_amount / Int(10) for 10%
```

Recompile and redeploy:
```bash
python compile_solidity.py
python deploy_sepolia.py
```

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## Support

- **Sepolia Docs**: https://sepolia.dev/
- **Ethers Docs**: https://docs.ethers.org
- **OpenZeppelin Docs**: https://docs.openzeppelin.com/contracts
- **Next.js Docs**: https://nextjs.org/docs

## Links

- **Video Demo**: https://youtu.be/J26eRUxOx74
- **FirstDollar**: https://firstdollar.money/SoumilMukh6476
- **Referral**: https://firstdollar.money/?r=k3S11X
- **Blockchain Python**: https://github.com/topics/blockchain-python

---

**Built with love using Sepolia + Solidity + Next.js**

*Turn your gaming confidence into instant liquidity!*

# Ethereum Sepolia Deployment

- Contract Address: 0x029EF7bCEC712a440cfAbFA9d65c7D01786FD8A2
- Chain ID: 11155111
- Network: Sepolia Testnet

## Project Structure

```
├─ .env.local
├─ .eslintrc.json
├─ .gitignore
├─ GAME_CONFIGURATIONS.md
├─ README.md
├─ app
│  ├─ dashboard
│  │  └─ page.tsx
│  ├─ game
│  │  └─ [gameId]
│  │     └─ page.tsx
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
├─ components
│  ├─ Features.tsx
│  ├─ Footer.tsx
│  ├─ Header.tsx
│  ├─ Hero.tsx
│  ├─ HowItWorks.tsx
│  ├─ NotificationBar.tsx
│  ├─ StakedGamesDashboard.tsx
│  ├─ StakingInterface.tsx
│  ├─ Stats.tsx
│  ├─ ThemeProvider.tsx
│  ├─ ThemeToggle.tsx
│  ├─ UserDashboard.tsx
│  └─ WalletProvider.tsx
├─ contracts
│  ├─ .env
│  ├─ @openzeppelin
│  │  └─ contracts
│  │     ├─ crosschain
│  │     │  ├─ amb
│  │     │  ├─ arbitrum
│  │     │  ├─ errors.sol
│  │     │  ├─ optimism
│  │     │  └─ polygon
│  │     ├─ finance
│  │     ├─ governance
│  │     │  ├─ compatibility
│  │     │  ├─ extensions
│  │     │  └─ utils
│  │     ├─ interfaces
│  │     ├─ metatx
│  │     ├─ mocks
│  │     │  ├─ ERC165
│  │     │  ├─ compound
│  │     │  ├─ crosschain
│  │     │  ├─ docs
│  │     │  ├─ governance
│  │     │  ├─ proxy
│  │     │  ├─ token
│  │     │  └─ wizard
│  │     ├─ package.json
│  │     ├─ proxy
│  │     │  ├─ ERC1967
│  │     │  ├─ beacon
│  │     │  ├─ transparent
│  │     │  └─ utils
│  │     ├─ security
│  │     ├─ token
│  │     │  ├─ ERC1155
│  │     │  │  ├─ extensions
│  │     │  │  ├─ presets
│  │     │  │  └─ utils
│  │     │  ├─ ERC20
│  │     │  │  ├─ extensions
│  │     │  │  ├─ presets
│  │     │  │  └─ utils
│  │     │  ├─ ERC721
│  │     │  │  ├─ extensions
│  │     │  │  ├─ presets
│  │     │  │  └─ utils
│  │     │  ├─ ERC777
│  │     │  │  └─ presets
│  │     │  └─ common
│  │     ├─ utils
│  │     │  ├─ cryptography
│  │     │  ├─ escrow
│  │     │  ├─ introspection
│  │     │  ├─ math
│  │     │  └─ structs
│  │     └─ vendor
│  ├─ StakeLiGames.sol
│  ├─ abi.json
│  ├─ bytecode.txt
│  ├─ compile.py
│  ├─ compile_solidity.py
│  ├─ compiled_contract.json
│  ├─ deploy.py
│  ├─ deploy_sepolia.py
│  ├─ deployment.json
│  ├─ hardhat.config.js
│  ├─ package.json
│  ├─ requirements.txt
│  ├─ scripts
│  │  └─ deploy.js
│  └─ staking_contract.py
├─ next.config.js
├─ package-lock.json
├─ package.json
├─ postcss.config.js
├─ public
│  └─ favicon.jpg
├─ tailwind.config.ts
├─ tsconfig.json
└─ types
   └─ ethereum.d.ts
```
