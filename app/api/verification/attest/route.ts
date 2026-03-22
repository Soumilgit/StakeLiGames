import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import { cleanupExpiredNonces, getVerificationStore } from "../../../../lib/verificationStore";

function getVerifierPrivateKey() {
  const raw = process.env.VERIFIER_PRIVATE_KEY || process.env.PRIVATE_KEY || "";
  if (!raw) return "";
  return raw.startsWith("0x") ? raw : `0x${raw}`;
}

function getChainId() {
  const configured = process.env.NEXT_PUBLIC_CHAIN_ID;
  if (!configured) return 11155111n;
  const parsed = BigInt(configured);
  return parsed > 0n ? parsed : 11155111n;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const player = String(body?.player || "").toLowerCase();
    const gameId = String(body?.gameId || "");
    const nonce = String(body?.nonce || "");
    const deadline = Number(body?.deadline || 0);
    const actualScore = Number(body?.actualScore);
    const flawlessClaimed = Boolean(body?.flawlessClaimed);

    if (!player || !gameId || !nonce || !deadline || Number.isNaN(actualScore)) {
      return NextResponse.json(
        { error: "player, gameId, nonce, deadline, and actualScore are required" },
        { status: 400 }
      );
    }

    const privateKey = getVerifierPrivateKey();
    if (!privateKey) {
      return NextResponse.json({ error: "Verifier key is not configured" }, { status: 500 });
    }

    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
    if (!contractAddress) {
      return NextResponse.json({ error: "Contract address is not configured" }, { status: 500 });
    }

    const nowMs = Date.now();
    cleanupExpiredNonces(nowMs);

    const store = getVerificationStore();
    const record = store.nonces.get(nonce);
    if (!record) {
      return NextResponse.json({ error: "Nonce not found or expired" }, { status: 400 });
    }

    if (record.used) {
      return NextResponse.json({ error: "Nonce already used" }, { status: 400 });
    }

    if (record.player !== player || record.gameId !== gameId) {
      return NextResponse.json({ error: "Nonce does not match player/game" }, { status: 400 });
    }

    if (record.expiresAt < nowMs || deadline * 1000 < nowMs) {
      return NextResponse.json({ error: "Attestation expired" }, { status: 400 });
    }

    const wallet = new ethers.Wallet(privateKey);
    const chainId = getChainId();
    const digest = ethers.solidityPackedKeccak256(
      ["address", "uint256", "address", "bytes32", "uint256", "bool", "bytes32", "uint256"],
      [
        contractAddress,
        chainId,
        player,
        gameId,
        BigInt(Math.trunc(actualScore)),
        flawlessClaimed,
        nonce,
        BigInt(deadline),
      ]
    );

    const signature = await wallet.signMessage(ethers.getBytes(digest));

    record.used = true;
    store.nonces.set(nonce, record);

    return NextResponse.json({ signature });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
