"use client";

import { useEffect, useMemo, useState } from "react";
import { useWallet } from "./WalletProvider";
import { ethers } from "ethers";
import Link from "next/link";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

// This dashboard lists all games staked by the user and provides a button to submit results for each
export default function StakedGamesDashboard() {
  const { account, signer } = useWallet();
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const updateTheme = () => {
      setIsDark(html.classList.contains("dark"));
    };
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchGames = async () => {
      if (!account || !signer) return;
      setLoading(true);
      setError("");
      try {
        const contractABI = [
          "event GameCreated(bytes32 indexed gameId, address indexed player, string gameType, uint256 targetScore, uint256 stakeAmount, uint256 flawlessStake)",
          "event GameVerified(bytes32 indexed gameId, address indexed player, uint256 actualScore, bool won, bool flawlessClaimed, uint256 payout)",
          // Use ethers v6 tuple ABI with named output (flawlessStake added)
          "function getGame(bytes32 gameId) view returns (tuple(address player, uint256 targetScore, uint256 stakeAmount, uint256 flawlessStake, uint256 timestamp, uint8 status, string gameType) game)"
        ];

        const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
        const provider = signer.provider;
        const contract = new ethers.Contract(contractAddress, contractABI, provider);

        // Query all GameCreated events for this user on the current contract
        const filter = contract.filters.GameCreated(null, account);
        const events = await contract.queryFilter(filter, 0);

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
            createdBlock: Number((ev as any).blockNumber ?? 0),
            createdLogIndex: Number((ev as any).logIndex ?? (ev as any).index ?? 0),
          };
        }));

        // Sort newest stakes first so latest entries appear at the top
        gameList.sort((a, b) => {
          if (a.createdBlock !== b.createdBlock) {
            return b.createdBlock - a.createdBlock;
          }
          return b.createdLogIndex - a.createdLogIndex;
        });

        setGames(gameList);
      } catch (err: any) {
        setError(err.message || "Failed to fetch games");
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [account, signer]);

  // Whenever the games list changes (e.g., new stake), reset to page 1
  useEffect(() => {
    setCurrentPage(1);
  }, [games.length]);

  const gameTypeConfig = useMemo(
    () => [
      { key: "queens", label: "Queens" },
      { key: "mini-sudoku", label: "Mini Sudoku" },
      { key: "tango", label: "Tango" },
      { key: "zip", label: "Zip" },
      { key: "crossclimb", label: "Crossclimb" },
      { key: "pinpoint", label: "Pinpoint" },
    ],
    []
  );

  const chartStats = useMemo(() => {
    const wins = new Array(gameTypeConfig.length).fill(0);
    const losses = new Array(gameTypeConfig.length).fill(0);

    games.forEach((g) => {
      const key = String(g.gameType || "").toLowerCase();
      const index = gameTypeConfig.findIndex((cfg) => cfg.key === key);
      if (index === -1) return;
      if (g.status === 3) return; // cancelled

      const scoreNum = typeof g.actualScore === "number" ? g.actualScore : NaN;
      const targetNum = Number(g.targetScore);
      if (isNaN(scoreNum) || isNaN(targetNum)) return;

      if (scoreNum < targetNum) {
        wins[index] += 1;
      } else if (scoreNum >= targetNum) {
        losses[index] += 1;
      }
    });

    return {
      labels: gameTypeConfig.map((g) => g.label),
      wins,
      losses,
    };
  }, [games, gameTypeConfig]);

  const chartData = useMemo(
    () => ({
      labels: chartStats.labels,
      datasets: [
        {
          label: "Wins",
          data: chartStats.wins,
          borderColor: "rgba(34,197,94,1)",
          backgroundColor: "rgba(34,197,94,0.15)",
          tension: 0.3,
          pointRadius: 4,
          yAxisID: "y",
        },
        {
          label: "Losses",
          data: chartStats.losses,
          borderColor: "rgba(239,68,68,1)",
          backgroundColor: "rgba(239,68,68,0.15)",
          tension: 0.3,
          pointRadius: 5,
          borderWidth: 3,
          yAxisID: "y1",
        },
      ],
    }),
    [chartStats]
  );

  const chartOptions = useMemo(() => {
    const axisColor = isDark ? "rgba(148,163,184,1)" : "rgba(55,65,81,1)";
    const gridColor = isDark ? "rgba(55,65,81,0.5)" : "rgba(209,213,219,0.5)";
    const legendLabelColor = isDark ? "rgba(229,231,235,1)" : "rgba(31,41,55,1)";

    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom" as const,
          labels: {
            color: legendLabelColor,
            usePointStyle: true,
          },
        },
        tooltip: {
          mode: "index" as const,
          intersect: false,
        },
      },
      interaction: {
        mode: "index" as const,
        intersect: false,
      },
      scales: {
        x: {
          ticks: { color: axisColor },
          grid: { color: gridColor },
        },
        y: {
          ticks: { color: axisColor },
          grid: { color: gridColor },
          grace: "10%",
        },
        y1: {
          position: "right" as const,
          ticks: { color: axisColor },
          grid: { drawOnChartArea: false },
          grace: "10%",
        },
      },
    };
  }, [isDark]);

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(games.length / pageSize));

  const paginatedGames = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages);
    const start = (safePage - 1) * pageSize;
    return games.slice(start, start + pageSize);
  }, [games, currentPage, totalPages]);

  const windowSize = 5;
  const windowStart = Math.floor((currentPage - 1) / windowSize) * windowSize + 1;
  const windowEnd = Math.min(windowStart + windowSize - 1, totalPages);
  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  return (
    <div className="card-modern p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4">Your Staked Games</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {games.length === 0 && !loading && !error && <div>No staked games found.</div>}
      {games.length > 0 && (
        <div className="mb-8">
          <div className="relative w-full h-64 sm:h-72 md:h-80">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      )}
      {games.length > 0 && (
        <>
          <div className="flex justify-center mb-4 gap-2">
            <button
              type="button"
              onClick={() => hasPrevPage && setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={!hasPrevPage}
              className={`w-8 h-8 flex items-center justify-center rounded-md border text-xs font-medium transition-colors
                ${hasPrevPage
                  ? "bg-slate-500/40 text-slate-100 border-slate-400/70 hover:bg-slate-400/70"
                  : "bg-slate-800/40 text-slate-500 border-slate-600/60 cursor-not-allowed"}
              `}
              aria-label="Previous page"
              aria-disabled={!hasPrevPage}
            >
              {"<<"}
            </button>

            {Array.from({ length: windowEnd - windowStart + 1 }, (_, i) => {
              const page = windowStart + i;
              const isActive = page === currentPage;
              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  disabled={isActive}
                  className={`w-8 h-8 flex items-center justify-center rounded-md border text-xs font-medium transition-colors
                    ${isActive
                      ? "bg-slate-600 text-white border-slate-300"
                      : "bg-slate-500/40 text-slate-100 border-slate-400/70 hover:bg-slate-400/70"}
                  `}
                  aria-current={isActive ? "page" : undefined}
                >
                  {page}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => hasNextPage && setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={!hasNextPage}
              className={`w-8 h-8 flex items-center justify-center rounded-md border text-xs font-medium transition-colors
                ${hasNextPage
                  ? "bg-slate-500/40 text-slate-100 border-slate-400/70 hover:bg-slate-400/70"
                  : "bg-slate-800/40 text-slate-500 border-slate-600/60 cursor-not-allowed"}
              `}
              aria-label="Next page"
              aria-disabled={!hasNextPage}
            >
              {">>"}
            </button>
          </div>

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
              {paginatedGames.map((g) => (
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
                          // All supported games currently use reverse scoring (lower-is-better)
                          if (scoreNum < targetNum) return "Won";
                          if (scoreNum > targetNum) return "Lost";
                          if (scoreNum === targetNum) return "Lost";
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
        </>
      )}
    </div>
  );
}
