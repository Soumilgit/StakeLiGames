import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { cleanupExpiredNonces, getVerificationStore } from "../../../../lib/verificationStore";

const DEFAULT_WINDOW_SECONDS = 30 * 60;

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

    const nonce = `0x${randomBytes(32).toString("hex")}`;
    const issuedAt = Math.floor(nowMs / 1000);
    const deadline = issuedAt + DEFAULT_WINDOW_SECONDS;

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
