// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/**
 * @title StakeLiGames
 * @dev Stake USDC on LinkedIn Games scores and earn rewards based on verified results
 */
contract StakeLiGames is Ownable, ReentrancyGuard {
    using ECDSA for bytes32;

    IERC20 public usdc;
    
    uint256 public totalStaked;
    uint256 public totalGames;
    uint256 public platformFee = 250; // 2.5% in basis points
    uint256 public accumulatedFees; // explicitly tracked platform fees
    
    struct Game {
        address player;
        uint256 targetScore;
        uint256 stakeAmount;
        uint256 flawlessStake; // optional extra stake for flawless commitment
        uint256 timestamp;
        GameStatus status;
        string gameType; // "queens", "crossword", "pinpoint", "tango"
    }
    
    enum GameStatus { Pending, Won, Lost, Cancelled }
    
    mapping(bytes32 => Game) public games;
    mapping(address => uint256) public userStakedAmount;
    mapping(address => uint256) public userGamesPlayed;
    mapping(address => uint256) public userTotalWinnings;
    mapping(address => uint256) public userTotalLosses;
    // configurable reverse scoring per game type (keccak256(gameType) => bool)
    mapping(bytes32 => bool) public reverseScoring;
    // optional per-game-type maximum target score (for reverse-scoring games)
    mapping(bytes32 => uint256) public maxTargetScore;
    // tracking for any owner-triggered retroactive top-ups to avoid double paying
    mapping(bytes32 => bool) public retroRewardProcessed;
    address public verifierSigner;
    address public pendingVerifierSigner;
    mapping(address => mapping(bytes32 => bool)) public usedNonces;
    uint256 public defaultAttestationWindow = 30 minutes;
    // per-player nonce used to derive unique, onchain gameIds
    mapping(address => uint256) public userGameNonce;
    
    event GameCreated(
        bytes32 indexed gameId,
        address indexed player,
        string gameType,
        uint256 targetScore,
        uint256 stakeAmount,
        uint256 flawlessStake
    );
    
    event GameVerified(
        bytes32 indexed gameId,
        address indexed player,
        uint256 actualScore,
        bool won,
        bool flawlessClaimed,
        uint256 payout
    );
    
    event FeesWithdrawn(address indexed owner, uint256 amount);
    event VerifierSignerUpdated(address indexed newSigner);
    event AttestationWindowUpdated(uint256 newWindow);
    
    constructor(address _usdcAddress) {
        usdc = IERC20(_usdcAddress);
        verifierSigner = msg.sender;
        pendingVerifierSigner = address(0);
        // default: pinpoint uses reverse scoring (lower-is-better)
        // enable reverse scoring (lower-is-better) for time/score based games
        reverseScoring[keccak256(bytes("pinpoint"))] = true;
        reverseScoring[keccak256(bytes("queens"))] = true;
        reverseScoring[keccak256(bytes("crossclimb"))] = true;
        reverseScoring[keccak256(bytes("mini-sudoku"))] = true;
        reverseScoring[keccak256(bytes("tango"))] = true;
        reverseScoring[keccak256(bytes("zip"))] = true;
        reverseScoring[keccak256(bytes("patches"))] = true;
    }

    // two-step verifier signer update to avoid accidentally setting wrong address
    function setVerifierSigner(address newSigner) external onlyOwner {
        require(newSigner != address(0), "Invalid verifier signer");
        require(verifierSigner != newSigner, "Already verifierSigner");
        pendingVerifierSigner = newSigner;
    }

    function acceptVerifierSigner() external {
        require(msg.sender == pendingVerifierSigner, "Not pending signer");
        verifierSigner = pendingVerifierSigner;
        pendingVerifierSigner = address(0);
        emit VerifierSignerUpdated(verifierSigner);
    }

    function setDefaultAttestationWindow(uint256 newWindow) external onlyOwner {
        require(newWindow >= 5 minutes, "Window too short");
        require(newWindow <= 1 days, "Window too long");
        defaultAttestationWindow = newWindow;
        emit AttestationWindowUpdated(newWindow);
    }

    /**
     * @dev Owner can configure a maximum targetScore for a given game type.
     * This is primarily intended for reverse-scoring games to avoid
     * unbounded target scores that would guarantee wins.
     */
    function setMaxTargetScore(string calldata gameType, uint256 maxScore) external onlyOwner {
        require(maxScore > 0, "Max target must be > 0");
        bytes32 key = keccak256(bytes(gameType));
        maxTargetScore[key] = maxScore;
    }

    function getAttestationDigest(
        address player,
        bytes32 gameId,
        uint256 actualScore,
        bool flawlessClaimed,
        bytes32 nonce,
        uint256 deadline
    ) public view returns (bytes32) {
        return keccak256(
            abi.encodePacked(
                address(this),
                block.chainid,
                player,
                gameId,
                actualScore,
                flawlessClaimed,
                nonce,
                deadline
            )
        );
    }

    /**
     * @dev Get base reward and flawless bonus (in basis points) for a given game type.
     * Base reward is applied to the primary stake amount. Flawless bonus is an
     * additional reward on the same base amount, only when flawless is claimed
     * and actually achieved for supported games.
     */
    function getRewardConfig(string memory gameType)
        public
        pure
        returns (uint256 baseRewardBps, uint256 flawlessBonusBps)
    {
        bytes32 t = keccak256(bytes(gameType));

        // Hard games: Queens, Crossclimb -> 25% base, +10% flawless
        if (t == keccak256(bytes("queens")) || t == keccak256(bytes("crossclimb"))) {
            return (2500, 1000);
        }

        // Medium games: Mini Sudoku, Tango -> 20% base, +8% flawless
        if (t == keccak256(bytes("mini-sudoku")) || t == keccak256(bytes("tango"))) {
            return (2000, 800);
        }

        // Easy game: Zip -> 15% base, +5% flawless
        if (t == keccak256(bytes("zip"))) {
            return (1500, 500);
        }

        // Patches: balanced challenge -> 10% base, +10% flawless
        if (t == keccak256(bytes("patches"))) {
            return (1000, 1000);
        }

        // Special game: Pinpoint -> 30% base, no flawless bonus
        if (t == keccak256(bytes("pinpoint"))) {
            return (3000, 0);
        }

        // Default safety fallback (should not normally be hit)
        return (2000, 0);
    }

    /**
     * @dev Owner can mark a game type as reverse-scoring (lower-is-better)
     * @param gameType string name of the game type (e.g., "pinpoint")
     * @param isReverse true to enable reverse scoring for this game type
     */
    function setReverseScoring(string calldata gameType, bool isReverse) external onlyOwner {
        reverseScoring[keccak256(bytes(gameType))] = isReverse;
    }
    
    /**
     * @dev Create a new game stake. The gameId is derived onchain from
     * the player address and a per-player nonce to avoid front-running
     * attacks on user-supplied identifiers.
     * @param gameType Type of LinkedIn game (queens, crossword, etc.)
     * @param targetScore Score player aims to achieve
     * @param stakeAmount Amount of USDC to stake (in wei, 6 decimals)
     */
    function createGame(
        string memory gameType,
        uint256 targetScore,
        uint256 stakeAmount,
        uint256 flawlessStake
    ) external nonReentrant returns (bytes32 gameId) {
        require(stakeAmount >= 1e4, "Minimum stake is 0.01 USDC");
        require(targetScore > 0, "Target score must be greater than 0");
        // 1e4 = 0.01 USDC in 6 decimals

        bytes32 gameTypeKey = keccak256(bytes(gameType));
        // For reverse-scoring (lower-is-better) games, enforce an owner-set
        // maximum targetScore to avoid guaranteed wins via huge targets.
        if (reverseScoring[gameTypeKey]) {
            uint256 maxScore = maxTargetScore[gameTypeKey];
            require(maxScore > 0, "Max target score not set");
            require(targetScore <= maxScore, "Target score too high");
        }
        
        // Transfer USDC (base + optional flawless) from player to contract
        uint256 totalToTransfer = stakeAmount + flawlessStake;
        require(
            usdc.transferFrom(msg.sender, address(this), totalToTransfer),
            "USDC transfer failed"
        );
        
        // derive unique gameId onchain using per-player nonce
        gameId = keccak256(abi.encodePacked(msg.sender, userGameNonce[msg.sender]++));
        require(games[gameId].player == address(0), "Game ID collision");

        games[gameId] = Game({
            player: msg.sender,
            targetScore: targetScore,
            stakeAmount: stakeAmount,
            flawlessStake: flawlessStake,
            timestamp: block.timestamp,
            status: GameStatus.Pending,
            gameType: gameType
        });

        totalStaked += (stakeAmount + flawlessStake);
        totalGames++;
        userStakedAmount[msg.sender] += (stakeAmount + flawlessStake);
        userGamesPlayed[msg.sender]++;
        
        emit GameCreated(gameId, msg.sender, gameType, targetScore, stakeAmount, flawlessStake);
    }
    
    /**
     * @dev Verify game score and distribute rewards
     * @param gameId ID of the game to verify
     * @param actualScore Score achieved by the player
     */
    function verifyAndPayout(
        bytes32 gameId,
        uint256 actualScore,
        bool flawlessClaimed
    ) external nonReentrant {
        revert("Use verifyAndPayoutWithAttestation");
    }

    function verifyAndPayoutWithAttestation(
        bytes32 gameId,
        uint256 actualScore,
        bool flawlessClaimed,
        bytes32 nonce,
        uint256 deadline,
        bytes calldata signature
    ) external nonReentrant {
        require(block.timestamp <= deadline, "Attestation expired");
        require(deadline <= block.timestamp + defaultAttestationWindow, "Deadline too far");
        require(!usedNonces[msg.sender][nonce], "Nonce already used");

        bytes32 digest = getAttestationDigest(
            msg.sender,
            gameId,
            actualScore,
            flawlessClaimed,
            nonce,
            deadline
        );
        bytes32 messageHash = digest.toEthSignedMessageHash();
        address recoveredSigner = ECDSA.recover(messageHash, signature);
        require(recoveredSigner == verifierSigner, "Invalid attestation signer");

        usedNonces[msg.sender][nonce] = true;
        _verifyAndPayout(gameId, actualScore, flawlessClaimed);
    }

    function _verifyAndPayout(
        bytes32 gameId,
        uint256 actualScore,
        bool flawlessClaimed
    ) internal {
        Game storage game = games[gameId];

        require(game.player == msg.sender, "Only player can verify");
        require(game.status == GameStatus.Pending, "Game already verified");

        // Determine whether this game type uses reverse scoring (lower-is-better)
        bool isReverse = reverseScoring[keccak256(bytes(game.gameType))];
        // Pinpoint has special rules (no flawless refund/bonus)
        bool isPinpoint = keccak256(bytes(game.gameType)) == keccak256(bytes("pinpoint"));
        bool won;
        if (isReverse) {
            // reverse scoring: lower is better
            won = actualScore < game.targetScore;
        } else {
            // normal scoring: higher or equal is better
            won = actualScore >= game.targetScore;
        }

        uint256 payout = 0;
        uint256 base = game.stakeAmount;
        uint256 flawless = game.flawlessStake;

        // Per-game reward configuration
        (uint256 baseRewardBps, uint256 flawlessBonusBps) = getRewardConfig(game.gameType);

        if (won) {
            // Player wins: return base stake + per-game base reward.
            // If flawless was staked and successfully claimed (non-Pinpoint), also
            // return the flawless stake principal plus flawless bonus percentage
            // on the *flawless stake* itself. All rewards are funded from the
            // pooled stakes of losing games.

            uint256 baseReward = (base * baseRewardBps) / 10000;
            uint256 flawlessBonus = 0;
            bool includeFlawlessPrincipal = false;

            if (!isPinpoint && flawless > 0 && flawlessClaimed) {
                // Flawless achieved: return extra stake and add flawless bonus
                includeFlawlessPrincipal = true;
                if (flawlessBonusBps > 0) {
                    // Economic fix: bonus is calculated from the flawless stake
                    flawlessBonus = (flawless * flawlessBonusBps) / 10000;
                }
            }

            // principal-only component (always desired on win)
            uint256 principalOnlyAmount = base;
            if (includeFlawlessPrincipal) {
                principalOnlyAmount += flawless;
            }

            // full reward-inclusive amount before fees
            uint256 fullRewardAmount = principalOnlyAmount + baseReward + flawlessBonus;
            uint256 feeOnFull = (fullRewardAmount * platformFee) / 10000;
            uint256 desiredPayout = fullRewardAmount - feeOnFull;

            uint256 contractBalance = usdc.balanceOf(address(this));
            uint256 rewardGranted;
            uint256 feeCollected;

            if (contractBalance >= desiredPayout) {
                // happy path: full rewards and fees can be paid
                payout = desiredPayout;
                rewardGranted = baseReward + flawlessBonus;
                feeCollected = feeOnFull;
            } else {
                // insolvency handling: if there is enough liquidity for at least
                // principal-only payout, allow users to withdraw their stake
                // without any rewards or fees.
                require(
                    contractBalance >= principalOnlyAmount,
                    "Insufficient liquidity for principal"
                );
                payout = principalOnlyAmount;
                rewardGranted = 0;
                feeCollected = 0;
            }

            game.status = GameStatus.Won;
            if (rewardGranted > 0) {
                userTotalWinnings[msg.sender] += rewardGranted;
            }
            if (feeCollected > 0) {
                accumulatedFees += feeCollected;
            }

            // Transfer payout (base + rewards/principal, plus flawless principal when applicable)
            require(usdc.transfer(msg.sender, payout), "Payout failed");

            // Remove base and flawless stakes from accounting totals regardless of
            // whether flawless principal was refunded or forfeited. The underlying
            // funds remain in the contract (minus payouts) and are effectively
            // part of the shared reward pool.
            uint256 totalStakeToRemove = base + flawless;
            if (totalStaked >= totalStakeToRemove) {
                totalStaked -= totalStakeToRemove;
            } else {
                totalStaked = 0;
            }

            if (userStakedAmount[msg.sender] >= totalStakeToRemove) {
                userStakedAmount[msg.sender] -= totalStakeToRemove;
            } else {
                userStakedAmount[msg.sender] = 0;
            }

        } else {
            // Player loses
            game.status = GameStatus.Lost;
            userTotalLosses[msg.sender] += base;

            // On loss, both base and flawless stakes are fully forfeited and
            // stay in the contract to fund the pooled rewards of winners.
            // No refund of flawless stake, regardless of whether it was
            // claimed as flawless or not.

            uint256 totalStakeToRemoveLoss = base + flawless;
            if (totalStaked >= totalStakeToRemoveLoss) {
                totalStaked -= totalStakeToRemoveLoss;
            } else {
                totalStaked = 0;
            }

            if (userStakedAmount[msg.sender] >= totalStakeToRemoveLoss) {
                userStakedAmount[msg.sender] -= totalStakeToRemoveLoss;
            } else {
                userStakedAmount[msg.sender] = 0;
            }
        }

        emit GameVerified(gameId, msg.sender, actualScore, won, flawlessClaimed, payout);
    }

    /**
     * @dev Owner-only helper to top up rewards for already-completed games.
     * This is intended for one-off retroactive adjustments where the
     * reward logic has been improved and early winners should receive
     * additional payouts without resubmitting their scores.
     *
     * Off-chain tooling should compute the extra amount owed for a given
     * gameId and then call this function once per game.
     */
    function adminTopUpReward(bytes32 gameId, address player, uint256 amount)
        external
        onlyOwner
        nonReentrant
    {
        require(!retroRewardProcessed[gameId], "Already topped up");
        Game storage game = games[gameId];
        require(game.player == player, "Player mismatch");
        require(
            game.status == GameStatus.Won || game.status == GameStatus.Lost,
            "Game not completed"
        );
        retroRewardProcessed[gameId] = true;

        require(usdc.transfer(player, amount), "Top-up transfer failed");
    }
    
    /**
     * @dev Cancel a pending game and refund stake (emergency only)
     * @param gameId ID of the game to cancel
     */
    function cancelGame(bytes32 gameId) external onlyOwner nonReentrant {
        Game storage game = games[gameId];
        
        // now owner-controlled emergency cancel; players can no longer
        // strategically cancel to avoid a loss
        require(game.player != address(0), "Game does not exist");
        require(game.status == GameStatus.Pending, "Game not pending");
        require(block.timestamp - game.timestamp < 7 days, "Game too old to cancel");
        
        game.status = GameStatus.Cancelled;
        uint256 totalStake = game.stakeAmount + game.flawlessStake;
        totalStaked -= totalStake;
        userStakedAmount[game.player] -= totalStake;
        
        // Refund with 1% cancellation fee on the combined stake (base + flawless)
        uint256 fee = totalStake / 100;
        uint256 refund = totalStake - fee;

        if (fee > 0) {
            accumulatedFees += fee;
        }
        
        require(usdc.transfer(game.player, refund), "Refund failed");
    }
    
    /**
     * @dev Withdraw accumulated platform fees (owner only)
     * @param amount Amount to withdraw
     */
    function withdrawFees(uint256 amount) external onlyOwner {
        uint256 contractBalance = usdc.balanceOf(address(this));
        require(amount <= accumulatedFees, "Insufficient fees available");
        require(amount <= contractBalance, "Insufficient contract balance");

        accumulatedFees -= amount;
        require(usdc.transfer(owner(), amount), "Withdrawal failed");
        
        emit FeesWithdrawn(owner(), amount);
    }
    
    /**
     * @dev Update platform fee (owner only)
     * @param newFee New fee in basis points (max 500 = 5%)
     */
    function updatePlatformFee(uint256 newFee) external onlyOwner {
        require(newFee <= 500, "Fee too high (max 5%)");
        platformFee = newFee;
    }
    
    /**
     * @dev Get game details
     * @param gameId ID of the game
     */
    function getGame(bytes32 gameId) external view returns (Game memory) {
        return games[gameId];
    }
    
    /**
     * @dev Get user statistics
     * @param user Address of the user
     */
    function getUserStats(address user) external view returns (
        uint256 stakedAmount,
        uint256 gamesPlayed,
        uint256 totalWinnings,
        uint256 totalLosses
    ) {
        return (
            userStakedAmount[user],
            userGamesPlayed[user],
            userTotalWinnings[user],
            userTotalLosses[user]
        );
    }
    
    /**
     * @dev Get platform statistics
     */
    function getPlatformStats() external view returns (
        uint256 _totalStaked,
        uint256 _totalGames,
        uint256 _platformFee,
        uint256 contractBalance
    ) {
        return (
            totalStaked,
            totalGames,
            platformFee,
            usdc.balanceOf(address(this))
        );
    }
}
