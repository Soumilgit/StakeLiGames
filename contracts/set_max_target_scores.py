"""
Configure max target scores for each LinkedIn game type by calling
setMaxTargetScore on the deployed StakeLiGames contract on Sepolia.

Usage, from contracts/:
    pip install -r requirements.txt
    python set_max_target_scores.py

Requires:
    PRIVATE_KEY in contracts/.env, using the owner/deployer wallet.

Relies on:
    deployment.json with contractAddress
    abi.json from compile_solidity.py
"""

import json
import os

from dotenv import load_dotenv
from eth_account import Account
from web3 import Web3
from web3.exceptions import TimeExhausted


load_dotenv()
load_dotenv(dotenv_path="../.env.local")

SEPOLIA_RPC_URLS = [
    "https://rpc.sepolia.org",
    "https://ethereum-sepolia.publicnode.com",
    "https://1rpc.io/sepolia",
]

RECEIPT_TIMEOUT_SECONDS = 300

TARGETS = {
    "queens": 600,
    "crossclimb": 600,
    "mini-sudoku": 600,
    "tango": 600,
    "zip": 600,
    "wend": 600,
    "patches": 600,
    "pinpoint": 5,
}


def get_web3() -> Web3:
    for rpc_url in SEPOLIA_RPC_URLS:
        try:
            w3 = Web3(Web3.HTTPProvider(rpc_url))
            if w3.is_connected():
                print(f"Connected to Sepolia via {rpc_url}")
                return w3
        except Exception as exc:
            print(f"RPC {rpc_url} failed: {exc}")
    raise RuntimeError("Could not connect to any Sepolia RPC endpoint")


def get_owner_account() -> Account:
    private_key = os.getenv("PRIVATE_KEY")
    if not private_key:
        raise RuntimeError(
            "PRIVATE_KEY not set in contracts/.env; use the same key that deployed the contract."
        )
    return Account.from_key(private_key)


def load_deployment_info() -> dict:
    if not os.path.exists("deployment.json"):
        raise FileNotFoundError(
            "deployment.json not found; deploy the contract first or create this file manually."
        )
    with open("deployment.json", "r") as file:
        data = json.load(file)
    if "contractAddress" not in data:
        raise KeyError("deployment.json missing contractAddress field")
    return data


def game_key(game_type: str) -> bytes:
    return Web3.keccak(text=game_type)


def main() -> None:
    print("\n=== StakeLiGames - Configure Max Target Scores ===\n")

    w3 = get_web3()
    owner = get_owner_account()
    deployment = load_deployment_info()
    contract_address = Web3.to_checksum_address(deployment["contractAddress"])

    print(f"Using owner: {owner.address}")
    print(f"Contract: {contract_address}\n")

    if not os.path.exists("abi.json"):
        raise FileNotFoundError("abi.json not found; run compile_solidity.py first.")

    with open("abi.json", "r") as file:
        abi = json.load(file)

    contract = w3.eth.contract(address=contract_address, abi=abi)

    nonce = w3.eth.get_transaction_count(owner.address, "pending")
    pending_txs = []
    failed_txs = []

    for game_type, max_score in TARGETS.items():
        current_score = contract.functions.maxTargetScore(game_key(game_type)).call()
        if current_score == max_score:
            print(f"{game_type} already configured -> {max_score}. Skipping.\n")
            continue

        print(f"Setting max target for {game_type} -> {max_score} ...")
        tx = contract.functions.setMaxTargetScore(game_type, max_score).build_transaction(
            {
                "from": owner.address,
                "nonce": nonce,
                "gasPrice": w3.eth.gas_price,
            }
        )

        try:
            estimated_gas = w3.eth.estimate_gas(tx)
            tx["gas"] = int(estimated_gas * 1.2)
        except Exception as exc:
            print(f"  Gas estimation failed for {game_type}: {exc}. Using default 200000.")
            tx["gas"] = 200000

        signed = w3.eth.account.sign_transaction(tx, private_key=owner.key)
        tx_hash = w3.eth.send_raw_transaction(signed.rawTransaction)
        tx_hash_hex = tx_hash.hex()
        print(f"  Tx sent: {tx_hash_hex}")
        nonce += 1

        try:
            receipt = w3.eth.wait_for_transaction_receipt(
                tx_hash, timeout=RECEIPT_TIMEOUT_SECONDS
            )
        except TimeExhausted:
            print(
                f"  Timed out after {RECEIPT_TIMEOUT_SECONDS}s waiting for {game_type}. "
                "Continuing with the remaining games."
            )
            print(f"  Tx: https://sepolia.etherscan.io/tx/{tx_hash_hex}\n")
            pending_txs.append((game_type, tx_hash_hex))
            continue

        if receipt.status == 1:
            print(f"  OK: mined in block {receipt.blockNumber}\n")
        else:
            print(f"  FAILED: mined in block {receipt.blockNumber}\n")
            failed_txs.append((game_type, tx_hash_hex))

    if pending_txs:
        print("Submitted transactions still pending or slow:")
        for game_type, tx_hash_hex in pending_txs:
            print(f"- {game_type}: https://sepolia.etherscan.io/tx/{tx_hash_hex}")
        print("Rerun this script later; already configured games will be skipped.\n")

    if failed_txs:
        print("Transactions that mined but failed:")
        for game_type, tx_hash_hex in failed_txs:
            print(f"- {game_type}: https://sepolia.etherscan.io/tx/{tx_hash_hex}")
        raise RuntimeError("One or more max target transactions failed")

    if not pending_txs:
        print("All max target scores configured.")


if __name__ == "__main__":
    main()
