# StakeLiGames - Stake on Your LinkedIn Games Performance

Stake on your LinkedIn Games performance using stablecoins and earn rewards based on real, verified results. Built for LinkedIn Games fans using **Algorand blockchain**, **PyTeal (Python smart contracts)**, **Solidity**, **TypeScript**, **TailWind**, and **Next.js**.

![StakeLiGames](https://img.shields.io/badge/blockchain-Algorand-00D4AA?style=for-the-badge)
![PyTeal](https://img.shields.io/badge/contracts-PyTeal-6366F1?style=for-the-badge)
![Next.js](https://img.shields.io/badge/frontend-Next.js-000000?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/language-TypeScript-3178C6?style=for-the-badge)

## Demo pics

<img width="1048" height="923" alt="contract-successful-deployment" src="https://github.com/user-attachments/assets/c293cec4-d40f-413d-a02b-94100340c4e8" />
<img width="1919" height="984" alt="hero-section" src="https://github.com/user-attachments/assets/2b5f8d5d-9c04-4152-b976-f335403cb9fa" />
<img width="1919" height="881" alt="why" src="https://github.com/user-attachments/assets/77e2e34a-c6e2-45a8-b79d-6a4999346276" />
<img width="1919" height="858" alt="info" src="https://github.com/user-attachments/assets/c185a564-b375-41f7-a872-cb4cb03ae24e" />
<img width="1393" height="887" alt="start" src="https://github.com/user-attachments/assets/93730066-20ca-4264-a990-541e55a7867a" />
<img width="1650" height="660" alt="foot" src="https://github.com/user-attachments/assets/ea9a362d-4539-44af-9f2c-4e2f7eaded3b" />

## Features

- Algorand Blockchain - Fast, secure, and near-zero transaction fees
- Python Smart Contracts - PyTeal for readable, Python-based blockchain logic
- USDC Staking - Stake stablecoins on your LinkedIn Games scores
- Score Verification - On-chain verification of game performance
- Instant Rewards - Earn up to 20% APY when you meet your target score
- Pera/Defly Wallet - Easy wallet integration for Algorand
- Neo-Brutalist UI - Clean, minimal design inspired by competitive gaming and LinkedIn Games
- Zero Gas Fees - Free testnet transactions, minimal mainnet costs

## How It Works

1. Connect Wallet - Link your Pera or Defly wallet (Algorand testnet)
2. Choose Game - Select a LinkedIn Game (Queens, Crossword, Pinpoint, Tango)
3. Stake USDC - Set your target and stake amount (minimum: 0.01 USDC)
4. Play & Verify - Complete the game and verify your result on-chain
5. Earn Rewards - Meet your target = get your stake back + 20% APY!

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **TailwindCSS** - For the styling
- **Framer Motion** - Smooth animations
- **@txnlab/use-wallet** - Algorand wallet connection
- **Solidity** - For 1 smart contract
- **algosdk** - Algorand JavaScript SDK

### Smart Contracts (Blockchain)
- **PyTeal** - Python for Algorand smart contracts
- **Algorand Testnet** - Free, fast blockchain (3.7s finality)
- **TEAL** - Algorand's compiled contract language
- **Box Storage** - Scalable on-chain data storage

### Backend/Scripts
- **Python 3.8+** - Contract compilation & deployment
- **py-algorand-sdk** - Python SDK for Algorand

## Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.8+ and pip
- **Pera Wallet** or **Defly Wallet** (mobile or browser extension)
- **Algorand Testnet Account** (created via wallet)

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
python compile.py
```

This generates:
- `staking_approval.teal` - Main contract logic
- `staking_clear.teal` - Clear state program

### 4. Get Testnet ALGO

1. Install [Pera Wallet](https://perawallet.app/) (recommended) or [Defly Wallet](https://defly.app/)
2. Create a new account on **Algorand Testnet**
3. Copy your wallet address
4. Get free testnet ALGO from any of these faucets:
   - **Bank.testnet.algorand.network** (Primary): https://bank.testnet.algorand.network
   - **Dispenser API** (Backup): https://dispenser.testnet.aws.algodev.network
5. Paste your address and claim **10 ALGO** (free!)

### 5. Deploy Smart Contract

```bash
# From contracts directory (with venv activated)
python deploy.py
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
Application Address: XXXXXX...
View on AlgoExplorer: https://testnet.algoexplorer.io/application/123456789
```

### 6. Configure Frontend

The deployment script automatically creates `.env.local`:

```env
NEXT_PUBLIC_ALGOD_SERVER=https://testnet-api.algonode.cloud
NEXT_PUBLIC_ALGOD_PORT=443
NEXT_PUBLIC_INDEXER_SERVER=https://testnet-idx.algonode.cloud
NEXT_PUBLIC_INDEXER_PORT=443
NEXT_PUBLIC_NETWORK=testnet
NEXT_PUBLIC_STAKING_APP_ID=123456789
NEXT_PUBLIC_USDC_ASSET_ID=10458941
```

### 7. Run Development Server

```bash
# From project root
npm run dev
```

Open http://localhost:3000

## Get Testnet USDC

The testnet uses Asset ID `10458941` for USDC simulation:

1. Visit: https://testnet.explorer.perawallet.app/asset/10458941
   - Or: https://testnet.explorer.lora.algokit.io/asset/10458941
2. Opt-in to the asset in your wallet
3. Use testnet faucets or swap testnet ALGO → USDC

## Using the Platform

### Stake on a Game

1. Connect Wallet - Click "Connect Wallet" (top right)
2. Select Game:
   - Queens (Hard) - Complete in under 40 seconds → 25% reward
   - Crossclimb (Hard) - Complete in under 50 seconds → 25% reward
   - Mini Sudoku (Medium) - Complete in under 80 seconds → 20% reward
   - Tango (Medium) - Complete in under 90 seconds → 20% reward
   - Zip (Easy) - Complete in under 120 seconds → 15% reward
   - Pinpoint (Special) - Score 1-5 or NA → 30% reward

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

## Project Structure

```
StakeLiGames/
├── app/
│   ├── layout.tsx          # Root layout with WalletProvider
│   ├── page.tsx            # Main page
│   └── globals.css         # Global styles (TailwindCSS)
├── components/
│   ├── Header.tsx          # Navigation & wallet connection
│   ├── Hero.tsx            # Landing hero section
│   ├── Stats.tsx           # Platform statistics
│   ├── Features.tsx        # Feature cards
│   ├── HowItWorks.tsx      # Step-by-step guide
│   ├── StakingInterface.tsx # Main staking UI
│   ├── Footer.tsx          # Footer with links
│   └── WalletProvider.tsx  # Algorand wallet context
├── contracts/
│   ├── staking_contract.py # PyTeal smart contract
│   ├── compile.py          # Compile PyTeal → TEAL
│   ├── deploy.py           # Deploy to Algorand
│   └── requirements.txt    # Python dependencies
├── public/                 # Static assets
├── .env.example            # Environment template
├── package.json            # Node dependencies
├── tailwind.config.ts      # TailwindCSS config
├── tsconfig.json           # TypeScript config
└── README.md               # This file
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
npm run contracts:deploy    # Deploy to Algorand

# Python (from contracts/)
python compile.py    # Compile contracts
python deploy.py     # Deploy to testnet
```

## Algorand Testnet Resources

- **Faucet**: https://bank.testnet.algorand.network (Get free ALGO - Official)
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

### Algorand Mainnet

1. **Get Mainnet ALGO** (~0.5 ALGO for deployment)
2. **Update `.env`**:
   ```env
   NEXT_PUBLIC_ALGOD_SERVER=https://mainnet-api.algonode.cloud
   NEXT_PUBLIC_NETWORK=mainnet
   NEXT_PUBLIC_USDC_ASSET_ID=31566704  # Real USDC on Algorand
   ```
3. **Deploy contract**:
   ```bash
   python deploy.py  # Use mainnet-funded account
   ```
4. **Update frontend** with new APP_ID

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

- **Algorand Discord**: https://discord.gg/algorand
- **PyTeal Docs**: https://pyteal.readthedocs.io
- **Next.js Docs**: https://nextjs.org/docs

## Links

- **FirstDollar**: https://firstdollar.money/SoumilMukh6476
- **Referral**: https://firstdollar.money/?r=k3S11X

- **Blockchain Python**: https://github.com/topics/blockchain-python

---

**Built with love using Algorand + PyTeal + Next.js**

*Turn your gaming confidence into instant liquidity!*
# Ethereum Sepolia Deployment

- Contract Address: 0xF22995f0b507C9e7e02317e4190E55F20e611f54
- Chain ID: 11155111
- Network: Sepolia Testnet

