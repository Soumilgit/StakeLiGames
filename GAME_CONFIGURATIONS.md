# StakeLiGames - Game Configurations

## Official 7 LinkedIn Games

### 1. **Queens**
- **Difficulty:** Hard
- **Scoring:** Time-based
- **Base Reward:** 25%
- **Flawless Bonus:** +10%
- **Total Max:** 35%

### 2. **Crossclimb**
- **Difficulty:** Hard
- **Scoring:** Time-based
- **Base Reward:** 25%
- **Flawless Bonus:** +10%
- **Total Max:** 35%

### 3. **Mini Sudoku**
- **Difficulty:** Medium
- **Scoring:** Time-based
- **Base Reward:** 20%
- **Flawless Bonus:** +8%
- **Total Max:** 28%

### 4. **Tango**
- **Difficulty:** Medium
- **Scoring:** Time-based
- **Base Reward:** 20%
- **Flawless Bonus:** +8%
- **Total Max:** 28%

### 5. **Zip**
- **Difficulty:** Easy
- **Scoring:** Time-based
- **Base Reward:** 15%
- **Flawless Bonus:** +5%
- **Total Max:** 20%

### 6. **Pinpoint**
- **Difficulty:** Special
- **Scoring:** Score-based (1-5 or NA)
- **Base Reward:** 30%
- **Flawless Bonus:** N/A (not applicable)
- **Total Max:** 30%
- **Note:** Only game without flawless bonus option

### 7. **Patches**
- **Difficulty:** Easy
- **Scoring:** Time-based
- **Base Reward:** 10%
- **Flawless Bonus:** +10%
- **Total Max:** 20%

---

## Scoring Systems

### Time-Based Games (6 games)
- Queens, Crossclimb, Mini Sudoku, Tango, Zip, Patches
- **Metric:** Completion time in seconds
- **Flawless Option:** Available (no hints, no mistakes)

### Score-Based Game (1 game)
- Pinpoint only
- **Metric:** Score from 1-5, or NA
- **NA Value:** Means puzzle was not successfully solved within 5 tries
- **Flawless Option:** Not available

---

## Reward Tiers

| Difficulty | Base Reward | Flawless Bonus | Total Max |
|------------|-------------|----------------|-----------|
| Hard       | 25%         | +10%           | **35%**   |
| Medium     | 20%         | +8%            | **28%**   |
| Easy       | 10-15%      | +5% to +10%    | **20%**   |
| Special    | 30%         | N/A            | **30%**   |

---

## Flawless Solve Rules

### What Qualifies as Flawless?
- No hints used
- No incorrect attempts/mistakes
- First-try success (where applicable)
- Pure skill and knowledge

### Benefits for Honest Solvers
- Extra rewards up to +10%
- Recognition for legitimate gameplay
- Higher total payouts (up to 35% vs 30%)

### Why It Matters
Players who use hints or make multiple attempts don't qualify for the flawless bonus. This rewards players like you who solve honestly and skillfully!

---

## Contract Integration

### Smart Contract Parameters
```solidity
function createGame(
    string gameId,        // Unique identifier
    string gameType,      // "queens", "crossclimb", "patchesgame", etc.
    uint256 stakeAmount   // USDC amount (6 decimals)
)
```

### Example Stakes

**Queens (Hard, Time-based with Flawless):**
- Stake: 100 USDC
- Flawless: Yes
- Potential Return: 135 USDC (25% + 10% bonus)

**Patches (Easy, Time-based with Flawless):**
- Stake: 100 USDC
- Flawless: Yes
- Potential Return: 120 USDC (10% + 10% bonus)

**Pinpoint (Special, Score-based, no Flawless):**
- Stake: 100 USDC
- Flawless: N/A
- Potential Return: 130 USDC (30% base only)

---

## UI Display

### Homepage Hero Section
Shows 2 featured games:
- Queens: +25% reward
- Crossclimb: +25% reward

### Staking Interface
- 4-column grid showing all 7 games
- Dynamic labels (seconds vs score)
- Conditional flawless checkbox (hidden for Pinpoint)
- Real-time reward calculations

---

**Contract Address:** 0x029EF7bCEC712a440cfAbFA9d65c7D01786FD8A2
**Network:** Ethereum Sepolia Testnet
