"""
Compile Solidity contract using Python
No need for Hardhat or npm!
"""

from solcx import compile_standard, install_solc
import json
import os
import requests
import zipfile
import shutil

def download_openzeppelin():
    """Download OpenZeppelin contracts if not present"""
    if os.path.exists("@openzeppelin"):
        print("✅ OpenZeppelin contracts already downloaded")
        return
    
    print("📥 Downloading OpenZeppelin contracts...")
    url = "https://github.com/OpenZeppelin/openzeppelin-contracts/archive/refs/tags/v4.9.0.zip"
    
    response = requests.get(url)
    with open("oz.zip", "wb") as f:
        f.write(response.content)
    
    print("📦 Extracting...")
    with zipfile.ZipFile("oz.zip", "r") as zip_ref:
        zip_ref.extractall(".")
    
    # Move to @openzeppelin folder structure
    os.makedirs("@openzeppelin", exist_ok=True)
    shutil.move("openzeppelin-contracts-4.9.0/contracts", "@openzeppelin/contracts")
    
    # Cleanup
    shutil.rmtree("openzeppelin-contracts-4.9.0")
    os.remove("oz.zip")
    
    print("✅ OpenZeppelin contracts downloaded!")

def compile_contract():
    print("🔨 Installing Solidity compiler...")
    install_solc("0.8.20")
    
    # Download OpenZeppelin if needed
    download_openzeppelin()
    
    print("📝 Reading contract source...")
    with open("StakeLiGames.sol", "r") as file:
        contract_source = file.read()
    
    # Read OpenZeppelin imports
    oz_sources = {}
    oz_imports = [
        "@openzeppelin/contracts/token/ERC20/IERC20.sol",
        "@openzeppelin/contracts/access/Ownable.sol",
        "@openzeppelin/contracts/security/ReentrancyGuard.sol",
        "@openzeppelin/contracts/utils/Context.sol"
    ]
    
    for import_path in oz_imports:
        file_path = import_path.replace("/", os.sep)
        if os.path.exists(file_path):
            with open(file_path, "r") as f:
                oz_sources[import_path] = {"content": f.read()}
    
    print("⚙️  Compiling StakeLiGames.sol...")
    
    all_sources = {"StakeLiGames.sol": {"content": contract_source}}
    all_sources.update(oz_sources)
    
    compiled_sol = compile_standard(
        {
            "language": "Solidity",
            "sources": all_sources,
            "settings": {
                "outputSelection": {
                    "*": {
                        "*": ["abi", "metadata", "evm.bytecode", "evm.sourceMap"]
                    }
                },
                "optimizer": {
                    "enabled": True,
                    "runs": 200
                }
            },
        },
        solc_version="0.8.20",
        allow_paths=["."]
    )
    
    print("✅ Compilation successful!")
    
    # Save compiled contract
    with open("compiled_contract.json", "w") as file:
        json.dump(compiled_sol, file, indent=2)
    
    print("💾 Saved to compiled_contract.json")
    
    # Extract ABI and bytecode for easy access
    contract_data = compiled_sol["contracts"]["StakeLiGames.sol"]["StakeLiGames"]
    
    with open("abi.json", "w") as file:
        json.dump(contract_data["abi"], file, indent=2)
    
    with open("bytecode.txt", "w") as file:
        file.write(contract_data["evm"]["bytecode"]["object"])
    
    print("📄 Extracted ABI to abi.json")
    print("📄 Extracted bytecode to bytecode.txt")
    print("\n🎉 Ready to deploy!")
    
    return contract_data

if __name__ == "__main__":
    compile_contract()
