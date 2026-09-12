import { request } from '../requests';
import apis from '../api';
import {
  InstantMatch,
  InstantMatchDraft,
  ChalkmanOperation,
  StakeConfig,
  SeriesFormat,
  Player,
} from '../types';

// ── Normalizers ─────────────────────────────────────────────────────────

const toPlayer = (p: any, i: number): Player => ({
  id: String(p?.Id ?? p?.id ?? p?._id ?? i),
  username: String(p?.Username ?? p?.username ?? p?.Name ?? p?.name ?? 'Player'),
  avatar: p?.AvatarUrl ?? p?.avatarUrl ?? p?.avatar ?? p?.image,
  rating: p?.Rating ?? p?.rating,
  gamesPlayed: p?.GamesPlayed ?? p?.gamesPlayed,
  winRate: p?.WinRate ?? p?.winRate,
  isOnline: p?.IsOnline ?? p?.isOnline ?? true,
});

const toInstantMatch = (m: any): InstantMatch => {
  const stake = m?.Stake ?? m?.stake ?? {};
  const series = m?.Series ?? m?.series ?? {};
  return {
    id: String(m?.Id ?? m?.id ?? m?._id),
    gameId: String(m?.GameId ?? m?.gameId ?? ''),
    gameName: String(m?.GameName ?? m?.gameName ?? 'Game'),
    mode: (m?.Mode ?? m?.mode ?? '1v1') as InstantMatch['mode'],
    playerIds: (m?.PlayerIds ?? m?.playerIds ?? []).map(String),
    players: (m?.Players ?? m?.players ?? []).map(toPlayer),
    series: {
      format: (series.Format ?? series.format ?? 'bo1') as SeriesFormat,
      winsNeeded: series.WinsNeeded ?? series.winsNeeded ?? 1,
      currentWinsA: series.CurrentWinsA ?? series.currentWinsA ?? 0,
      currentWinsB: series.CurrentWinsB ?? series.currentWinsB ?? 0,
      isComplete: series.IsComplete ?? series.isComplete ?? false,
      winner: series.Winner ?? series.winner,
    },
    stake: {
      amount: stake.Amount ?? stake.amount ?? 0,
      currency: stake.Currency ?? stake.currency ?? 'USD',
      method: stake.Method ?? stake.method ?? 'instant',
      escrowId: stake.EscrowId ?? stake.escrowId,
      secured: stake.Secured ?? stake.secured ?? false,
      settled: stake.Settled ?? stake.settled,
    },
    status: (m?.Status ?? m?.status ?? 'pending') as InstantMatch['status'],
    shopId: m?.ShopId ?? m?.shopId,
    inviteCode: m?.InviteCode ?? m?.inviteCode,
    createdAt: m?.CreatedAt ?? m?.createdAt ?? new Date().toISOString(),
    startedAt: m?.StartedAt ?? m?.startedAt,
    completedAt: m?.CompletedAt ?? m?.completedAt,
    notificationsEnabled: m?.NotificationsEnabled ?? m?.notificationsEnabled ?? true,
    rematchOf: m?.RematchOf ?? m?.rematchOf,
  };
};

// ── Instant Match API ───────────────────────────────────────────────────

/** Create a new instant (in-shop / LAN) match. */
export async function createInstantMatch(draft: InstantMatchDraft): Promise<InstantMatch> {
  const data = await request(apis.instantMatch, {
    method: 'POST',
    body: JSON.stringify(draft),
  });
  return toInstantMatch(data);
}

/** Place (secure) the stake for an existing match. */
export async function placeStake(matchId: string, stake: StakeConfig): Promise<InstantMatch> {
  const data = await request(apis.matchStake, {
    method: 'POST',
    body: JSON.stringify({ matchId, ...stake }),
  });
  return toInstantMatch(data);
}

/** Ask a chalkman (shop attendant) to hold the stake in escrow. */
export async function holdEscrow(op: ChalkmanOperation): Promise<InstantMatch> {
  const data = await request(apis.matchEscrowHold(op.matchId), {
    method: 'POST',
    body: JSON.stringify({ chalkmanId: op.chalkmanId, amount: op.amount, action: 'hold' }),
  });
  return toInstantMatch(data);
}

/** Release the escrowed stake to the winner. */
export async function releaseEscrow(op: ChalkmanOperation): Promise<InstantMatch> {
  const data = await request(apis.matchEscrowRelease(op.matchId), {
    method: 'POST',
    body: JSON.stringify({ chalkmanId: op.chalkmanId, action: 'release' }),
  });
  return toInstantMatch(data);
}

/** Refund the escrowed stake (no winner / cancelled). */
export async function refundEscrow(op: ChalkmanOperation): Promise<InstantMatch> {
  const data = await request(apis.matchEscrowRefund(op.matchId), {
    method: 'POST',
    body: JSON.stringify({ chalkmanId: op.chalkmanId, action: 'refund' }),
  });
  return toInstantMatch(data);
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
  return toInstantMatch(data);
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
  return toInstantMatch(data);
}

/** Fetch chalkmen (shop attendants) available to hold stakes. */
export async function fetchChalkmen(): Promise<Player[]> {
  const data = await request(apis.matchChalkmen, { method: 'GET' });
  const list: any[] = Array.isArray(data) ? data : data?.chalkmen ?? data?.data ?? [];
  return list.map(toPlayer);
}

/** Fetch players currently present in the shop (for instant match add). */
export async function fetchNearbyPlayers(): Promise<Player[]> {
  const data = await request(apis.matchNearbyPlayers, { method: 'GET' });
  const list: any[] = Array.isArray(data) ? data : data?.players ?? data?.data ?? [];
  return list.map(toPlayer);
}
