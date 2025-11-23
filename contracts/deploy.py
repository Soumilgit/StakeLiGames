"""
Deploy StakeLiGames smart contracts to Algorand Testnet
"""

import os
from algosdk import account, mnemonic
from algosdk.v2client import algod
from algosdk.transaction import (
    ApplicationCreateTxn,
    StateSchema,
    OnComplete,
    wait_for_confirmation
)
from base64 import b64decode


# Algorand Testnet configuration
ALGOD_ADDRESS = "https://testnet-api.algonode.cloud"
ALGOD_TOKEN = ""


def get_algod_client():
    """Create Algorand client for testnet"""
    return algod.AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS)


def read_teal_file(filename):
    """Read TEAL file and return as string"""
    with open(f"contracts/{filename}", "r") as f:
        return f.read()


def compile_program(client, source_code):
    """Compile TEAL source code"""
    compile_response = client.compile(source_code)
    return b64decode(compile_response["result"])


def deploy_contract(private_key):
    """Deploy the staking contract to Algorand testnet"""
    
    client = get_algod_client()
    sender = account.address_from_private_key(private_key)
    
    print(f"🚀 Deploying from account: {sender}")
    
    # Get account info
    account_info = client.account_info(sender)
    balance = account_info.get('amount', 0) / 1_000_000
    print(f"💰 Account balance: {balance} ALGO")
    
    if balance < 0.5:
        print("\n⚠️  WARNING: Low balance!")
        print("Get free testnet ALGO from: https://bank.testnet.algorand.network")
        return None
    
    # Read and compile TEAL programs
    print("\n📝 Reading TEAL programs...")
    approval_program_source = read_teal_file("staking_approval.teal")
    clear_program_source = read_teal_file("staking_clear.teal")
    
    print("🔨 Compiling programs...")
    approval_program = compile_program(client, approval_program_source)
    clear_program = compile_program(client, clear_program_source)
    
    # Define state schemas
    global_schema = StateSchema(num_uints=3, num_byte_slices=1)
    local_schema = StateSchema(num_uints=4, num_byte_slices=0)
    
    # Get suggested params
    params = client.suggested_params()
    
    # Create application transaction
    print("\n📤 Creating application transaction...")
    txn = ApplicationCreateTxn(
        sender=sender,
        sp=params,
        on_complete=OnComplete.NoOpOC,
        approval_program=approval_program,
        clear_program=clear_program,
        global_schema=global_schema,
        local_schema=local_schema,
        extra_pages=3,  # For box storage
    )
    
    # Sign transaction
    signed_txn = txn.sign(private_key)
    
    # Send transaction
    print("📡 Sending transaction...")
    tx_id = client.send_transaction(signed_txn)
    print(f"Transaction ID: {tx_id}")
    
    # Wait for confirmation
    print("⏳ Waiting for confirmation...")
    confirmed_txn = wait_for_confirmation(client, tx_id, 4)
    
    # Get application ID
    app_id = confirmed_txn["application-index"]
    app_address = get_application_address(app_id)
    
    print("\n🎉 Contract deployed successfully!")
    print(f"📋 Application ID: {app_id}")
    print(f"📍 Application Address: {app_address}")
    print(f"\n🔗 View on Block Explorers:")
    print(f"   Pera: https://testnet.explorer.perawallet.app/application/{app_id}")
    print(f"   Lora: https://testnet.explorer.lora.algokit.io/application/{app_id}")
    
    # Update .env file
    update_env_file(app_id)
    
    return app_id


def get_application_address(app_id):
    """Get the address of an application"""
    from algosdk.logic import get_application_address
    return get_application_address(app_id)


def update_env_file(app_id):
    """Update .env file with deployed app ID"""
    env_content = f"""# Algorand Network Configuration
NEXT_PUBLIC_ALGOD_TOKEN=
NEXT_PUBLIC_ALGOD_SERVER=https://testnet-api.algonode.cloud
NEXT_PUBLIC_ALGOD_PORT=443
NEXT_PUBLIC_INDEXER_SERVER=https://testnet-idx.algonode.cloud
NEXT_PUBLIC_INDEXER_PORT=443
NEXT_PUBLIC_NETWORK=testnet

# Smart Contract App IDs
NEXT_PUBLIC_STAKING_APP_ID={app_id}

# Application Settings
NEXT_PUBLIC_APP_NAME=StakeLiGames
NEXT_PUBLIC_USDC_ASSET_ID=10458941
"""
    
    with open(".env.local", "w") as f:
        f.write(env_content)
    
    print(f"\n✅ Updated .env.local with APP_ID: {app_id}")


if __name__ == "__main__":
    print("╔═══════════════════════════════════════╗")
    print("║  StakeLiGames Contract Deployment    ║")
    print("║  Algorand Testnet                    ║")
    print("╚═══════════════════════════════════════╝\n")
    
    # Get private key from environment or user input
    private_key = os.getenv("DEPLOYER_PRIVATE_KEY")
    
    if not private_key:
        print("📝 Enter your 25-word mnemonic (or press Enter to generate new account):")
        user_mnemonic = input().strip()
        
        if user_mnemonic:
            try:
                private_key = mnemonic.to_private_key(user_mnemonic)
            except Exception as e:
                print(f"❌ Invalid mnemonic: {e}")
                exit(1)
        else:
            # Generate new account
            private_key, address = account.generate_account()
            account_mnemonic = mnemonic.from_private_key(private_key)
            
            print("\n🆕 Generated new account!")
            print(f"Address: {address}")
            print(f"\n🔑 SAVE THIS MNEMONIC (25 words):")
            print(f"{account_mnemonic}\n")
            print("⚠️  Fund this account with testnet ALGO:")
            print("   https://bank.testnet.algorand.network\n")
            
            input("Press Enter after funding the account...")
    
    # Deploy contract
    try:
        app_id = deploy_contract(private_key)
        if app_id:
            print("\n✨ Deployment complete! You can now run the frontend.")
    except Exception as e:
        print(f"\n❌ Deployment failed: {e}")
        import traceback
        traceback.print_exc()
