// Retroactively top up rewards for already-completed games.
//
// This script is optional and is intended to be run by the contract owner.
// It scans past GameVerified events, recomputes the payout using the
// current on-chain logic (via a static call), compares it with the
// originally emitted payout, and if the new payout is higher it calls
// adminTopUpReward to pay the difference. Each gameId is only topped up
// once because the contract tracks retroRewardProcessed.
//
// Usage on Windows PowerShell (from project root):
//   # 1) Ensure .env.local has NEXT_PUBLIC_RPC_URL, PRIVATE_KEY, NEXT_PUBLIC_CONTRACT_ADDRESS
//   # 2) Run:
//   node scripts/retroactive_topup.js
//
// The script loads environment variables from .env.local in the project root
// (Next.js style) so you don't need a separate .env just for this. It will
// use RPC_URL if set, otherwise it falls back to NEXT_PUBLIC_RPC_URL so you
// can reuse the same endpoint as the frontend.

const { ethers } = require("ethers");
const dotenv = require("dotenv");

// Load from .env.local (Next.js) if present, otherwise fall back to .env
dotenv.config({ path: ".env.local" });
dotenv.config();

async function main() {
  const rpcUrl = process.env.RPC_URL || process.env.NEXT_PUBLIC_RPC_URL;
  const pk = process.env.PRIVATE_KEY;
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  if (!rpcUrl || !pk || !contractAddress) {
    throw new Error("RPC_URL (or NEXT_PUBLIC_RPC_URL), PRIVATE_KEY, and NEXT_PUBLIC_CONTRACT_ADDRESS must be set in env");
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const signer = new ethers.Wallet(pk, provider);

  const abi = [
    "event GameVerified(bytes32 indexed gameId, address indexed player, uint256 actualScore, bool won, bool flawlessClaimed, uint256 payout)",
    "function getGame(bytes32 gameId) view returns (tuple(address player,uint256 targetScore,uint256 stakeAmount,uint256 flawlessStake,uint256 timestamp,uint8 status,string gameType))",
    "function verifyAndPayout(bytes32 gameId, uint256 actualScore, bool flawlessClaimed) external",
    "function adminTopUpReward(bytes32 gameId, address player, uint256 amount) external",
  ];

  const contract = new ethers.Contract(contractAddress, abi, signer);

  console.log("Scanning past GameVerified events for potential top-ups...");

  const filter = contract.filters.GameVerified();
  // Some public RPC providers cap eth_getLogs queries to a maximum
  // block range (e.g. 50,000). To stay within those limits, we
  // fetch events in chunks from block 0 up to the latest block.
  const latestBlock = await provider.getBlockNumber();
  const maxRange = 49000; // safely below 50k
  let events = [];

  for (let fromBlock = 0; fromBlock <= latestBlock; fromBlock += (maxRange + 1)) {
    const toBlock = Math.min(fromBlock + maxRange, latestBlock);
    const chunk = await contract.queryFilter(filter, fromBlock, toBlock);
    events = events.concat(chunk);
  }

  for (const ev of events) {
    const { gameId, player, actualScore, won, flawlessClaimed, payout } = ev.args;

    if (!won) continue; // only winners may need top-ups

    // Use a static call to see what payout the current logic would produce
    const newPayout = await contract.callStatic.verifyAndPayout(gameId, actualScore, flawlessClaimed);

    if (newPayout <= payout) continue; // nothing extra owed

    const diff = newPayout - payout;
    console.log(`Game ${gameId} for ${player} needs top-up of`, ethers.formatUnits(diff, 6), "USDC");

    // Send the difference via the admin helper. This will revert if the game
    // has already been topped up once.
    const tx = await contract.adminTopUpReward(gameId, player, diff);
    console.log("  -> top-up tx hash", tx.hash);
    await tx.wait();
  }

  console.log("Retroactive top-up scan complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
