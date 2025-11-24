"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "../../../components/WalletProvider";
import { ethers } from "ethers";
import { useParams } from "next/navigation";

export default function GamePage() {
  const router = useRouter();
  const params = useParams();
  const { account, signer } = useWallet();
  const [actualScore, setActualScore] = useState("");
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
        "function verifyAndPayout(bytes32 gameId, uint256 actualScore) external"
      ];
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      // gameIdParam is already bytes32 (from dashboard link)
      const tx = await contract.verifyAndPayout(gameIdParam, parseInt(actualScore));
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
