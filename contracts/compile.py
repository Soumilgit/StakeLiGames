"""
Compile PyTeal contracts to TEAL
"""

import sys
import os

# Add contracts directory to path
sys.path.append(os.path.dirname(__file__))

from staking_contract import approval_program, clear_state_program
from pyteal import compileTeal, Mode


def compile_contracts():
    """Compile all PyTeal contracts to TEAL"""
    
    print("🔨 Compiling StakeLiGames smart contracts...")
    
    # Compile approval program
    print("📝 Compiling approval program...")
    approval_teal = compileTeal(approval_program(), mode=Mode.Application, version=8)
    with open("contracts/staking_approval.teal", "w") as f:
        f.write(approval_teal)
    print("✅ staking_approval.teal compiled")
    
    # Compile clear state program
    print("📝 Compiling clear state program...")
    clear_teal = compileTeal(clear_state_program(), mode=Mode.Application, version=8)
    with open("contracts/staking_clear.teal", "w") as f:
        f.write(clear_teal)
    print("✅ staking_clear.teal compiled")
    
    print("\n🎉 All contracts compiled successfully!")
    print("\n📊 Contract Stats:")
    print(f"  - Approval program: {len(approval_teal.split('\\n'))} lines")
    print(f"  - Clear state program: {len(clear_teal.split('\\n'))} lines")
    
    return True


if __name__ == "__main__":
    compile_contracts()
