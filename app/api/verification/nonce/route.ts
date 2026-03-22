import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import { cleanupExpiredNonces, getVerificationStore } from "../../../../lib/verificationStore";

const DEFAULT_WINDOW_SECONDS = 30 * 60;
const MIN_WINDOW_SECONDS = 5 * 60;
const SKEW_BUFFER_SECONDS = 45;

async function getOnchainWindowSeconds() {
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
  const rpcUrl =
    process.env.RPC_URL ||
    process.env.NEXT_PUBLIC_RPC_URL ||
    "https://rpc.sepolia.org";

  if (!contractAddress) return DEFAULT_WINDOW_SECONDS;

  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const contract = new ethers.Contract(
      contractAddress,
      ["function defaultAttestationWindow() view returns (uint256)"],
      provider
    );
    const onchainWindow = Number(await contract.defaultAttestationWindow());
    if (!Number.isFinite(onchainWindow) || onchainWindow <= 0) {
      return DEFAULT_WINDOW_SECONDS;
    }
    return Math.max(MIN_WINDOW_SECONDS, Math.trunc(onchainWindow));
  } catch {
    return DEFAULT_WINDOW_SECONDS;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const player = String(body?.player || "").toLowerCase();
    const gameId = String(body?.gameId || "");

    if (!player || !gameId) {
      return NextResponse.json({ error: "player and gameId are required" }, { status: 400 });
    }

    const nowMs = Date.now();
    cleanupExpiredNonces(nowMs);

    const allowedWindowSeconds = await getOnchainWindowSeconds();
    const effectiveWindowSeconds =
      allowedWindowSeconds > SKEW_BUFFER_SECONDS
        ? allowedWindowSeconds - SKEW_BUFFER_SECONDS
        : allowedWindowSeconds;

    const nonce = `0x${randomBytes(32).toString("hex")}`;
    const issuedAt = Math.floor(nowMs / 1000);
    const deadline = issuedAt + effectiveWindowSeconds;

    const store = getVerificationStore();
    store.nonces.set(nonce, {
      player,
      gameId,
      expiresAt: deadline * 1000,
      used: false,
    });

    return NextResponse.json({ nonce, issuedAt, deadline });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
