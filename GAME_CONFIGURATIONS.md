# 🎮 StakeLiGames - Game Configurations

## Official 6 LinkedIn Games

### 1. **Queens** 👑
- **Difficulty:** Hard
- **Scoring:** Time-based
- **Target:** <40 seconds
- **Base Reward:** 25%
- **Flawless Bonus:** +10%
- **Total Max:** 35%

### 2. **Crossclimb** 🧗
- **Difficulty:** Hard
- **Scoring:** Time-based
- **Target:** <50 seconds
- **Base Reward:** 25%
- **Flawless Bonus:** +10%
- **Total Max:** 35%

### 3. **Mini Sudoku** 🔢
- **Difficulty:** Medium
- **Scoring:** Time-based
- **Target:** <80 seconds
- **Base Reward:** 20%
- **Flawless Bonus:** +8%
- **Total Max:** 28%

### 4. **Tango** 💃
- **Difficulty:** Medium
- **Scoring:** Time-based
- **Target:** <90 seconds
- **Base Reward:** 20%
- **Flawless Bonus:** +8%
- **Total Max:** 28%

### 5. **Zip** ⚡
- **Difficulty:** Easy
- **Scoring:** Time-based
- **Target:** <120 seconds
- **Base Reward:** 15%
- **Flawless Bonus:** +5%
- **Total Max:** 20%

### 6. **Pinpoint** 🎯
- **Difficulty:** Special
- **Scoring:** Score-based (1-5 or NA)
- **Target:** ≤5 score (1-5, or NA if unsolved)
- **Base Reward:** 30%
- **Flawless Bonus:** N/A (not applicable)
- **Total Max:** 30%
- **Note:** Only game without flawless bonus option

---

## Scoring Systems

### Time-Based Games (5 games)
- Queens, Crossclimb, Mini Sudoku, Tango, Zip
- **Metric:** Completion time in seconds
- **Rule:** Must complete under target time
- **Flawless Option:** Available (no hints, no mistakes)

### Score-Based Game (1 game)
- Pinpoint only
- **Metric:** Score from 1-5, or NA
- **Rule:** Score must be ≤ target (lower is better)
- **NA Value:** Means puzzle was not successfully solved within 5 tries
- **Flawless Option:** Not available

---

## Reward Tiers

| Difficulty | Base Reward | Flawless Bonus | Total Max |
|------------|-------------|----------------|-----------|
| Hard       | 25%         | +10%           | **35%**   |
| Medium     | 20%         | +8%            | **28%**   |
| Easy       | 15%         | +5%            | **20%**   |
| Special    | 30%         | N/A            | **30%**   |

---

## Flawless Solve Rules

### What Qualifies as Flawless?
- ✅ No hints used
- ✅ No incorrect attempts/mistakes
- ✅ First-try success (where applicable)
- ✅ Pure skill and knowledge

### Benefits for Honest Solvers
- 🏆 Extra rewards up to +10%
- ⚡ Recognition for legitimate gameplay
- 💎 Higher total payouts (up to 35% vs 30%)

### Why It Matters
Players who use hints or make multiple attempts don't qualify for the flawless bonus. This rewards players like you who solve honestly and skillfully!

---

## Contract Integration

### Smart Contract Parameters
```solidity
function createGame(
    string gameId,        // Unique identifier
    string gameType,      // "queens", "crossclimb", etc.
    uint256 targetScore,  // Time in seconds OR score (1-5) for Pinpoint
    uint256 stakeAmount   // USDC amount (6 decimals)
)
```

### Example Stakes

**Queens (Time-based with Flawless):**
- Stake: 100 USDC
- Target: 35 seconds
- Flawless: Yes
- Potential Return: 135 USDC (25% + 10% bonus)

**Pinpoint (Score-based, no Flawless):**
- Stake: 100 USDC
- Target Score: 3
- Flawless: N/A
- Potential Return: 130 USDC (30% base only)

---

## UI Display

### Homepage Hero Section
Shows 2 featured games:
- Queens: <40 sec, +25%
- Crossclimb: <50 sec, +25%

### Staking Interface
- 3-column grid showing all 6 games
- Dynamic labels (seconds vs score)
- Conditional flawless checkbox (hidden for Pinpoint)
- Real-time reward calculations

---

**Last Updated:** November 23, 2025
**Contract Address:** 0xF419ccaDF195D72B1B6C5F3F38F6143273b085cf
**Network:** Ethereum Sepolia Testnet
