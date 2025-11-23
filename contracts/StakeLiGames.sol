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
    
    event GameCreated(
        bytes32 indexed gameId,
        address indexed player,
        string gameType,
        uint256 targetScore,
        uint256 stakeAmount
    );
    
    event GameVerified(
        bytes32 indexed gameId,
        address indexed player,
        uint256 actualScore,
        bool won,
        uint256 payout
    );
    
    event FeesWithdrawn(address indexed owner, uint256 amount);
    
    constructor(address _usdcAddress) {
        usdc = IERC20(_usdcAddress);
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
        uint256 stakeAmount
    ) external nonReentrant {
        require(games[gameId].player == address(0), "Game ID already exists");
        require(stakeAmount >= 1e4, "Minimum stake is 0.01 USDC");
        require(targetScore > 0, "Target score must be greater than 0");
        // 1e4 = 0.01 USDC in 6 decimals
        
        // Transfer USDC from player to contract
        require(
            usdc.transferFrom(msg.sender, address(this), stakeAmount),
            "USDC transfer failed"
        );
        
        games[gameId] = Game({
            player: msg.sender,
            targetScore: targetScore,
            stakeAmount: stakeAmount,
            timestamp: block.timestamp,
            status: GameStatus.Pending,
            gameType: gameType
        });
        
        totalStaked += stakeAmount;
        totalGames++;
        userStakedAmount[msg.sender] += stakeAmount;
        userGamesPlayed[msg.sender]++;
        
        emit GameCreated(gameId, msg.sender, gameType, targetScore, stakeAmount);
    }
    
    /**
     * @dev Verify game score and distribute rewards
     * @param gameId ID of the game to verify
     * @param actualScore Score achieved by the player
     */
    function verifyAndPayout(
        bytes32 gameId,
        uint256 actualScore
    ) external nonReentrant {
        Game storage game = games[gameId];
        
        require(game.player == msg.sender, "Only player can verify");
        require(game.status == GameStatus.Pending, "Game already verified");
        
        bool won = actualScore >= game.targetScore;
        uint256 payout = 0;
        
        if (won) {
            // Player wins: return stake + 20% reward
            uint256 reward = (game.stakeAmount * 20) / 100;
            uint256 totalAmount = game.stakeAmount + reward;
            uint256 fee = (totalAmount * platformFee) / 10000;
            payout = totalAmount - fee;
            
            game.status = GameStatus.Won;
            userTotalWinnings[msg.sender] += reward;
            
            require(usdc.transfer(msg.sender, payout), "Payout failed");
        } else {
            // Player loses: stake goes to reward pool
            game.status = GameStatus.Lost;
            userTotalLosses[msg.sender] += game.stakeAmount;
        }
        
        totalStaked -= game.stakeAmount;
        userStakedAmount[msg.sender] -= game.stakeAmount;
        
        emit GameVerified(gameId, msg.sender, actualScore, won, payout);
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
