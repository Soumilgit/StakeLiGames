// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title StakeLiGames
 * @dev Stake USDC on LinkedIn Games scores and earn rewards based on verified results
 */
contract StakeLiGames is Ownable, ReentrancyGuard {
    IERC20 public usdc;
    
    uint256 public totalStaked;
    uint256 public totalGames;
    uint256 public platformFee = 250; // 2.5% in basis points
    
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
    
    constructor(address _usdcAddress) {
        usdc = IERC20(_usdcAddress);
        // default: pinpoint uses reverse scoring (lower-is-better)
        // enable reverse scoring (lower-is-better) for time/score based games
        reverseScoring[keccak256(bytes("pinpoint"))] = true;
        reverseScoring[keccak256(bytes("queens"))] = true;
        reverseScoring[keccak256(bytes("crossclimb"))] = true;
        reverseScoring[keccak256(bytes("mini-sudoku"))] = true;
        reverseScoring[keccak256(bytes("tango"))] = true;
        reverseScoring[keccak256(bytes("zip"))] = true;
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
     * @dev Create a new game stake
     * @param gameId Unique identifier for the game
     * @param gameType Type of LinkedIn game (queens, crossword, etc.)
     * @param targetScore Score player aims to achieve
     * @param stakeAmount Amount of USDC to stake (in wei, 6 decimals)
     */
    function createGame(
        bytes32 gameId,
        string memory gameType,
        uint256 targetScore,
        uint256 stakeAmount,
        uint256 flawlessStake
    ) external nonReentrant {
        require(games[gameId].player == address(0), "Game ID already exists");
        require(stakeAmount >= 1e4, "Minimum stake is 0.01 USDC");
        require(targetScore > 0, "Target score must be greater than 0");
        // 1e4 = 0.01 USDC in 6 decimals
        
        // Transfer USDC (base + optional flawless) from player to contract
        uint256 totalToTransfer = stakeAmount + flawlessStake;
        require(
            usdc.transferFrom(msg.sender, address(this), totalToTransfer),
            "USDC transfer failed"
        );
        
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
        Game storage game = games[gameId];

        require(game.player == msg.sender, "Only player can verify");
        require(game.status == GameStatus.Pending, "Game already verified");

        // Determine whether this game type uses reverse scoring (lower-is-better)
        bool isReverse = reverseScoring[keccak256(bytes(game.gameType))];
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

        if (won) {
            // Player wins: return base stake + reward; for non-Pinpoint games include flawless stake only if claimed
            uint256 reward = (base * 20) / 100;
            uint256 totalAmount = base + reward;
            bool includeFlawless = (!isReverse && flawless > 0 && flawlessClaimed);
            if (includeFlawless) {
                totalAmount += flawless;
            }

            uint256 fee = (totalAmount * platformFee) / 10000;
            payout = totalAmount - fee;

            game.status = GameStatus.Won;
            userTotalWinnings[msg.sender] += reward;

            // Transfer payout (base + reward, and flawless stake if included above)
            require(usdc.transfer(msg.sender, payout), "Payout failed");

            // Update totals: remove base stake
            if (totalStaked >= base) {
                totalStaked -= base;
            } else {
                totalStaked = 0;
            }
            if (userStakedAmount[msg.sender] >= base) {
                userStakedAmount[msg.sender] -= base;
            } else {
                userStakedAmount[msg.sender] = 0;
            }

            // Handle flawless stake totals: if flawless was included in payout remove it from totals; otherwise it's forfeited and should also be removed from totals
            if (flawless > 0) {
                if (includeFlawless) {
                    if (totalStaked >= flawless) {
                        totalStaked -= flawless;
                    } else {
                        totalStaked = 0;
                    }
                    if (userStakedAmount[msg.sender] >= flawless) {
                        userStakedAmount[msg.sender] -= flawless;
                    } else {
                        userStakedAmount[msg.sender] = 0;
                    }
                } else {
                    // forfeited flawless stake (or ignored for Pinpoint) -> remove from staked totals
                    if (totalStaked >= flawless) {
                        totalStaked -= flawless;
                    } else {
                        totalStaked = 0;
                    }
                    if (userStakedAmount[msg.sender] >= flawless) {
                        userStakedAmount[msg.sender] -= flawless;
                    } else {
                        userStakedAmount[msg.sender] = 0;
                    }
                }
            }

        } else {
            // Player loses
            game.status = GameStatus.Lost;
            userTotalLosses[msg.sender] += base;

            // For non-Pinpoint games, if user claimed flawless they get it back on loss; for Pinpoint or non-claimed, flawless is forfeited
            bool refundFlawless = (!isReverse && flawless > 0 && flawlessClaimed);
            if (refundFlawless) {
                uint256 refund = flawless;
                require(usdc.transfer(msg.sender, refund), "Flawless refund failed");
                payout = refund;

                if (totalStaked >= refund) {
                    totalStaked -= refund;
                } else {
                    totalStaked = 0;
                }
                if (userStakedAmount[msg.sender] >= refund) {
                    userStakedAmount[msg.sender] -= refund;
                } else {
                    userStakedAmount[msg.sender] = 0;
                }
            } else {
                // flawless forfeited or ignored for Pinpoint: remove from totals (kept by contract)
                if (flawless > 0) {
                    if (totalStaked >= flawless) {
                        totalStaked -= flawless;
                    } else {
                        totalStaked = 0;
                    }
                    if (userStakedAmount[msg.sender] >= flawless) {
                        userStakedAmount[msg.sender] -= flawless;
                    } else {
                        userStakedAmount[msg.sender] = 0;
                    }
                }
            }

            // remove base stake from totals
            if (totalStaked >= base) {
                totalStaked -= base;
            } else {
                totalStaked = 0;
            }
            if (userStakedAmount[msg.sender] >= base) {
                userStakedAmount[msg.sender] -= base;
            } else {
                userStakedAmount[msg.sender] = 0;
            }
        }

        emit GameVerified(gameId, msg.sender, actualScore, won, flawlessClaimed, payout);
    }
    
    /**
     * @dev Cancel a pending game and refund stake (emergency only)
     * @param gameId ID of the game to cancel
     */
    function cancelGame(bytes32 gameId) external nonReentrant {
        Game storage game = games[gameId];
        
        require(game.player == msg.sender, "Only player can cancel");
        require(game.status == GameStatus.Pending, "Game not pending");
        require(block.timestamp - game.timestamp < 7 days, "Game too old to cancel");
        
        game.status = GameStatus.Cancelled;
        totalStaked -= game.stakeAmount;
        userStakedAmount[msg.sender] -= game.stakeAmount;
        
        // Refund with 1% cancellation fee
        uint256 fee = game.stakeAmount / 100;
        uint256 refund = game.stakeAmount - fee;
        
        require(usdc.transfer(msg.sender, refund), "Refund failed");
    }
    
    /**
     * @dev Withdraw accumulated platform fees (owner only)
     * @param amount Amount to withdraw
     */
    function withdrawFees(uint256 amount) external onlyOwner {
        uint256 contractBalance = usdc.balanceOf(address(this));
        uint256 availableFees = contractBalance - totalStaked;
        
        require(amount <= availableFees, "Insufficient fees available");
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
