"""
StakeLiGames - Staking Smart Contract (PyTeal)
Allows users to stake USDC on LinkedIn Games scores and earn rewards based on verified results.
"""

from pyteal import *


def approval_program():
    # Global State Schema
    # - total_staked: Total USDC staked in the platform
    # - total_games: Number of games created
    # - platform_fee: Platform fee percentage (basis points, e.g., 250 = 2.5%)
    # - owner: Platform owner address
    
    # Local State Schema (per user)
    # - staked_amount: Amount user has staked
    # - games_participated: Number of games user participated in
    # - total_winnings: Total amount won
    # - total_losses: Total amount lost
    
    # Game State (Box Storage for scalability)
    # - game_id -> game_data (player, score_claimed, stake_amount, timestamp, status)
    
    on_creation = Seq([
        App.globalPut(Bytes("total_staked"), Int(0)),
        App.globalPut(Bytes("total_games"), Int(0)),
        App.globalPut(Bytes("platform_fee"), Int(250)),  # 2.5% fee
        App.globalPut(Bytes("owner"), Txn.sender()),
        Approve()
    ])
    
    # Initialize user account
    on_opt_in = Seq([
        App.localPut(Txn.sender(), Bytes("staked_amount"), Int(0)),
        App.localPut(Txn.sender(), Bytes("games_participated"), Int(0)),
        App.localPut(Txn.sender(), Bytes("total_winnings"), Int(0)),
        App.localPut(Txn.sender(), Bytes("total_losses"), Int(0)),
        Approve()
    ])
    
    # Create a new staking game
    # Args: game_id, target_score, stake_amount (in microUSDC)
    create_game = Seq([
        Assert(Txn.application_args.length() == Int(3)),
        Assert(Gtxn[1].type_enum() == TxnType.AssetTransfer),
        Assert(Gtxn[1].asset_receiver() == Global.current_application_address()),
        Assert(Gtxn[1].asset_amount() == Btoi(Txn.application_args[2])),
        
        # Store game data in box storage
        App.box_put(
            Txn.application_args[0],  # game_id
            Concat(
                Txn.sender(),  # player address (32 bytes)
                Txn.application_args[1],  # target_score (8 bytes)
                Txn.application_args[2],  # stake_amount (8 bytes)
                Itob(Global.latest_timestamp()),  # timestamp (8 bytes)
                Bytes("pending")  # status (7 bytes)
            )
        ),
        
        # Update user local state
        App.localPut(
            Txn.sender(),
            Bytes("staked_amount"),
            App.localGet(Txn.sender(), Bytes("staked_amount")) + Btoi(Txn.application_args[2])
        ),
        App.localPut(
            Txn.sender(),
            Bytes("games_participated"),
            App.localGet(Txn.sender(), Bytes("games_participated")) + Int(1)
        ),
        
        # Update global state
        App.globalPut(
            Bytes("total_staked"),
            App.globalGet(Bytes("total_staked")) + Btoi(Txn.application_args[2])
        ),
        App.globalPut(
            Bytes("total_games"),
            App.globalGet(Bytes("total_games")) + Int(1)
        ),
        
        Approve()
    ])
    
    # Verify score and distribute rewards
    # Args: game_id, actual_score
    verify_and_payout = Seq([
        Assert(Txn.application_args.length() == Int(2)),
        
        # Get game data from box storage
        Let(
            game_data := App.box_get(Txn.application_args[0]),
            Seq([
                Assert(game_data.hasValue()),
                
                Let(
                    player := Extract(game_data.value(), Int(0), Int(32)),
                    target_score := Btoi(Extract(game_data.value(), Int(32), Int(8))),
                    stake_amount := Btoi(Extract(game_data.value(), Int(40), Int(8))),
                    actual_score := Btoi(Txn.application_args[1]),
                    
                    Seq([
                        # Only player can verify their own game
                        Assert(Txn.sender() == player),
                        
                        # Check if player met or exceeded target score
                        If(
                            actual_score >= target_score,
                            # Player wins - return stake + reward (20% APY equivalent)
                            Seq([
                                Let(
                                    reward := stake_amount / Int(5),  # 20% reward
                                    fee := (stake_amount + reward) * App.globalGet(Bytes("platform_fee")) / Int(10000),
                                    payout := stake_amount + reward - fee,
                                    
                                    Seq([
                                        # Send payout to player
                                        InnerTxnBuilder.Begin(),
                                        InnerTxnBuilder.SetFields({
                                            TxnField.type_enum: TxnType.AssetTransfer,
                                            TxnField.asset_receiver: player,
                                            TxnField.asset_amount: payout,
                                            TxnField.xfer_asset: Int(10458941),  # USDC Asset ID
                                        }),
                                        InnerTxnBuilder.Submit(),
                                        
                                        # Update user stats
                                        App.localPut(
                                            player,
                                            Bytes("total_winnings"),
                                            App.localGet(player, Bytes("total_winnings")) + reward
                                        ),
                                        App.localPut(
                                            player,
                                            Bytes("staked_amount"),
                                            App.localGet(player, Bytes("staked_amount")) - stake_amount
                                        ),
                                    ])
                                )
                            ]),
                            # Player loses - stake goes to reward pool
                            Seq([
                                App.localPut(
                                    player,
                                    Bytes("total_losses"),
                                    App.localGet(player, Bytes("total_losses")) + stake_amount
                                ),
                                App.localPut(
                                    player,
                                    Bytes("staked_amount"),
                                    App.localGet(player, Bytes("staked_amount")) - stake_amount
                                ),
                            ])
                        ),
                        
                        # Update global state
                        App.globalPut(
                            Bytes("total_staked"),
                            App.globalGet(Bytes("total_staked")) - stake_amount
                        ),
                        
                        # Mark game as completed
                        App.box_delete(Txn.application_args[0]),
                        
                        Approve()
                    ])
                )
            ])
        )
    ])
    
    # Withdraw platform fees (owner only)
    withdraw_fees = Seq([
        Assert(Txn.sender() == App.globalGet(Bytes("owner"))),
        Assert(Txn.application_args.length() == Int(1)),
        
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.AssetTransfer,
            TxnField.asset_receiver: Txn.sender(),
            TxnField.asset_amount: Btoi(Txn.application_args[0]),
            TxnField.xfer_asset: Int(10458941),  # USDC Asset ID
        }),
        InnerTxnBuilder.Submit(),
        
        Approve()
    ])
    
    # Main program router
    program = Cond(
        [Txn.application_id() == Int(0), on_creation],
        [Txn.on_completion() == OnComplete.OptIn, on_opt_in],
        [Txn.on_completion() == OnComplete.CloseOut, Approve()],
        [Txn.on_completion() == OnComplete.UpdateApplication, Reject()],
        [Txn.on_completion() == OnComplete.DeleteApplication, Reject()],
        [Txn.application_args[0] == Bytes("create_game"), create_game],
        [Txn.application_args[0] == Bytes("verify_payout"), verify_and_payout],
        [Txn.application_args[0] == Bytes("withdraw_fees"), withdraw_fees],
    )
    
    return program


def clear_state_program():
    return Approve()


if __name__ == "__main__":
    with open("staking_approval.teal", "w") as f:
        compiled = compileTeal(approval_program(), mode=Mode.Application, version=8)
        f.write(compiled)
    
    with open("staking_clear.teal", "w") as f:
        compiled = compileTeal(clear_state_program(), mode=Mode.Application, version=8)
        f.write(compiled)
    
    print("✅ Smart contracts compiled successfully!")
    print("📄 Generated: staking_approval.teal")
    print("📄 Generated: staking_clear.teal")
