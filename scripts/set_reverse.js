#!/usr/bin/env node
const { ethers } = require('ethers');

// Usage:
// set env: OWNER_PRIVATE_KEY, NEXT_PUBLIC_CONTRACT_ADDRESS, SEP_RPC (optional)
// node scripts/set_reverse.js queens,crossclimb,minisudoku,tango,zip

async function main() {
  const pk = process.env.OWNER_PRIVATE_KEY;
  const contract = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const rpc = process.env.SEP_RPC || 'https://rpc.sepolia.org';

  if (!pk || !contract) {
    console.error('Please set OWNER_PRIVATE_KEY and NEXT_PUBLIC_CONTRACT_ADDRESS environment variables');
    process.exit(1);
  }

  const provider = new ethers.JsonRpcProvider(rpc);
  const wallet = new ethers.Wallet(pk, provider);

  const abi = [
    'function setReverseScoring(string calldata gameType, bool isReverse) external',
  ];

  const c = new ethers.Contract(contract, abi, wallet);

  const arg = process.argv[2] || '';
  const games = arg ? arg.split(',') : ['queens','crossclimb','minisudoku','tango','zip'];

  for (const g of games) {
    console.log('Setting reverse scoring for', g);
    const tx = await c.setReverseScoring(g, true);
    console.log('tx sent', tx.hash);
    await tx.wait();
    console.log('done', g);
  }
}

main().catch(e=>{ console.error(e); process.exit(1); });
