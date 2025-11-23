"""
Deploy StakeLiGames to Sepolia Testnet using Python + Web3.py
No MetaMask needed - generates account or uses your private key
"""

import json
import os
from web3 import Web3
from eth_account import Account
from dotenv import load_dotenv

load_dotenv()

# Sepolia RPC endpoints (FREE - no API key needed!)
SEPOLIA_RPC_URLS = [
    "https://rpc.sepolia.org",
    "https://ethereum-sepolia.publicnode.com",
    "https://1rpc.io/sepolia",
]

# Sepolia USDC test token address
SEPOLIA_USDC = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"

def get_web3():
    """Connect to Sepolia using free public RPC"""
    for rpc_url in SEPOLIA_RPC_URLS:
        try:
            w3 = Web3(Web3.HTTPProvider(rpc_url))
            if w3.is_connected():
                print(f"✅ Connected to Sepolia via {rpc_url}")
                return w3
        except:
            continue
    raise Exception("❌ Could not connect to Sepolia. Check your internet connection.")

def get_or_create_account():
    """Get account from private key or generate new one"""
    private_key = os.getenv("PRIVATE_KEY")
    
    if private_key:
        print("🔑 Using existing private key from .env")
        account = Account.from_key(private_key)
    else:
        print("\n🆕 No private key found. Generating new account...")
        account = Account.create()
        
        print("\n" + "="*60)
        print("🔐 NEW ACCOUNT CREATED!")
        print("="*60)
        print(f"\n📍 Address: {account.address}")
        print(f"\n🔑 Private Key: {account.key.hex()}")
        print("\n⚠️  SAVE THIS PRIVATE KEY! You'll need it to deploy.")
        print("="*60)
        
        # Save to .env
        with open(".env", "w") as f:
            f.write(f"PRIVATE_KEY={account.key.hex()}\n")
            f.write(f"DEPLOYER_ADDRESS={account.address}\n")
        
        print("\n✅ Saved to contracts/.env")
        print("\n💰 Get free Sepolia ETH from:")
        print("   1. https://sepoliafaucet.com")
        print("   2. https://www.alchemy.com/faucets/ethereum-sepolia")
        print("   3. https://faucet.quicknode.com/ethereum/sepolia")
        print("\n⏳ Fund your account and run this script again!")
        return None
    
    return account

def deploy_contract(w3, account):
    """Deploy StakeLiGames contract"""
    
    # Check balance
    balance = w3.eth.get_balance(account.address)
    balance_eth = w3.from_wei(balance, 'ether')
    
    print(f"\n💰 Account: {account.address}")
    print(f"💵 Balance: {balance_eth} ETH")
    
    if balance_eth < 0.01:
        print("\n⚠️  WARNING: Low balance!")
        print("You need at least 0.01 ETH to deploy.")
        print("Get free Sepolia ETH from faucets above.")
        return None
    
    # Load compiled contract
    print("\n📖 Loading compiled contract...")
    
    if not os.path.exists("abi.json") or not os.path.exists("bytecode.txt"):
        print("❌ Contract not compiled! Run: python compile_solidity.py")
        return None
    
    with open("abi.json", "r") as f:
        abi = json.load(f)
    
    with open("bytecode.txt", "r") as f:
        bytecode = f.read().strip()
    
    # Create contract instance
    Contract = w3.eth.contract(abi=abi, bytecode=bytecode)
    
    # Get current gas price
    gas_price = w3.eth.gas_price
    
    print(f"\n⛽ Gas Price: {w3.from_wei(gas_price, 'gwei')} Gwei")
    
    # Build transaction
    print("\n🔨 Building deployment transaction...")
    
    constructor_txn = Contract.constructor(SEPOLIA_USDC).build_transaction({
        'from': account.address,
        'nonce': w3.eth.get_transaction_count(account.address),
        'gas': 3000000,  # Estimated gas limit
        'gasPrice': gas_price,
    })
    
    # Estimate actual gas needed
    try:
        estimated_gas = w3.eth.estimate_gas(constructor_txn)
        constructor_txn['gas'] = int(estimated_gas * 1.2)  # Add 20% buffer
        print(f"📊 Estimated Gas: {estimated_gas}")
    except Exception as e:
        print(f"⚠️  Could not estimate gas: {e}")
    
    # Sign transaction
    print("\n✍️  Signing transaction...")
    signed_txn = w3.eth.account.sign_transaction(constructor_txn, account.key)
    
    # Send transaction
    print("📤 Sending transaction to Sepolia...")
    tx_hash = w3.eth.send_raw_transaction(signed_txn.rawTransaction)
    
    print(f"📝 Transaction Hash: {tx_hash.hex()}")
    print("⏳ Waiting for confirmation (this may take 15-30 seconds)...")
    
    # Wait for receipt
    tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=300)
    
    if tx_receipt['status'] == 1:
        contract_address = tx_receipt['contractAddress']
        
        print("\n" + "="*60)
        print("🎉 CONTRACT DEPLOYED SUCCESSFULLY!")
        print("="*60)
        print(f"\n📋 Contract Address: {contract_address}")
        print(f"🔗 Etherscan: https://sepolia.etherscan.io/address/{contract_address}")
        print(f"💎 Transaction: https://sepolia.etherscan.io/tx/{tx_hash.hex()}")
        print("="*60)
        
        # Save deployment info
        deployment = {
            "network": "sepolia",
            "contractAddress": contract_address,
            "usdcAddress": SEPOLIA_USDC,
            "deployer": account.address,
            "txHash": tx_hash.hex(),
        }
        
        with open("deployment.json", "w") as f:
            json.dump(deployment, f, indent=2)
        
        print("\n💾 Deployment info saved to deployment.json")
        
        # Update .env.local for frontend
        env_content = f"""# Ethereum Sepolia Configuration
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://rpc.sepolia.org
NEXT_PUBLIC_NETWORK_NAME=Sepolia Testnet

# Smart Contract Addresses
NEXT_PUBLIC_CONTRACT_ADDRESS={contract_address}
NEXT_PUBLIC_USDC_ADDRESS={SEPOLIA_USDC}

# Application Settings
NEXT_PUBLIC_APP_NAME=StakeLiGames
"""
        
        with open("../.env.local", "w") as f:
            f.write(env_content)
        
        print("✅ Updated .env.local for frontend")
        
        print("\n📋 Next Steps:")
        print("1. Import account to MetaMask using private key")
        print("2. Add Sepolia network to MetaMask")
        print("3. Get test USDC (opt-in to token)")
        print("4. Run: npm run dev")
        print("5. Start staking! 🎮\n")
        
        return contract_address
    else:
        print("\n❌ Deployment failed!")
        print(f"Transaction receipt: {tx_receipt}")
        return None

def main():
    print("╔════════════════════════════════════════╗")
    print("║   StakeLiGames - Sepolia Deployment   ║")
    print("║   Python + Web3.py (No Hardhat!)      ║")
    print("╚════════════════════════════════════════╝\n")
    
    # Connect to Sepolia
    w3 = get_web3()
    
    # Get or create account
    account = get_or_create_account()
    
    if account is None:
        return
    
    # Deploy contract
    deploy_contract(w3, account)

if __name__ == "__main__":
    main()
