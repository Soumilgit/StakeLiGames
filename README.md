# StakeLiGames - Stake on LinkedIn Games Scores
<a href="https://www.producthunt.com/products/stakeligames?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-stakeligames" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1044696&theme=neutral&t=1764664965863" alt="StakeLiGames - Protocol&#0032;to&#0032;stake&#0032;on&#0032;your&#0032;LinkedIn&#0032;games&#0032;performance | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

Stake on your LinkedIn Games performance using stablecoins and earn rewards based on real, verified results. Built for LinkedIn Games fans on **Ethereum Sepolia** using **Solidity**, **TypeScript**, **Tailwind**, and **Next.js**.

![StakeLiGames](https://img.shields.io/badge/chain-Sepolia-00D4AA?style=for-the-badge)
![Solidity](https://img.shields.io/badge/contracts-Solidity-363636?style=for-the-badge)
![Next.js](https://img.shields.io/badge/frontend-Next.js-000000?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/language-TypeScript-3178C6?style=for-the-badge)

## Demo pics

<img width="850" height="751" alt="deployedcontract" src="https://github.com/user-attachments/assets/3a23cbfc-a9a1-4da7-a502-615ff078111a" />
<img width="1532" height="786" alt="hero-section-light" src="https://github.com/user-attachments/assets/118e47a6-919b-478d-b0ab-3453e30a7ebd" />
<img width="1536" height="704" alt="why-stake-light" src="https://github.com/user-attachments/assets/25b3ef27-eec0-437f-8841-941866280f6f" />
<img width="1536" height="598" alt="cashflow-light" src="https://github.com/user-attachments/assets/1a699617-85de-4baf-ab5f-ea5c5743ae5a" />
<img width="913" height="716" alt="staking-interface-light" src="https://github.com/user-attachments/assets/f896d427-9ca0-4106-8a2b-db05eb295b39" />
<img width="1536" height="709" alt="footer-light" src="https://github.com/user-attachments/assets/8c2dc2d2-2fb5-4323-ac60-80832a4e33ce" />
<img width="1027" height="723" alt="dashboard-light" src="https://github.com/user-attachments/assets/b3f84364-e79f-4c9a-87ab-5e430348e7aa" />
<img width="491" height="355" alt="submit-light" src="https://github.com/user-attachments/assets/3fb37d4b-d7b7-4cc4-b045-d1902e589216" />

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
2. Choose Game - Select from 8 LinkedIn Games (Queens, Crossclimb, Pinpoint, Tango, Zip, Mini Sudoku, Wend, Patches)
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

Also, create `.env ` here:

```env
PRIVATE_KEY=
SEPOLIA_RPC_URL=https://rpc.sepolia.org
NEXT_PUBLIC_USDC_ADDRESS=

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

1. Get free Sepolia ETH from https://sepolia-faucet.pk910.de/#/ via your wallet address
2. Visit https://faucet.circle.com/ - the official Circle Sepolia USDC faucet
3. Connect your wallet (e.g., MetaMask) and select the Sepolia network
4. Paste your latest contract/wallet address and request testnet USDC
5. Confirm the transaction in your wallet
6. You will receive Sepolia USDC directly to your wallet (no asset opt-in required)

**Note:** The old Algorand testnet asset (ID 10458941) is no longer used. All staking and rewards now use Sepolia USDC.

### 5. Deploy Smart Contract

```bash
# From contracts directory
python deploy_sepolia.py
```

### 6. Set Maximum Target Score

```bash
python set_max_target_scores.py
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
PRIVATE_KEY=""
NEXT_PUBLIC_APP_NAME=""
NEXT_PUBLIC_CHAIN_ID="11155111"
NEXT_PUBLIC_CONTRACT_ADDRESS=""
NEXT_PUBLIC_LEGACY_CONTRACT_ADDRESSES=""
NEXT_PUBLIC_NETWORK_NAME="Sepolia Testnet"
NEXT_PUBLIC_RPC_URL="https://rpc.sepolia.org"
NEXT_PUBLIC_SECOND_LAST_CONTRACT_ADDRESS=""
NEXT_PUBLIC_THIRD_LAST_CONTRACT_ADDRESSES=""
NEXT_PUBLIC_USDC_ADDRESS=""
RPC_URL="https://ethereum-sepolia.publicnode.com"

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
   - Wend (Hard) → 20% reward
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

- Contract Address: 0x60D96e2290CB500E315cE3f6eDf742afd6601663
- Chain ID: 11155111
- Network: Sepolia Testnet

## Project Structure

```
├─ .env.example
├─ .env.local
├─ .eslintrc.json
├─ .gitignore
├─ GAME_CONFIGURATIONS.md
├─ README.md
├─ StakeLiGames_flat.sol
├─ app
│  ├─ api
│  │  └─ verification
│  │     ├─ attest
│  │     │  └─ route.ts
│  │     └─ nonce
│  │        └─ route.ts
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
│  ├─ hardhat.config.js
│  ├─ package.json
│  ├─ requirements.txt
│  ├─ scripts
│  │  └─ deploy.js
│  ├─ set_max_target_scores.py
│  └─ staking_contract.py
├─ lib
│  └─ verificationStore.ts
├─ next.config.js
├─ package-lock.json
├─ package.json
├─ postcss.config.js
├─ public
│  ├─ crossclimb.jpg
│  ├─ favicon.jpg
│  ├─ minisudoku.jpg
│  ├─ patches.jpg
│  ├─ pinpoint.jpg
│  ├─ queens.jpg
│  ├─ tango.jpg
│  ├─ wend.jpg
│  └─ zip.jpg
├─ scripts
│  ├─ check_balances.js
│  ├─ inspect_game.js
│  ├─ retroactive_topup.js
│  └─ set_reverse.js
├─ tailwind.config.ts
├─ tsconfig.json
└─ types
   └─ ethereum.d.ts
```
