type NonceRecord = {
  player: string;
  gameId: string;
  expiresAt: number;
  used: boolean;
};

type VerificationStore = {
  nonces: Map<string, NonceRecord>;
};

declare global {
  // eslint-disable-next-line no-var
  var __stakeLiVerificationStore: VerificationStore | undefined;
}

function createStore(): VerificationStore {
  return {
    nonces: new Map<string, NonceRecord>(),
  };
}

export function getVerificationStore(): VerificationStore {
  if (!globalThis.__stakeLiVerificationStore) {
    globalThis.__stakeLiVerificationStore = createStore();
  }

  return globalThis.__stakeLiVerificationStore;
}

export function cleanupExpiredNonces(nowMs: number) {
  const store = getVerificationStore();
  for (const [nonce, record] of store.nonces.entries()) {
    if (record.expiresAt <= nowMs || record.used) {
      store.nonces.delete(nonce);
    }
  }
}

export type { NonceRecord };
