const { ethers } = require('ethers');

// Usage: set env NEXT_PUBLIC_CONTRACT_ADDRESS and WALLET addr, optional SEP_RPC
// $env:NEXT_PUBLIC_CONTRACT_ADDRESS="0x..."; $env:WALLET="0x..."; node check_balances.js

const RPC = process.env.SEP_RPC || 'https://rpc.sepolia.org';
const provider = new ethers.JsonRpcProvider(RPC);
const CONTRACT = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';
const WALLET = process.env.WALLET || '';
const USDC = process.env.NEXT_PUBLIC_USDC_ADDRESS || '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238';

if (!CONTRACT || !WALLET) {
  console.error('Please set NEXT_PUBLIC_CONTRACT_ADDRESS and WALLET env vars');
  process.exit(1);
}

const abi = [
  'function balanceOf(address) view returns (uint256)',
  'event Transfer(address indexed from, address indexed to, uint256 value)'
];

(async function(){
  try {
    const token = new ethers.Contract(USDC, abi, provider);
    const cBal = await token.balanceOf(CONTRACT);
    const wBal = await token.balanceOf(WALLET);
    console.log('USDC balances (6 decimals):');
    console.log('Contract:', cBal.toString(), '->', (Number(cBal.toString())/1e6).toFixed(6));
    console.log('Wallet:  ', wBal.toString(), '->', (Number(wBal.toString())/1e6).toFixed(6));

    const filter = token.filters.Transfer();
    const logs = await provider.getLogs({ address: USDC, fromBlock: 0, toBlock: 'latest', topics: filter.topics });
    const parsed = logs.reverse().slice(0,200).map(l => {
      try {
        const p = token.interface.parseLog(l);
        return { tx: l.transactionHash, from: p.args.from, to: p.args.to, value: p.args.value.toString() };
      } catch (e) { return null; }
    }).filter(x => x && (x.from.toLowerCase() === WALLET.toLowerCase() || x.to.toLowerCase() === WALLET.toLowerCase() || x.from.toLowerCase() === CONTRACT.toLowerCase() || x.to.toLowerCase() === CONTRACT.toLowerCase()));

    console.log('Recent transfers involving wallet/contract:');
    console.log(parsed.slice(0,50));
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
