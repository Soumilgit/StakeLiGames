"use client";

import React, { useState, useEffect } from "react";
import { useWallet } from "./WalletProvider";
import { Gamepad2, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { ethers } from "ethers";

const games = [
  { id: "queens", name: "Queens", emoji: "👑", difficulty: "Hard", targetTime: 40, unit: "sec", reward: "25%", flawlessBonus: "10%" },
  { id: "crossclimb", name: "Crossclimb", emoji: "🧗", difficulty: "Hard", targetTime: 50, unit: "sec", reward: "25%", flawlessBonus: "10%" },
  { id: "mini-sudoku", name: "Mini Sudoku", emoji: "🔢", difficulty: "Medium", targetTime: 80, unit: "sec", reward: "20%", flawlessBonus: "8%" },
  { id: "tango", name: "Tango", emoji: "💃", difficulty: "Medium", targetTime: 90, unit: "sec", reward: "20%", flawlessBonus: "8%" },
  { id: "zip", name: "Zip", emoji: "⚡", difficulty: "Easy", targetTime: 120, unit: "sec", reward: "15%", flawlessBonus: "5%" },
  { id: "pinpoint", name: "Pinpoint", emoji: "🎯", difficulty: "Special", targetTime: 5, unit: "score", reward: "30%", flawlessBonus: "0%", note: "Score: 1-5 or NA", hideFlawless: true },
];

export function StakingInterface() {
  const { account, signer } = useWallet();
  const [selectedGame, setSelectedGame] = useState(games[0]);
  const [stakeAmount, setStakeAmount] = useState("");
  const [targetTime, setTargetTime] = useState("");
  const [isFlawless, setIsFlawless] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatUSDC = (v: number) => {
    if (!isFinite(v) || isNaN(v)) return "0.00";
    if (v >= 0.01) return v.toFixed(2);
    if (v >= 0.001) return v.toFixed(4);
    return v.toFixed(6);
  };

  const handleStake = async () => {
    if (!account || !signer || !stakeAmount || !targetTime) {
      alert("Please connect wallet and fill all fields");
      return;
    }

    setLoading(true);
    try {
      // Contract ABI (corrected - createGame expects bytes32 gameId)
      const contractABI = [
        "function createGame(bytes32 gameId, string gameType, uint256 targetScore, uint256 stakeAmount, uint256 flawlessStake) external"
      ];

      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
      if (!contractAddress) {
        throw new Error("Contract address not found. Please deploy the contract first.");
      }

      // Create contract instance
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Create game ID as bytes32
      const gameIdString = `${selectedGame.id}_${account}_${Date.now()}`;
      const gameId = ethers.id(gameIdString); // ethers.id returns bytes32

      // Convert stake amount to USDC smallest unit (6 decimals)
      const microAmount = ethers.parseUnits(stakeAmount, 6);
      const flawlessMicro = isFlawless ? microAmount : ethers.parseUnits("0", 6);

      // Approve USDC transfer (base + flawless) to contract if necessary
      const usdcAddress = process.env.NEXT_PUBLIC_USDC_ADDRESS || "";
      if (!usdcAddress) throw new Error("USDC address not configured");
      const usdcAbi = ["function approve(address spender, uint256 amount) public returns (bool)"];
      const usdcContract = new ethers.Contract(usdcAddress, usdcAbi, signer);
      const totalToApprove = microAmount + flawlessMicro;
      // Request approval
      const approveTx = await usdcContract.approve(contractAddress, totalToApprove);
      await approveTx.wait();

      // Call createGame function
      // For Pinpoint: targetTime is tries (1-5), for others: time in seconds
      const tx = await contract.createGame(
        gameId,
        selectedGame.id,
        parseInt(targetTime),
        microAmount,
        flawlessMicro
      );

      console.log("Transaction sent:", tx.hash);
      alert(`⏳ Transaction submitted! Hash: ${tx.hash}\n\nWaiting for confirmation...`);

      // Wait for confirmation
      const receipt = await tx.wait();
      
      console.log("Stake successful! Receipt:", receipt);
      const performanceMsg = selectedGame.id === "pinpoint" 
        ? `score of ${targetTime} or lower (1-5, or NA if unsolved)`
        : `under ${targetTime} seconds`;
      const bonusMsg = isFlawless && !selectedGame.hideFlawless ? " (+ Flawless Bonus!)" : "";
      alert(`🎉 Stake created successfully!\n\nNow play ${selectedGame.name} and complete it with ${performanceMsg}${bonusMsg}!`);

      // Reset form
      setStakeAmount("");
      setTargetTime("");
      setIsFlawless(false);
    } catch (error: any) {
      console.error("Staking failed:", error);
      alert("Staking failed: " + (error.message || error.toString()));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="stake" className="py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-secondary/5" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">Start Staking Now</h2>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Choose your game, set your time target, and stake to earn rewards.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Game Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card-modern"
          >
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Gamepad2 className="w-6 h-6 text-primary" />
              Select Your Game
            </h3>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {games.map((game) => (
                <button
                  key={game.id}
                  onClick={() => setSelectedGame(game)}
                  className={`p-3 rounded-lg border transition-all ${
                    selectedGame.id === game.id
                      ? "bg-gradient-primary border-primary shadow-glow scale-105"
                      : "bg-card/50 border-border hover:border-primary/50 hover:shadow-glow-sm hover:scale-105"
                  }`}
                >
                  <div className="text-2xl mb-1">{game.emoji}</div>
                  <div className={`font-bold text-sm mb-1 ${selectedGame.id === game.id ? 'text-white' : ''}`}>{game.name}</div>
                  <div className={`text-xs ${selectedGame.id === game.id ? 'text-white/80' : 'text-muted'}`}>{game.difficulty}</div>
                  <div className={`text-xs font-bold mt-1 ${selectedGame.id === game.id ? 'text-white' : 'text-primary'}`}>+{game.reward}</div>
                </button>
              ))}
            </div>

            {selectedGame && <SelectedGameBox selectedGame={selectedGame} />}
          </motion.div>

          {/* Staking Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card-modern"
          >
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-secondary" />
              Configure Your Stake
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2">Stake Amount (USDC)</label>
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  placeholder="Enter amount (e.g., 0.01)"
                  className="input-modern w-full"
                  min="0.01"
                  step="0.01"
                />
                <div className="text-xs text-muted mt-2">Minimum: 0.01 USDC</div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">
                  {selectedGame.id === "pinpoint" ? "Target Score (1-5 or NA)" : "Target Time (seconds)"}
                </label>
                <input
                  type="number"
                  value={targetTime}
                  onChange={(e) => setTargetTime(e.target.value)}
                  placeholder={selectedGame.id === "pinpoint" ? "e.g., 3" : `e.g., ${selectedGame.targetTime}`}
                  className="input-modern w-full"
                  min={selectedGame.id === "pinpoint" ? 1 : 10}
                  max={selectedGame.id === "pinpoint" ? 5 : undefined}
                />
                <div className="text-xs text-muted mt-2">
                  {selectedGame.id === "pinpoint" 
                    ? "Set score target (1-5). Lower score = harder = higher rewards! NA if unsolved."
                    : "Set your time target. Faster = harder = higher rewards!"}
                </div>
              </div>

              {!selectedGame.hideFlawless && (
                <div className="bg-gradient-to-r from-secondary/10 to-accent/10 p-4 rounded-lg border border-secondary/20">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFlawless}
                      onChange={(e) => setIsFlawless(e.target.checked)}
                      className="w-5 h-5 accent-secondary"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-sm flex items-center gap-2">
                        ✨ Flawless Solve Commitment
                        <span className="text-xs bg-secondary text-white px-2 py-0.5 rounded-full">+{selectedGame.flawlessBonus}</span>
                      </div>
                      <div className="text-xs text-muted mt-1">
                        No hints, no mistakes - pure skill! Earn extra rewards for honest solving.
                      </div>
                    </div>
                  </label>
                </div>
              )}

              {stakeAmount && targetTime && (
                <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-4 rounded-lg border border-primary/20">
                  <div className="text-sm font-semibold text-muted mb-3">Estimated Returns</div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Stake Amount:</span>
                      <span className="font-bold">{stakeAmount} USDC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Base Reward ({selectedGame.reward}):</span>
                      <span className="font-bold text-primary">
                        {formatUSDC(parseFloat(stakeAmount) * parseFloat(selectedGame.reward) / 100)} USDC
                      </span>
                    </div>
                    {isFlawless && !selectedGame.hideFlawless && (
                      <div className="flex justify-between">
                        <span className="text-sm flex items-center gap-1">✨ Flawless Bonus ({selectedGame.flawlessBonus}):</span>
                        <span className="font-bold text-secondary">
                          +{formatUSDC(parseFloat(stakeAmount) * parseFloat(selectedGame.flawlessBonus) / 100)} USDC
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-border">
                      <span className="font-semibold">Total if Success:</span>
                      <span className="font-bold text-lg text-primary">
                        {formatUSDC(
                            parseFloat(stakeAmount) * 
                            (1 + parseFloat(selectedGame.reward) / 100 + ((isFlawless && !selectedGame.hideFlawless) ? parseFloat(selectedGame.flawlessBonus) / 100 : 0))
                          )} USDC
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleStake}
                disabled={!account || loading || !stakeAmount || !targetTime}
                className="btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : account ? "🚀 Create Stake" : "Connect Wallet First"}
              </button>

              {!account && (
                <div className="text-center text-sm text-muted">
                  Connect your MetaMask wallet to start staking
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-12">
          <div className="card-modern bg-white hover:bg-cardHover">
            <div className="text-3xl mb-3">⚡</div>
            <h4 className="font-bold mb-2">Time-Based & Score Scoring</h4>
            <p className="text-sm text-muted">
              Beat the clock for 5 games! Pinpoint uses score (1-5 or NA if unsolved).
            </p>
          </div>
          <div className="card-modern bg-card/50 hover:bg-cardHover">
            <div className="text-3xl mb-3">✨</div>
            <h4 className="font-bold mb-2">Flawless Bonuses</h4>
            <p className="text-sm text-muted">
              No hints, no mistakes! Honest solvers earn extra rewards up to 12% bonus.
            </p>
          </div>
          <div className="card-modern bg-card/50 hover:bg-cardHover">
            <div className="text-3xl mb-3">🔒</div>
            <h4 className="font-bold mb-2">Secure & Transparent</h4>
            <p className="text-sm text-muted">
              All stakes are locked in audited smart contracts on Ethereum Sepolia testnet.
            </p>
          </div>
        </div>
      </div>
    </section>

  );
}

// --- SelectedGameBox component for dynamic background ---
type SelectedGame = {
  id: string;
  name: string;
  emoji: string;
  difficulty: string;
  targetTime: number;
  unit: string;
  reward: string;
  flawlessBonus: string;
  note?: string;
  hideFlawless?: boolean;
};

function SelectedGameBox({ selectedGame }: { selectedGame: SelectedGame }) {
  const [bg, setBg] = React.useState('white');
  React.useEffect(() => {
    const html = document.documentElement;
    const updateBg = () => {
      setBg(html.classList.contains('dark') ? '#181825' : 'white');
    };
    updateBg();
    const observer = new MutationObserver(updateBg);
    observer.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  return (
    <div
      className="p-4 rounded-lg border border-border"
      style={{ backgroundColor: bg, color: 'inherit' }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-muted">Selected Game:</span>
        <span className="text-xl">{selectedGame.emoji}</span>
      </div>
      <div className="font-bold text-lg mb-1 gradient-text">{selectedGame.name}</div>
      <div className="text-sm text-muted mb-2">Difficulty: {selectedGame.difficulty}</div>
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <span className="text-sm font-semibold text-muted">Target:</span>
        <span className="font-bold text-primary">
          {selectedGame.id === "pinpoint" ? `≤${selectedGame.targetTime} score` : `<${selectedGame.targetTime} sec`}
        </span>
      </div>
      <div className="flex items-center justify-between pt-1">
        <span className="text-sm font-semibold text-muted">Base Reward:</span>
        <span className="font-bold text-primary">{selectedGame.reward}</span>
      </div>
      {!selectedGame.hideFlawless && (
        <div className="flex items-center justify-between pt-1">
          <span className="text-sm font-semibold text-muted">Flawless Bonus:</span>
          <span className="font-bold text-secondary">+{selectedGame.flawlessBonus}</span>
        </div>
      )}
      {selectedGame.note && (
        <div className="text-xs text-muted mt-2 italic">{selectedGame.note}</div>
      )}
    </div>
  );
}
