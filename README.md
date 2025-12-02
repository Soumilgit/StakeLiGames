# StakeLiGames - Stake on LinkedIn Games Scores
<a href="https://www.producthunt.com/products/stakeligames?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-stakeligames" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1044696&theme=neutral&t=1764664965863" alt="StakeLiGames - Protocol&#0032;to&#0032;stake&#0032;on&#0032;your&#0032;LinkedIn&#0032;games&#0032;performance | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

Stake on your LinkedIn Games performance using stablecoins and earn rewards based on real, verified results. Built for LinkedIn Games fans using **Algorand blockchain** logic on **Sepolia** testnet, **PyTeal (Python smart contracts)**, **Solidity**, **TypeScript**, **TailWind** and **Next.js**.

![StakeLiGames](https://img.shields.io/badge/chain-Sepolia-00D4AA?style=for-the-badge)
![PyTeal](https://img.shields.io/badge/contracts-PyTeal-6366F1?style=for-the-badge)
![Next.js](https://img.shields.io/badge/frontend-Next.js-000000?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/language-TypeScript-3178C6?style=for-the-badge)

## Demo pics

<img width="1549" height="871" alt="contract-successful-deployment-re" src="https://github.com/user-attachments/assets/55c5303f-4819-469a-925e-c6d8eaee33b9" />
<img width="1919" height="986" alt="image" src="https://github.com/user-attachments/assets/248d9838-307e-493c-a2e2-334175884a9d" />
<img width="1919" height="881" alt="why" src="https://github.com/user-attachments/assets/77e2e34a-c6e2-45a8-b79d-6a4999346276" />
<img width="1919" height="858" alt="info" src="https://github.com/user-attachments/assets/c185a564-b375-41f7-a872-cb4cb03ae24e" />
<img width="1393" height="887" alt="start" src="https://github.com/user-attachments/assets/93730066-20ca-4264-a990-541e55a7867a" />
<img width="1919" height="812" alt="foot" src="https://github.com/user-attachments/assets/53bb4d6b-6fa9-4ba4-95a5-2a9c214627de" />
<img width="1919" height="983" alt="dashboard-onchain" src="https://github.com/user-attachments/assets/00aaf2bc-60ce-48fb-ab30-fbcc9fce7ad2" />

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
NEXT_PUBLIC_NETWORK_NAME=Sepolia Testnet

# Smart Contract Addresses
NEXT_PUBLIC_CONTRACT_ADDRESS=
NEXT_PUBLIC_USDC_ADDRESS=

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

## Algorand Testnet Resources

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

- **Algorand Discord**: https://discord.gg/algorand
- **PyTeal Docs**: https://pyteal.readthedocs.ionot
- **Next.js Docs**: https://nextjs.org/docs

## Links

- **FirstDollar**: https://firstdollar.money/SoumilMukh6476
- **Referral**: https://firstdollar.money/?r=k3S11X

- **Blockchain Python**: https://github.com/topics/blockchain-python

---

**Built with love using Algorand + PyTeal + Next.js**

*Turn your gaming confidence into instant liquidity!*
# Ethereum Sepolia Deployment

- Contract Address: 0x68900B5594De2D84FeE2265b01B3481b090E11e8
- Chain ID: 11155111
- Network: Sepolia Testnet

## Project Structure

```
📦 StakeLiGames
├─ .env.example
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
│  ├─ .env.example
│  ├─ @openzeppelin
│  │  └─ contracts
│  │     ├─ access
│  │     │  ├─ AccessControl.sol
│  │     │  ├─ AccessControlCrossChain.sol
│  │     │  ├─ AccessControlDefaultAdminRules.sol
│  │     │  ├─ AccessControlEnumerable.sol
│  │     │  ├─ IAccessControl.sol
│  │     │  ├─ IAccessControlDefaultAdminRules.sol
│  │     │  ├─ IAccessControlEnumerable.sol
│  │     │  ├─ Ownable.sol
│  │     │  ├─ Ownable2Step.sol
│  │     │  └─ README.adoc
│  │     ├─ crosschain
│  │     │  ├─ CrossChainEnabled.sol
│  │     │  ├─ README.adoc
│  │     │  ├─ amb
│  │     │  │  ├─ CrossChainEnabledAMB.sol
│  │     │  │  └─ LibAMB.sol
│  │     │  ├─ arbitrum
│  │     │  │  ├─ CrossChainEnabledArbitrumL1.sol
│  │     │  │  ├─ CrossChainEnabledArbitrumL2.sol
│  │     │  │  ├─ LibArbitrumL1.sol
│  │     │  │  └─ LibArbitrumL2.sol
│  │     │  ├─ errors.sol
│  │     │  ├─ optimism
│  │     │  │  ├─ CrossChainEnabledOptimism.sol
│  │     │  │  └─ LibOptimism.sol
│  │     │  └─ polygon
│  │     │     └─ CrossChainEnabledPolygonChild.sol
│  │     ├─ finance
│  │     │  ├─ PaymentSplitter.sol
│  │     │  ├─ README.adoc
│  │     │  └─ VestingWallet.sol
│  │     ├─ governance
│  │     │  ├─ Governor.sol
│  │     │  ├─ IGovernor.sol
│  │     │  ├─ README.adoc
│  │     │  ├─ TimelockController.sol
│  │     │  ├─ compatibility
│  │     │  │  ├─ GovernorCompatibilityBravo.sol
│  │     │  │  └─ IGovernorCompatibilityBravo.sol
│  │     │  ├─ extensions
│  │     │  │  ├─ GovernorCountingSimple.sol
│  │     │  │  ├─ GovernorPreventLateQuorum.sol
│  │     │  │  ├─ GovernorProposalThreshold.sol
│  │     │  │  ├─ GovernorSettings.sol
│  │     │  │  ├─ GovernorTimelockCompound.sol
│  │     │  │  ├─ GovernorTimelockControl.sol
│  │     │  │  ├─ GovernorVotes.sol
│  │     │  │  ├─ GovernorVotesComp.sol
│  │     │  │  ├─ GovernorVotesQuorumFraction.sol
│  │     │  │  └─ IGovernorTimelock.sol
│  │     │  └─ utils
│  │     │     ├─ IVotes.sol
│  │     │     └─ Votes.sol
│  │     ├─ interfaces
│  │     │  ├─ IERC1155.sol
│  │     │  ├─ IERC1155MetadataURI.sol
│  │     │  ├─ IERC1155Receiver.sol
│  │     │  ├─ IERC1271.sol
│  │     │  ├─ IERC1363.sol
│  │     │  ├─ IERC1363Receiver.sol
│  │     │  ├─ IERC1363Spender.sol
│  │     │  ├─ IERC165.sol
│  │     │  ├─ IERC1820Implementer.sol
│  │     │  ├─ IERC1820Registry.sol
│  │     │  ├─ IERC1967.sol
│  │     │  ├─ IERC20.sol
│  │     │  ├─ IERC20Metadata.sol
│  │     │  ├─ IERC2309.sol
│  │     │  ├─ IERC2612.sol
│  │     │  ├─ IERC2981.sol
│  │     │  ├─ IERC3156.sol
│  │     │  ├─ IERC3156FlashBorrower.sol
│  │     │  ├─ IERC3156FlashLender.sol
│  │     │  ├─ IERC4626.sol
│  │     │  ├─ IERC4906.sol
│  │     │  ├─ IERC5267.sol
│  │     │  ├─ IERC5313.sol
│  │     │  ├─ IERC5805.sol
│  │     │  ├─ IERC6372.sol
│  │     │  ├─ IERC721.sol
│  │     │  ├─ IERC721Enumerable.sol
│  │     │  ├─ IERC721Metadata.sol
│  │     │  ├─ IERC721Receiver.sol
│  │     │  ├─ IERC777.sol
│  │     │  ├─ IERC777Recipient.sol
│  │     │  ├─ IERC777Sender.sol
│  │     │  ├─ README.adoc
│  │     │  ├─ draft-IERC1822.sol
│  │     │  └─ draft-IERC2612.sol
│  │     ├─ metatx
│  │     │  ├─ ERC2771Context.sol
│  │     │  ├─ MinimalForwarder.sol
│  │     │  └─ README.adoc
│  │     ├─ mocks
│  │     │  ├─ AccessControlCrossChainMock.sol
│  │     │  ├─ ArraysMock.sol
│  │     │  ├─ CallReceiverMock.sol
│  │     │  ├─ ConditionalEscrowMock.sol
│  │     │  ├─ ContextMock.sol
│  │     │  ├─ DummyImplementation.sol
│  │     │  ├─ EIP712Verifier.sol
│  │     │  ├─ ERC1271WalletMock.sol
│  │     │  ├─ ERC165
│  │     │  │  ├─ ERC165MaliciousData.sol
│  │     │  │  ├─ ERC165MissingData.sol
│  │     │  │  ├─ ERC165NotSupported.sol
│  │     │  │  └─ ERC165ReturnBomb.sol
│  │     │  ├─ ERC20Mock.sol
│  │     │  ├─ ERC20Reentrant.sol
│  │     │  ├─ ERC2771ContextMock.sol
│  │     │  ├─ ERC3156FlashBorrowerMock.sol
│  │     │  ├─ ERC4626Mock.sol
│  │     │  ├─ EtherReceiverMock.sol
│  │     │  ├─ InitializableMock.sol
│  │     │  ├─ MulticallTest.sol
│  │     │  ├─ MultipleInheritanceInitializableMocks.sol
│  │     │  ├─ PausableMock.sol
│  │     │  ├─ PullPaymentMock.sol
│  │     │  ├─ ReentrancyAttack.sol
│  │     │  ├─ ReentrancyMock.sol
│  │     │  ├─ RegressionImplementation.sol
│  │     │  ├─ SafeMathMemoryCheck.sol
│  │     │  ├─ SingleInheritanceInitializableMocks.sol
│  │     │  ├─ StorageSlotMock.sol
│  │     │  ├─ TimelockReentrant.sol
│  │     │  ├─ TimersBlockNumberImpl.sol
│  │     │  ├─ TimersTimestampImpl.sol
│  │     │  ├─ VotesMock.sol
│  │     │  ├─ compound
│  │     │  │  └─ CompTimelock.sol
│  │     │  ├─ crosschain
│  │     │  │  ├─ bridges.sol
│  │     │  │  └─ receivers.sol
│  │     │  ├─ docs
│  │     │  │  └─ ERC4626Fees.sol
│  │     │  ├─ governance
│  │     │  │  ├─ GovernorCompMock.sol
│  │     │  │  ├─ GovernorCompatibilityBravoMock.sol
│  │     │  │  ├─ GovernorMock.sol
│  │     │  │  ├─ GovernorPreventLateQuorumMock.sol
│  │     │  │  ├─ GovernorTimelockCompoundMock.sol
│  │     │  │  ├─ GovernorTimelockControlMock.sol
│  │     │  │  ├─ GovernorVoteMock.sol
│  │     │  │  └─ GovernorWithParamsMock.sol
│  │     │  ├─ proxy
│  │     │  │  ├─ BadBeacon.sol
│  │     │  │  ├─ ClashingImplementation.sol
│  │     │  │  ├─ UUPSLegacy.sol
│  │     │  │  └─ UUPSUpgradeableMock.sol
│  │     │  ├─ token
│  │     │  │  ├─ ERC1155ReceiverMock.sol
│  │     │  │  ├─ ERC20DecimalsMock.sol
│  │     │  │  ├─ ERC20ExcessDecimalsMock.sol
│  │     │  │  ├─ ERC20FlashMintMock.sol
│  │     │  │  ├─ ERC20ForceApproveMock.sol
│  │     │  │  ├─ ERC20MulticallMock.sol
│  │     │  │  ├─ ERC20NoReturnMock.sol
│  │     │  │  ├─ ERC20PermitNoRevertMock.sol
│  │     │  │  ├─ ERC20ReturnFalseMock.sol
│  │     │  │  ├─ ERC20VotesLegacyMock.sol
│  │     │  │  ├─ ERC4626OffsetMock.sol
│  │     │  │  ├─ ERC4646FeesMock.sol
│  │     │  │  ├─ ERC721ConsecutiveEnumerableMock.sol
│  │     │  │  ├─ ERC721ConsecutiveMock.sol
│  │     │  │  ├─ ERC721ReceiverMock.sol
│  │     │  │  ├─ ERC721URIStorageMock.sol
│  │     │  │  ├─ ERC777Mock.sol
│  │     │  │  ├─ ERC777SenderRecipientMock.sol
│  │     │  │  └─ VotesTimestamp.sol
│  │     │  └─ wizard
│  │     │     ├─ MyGovernor1.sol
│  │     │     ├─ MyGovernor2.sol
│  │     │     └─ MyGovernor3.sol
│  │     ├─ package.json
│  │     ├─ proxy
│  │     │  ├─ Clones.sol
│  │     │  ├─ ERC1967
│  │     │  │  ├─ ERC1967Proxy.sol
│  │     │  │  └─ ERC1967Upgrade.sol
│  │     │  ├─ Proxy.sol
│  │     │  ├─ README.adoc
│  │     │  ├─ beacon
│  │     │  │  ├─ BeaconProxy.sol
│  │     │  │  ├─ IBeacon.sol
│  │     │  │  └─ UpgradeableBeacon.sol
│  │     │  ├─ transparent
│  │     │  │  ├─ ProxyAdmin.sol
│  │     │  │  └─ TransparentUpgradeableProxy.sol
│  │     │  └─ utils
│  │     │     ├─ Initializable.sol
│  │     │     └─ UUPSUpgradeable.sol
│  │     ├─ security
│  │     │  ├─ Pausable.sol
│  │     │  ├─ PullPayment.sol
│  │     │  ├─ README.adoc
│  │     │  └─ ReentrancyGuard.sol
│  │     ├─ token
│  │     │  ├─ ERC1155
│  │     │  │  ├─ ERC1155.sol
│  │     │  │  ├─ IERC1155.sol
│  │     │  │  ├─ IERC1155Receiver.sol
│  │     │  │  ├─ README.adoc
│  │     │  │  ├─ extensions
│  │     │  │  │  ├─ ERC1155Burnable.sol
│  │     │  │  │  ├─ ERC1155Pausable.sol
│  │     │  │  │  ├─ ERC1155Supply.sol
│  │     │  │  │  ├─ ERC1155URIStorage.sol
│  │     │  │  │  └─ IERC1155MetadataURI.sol
│  │     │  │  ├─ presets
│  │     │  │  │  ├─ ERC1155PresetMinterPauser.sol
│  │     │  │  │  └─ README.md
│  │     │  │  └─ utils
│  │     │  │     ├─ ERC1155Holder.sol
│  │     │  │     └─ ERC1155Receiver.sol
│  │     │  ├─ ERC20
│  │     │  │  ├─ ERC20.sol
│  │     │  │  ├─ IERC20.sol
│  │     │  │  ├─ README.adoc
│  │     │  │  ├─ extensions
│  │     │  │  │  ├─ ERC20Burnable.sol
│  │     │  │  │  ├─ ERC20Capped.sol
│  │     │  │  │  ├─ ERC20FlashMint.sol
│  │     │  │  │  ├─ ERC20Pausable.sol
│  │     │  │  │  ├─ ERC20Permit.sol
│  │     │  │  │  ├─ ERC20Snapshot.sol
│  │     │  │  │  ├─ ERC20Votes.sol
│  │     │  │  │  ├─ ERC20VotesComp.sol
│  │     │  │  │  ├─ ERC20Wrapper.sol
│  │     │  │  │  ├─ ERC4626.sol
│  │     │  │  │  ├─ IERC20Metadata.sol
│  │     │  │  │  ├─ IERC20Permit.sol
│  │     │  │  │  ├─ draft-ERC20Permit.sol
│  │     │  │  │  └─ draft-IERC20Permit.sol
│  │     │  │  ├─ presets
│  │     │  │  │  ├─ ERC20PresetFixedSupply.sol
│  │     │  │  │  ├─ ERC20PresetMinterPauser.sol
│  │     │  │  │  └─ README.md
│  │     │  │  └─ utils
│  │     │  │     ├─ SafeERC20.sol
│  │     │  │     └─ TokenTimelock.sol
│  │     │  ├─ ERC721
│  │     │  │  ├─ ERC721.sol
│  │     │  │  ├─ IERC721.sol
│  │     │  │  ├─ IERC721Receiver.sol
│  │     │  │  ├─ README.adoc
│  │     │  │  ├─ extensions
│  │     │  │  │  ├─ ERC721Burnable.sol
│  │     │  │  │  ├─ ERC721Consecutive.sol
│  │     │  │  │  ├─ ERC721Enumerable.sol
│  │     │  │  │  ├─ ERC721Pausable.sol
│  │     │  │  │  ├─ ERC721Royalty.sol
│  │     │  │  │  ├─ ERC721URIStorage.sol
│  │     │  │  │  ├─ ERC721Votes.sol
│  │     │  │  │  ├─ ERC721Wrapper.sol
│  │     │  │  │  ├─ IERC721Enumerable.sol
│  │     │  │  │  ├─ IERC721Metadata.sol
│  │     │  │  │  └─ draft-ERC721Votes.sol
│  │     │  │  ├─ presets
│  │     │  │  │  ├─ ERC721PresetMinterPauserAutoId.sol
│  │     │  │  │  └─ README.md
│  │     │  │  └─ utils
│  │     │  │     └─ ERC721Holder.sol
│  │     │  ├─ ERC777
│  │     │  │  ├─ ERC777.sol
│  │     │  │  ├─ IERC777.sol
│  │     │  │  ├─ IERC777Recipient.sol
│  │     │  │  ├─ IERC777Sender.sol
│  │     │  │  ├─ README.adoc
│  │     │  │  └─ presets
│  │     │  │     └─ ERC777PresetFixedSupply.sol
│  │     │  └─ common
│  │     │     ├─ ERC2981.sol
│  │     │     └─ README.adoc
│  │     ├─ utils
│  │     │  ├─ Address.sol
│  │     │  ├─ Arrays.sol
│  │     │  ├─ Base64.sol
│  │     │  ├─ Checkpoints.sol
│  │     │  ├─ Context.sol
│  │     │  ├─ Counters.sol
│  │     │  ├─ Create2.sol
│  │     │  ├─ Multicall.sol
│  │     │  ├─ README.adoc
│  │     │  ├─ ShortStrings.sol
│  │     │  ├─ StorageSlot.sol
│  │     │  ├─ Strings.sol
│  │     │  ├─ Timers.sol
│  │     │  ├─ cryptography
│  │     │  │  ├─ ECDSA.sol
│  │     │  │  ├─ EIP712.sol
│  │     │  │  ├─ MerkleProof.sol
│  │     │  │  ├─ SignatureChecker.sol
│  │     │  │  └─ draft-EIP712.sol
│  │     │  ├─ escrow
│  │     │  │  ├─ ConditionalEscrow.sol
│  │     │  │  ├─ Escrow.sol
│  │     │  │  └─ RefundEscrow.sol
│  │     │  ├─ introspection
│  │     │  │  ├─ ERC165.sol
│  │     │  │  ├─ ERC165Checker.sol
│  │     │  │  ├─ ERC165Storage.sol
│  │     │  │  ├─ ERC1820Implementer.sol
│  │     │  │  ├─ IERC165.sol
│  │     │  │  ├─ IERC1820Implementer.sol
│  │     │  │  └─ IERC1820Registry.sol
│  │     │  ├─ math
│  │     │  │  ├─ Math.sol
│  │     │  │  ├─ SafeCast.sol
│  │     │  │  ├─ SafeMath.sol
│  │     │  │  ├─ SignedMath.sol
│  │     │  │  └─ SignedSafeMath.sol
│  │     │  └─ structs
│  │     │     ├─ BitMaps.sol
│  │     │     ├─ DoubleEndedQueue.sol
│  │     │     ├─ EnumerableMap.sol
│  │     │     └─ EnumerableSet.sol
│  │     └─ vendor
│  │        ├─ amb
│  │        │  └─ IAMB.sol
│  │        ├─ arbitrum
│  │        │  ├─ IArbSys.sol
│  │        │  ├─ IBridge.sol
│  │        │  ├─ IDelayedMessageProvider.sol
│  │        │  ├─ IInbox.sol
│  │        │  └─ IOutbox.sol
│  │        ├─ compound
│  │        │  ├─ ICompoundTimelock.sol
│  │        │  └─ LICENSE
│  │        ├─ optimism
│  │        │  ├─ ICrossDomainMessenger.sol
│  │        │  └─ LICENSE
│  │        └─ polygon
│  │           └─ IFxMessageProcessor.sol
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
