"""
Configure max target scores for each LinkedIn game type
by calling setMaxTargetScore on the deployed StakeLiGames
contract on Sepolia.

Usage (from contracts/ directory):
    pip install -r requirements.txt   # if not already
    python set_max_target_scores.py

Requires env vars (same as deploy_sepolia.py):
    PRIVATE_KEY  # owner/deployer private key (hex)

Relies on:
    deployment.json  # written by deploy_sepolia.py (contains contractAddress)
    abi.json         # compiled contract ABI
"""

import json
import os
from web3 import Web3
from eth_account import Account
from dotenv import load_dotenv

# Load both local contracts/.env and project ../.env.local if present
load_dotenv()
load_dotenv(dotenv_path="../.env.local")

SEPOLIA_RPC_URLS = [
    "https://rpc.sepolia.org",
    "https://ethereum-sepolia.publicnode.com",
    "https://1rpc.io/sepolia",
]


def get_web3() -> Web3:
    for rpc_url in SEPOLIA_RPC_URLS:
        try:
            w3 = Web3(Web3.HTTPProvider(rpc_url))
            if w3.is_connected():
                print(f"✅ Connected to Sepolia via {rpc_url}")
                return w3
        except Exception as e:
            print(f"⚠️ RPC {rpc_url} failed: {e}")
            continue
    raise RuntimeError("Could not connect to any Sepolia RPC endpoint")


def get_owner_account() -> Account:
    private_key = os.getenv("PRIVATE_KEY")
    if not private_key:
        raise RuntimeError(
            "PRIVATE_KEY not set in contracts/.env – use the same key that deployed the contract."
        )
    return Account.from_key(private_key)


def load_deployment_info() -> dict:
    if not os.path.exists("deployment.json"):
        raise FileNotFoundError(
            "deployment.json not found – deploy the contract first or create this file manually."
        )
    with open("deployment.json", "r") as f:
        data = json.load(f)
    if "contractAddress" not in data:
        raise KeyError("deployment.json missing contractAddress field")
    return data


def main() -> None:
    print("\n=== StakeLiGames - Configure Max Target Scores ===\n")

    w3 = get_web3()
    owner = get_owner_account()
    deployment = load_deployment_info()
    contract_address = Web3.to_checksum_address(deployment["contractAddress"])

    print(f"Using owner: {owner.address}")
    print(f"Contract: {contract_address}\n")

    # Load ABI produced by compile_solidity.py
    if not os.path.exists("abi.json"):
        raise FileNotFoundError("abi.json not found – run compile_solidity.py first.")

    with open("abi.json", "r") as f:
        abi = json.load(f)

    contract = w3.eth.contract(address=contract_address, abi=abi)

    # Desired max target scores per game type
    targets = {
        "queens": 600,
        "crossclimb": 600,
        "mini-sudoku": 600,
        "tango": 600,
        "zip": 600,
        "patches": 600,
        "pinpoint": 5,
    }

    # Build and send one transaction per game type
    nonce = w3.eth.get_transaction_count(owner.address)
    gas_price = w3.eth.gas_price

    for game_type, max_score in targets.items():
        print(f"Setting max target for {game_type} -> {max_score} ...")
        tx = contract.functions.setMaxTargetScore(game_type, max_score).build_transaction(
            {
                "from": owner.address,
                "nonce": nonce,
                "gasPrice": gas_price,
            }
        )

        # Estimate gas and add small buffer
        try:
            estimated_gas = w3.eth.estimate_gas(tx)
            tx["gas"] = int(estimated_gas * 1.2)
        except Exception as e:
            print(
                f"  ⚠️  Gas estimation failed for {game_type}: {e}. Using default 200000."
            )
            tx["gas"] = 200000

        signed = w3.eth.account.sign_transaction(tx, private_key=owner.key)
        tx_hash = w3.eth.send_raw_transaction(signed.rawTransaction)
        print(f"  📤 Tx sent: {tx_hash.hex()}")
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
        status = "✅" if receipt.status == 1 else "❌"
        print(f"  {status} Mined in block {receipt.blockNumber}\n")

        nonce += 1

    print("All max target scores configured.")


if __name__ == "__main__":
    main()
