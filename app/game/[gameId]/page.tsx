"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "../../../components/WalletProvider";
import { ethers } from "ethers";
import { useParams } from "next/navigation";

export default function GamePage() {
  const router = useRouter();
  const params = useParams();
  const { account, signer } = useWallet();
  const [actualScore, setActualScore] = useState("");
  const [flawlessClaimed, setFlawlessClaimed] = useState(false);
  const [gameData, setGameData] = useState<any>(null);
  const [flawlessAvailable, setFlawlessAvailable] = useState(false);
  const [isPinpoint, setIsPinpoint] = useState(false);
  const [platformFee, setPlatformFee] = useState<number | null>(null);
  const [payoutPreview, setPayoutPreview] = useState<string>("0");
  const [explanation, setExplanation] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // Get gameId from dynamic route
  const gameIdParam = params?.gameId || "";

  // Submit result handler
  const handleSubmit = async () => {
    if (!account || !signer || !gameIdParam || !actualScore) {
      setMessage("Please connect wallet and fill all fields.");
      return;
    }
    setSubmitting(true);
    setMessage("");
    try {
      const contractABI = [
        "function verifyAndPayout(bytes32 gameId, uint256 actualScore, bool flawlessClaimed) external"
      ];
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      // gameIdParam is already bytes32 (from dashboard link)
      const tx = await contract.verifyAndPayout(gameIdParam, parseInt(actualScore), flawlessClaimed);
      await tx.wait();
      setMessage("🎉 Result submitted and payout processed!");
      // Redirect to dashboard after short delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 1800);
    } catch (error: any) {
      setMessage("Submission failed: " + (error.message || error.toString()));
    } finally {
      setSubmitting(false);
    }
  };

  // Fetch game details so we can enforce flawless rules in UI
  useEffect(() => {
    if (!gameIdParam || !signer) return;
    const load = async () => {
      try {
        const abi = [
          "function getGame(bytes32) view returns (tuple(address player,uint256 targetScore,uint256 stakeAmount,uint256 flawlessStake,uint256 timestamp,uint8 status,string gameType))"
        ];
        const addr = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
        const c = new ethers.Contract(addr, abi, signer);
        const g = await c.getGame(gameIdParam);
        // g is a tuple-like object; extract fields
        const flawless = g.flawlessStake ? BigInt(g.flawlessStake.toString()) : BigInt(0);
        const gameType = g.gameType || "";
        setGameData(g);
        setFlawlessAvailable(flawless > 0n);
        setIsPinpoint(ethers.keccak256(ethers.toUtf8Bytes(gameType)) === ethers.keccak256(ethers.toUtf8Bytes("pinpoint")));
        // default: only allow claiming flawless if it was staked
        setFlawlessClaimed(false);
        // fetch platform fee so we can preview payout
        try {
          const statsAbi = ["function getPlatformStats() view returns (uint256,uint256,uint256,uint256)"];
          const statsC = new ethers.Contract(addr, statsAbi, signer);
          const stats = await statsC.getPlatformStats();
          // stats[2] is platformFee in basis points
          setPlatformFee(Number(stats[2]));
        } catch (err) {
          console.warn("Failed to read platform stats", err);
        }
      } catch (e: any) {
        console.error("Failed to load game", e);
      }
    };
    load();
  }, [gameIdParam, signer]);

  // Helper to format USDC (6 decimals)
  const formatUSDC = (v: bigint | number | string) => {
    try {
      const n = typeof v === "bigint" ? Number(v) : typeof v === "number" ? v : parseFloat(v as string);
      return (n / 1e6).toFixed(6).replace(/\.([0-9]{2})[0-9]*/,' .$1');
    } catch {
      return "0.000000";
    }
  };

  // Recompute payout preview whenever relevant values change
  useEffect(() => {
    if (!gameData || platformFee == null || actualScore === "") {
      setPayoutPreview("0");
      setExplanation("");
      return;
    }

    const base = BigInt(gameData.stakeAmount.toString());
    const flawless = BigInt(gameData.flawlessStake.toString());
    const isPin = isPinpoint;
    const actual = BigInt(parseInt(actualScore || "0"));
    const target = BigInt(gameData.targetScore.toString());

    let won = false;
    if (isPin) {
      won = actual < target;
    } else {
      won = actual >= target;
    }

    const reward = (base * 20n) / 100n; // contract uses 20%

    let payout = 0n;
    let expl = "";

    if (won) {
      // base + reward always returned on win
      let totalAmount = base + reward;
      const includeFlawless = (!isPin && flawless > 0n && flawlessClaimed);
      if (includeFlawless) totalAmount += flawless;

      const fee = (totalAmount * BigInt(platformFee)) / 10000n;
      payout = totalAmount - fee;

      if (includeFlawless) {
        expl = `Win: returns base + reward + flawless (fee ${platformFee} bps). Flawless stake returned.`;
      } else if (flawless > 0n) {
        expl = `Win: returns base + reward (fee ${platformFee} bps). Flawless stake is forfeited because you did not claim flawless.`;
      } else {
        expl = `Win: returns base + reward (fee ${platformFee} bps). No flawless stake involved.`;
      }
    } else {
      // lost
      const refundFlawless = (!isPin && flawless > 0n && flawlessClaimed);
      if (refundFlawless) {
        payout = flawless;
        expl = `Loss: base stake forfeited. Flawless stake refunded because you claimed flawless.`;
      } else {
        payout = 0n;
        if (flawless > 0n && !isPin) {
          expl = `Loss: base stake forfeited. Flawless stake also forfeited (not claimed).`;
        } else if (isPin && flawless > 0n) {
          // Pinpoint ignores flawless
          expl = `Loss: base stake forfeited. Pinpoint ignores flawless stake and it is forfeited.`;
        } else {
          expl = `Loss: base stake forfeited. No flawless stake to refund.`;
        }
      }
    }

    setPayoutPreview(payout.toString());
    setExplanation(expl);
  }, [gameData, platformFee, actualScore, flawlessClaimed, isPinpoint]);

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Submit Your Game Result</h1>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Your Score / Time</label>
        <input
          type="number"
          value={actualScore}
          onChange={e => setActualScore(e.target.value)}
          className="input-modern w-full max-w-xs"
          placeholder="Enter your score or time"
        />
      </div>
      {isPinpoint ? (
        <div className="mb-4 text-sm text-muted">Pinpoint uses score (lower is better). Flawless option not available.</div>
      ) : (
        <div className="mb-4">
          <label className="inline-flex items-center gap-3">
            <input
              type="checkbox"
              checked={flawlessClaimed}
              onChange={e => setFlawlessClaimed(e.target.checked)}
              className="w-5 h-5 accent-secondary"
              disabled={!flawlessAvailable}
            />
            <span className="font-medium">
              I completed this run flawlessly (no hints, no mistakes)
            </span>
          </label>
          {!flawlessAvailable && (
            <div className="text-xs text-muted mt-2">No flawless stake was set when this game was created.</div>
          )}
        </div>
      )}
      <button
        onClick={handleSubmit}
        disabled={submitting || !actualScore || !account}
        className="btn-primary px-6 py-2"
      >
        {submitting ? "Submitting..." : "Submit Result"}
      </button>
      {message && <div className="mt-6 text-lg font-mono whitespace-pre-line">{message}</div>}
      {!account && <div className="mt-4 text-red-500 font-mono">Please connect your wallet.</div>}
    </div>
  );
}
