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

// ABIs for current vs legacy contract versions
const ifaceNew = new ethers.Interface([
  "event GameCreated(bytes32 indexed gameId, address indexed player, string gameType, uint256 targetScore, uint256 stakeAmount, uint256 flawlessStake)",
  "event GameVerified(bytes32 indexed gameId, address indexed player, uint256 actualScore, bool won, bool flawlessClaimed, uint256 payout)",
  "function getGame(bytes32 gameId) view returns (tuple(address player, uint256 targetScore, uint256 stakeAmount, uint256 flawlessStake, uint256 timestamp, uint8 status, string gameType))"
]);

const ifaceOld = new ethers.Interface([
  "event GameCreated(bytes32 indexed gameId, address indexed player, string gameType, uint256 targetScore, uint256 stakeAmount)",
  "event GameVerified(bytes32 indexed gameId, address indexed player, uint256 actualScore, bool won, uint256 payout)",
  "function getGame(bytes32 gameId) view returns (tuple(address player, uint256 targetScore, uint256 stakeAmount, uint256 timestamp, uint8 status, string gameType))"
]);

const TOPIC_GAME_CREATED_NEW = ethers.id("GameCreated(bytes32,address,string,uint256,uint256,uint256)");
const TOPIC_GAME_CREATED_OLD = ethers.id("GameCreated(bytes32,address,string,uint256,uint256)");

const TOPIC_GAME_VERIFIED_NEW = ethers.id("GameVerified(bytes32,address,uint256,bool,bool,uint256)");
const TOPIC_GAME_VERIFIED_OLD = ethers.id("GameVerified(bytes32,address,uint256,bool,uint256)");


// Robust chunked getLogs that respects RPC block range limits (e.g. MetaMask/Infura 10,000 blocks limit)
// with automatic bisection on range-related RPC errors.
async function getLogsChunked(
  provider: ethers.Provider,
  filter: any,
  fromBlock: number,
  toBlock: number,
  maxChunk = 8000,
  concurrency = 6
): Promise<any[]> {
  if (toBlock < fromBlock) return [];
  const ranges: { from: number; to: number }[] = [];
  for (let from = fromBlock; from <= toBlock; from += maxChunk) {
    ranges.push({ from, to: Math.min(from + maxChunk - 1, toBlock) });
  }

  const results: any[] = [];
  for (let i = 0; i < ranges.length; i += concurrency) {
    const batch = ranges.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map(async ({ from, to }) => {
        try {
          return await provider.getLogs({
            ...filter,
            fromBlock: from,
            toBlock: to,
          });
        } catch (err: any) {
          const msg = String(err?.message || "").toLowerCase();
          const isRangeErr =
            err?.code === -32602 ||
            err?.code === -32701 ||
            msg.includes("exceed") ||
            msg.includes("limit") ||
            msg.includes("range");

          if (isRangeErr && to > from) {
            const mid = Math.floor((from + to) / 2);
            const [left, right] = await Promise.all([
              getLogsChunked(provider, filter, from, mid, Math.floor(maxChunk / 2), 2),
              getLogsChunked(provider, filter, mid + 1, to, Math.floor(maxChunk / 2), 2),
            ]);
            return [...left, ...right];
          } else {
            console.warn(`getLogs failed for range [${from}, ${to}]:`, err);
            return [];
          }
        }
      })
    );
    for (const res of batchResults) {
      if (Array.isArray(res)) results.push(...res);
    }
  }

  return results;
}

function decodeVerifiedLog(log: any) {
  try {
    const decoded = ifaceNew.decodeEventLog("GameVerified", log.data, log.topics);
    return {
      actualScore: Number(decoded.actualScore),
      won: Boolean(decoded.won),
      payout: ethers.formatUnits(decoded.payout, 6),
    };
  } catch {
    try {
      const decoded = ifaceOld.decodeEventLog("GameVerified", log.data, log.topics);
      return {
        actualScore: Number(decoded.actualScore),
        won: Boolean(decoded.won),
        payout: ethers.formatUnits(decoded.payout, 6),
      };
    } catch {
      return null;
    }
  }
}

function decodeCreatedLog(log: any) {
  try {
    const decoded = ifaceNew.decodeEventLog("GameCreated", log.data, log.topics);
    return {
      gameId: decoded.gameId,
      player: decoded.player,
      gameType: decoded.gameType,
      targetScore: decoded.targetScore?.toString?.() || "",
      stakeAmount: ethers.formatUnits(decoded.stakeAmount, 6),
      flawlessStake: ethers.formatUnits(decoded.flawlessStake, 6),
    };
  } catch {
    try {
      const decoded = ifaceOld.decodeEventLog("GameCreated", log.data, log.topics);
      return {
        gameId: decoded.gameId,
        player: decoded.player,
        gameType: decoded.gameType,
        targetScore: decoded.targetScore?.toString?.() || "",
        stakeAmount: ethers.formatUnits(decoded.stakeAmount, 6),
        flawlessStake: "0",
      };
    } catch {
      return null;
    }
  }
}

async function fetchGameData(provider: ethers.Provider, contractAddress: string, gameId: string) {
  let targetAddr = contractAddress;
  try {
    targetAddr = ethers.getAddress(contractAddress.toLowerCase());
  } catch {}

  try {
    const res = await provider.call({
      to: targetAddr,
      data: ifaceNew.encodeFunctionData("getGame", [gameId]),
    });
    const decoded = ifaceNew.decodeFunctionResult("getGame", res);
    return {
      gameType: decoded[0].gameType,
      targetScore: decoded[0].targetScore?.toString?.() || "",
      stakeAmount: ethers.formatUnits(decoded[0].stakeAmount, 6),
      flawlessStake: ethers.formatUnits(decoded[0].flawlessStake, 6),
      timestamp: Number(decoded[0].timestamp),
      status: Number(decoded[0].status),
    };
  } catch {
    try {
      const res = await provider.call({
        to: targetAddr,
        data: ifaceOld.encodeFunctionData("getGame", [gameId]),
      });
      const decoded = ifaceOld.decodeFunctionResult("getGame", res);
      return {
        gameType: decoded[0].gameType,
        targetScore: decoded[0].targetScore?.toString?.() || "",
        stakeAmount: ethers.formatUnits(decoded[0].stakeAmount, 6),
        flawlessStake: "0",
        timestamp: Number(decoded[0].timestamp),
        status: Number(decoded[0].status),
      };
    } catch {
      return null;
    }
  }
}

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
        const primaryAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
        const secondLastAddress =
          process.env.NEXT_PUBLIC_SECOND_LAST_CONTRACT_ADDRESS ||
          process.env.NEXT_PUBLIC_SECOND_LAST_CONTRACT_ADDRESSES ||
          "";
        const thirdLastAddress =
          process.env.NEXT_PUBLIC_THIRD_LAST_CONTRACT_ADDRESSES ||
          process.env.NEXT_PUBLIC_THIRD_LAST_CONTRACT_ADDRESS ||
          "";
        const legacyAddressesRaw =
          process.env.NEXT_PUBLIC_LEGACY_CONTRACT_ADDRESSES ||
          process.env.NEXT_PUBLIC_LEGACY_CONTRACT_ADDRESS ||
          "";
        const legacyAddresses = legacyAddressesRaw
          .split(",")
          .map((addr) => addr.trim())
          .filter((addr) => addr.length > 0);

        const provider = signer.provider;
        if (!provider) return;

        const latestBlock = await provider.getBlockNumber();
        const envStart = Number(
          process.env.NEXT_PUBLIC_DEPLOYMENT_START_BLOCK ||
          process.env.NEXT_PUBLIC_START_BLOCK
        );

        // Build contract configurations directly from environment variables with their active block ranges
        // No hardcoded address literals: all addresses are sourced purely from process.env
        const contractConfigs: { address: string; startBlock: number; endBlock: number }[] = [];

        if (primaryAddress) {
          contractConfigs.push({
            address: primaryAddress,
            startBlock: !isNaN(envStart) && envStart > 0 ? envStart : 11045000,
            endBlock: latestBlock,
          });
        }
        if (secondLastAddress) {
          contractConfigs.push({
            address: secondLastAddress,
            startBlock: 9800000,
            endBlock: 10450000,
          });
        }
        if (thirdLastAddress) {
          contractConfigs.push({
            address: thirdLastAddress,
            startBlock: 10250000,
            endBlock: 10750000,
          });
        }
        for (const addr of legacyAddresses) {
          contractConfigs.push({
            address: addr,
            startBlock: 10500000,
            endBlock: 11100000,
          });
        }

        // Deduplicate addresses safely and normalize with EIP-55 checksum
        const seen = new Set<string>();
        const uniqueConfigs: { address: string; startBlock: number; endBlock: number }[] = [];

        for (const cfg of contractConfigs) {
          if (!cfg.address) continue;
          let normalized = cfg.address.trim();
          try {
            normalized = ethers.getAddress(normalized.toLowerCase());
          } catch {}
          const lower = normalized.toLowerCase();
          if (seen.has(lower)) continue;
          seen.add(lower);

          uniqueConfigs.push({
            address: normalized,
            startBlock: cfg.startBlock,
            endBlock: cfg.endBlock,
          });
        }

        const playerTopic = ethers.zeroPadValue(account.toLowerCase(), 32);

        console.log("[Dashboard] Starting parallel fetch for contracts:", uniqueConfigs.map(c => `${c.address} [${c.startBlock}->${c.endBlock}]`));

        // Helper to stream and deduplicate incoming games per contract
        const updateGamesList = (incoming: any[]) => {
          if (!incoming || incoming.length === 0) return;
          setGames((prev) => {
            const map = new Map<string, any>();
            for (const g of prev) {
              const key = `${(g.contractAddress || "").toLowerCase()}-${g.gameId}`;
              map.set(key, g);
            }
            for (const g of incoming) {
              const key = `${(g.contractAddress || "").toLowerCase()}-${g.gameId}`;
              map.set(key, g);
            }
            const merged = Array.from(map.values());
            merged.sort((a, b) => {
              if (a.createdBlock !== b.createdBlock) {
                return (b.createdBlock || 0) - (a.createdBlock || 0);
              }
              return (b.createdLogIndex || 0) - (a.createdLogIndex || 0);
            });
            return merged;
          });
        };

        // Fetch all contracts concurrently in parallel for instant, low-latency loading
        await Promise.all(
          uniqueConfigs.map(async (config) => {
            const addr = config.address;
            const startBlock = config.startBlock;
            const endBlock = config.endBlock;

            try {
              console.log(`[Dashboard] Scanning ${addr} [blocks ${startBlock} -> ${endBlock}]...`);

              // Query both new and legacy GameCreated schemas concurrently
              const [logsNew, logsOld] = await Promise.all([
                getLogsChunked(
                  provider,
                  { address: addr, topics: [TOPIC_GAME_CREATED_NEW, null, playerTopic] },
                  startBlock,
                  endBlock,
                  8000,
                  4
                ),
                getLogsChunked(
                  provider,
                  { address: addr, topics: [TOPIC_GAME_CREATED_OLD, null, playerTopic] },
                  startBlock,
                  endBlock,
                  8000,
                  4
                ),
              ]);

              const createdLogs = [...logsNew, ...logsOld];
              console.log(`[Dashboard] Contract ${addr}: found ${createdLogs.length} created logs`);

              if (!createdLogs || createdLogs.length === 0) {
                return;
              }

              // Only query verification events starting from the earliest game created
              const minCreatedBlock = Math.min(
                ...createdLogs.map((l: any) => Number(l.blockNumber || startBlock))
              );

              // Query both new and legacy GameVerified schemas concurrently
              const [vNew, vOld] = await Promise.all([
                getLogsChunked(
                  provider,
                  { address: addr, topics: [TOPIC_GAME_VERIFIED_NEW, null, playerTopic] },
                  minCreatedBlock,
                  endBlock,
                  8000,
                  4
                ),
                getLogsChunked(
                  provider,
                  { address: addr, topics: [TOPIC_GAME_VERIFIED_OLD, null, playerTopic] },
                  minCreatedBlock,
                  endBlock,
                  8000,
                  4
                ),
              ]);

              const verifiedLogs = [...vNew, ...vOld];
              const verifiedMap = new Map<string, any>();
              for (const v of verifiedLogs) {
                const gId = v?.topics?.[1];
                if (gId) {
                  verifiedMap.set(gId, decodeVerifiedLog(v));
                }
              }

              const gamesForContract = await Promise.all(
                createdLogs.map(async (ev: any) => {
                  const gameId = ev?.topics?.[1];
                  const decodedCreated = decodeCreatedLog(ev);
                  const verifiedInfo = verifiedMap.get(gameId);

                  // If game is already verified from logs, status is won (1) or lost (2).
                  // Only make an onchain getGame call if unverified to check for cancelled status (3).
                  let status = verifiedInfo ? (verifiedInfo.won ? 1 : 2) : 0;
                  let onchainGame: any = null;

                  if (!verifiedInfo) {
                    onchainGame = await fetchGameData(provider, addr, gameId);
                    if (onchainGame?.status !== undefined) {
                      status = onchainGame.status;
                    }
                  }

                  const actualScore =
                    verifiedInfo?.actualScore !== undefined ? Number(verifiedInfo.actualScore) : null;

                  return {
                    contractAddress: addr,
                    gameId,
                    gameType: onchainGame?.gameType || decodedCreated?.gameType || "unknown",
                    targetScore: onchainGame?.targetScore || decodedCreated?.targetScore || "",
                    stakeAmount: onchainGame?.stakeAmount || decodedCreated?.stakeAmount || "0",
                    flawlessStake: onchainGame?.flawlessStake || decodedCreated?.flawlessStake || "0",
                    status,
                    actualScore,
                    createdBlock: Number(ev.blockNumber ?? 0),
                    createdLogIndex: Number(ev.index ?? ev.logIndex ?? 0),
                  };
                })
              );

              console.log(`[Dashboard] Loaded ${gamesForContract.length} games for ${addr}`);
              updateGamesList(gamesForContract);
            } catch (err) {
              console.warn("Failed to fetch games for contract", addr, err);
            }
          })
        );
      } catch (err: any) {
        setError(err.message || "Failed to fetch games");
      } finally {
        setLoading(false);
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
      { key: "wend", label: "Wend" },
      { key: "patches", label: "Patches" },
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
      if (!isNaN(scoreNum) && !isNaN(targetNum)) {
        if (scoreNum < targetNum) {
          wins[index] += 1;
        } else if (scoreNum >= targetNum) {
          losses[index] += 1;
        }
      } else if (g.status === 1) {
        wins[index] += 1;
      } else if (g.status === 2) {
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
        },
        {
          label: "Losses",
          data: chartStats.losses,
          borderColor: "rgba(239,68,68,1)",
          backgroundColor: "rgba(239,68,68,0.15)",
          tension: 0.3,
          pointRadius: 5,
          borderWidth: 3,
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
  const getGameResultStatus = (g: any) => {
    if (g.status === 3) return "Cancelled";
    if (typeof g.actualScore === "number" && typeof g.targetScore !== "undefined") {
      const scoreNum = g.actualScore;
      const targetNum = Number(g.targetScore);
      if (!isNaN(scoreNum) && !isNaN(targetNum)) {
        // All supported games currently use reverse scoring (lower-is-better)
        if (scoreNum < targetNum) return "Won";
        if (scoreNum >= targetNum) return "Lost";
      }
    }
    if (g.status === 1) return "Won";
    if (g.status === 2) return "Lost";
    return "Pending";
  };

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
                <tr key={`${g.contractAddress || ""}-${g.gameId}`} className="border-b border-border">
                  <td className="px-2 py-1">{g.gameType}</td>
                  <td className="px-2 py-1">{g.targetScore}</td>
                  <td className="px-2 py-1">{g.stakeAmount} USDC</td>
                  <td className="px-2 py-1">{g.flawlessStake} USDC</td>
                  <td className="px-2 py-1">
                    {(() => {
                      const status = getGameResultStatus(g);
                      if (status === "Won" || status === "Lost") {
                        return (
                          <span className={`status-pill ${status === "Won" ? "status-pill-won" : "status-pill-lost"}`}>
                            {status}
                          </span>
                        );
                      }
                      return status;
                    })()}
                  </td>
                  <td className="px-2 py-1">
                    {/* Only show Submit Result button for pending stakes */}
                    {(() => {
                      // Status logic matches the status column above
                      if (g.status === 3) return null; // Cancelled
                      // Only allow submitting results for games on the primary (current) contract
                      const primaryAddress = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "").toLowerCase();
                      if (!primaryAddress || (g.contractAddress || "").toLowerCase() !== primaryAddress) {
                        return null;
                      }
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
