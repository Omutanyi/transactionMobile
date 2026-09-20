import { request } from '../requests';
import apis from '../api';
import {
  InstantMatch,
  InstantMatchDraft,
  ChalkmanOperation,
  StakeConfig,
  SeriesFormat,
  MatchLocation,
  MatchMode,
  MatchStatus,
  Player,
  Shop,
  StakeMethod,
  WalletInfo,
} from '../types';

// ── Normalizers ─────────────────────────────────────────────────────────

const num = (v: any, fallback = 0): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const toPlayer = (p: any, i: number): Player => ({
  id: String(p?.Id ?? p?.id ?? p?._id ?? i),
  username: String(p?.Username ?? p?.username ?? p?.Name ?? p?.name ?? 'Player'),
  avatar: p?.AvatarUrl ?? p?.avatarUrl ?? p?.avatar ?? p?.image,
  rating: p?.Rating ?? p?.rating,
  gamesPlayed: p?.GamesPlayed ?? p?.gamesPlayed,
  winRate: p?.WinRate ?? p?.winRate,
  isOnline: p?.IsOnline ?? p?.isOnline ?? true,
});

const toShop = (s: any, i: number): Shop => ({
  id: String(s?.Id ?? s?.id ?? s?._id ?? i),
  name: String(s?.Name ?? s?.name ?? 'Game Shop'),
  address: s?.Address ?? s?.address,
  chalkmanName: s?.ChalkmanName ?? s?.chalkmanName,
  isOnline: s?.IsOnline ?? s?.isOnline ?? true,
});

const STAKE_METHODS: StakeMethod[] = ['none', 'wallet', 'instant', 'escrow', 'chalkman'];

const toStake = (raw: any): StakeConfig => {
  const s = raw ?? {};
  const declared = (s?.Method ?? s?.method) as StakeMethod | undefined;
  const method: StakeMethod =
    declared && STAKE_METHODS.includes(declared) ? declared : 'wallet';
  const amount = num(s?.Amount ?? s?.amount, 0);
  // Nothing to hold when there is no stake.
  const heldBy: StakeConfig['heldBy'] =
    s?.HeldBy ?? s?.heldBy ?? (method === 'escrow' || method === 'chalkman' ? 'chalkman' : 'system');
  return {
    amount,
    currency: (s?.Currency ?? s?.currency ?? 'USD') as StakeConfig['currency'],
    method,
    escrowId: s?.EscrowId ?? s?.escrowId,
    heldBy,
    secured: s?.Secured ?? s?.secured ?? (method === 'none' || amount <= 0),
    settled: s?.Settled ?? s?.settled,
  };
};

const toInstantMatch = (m: any): InstantMatch => {
  const series = m?.Series ?? m?.series ?? {};
  return {
    id: String(m?.Id ?? m?.id ?? m?._id ?? ''),
    gameId: String(m?.GameId ?? m?.gameId ?? ''),
    gameName: String(m?.GameName ?? m?.gameName ?? 'Game'),
    mode: (m?.Mode ?? m?.mode ?? '1v1') as MatchMode,
    playerIds: (m?.PlayerIds ?? m?.playerIds ?? []).map(String),
    players: (m?.Players ?? m?.players ?? []).map(toPlayer),
    series: {
      format: (series.Format ?? series.format ?? 'bo1') as SeriesFormat,
      winsNeeded: num(series.WinsNeeded ?? series.winsNeeded, 1),
      currentWinsA: num(series.CurrentWinsA ?? series.currentWinsA, 0),
      currentWinsB: num(series.CurrentWinsB ?? series.currentWinsB, 0),
      isComplete: series.IsComplete ?? series.isComplete ?? false,
      winner: series.Winner ?? series.winner,
    },
    stake: toStake(m?.Stake ?? m?.stake),
    status: (m?.Status ?? m?.status ?? 'pending') as MatchStatus,
    location: (m?.Location ?? m?.location ?? 'online') as MatchLocation,
    shopId: m?.ShopId ?? m?.shopId,
    shopName: m?.ShopName ?? m?.shopName,
    isOpen: m?.IsOpen ?? m?.isOpen ?? false,
    inviteCode: m?.InviteCode ?? m?.inviteCode,
    createdAt: m?.CreatedAt ?? m?.createdAt ?? new Date().toISOString(),
    startedAt: m?.StartedAt ?? m?.startedAt,
    completedAt: m?.CompletedAt ?? m?.completedAt,
    notificationsEnabled: m?.NotificationsEnabled ?? m?.notificationsEnabled ?? true,
    rematchOf: m?.RematchOf ?? m?.rematchOf,
  };
};

/** Pull a list out of the many shapes our endpoints return. */
const asList = (data: any, ...keys: string[]): any[] => {
  if (Array.isArray(data)) return data;
  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key];
  }
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

// ── Instant Match API ───────────────────────────────────────────────────

/** Create a new instant match (in-shop LAN or online). */
export async function createInstantMatch(draft: InstantMatchDraft): Promise<InstantMatch> {
  const data = await request(apis.instantMatch, {
    method: 'POST',
    body: JSON.stringify(draft),
  });
  return toInstantMatch(data?.match ?? data);
}

/** Place (secure) the stake for an existing match. */
export async function placeStake(matchId: string, stake: StakeConfig): Promise<InstantMatch> {
  const data = await request(apis.matchStake, {
    method: 'POST',
    body: JSON.stringify({ matchId, ...stake }),
  });
  return toInstantMatch(data?.match ?? data);
}

/** Ask a chalkman (shop attendant) to hold the stake in escrow. */
export async function holdEscrow(op: ChalkmanOperation): Promise<InstantMatch> {
  const data = await request(apis.matchEscrowHold(op.matchId), {
    method: 'POST',
    body: JSON.stringify({ chalkmanId: op.chalkmanId, amount: op.amount, action: 'hold' }),
  });
  return toInstantMatch(data?.match ?? data);
}

/** Release the escrowed stake to the winner. */
export async function releaseEscrow(op: ChalkmanOperation): Promise<InstantMatch> {
  const data = await request(apis.matchEscrowRelease(op.matchId), {
    method: 'POST',
    body: JSON.stringify({ chalkmanId: op.chalkmanId, action: 'release' }),
  });
  return toInstantMatch(data?.match ?? data);
}

/** Refund the escrowed stake (no winner / cancelled). */
export async function refundEscrow(op: ChalkmanOperation): Promise<InstantMatch> {
  const data = await request(apis.matchEscrowRefund(op.matchId), {
    method: 'POST',
    body: JSON.stringify({ chalkmanId: op.chalkmanId, action: 'refund' }),
  });
  return toInstantMatch(data?.match ?? data);
}

/** Update the series format / score for a running match. */
export async function updateSeries(
  matchId: string,
  series: { format?: SeriesFormat; currentWinsA?: number; currentWinsB?: number }
): Promise<InstantMatch> {
  const data = await request(apis.matchSeries(matchId), {
    method: 'PUT',
    body: JSON.stringify(series),
  });
  return toInstantMatch(data?.match ?? data);
}

/** Report the winner of a completed series. Settles the wager server-side. */
export async function reportMatchResult(
  matchId: string,
  winnerId: string
): Promise<InstantMatch> {
  const data = await request(apis.matchResult(matchId), {
    method: 'POST',
    body: JSON.stringify({ winnerId }),
  });
  return toInstantMatch(data?.match ?? data);
}

/** Cancel an open match and refund / release any held wager. */
export async function cancelInstantMatch(
  matchId: string,
  reason?: string
): Promise<InstantMatch> {
  const data = await request(apis.matchCancel(matchId), {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
  return toInstantMatch(data?.match ?? data);
}

/** Join an open match by its id. */
export async function joinInstantMatch(matchId: string): Promise<InstantMatch> {
  const data = await request(apis.matchJoin(matchId), { method: 'POST' });
  return toInstantMatch(data?.match ?? data);
}

/** Join an open match using an invite code. */
export async function joinByInviteCode(code: string): Promise<InstantMatch> {
  const data = await request(apis.matchJoinByCode, {
    method: 'POST',
    body: JSON.stringify({ inviteCode: code.trim().toUpperCase() }),
  });
  return toInstantMatch(data?.match ?? data);
}

/** Trigger a phone notification for the match participants. */
export async function notifyMatch(matchId: string, message?: string): Promise<boolean> {
  const data = await request(apis.matchNotify(matchId), {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
  return data?.success !== false;
}

/** Create a rematch from a completed match. */
export async function createRematch(matchId: string): Promise<InstantMatch> {
  const data = await request(apis.matchRematch(matchId), { method: 'POST' });
  return toInstantMatch(data?.match ?? data);
}

/** Fetch chalkmen (shop attendants) available to hold stakes. */
export async function fetchChalkmen(shopId?: string): Promise<Player[]> {
  const url = shopId
    ? `${apis.matchChalkmen}?shopId=${encodeURIComponent(shopId)}`
    : apis.matchChalkmen;
  const data = await request(url, { method: 'GET' });
  return asList(data, 'chalkmen', 'players').map(toPlayer);
}

/** Fetch players currently present in the shop (for instant match add). */
export async function fetchNearbyPlayers(shopId?: string): Promise<Player[]> {
  const url = shopId
    ? `${apis.matchNearbyPlayers}?shopId=${encodeURIComponent(shopId)}`
    : apis.matchNearbyPlayers;
  const data = await request(url, { method: 'GET' });
  return asList(data, 'players', 'nearby').map(toPlayer);
}

/**
 * Fetch the game shops a player can pick when playing in-shop.
 * Tries the dedicated match endpoint first and falls back to the shop /
 * tournament shop endpoints so the picker still works on older backends.
 */
export async function fetchMatchShops(): Promise<Shop[]> {
  const candidates = [apis.matchShops, apis.shopShops, apis.tournamentShops];
  for (const url of candidates) {
    try {
      const data = await request(url, { method: 'GET' });
      const list = asList(data, 'shops');
      if (list.length) return list.map(toShop);
    } catch {
      // Endpoint missing on this backend — try the next candidate.
    }
  }
  return [];
}

/** Fetch the caller's in-app wallet (used when the wager is held by the system). */
export async function fetchWallet(): Promise<WalletInfo> {
  const data = await request(apis.matchWallet, { method: 'GET' });
  const src = data?.wallet ?? data?.data ?? data ?? {};
  return {
    balance: num(src?.Balance ?? src?.balance, 0),
    currency: (src?.Currency ?? src?.currency ?? 'USD') as WalletInfo['currency'],
    pending: src?.Pending ?? src?.pending,
  };
}

export { toInstantMatch, toPlayer, toShop, toStake };
