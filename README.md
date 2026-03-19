# StakeLiGames - Stake on LinkedIn Games Scores
<a href="https://www.producthunt.com/products/stakeligames?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-stakeligames" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1044696&theme=neutral&t=1764664965863" alt="StakeLiGames - Protocol&#0032;to&#0032;stake&#0032;on&#0032;your&#0032;LinkedIn&#0032;games&#0032;performance | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

Stake on your LinkedIn Games performance using stablecoins and earn rewards based on real, verified results. Built for LinkedIn Games fans using **Algorand blockchain** logic on **Sepolia** testnet, **PyTeal (Python smart contracts)**, **Solidity**, **TypeScript**, **TailWind** and **Next.js**.

![StakeLiGames](https://img.shields.io/badge/chain-Sepolia-00D4AA?style=for-the-badge)
![PyTeal](https://img.shields.io/badge/contracts-PyTeal-6366F1?style=for-the-badge)
![Next.js](https://img.shields.io/badge/frontend-Next.js-000000?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/language-TypeScript-3178C6?style=for-the-badge)

## Demo pics

<img width="1063" height="932" alt="contract-successful-dep-new" src="https://github.com/user-attachments/assets/223cfff8-d88f-4d18-b499-005f45883fc3" />
<img width="1919" height="986" alt="image" src="https://github.com/user-attachments/assets/248d9838-307e-493c-a2e2-334175884a9d" />
<img width="1919" height="881" alt="why" src="https://github.com/user-attachments/assets/77e2e34a-c6e2-45a8-b79d-6a4999346276" />
<img width="1919" height="858" alt="info" src="https://github.com/user-attachments/assets/c185a564-b375-41f7-a872-cb4cb03ae24e" />
<img width="1345" height="877" alt="stake-part" src="https://github.com/user-attachments/assets/7032fa38-f360-4ffa-8100-d4cdb1b85422" />
<img width="1919" height="812" alt="foot" src="https://github.com/user-attachments/assets/53bb4d6b-6fa9-4ba4-95a5-2a9c214627de" />
<img width="1427" height="881" alt="image" src="https://github.com/user-attachments/assets/97b9c110-ac34-4612-8dad-669589a8efd7" />
<img width="1390" height="371" alt="image" src="https://github.com/user-attachments/assets/6c862456-b2eb-4c11-b066-d4aacec06f13" />
<img width="1388" height="247" alt="image" src="https://github.com/user-attachments/assets/68c0d741-e642-4d64-981e-6baa8fabd9c0" />



## Features

- Sepolia Testnet - All staking and rewards use the Ethereum Sepolia testnet for fast, low-cost testing
- USDC Stablecoin - Stake and earn rewards using Sepolia USDC (ERC20)
- Algorand Blockchain - Fast, secure, and near-zero transaction fees
- Python Smart Contracts - PyTeal for readable, Python-based blockchain logic
- USDC Staking - Stake stablecoins on your LinkedIn Games scores
- Score Verification - On-chain verification of game performance
- Instant Rewards - Earn up to 20% APY when you meet your target score
- Pera/Defly Wallet - Easy wallet integration for Algorand
- Pleasant UI - Clean, minimal design inspired by competitive gaming and LinkedIn Games
- Zero Gas Fees - Free testnet transactions, minimal mainnet costs

## How It Works

1. Connect Wallet - Link your MetaMask wallet (Sepolia testnet)
2. Choose Game - Select a LinkedIn Game (Queens, Crossword, Pinpoint, Tango, Zip & Mini Sudoku)
3. Stake USDC - Set your target and stake amount (minimum: 0.01 USDC)
4. Play & Verify - Complete the game and verify your result on-chain
5. Earn Rewards - Meet your target = get your stake back + 20% APY!

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **TailwindCSS** - For the styling
- **Framer Motion** - Smooth animations
- **Chart.js** - For the result analytics on dashboard
- **@txnlab/use-wallet** - Algorand wallet connection
- **Solidity** - For 1 smart contract
- **algosdk** - Algorand JavaScript SDK

### Smart Contracts (Blockchain)
- **PyTeal** - Python for Algorand smart contracts
- **Sepolia Testnet** - Free, fast blockchain (3.7s finality)
- **TEAL** - Algorand's compiled contract language
- **Box Storage** - Scalable on-chain data storage

### Backend/Scripts
- **Python 3.8+** - Contract compilation & deployment
- **py-sepolia-sdk** - Python SDK for Sepolia

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
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

### 3. Compile Smart Contracts (PyTeal → TEAL)

```bash
# From contracts directory
python compile_solidity.py
```

This generates:
- `staking_approval.teal` - Main contract logic
- `staking_clear.teal` - Clear state program

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
# From contracts directory (with venv activated)
python deploy_sepolia.py
```

**Options:**
- **Enter existing mnemonic** (25 words from your wallet) OR
- **Press Enter** to generate a new account (you'll need to fund it)

The deployment script will:
- Compile PyTeal → TEAL
- Deploy to Algorand testnet
- Generate Application ID
- Create `.env.local` with config

**Output:**
```
Contract deployed successfully!
Application ID: 123456789
Application Address: XXXX...
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

# Historical / Legacy Contracts (optional)
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

3. Configure Stake:
   - Enter USDC amount (min: 0.01 USDC)
   - Set your target (time or score, as per game)
   - Review estimated returns

4. Create Stake - Approve transaction in wallet

5. Play Game - Complete your LinkedIn Game

6. Verify Result - Submit your result to claim rewards

### Verify & Claim Rewards

```javascript
// Example: Verify score and claim rewards
// This functionality will trigger the smart contract to:
// - Check if score >= target
// - If YES: Return stake + 20% reward
// - If NO: Stake goes to reward pool
```

## Available Scripts

```bash
# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Smart Contracts
npm run contracts:compile   # Compile PyTeal contracts
npm run contracts:deploy    # Deploy to Sepolia

# Python (from contracts/)
python compile_solidity.py    # Compile contracts
python deploy_sepolia.py     # Deploy to testnet
```

## Testnet Resources

- **Faucet**: https://sepolia-faucet.pk910.de/#/ (Get free Sepolia ETH - Official)
- **Explorer Options**:
  - https://testnet.explorer.perawallet.app (Pera Explorer - Recommended)
  - https://testnet.explorer.lora.algokit.io (Lora Explorer)
  - https://app.dappflow.org/explorer (Dappflow)
- **Docs**: https://developer.algorand.org (Algorand dev docs)
- **PyTeal Guide**: https://pyteal.readthedocs.io (Smart contract docs)
- **AlgoNode API**: https://testnet-api.algonode.cloud (Free RPC node - Most reliable)

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

**Box Storage (scalable):**
- Game data: player, target score, stake amount, timestamp, status

### Contract Methods

1. `create_game` - Create new stake on game result
   - Args: game_id, target_score, stake_amount
   - Requires: USDC transfer to contract (min: 0.01 USDC)

2. `verify_payout` - Verify result and distribute rewards
   - Args: game_id, actual_score
   - Logic: If result meets/exceeds target → return stake + reward (see above)
   - Else: stake → reward pool

3. `withdraw_fees` - Owner withdraws platform fees
   - Args: amount
   - Requires: Owner signature

## UI Design Philosophy

- **Clean & Minimal** - Inspired by the challenge and excitement of LinkedIn Games
- **Accessible** - High contrast, readable fonts
- **Responsive** - Mobile-first design

## Security Features

- **OpenZeppelin patterns** (Algorand equivalent)
- **Reentrancy protection** via atomic transactions
- **Access control** for admin functions
- **Box storage** for scalability
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
- **Algorand Discord**: https://discord.gg/algorand
- **PyTeal Docs**: https://pyteal.readthedocs.ionot
- **Next.js Docs**: https://nextjs.org/docs

## Links

- **Video Demo**: https://youtu.be/MYxh5ZZ6iFs
- **FirstDollar**: https://firstdollar.money/SoumilMukh6476
- **Referral**: https://firstdollar.money/?r=k3S11X
- **Blockchain Python**: https://github.com/topics/blockchain-python

---

**Built with love using Algorand + Sepolia + PyTeal + Next.js**

*Turn your gaming confidence into instant liquidity!*

# Ethereum Sepolia Deployment

- Contract Address: 0xEe1CAE5AE62084Ed655e11d9811662EB063f9d02
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
