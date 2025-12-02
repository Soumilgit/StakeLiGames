const { ethers } = require('ethers');

// Usage: set env NEXT_PUBLIC_CONTRACT_ADDRESS and GAME_ID (bytes32), optional SEP_RPC
// Example:
// $env:NEXT_PUBLIC_CONTRACT_ADDRESS="0x..."; $env:GAME_ID="0x..."; node inspect_game.js

const RPC = process.env.SEP_RPC || 'https://rpc.sepolia.org';
const provider = new ethers.JsonRpcProvider(RPC);
const CONTRACT = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';
const GAME_ID = process.env.GAME_ID || '';

if (!CONTRACT || !GAME_ID) {
  console.error('Please set NEXT_PUBLIC_CONTRACT_ADDRESS and GAME_ID env vars');
  process.exit(1);
}

const ABI = [
  'function getGame(bytes32) view returns (tuple(address player,uint256 targetScore,uint256 stakeAmount,uint256 flawlessStake,uint256 timestamp,uint8 status,string gameType))',
  'event GameCreated(bytes32 indexed gameId,address indexed player,string gameType,uint256 targetScore,uint256 stakeAmount,uint256 flawlessStake)',
  'event GameVerified(bytes32 indexed gameId,address indexed player,uint256 actualScore,bool won,bool flawlessClaimed,uint256 payout)'
];

(async function(){
  try {
    const c = new ethers.Contract(CONTRACT, ABI, provider);
    const g = await c.getGame(GAME_ID);
    console.log('Game:', {
      player: g.player,
      targetScore: g.targetScore.toString(),
      stakeAmount: g.stakeAmount.toString(),
      flawlessStake: g.flawlessStake.toString(),
      timestamp: new Date(Number(g.timestamp.toString())*1000).toISOString(),
      status: g.status,
      gameType: g.gameType
    });

    const created = await c.queryFilter(c.filters.GameCreated(GAME_ID), 0, 'latest');
    console.log('GameCreated events:', created.map(e => ({tx: e.transactionHash, args: e.args})));

    const verified = await c.queryFilter(c.filters.GameVerified(GAME_ID), 0, 'latest');
    console.log('GameVerified events:', verified.map(e => ({tx: e.transactionHash, args: e.args})));
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
