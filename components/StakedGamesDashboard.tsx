"use client";

import { useEffect, useState } from "react";
import { useWallet } from "./WalletProvider";
import { ethers } from "ethers";
import Link from "next/link";

// This dashboard lists all games staked by the user and provides a button to submit results for each
export default function StakedGamesDashboard() {
  const { account, signer } = useWallet();
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGames = async () => {
      if (!account || !signer) return;
      setLoading(true);
      setError("");
      try {
        // Fetch GameCreated events for this user
        const contractABI = [
          "event GameCreated(bytes32 indexed gameId, address indexed player, string gameType, uint256 targetScore, uint256 stakeAmount, uint256 flawlessStake)",
          "event GameVerified(bytes32 indexed gameId, address indexed player, uint256 actualScore, bool won, bool flawlessClaimed, uint256 payout)",
          // Use ethers v6 tuple ABI with named output (flawlessStake added)
          "function getGame(bytes32 gameId) view returns (tuple(address player, uint256 targetScore, uint256 stakeAmount, uint256 flawlessStake, uint256 timestamp, uint8 status, string gameType) game)"
        ];
        const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
        const provider = signer.provider;
        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        // Query all GameCreated events for this user
        const filter = contract.filters.GameCreated(null, account);
        const events = await contract.queryFilter(filter, 0); // all blocks since contract deployment
        // Always fetch latest status from contract for each game
        const gameList = await Promise.all(events.map(async (ev: any) => {
          const gameId = ev.args.gameId;
          let gameData;
          let actualScore = null;
          try {
            gameData = await contract.getGame(gameId);
            // Fetch GameVerified event for this gameId
            const verifiedFilter = contract.filters.GameVerified(gameId);
            const verifiedEvents = await contract.queryFilter(verifiedFilter, 0);
            if (verifiedEvents.length > 0) {
              // Use the last GameVerified event (should only be one per game)
              const last = verifiedEvents[verifiedEvents.length - 1];
              // ethers v6: args may not exist on Log/EventLog in production, so decode if needed
              let actualScoreRaw = null;
              if ('args' in last && last.args && typeof last.args === 'object') {
                actualScoreRaw = last.args.actualScore;
              } else if (last.data && last.topics) {
                // decode log manually
                const iface = new ethers.Interface([
                  "event GameVerified(bytes32 indexed gameId, address indexed player, uint256 actualScore, bool won, bool flawlessClaimed, uint256 payout)"
                ]);
                const decoded = iface.decodeEventLog("GameVerified", last.data, last.topics);
                actualScoreRaw = decoded.actualScore;
              }
              actualScore = actualScoreRaw?.toString?.() || actualScoreRaw;
            }
            // Convert ethers.js Result (Proxy) to plain object
            let gameObj: { [key: string]: any };
            if (gameData && typeof gameData === "object" && typeof gameData.toObject === "function") {
              gameObj = gameData.toObject();
            } else if (gameData && typeof gameData === "object") {
              gameObj = {};
              for (const key of Object.keys(gameData)) {
                gameObj[key] = gameData[key];
              }
              for (const key in gameData) {
                if (!isNaN(Number(key))) {
                  gameObj[key] = gameData[key];
                }
              }
            } else {
              gameObj = gameData;
            }
            // Log all properties for debugging
            console.log("dashboard row", ev.args.gameId, gameObj, { actualScore });
          } catch (err) {
            console.warn('getGame failed', gameId, err);
          }
          let gameType, targetScore, stakeAmount, status;
          if (gameData && typeof gameData === "object" && "gameType" in gameData) {
            gameType = gameData.gameType || ev.args.gameType;
            targetScore = gameData.targetScore?.toString?.() || ev.args.targetScore?.toString?.() || "";
            try {
              stakeAmount = gameData.stakeAmount ? ethers.formatUnits(gameData.stakeAmount, 6) : ethers.formatUnits(ev.args.stakeAmount, 6);
            } catch {
              stakeAmount = gameData.stakeAmount?.toString?.() || ev.args.stakeAmount?.toString?.() || "0";
            }
            // read flawlessStake if present
            let flawlessStake = "0";
            try {
              flawlessStake = gameData.flawlessStake ? ethers.formatUnits(gameData.flawlessStake, 6) : "0";
            } catch { flawlessStake = gameData.flawlessStake?.toString?.() || "0"; }
            status = typeof gameData.status !== "undefined" ? Number(gameData.status) : 0;
            // attach flawless info to object for UI
            ev.flawlessStake = flawlessStake;
          } else {
            gameType = ev.args.gameType;
            targetScore = ev.args.targetScore?.toString?.() || "";
            try {
              stakeAmount = ethers.formatUnits(ev.args.stakeAmount, 6);
            } catch {
              stakeAmount = ev.args.stakeAmount?.toString?.() || "0";
            }
            ev.flawlessStake = "0";
            status = typeof ev.args.status !== "undefined" ? Number(ev.args.status) : 0;
          }
          return {
            gameId,
            gameType,
            targetScore,
            stakeAmount,
            flawlessStake: ev.flawlessStake || "0",
            status: typeof status === 'bigint' ? Number(status) : status,
            actualScore: actualScore !== null ? Number(actualScore) : null,
          };
        }));
        setGames(gameList);
      } catch (err: any) {
        setError(err.message || "Failed to fetch games");
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, [account, signer]);

  return (
    <div className="card-modern p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4">Your Staked Games</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {games.length === 0 && !loading && !error && <div>No staked games found.</div>}
      {games.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="px-2 py-1 text-left">Game</th>
                <th className="px-2 py-1 text-left">Target</th>
                <th className="px-2 py-1 text-left">Stake</th>
                <th className="px-2 py-1 text-left">Est. Flawless Stake</th>
                <th className="px-2 py-1 text-left">Status</th>
                <th className="px-2 py-1"></th>
              </tr>
            </thead>
            <tbody>
              {games.map((g) => (
                <tr key={g.gameId} className="border-b border-border">
                  <td className="px-2 py-1">{g.gameType}</td>
                  <td className="px-2 py-1">{g.targetScore}</td>
                  <td className="px-2 py-1">{g.stakeAmount} USDC</td>
                  <td className="px-2 py-1">{g.flawlessStake} USDC</td>
                  <td className="px-2 py-1">
                    {(() => {
                      // Use actualScore from GameVerified event if available
                      if (g.status === 3) return "Cancelled";
                      if (typeof g.actualScore === 'number' && typeof g.targetScore !== 'undefined') {
                        const scoreNum = g.actualScore;
                        const targetNum = Number(g.targetScore);
                        if (!isNaN(scoreNum) && !isNaN(targetNum)) {
                          if (scoreNum < targetNum) return "Won";
                          if (scoreNum > targetNum) return "Lost";
                          if (scoreNum === targetNum) return "Won";
                        }
                      }
                      return "Pending";
                    })()}
                  </td>
                  <td className="px-2 py-1">
                    {/* Only show Submit Result button for pending stakes */}
                    {(() => {
                      // Status logic matches the status column above
                      if (g.status === 3) return null; // Cancelled
                      if (typeof g.actualScore === 'number' && typeof g.targetScore !== 'undefined') {
                        const scoreNum = g.actualScore;
                        const targetNum = Number(g.targetScore);
                        if (!isNaN(scoreNum) && !isNaN(targetNum)) {
                          // Completed (won/lost), no button
                          return null;
                        }
                      }
                      // Pending: show button
                      return (
                        <Link href={`/game/${g.gameId}`}>
                          <button className="btn-secondary text-xs">Submit Result</button>
                        </Link>
                      );
                    })()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
