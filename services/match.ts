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
  ShopPlayer,
  ShopMatchSummary,
  InviteCode,
  StakeMethod,
  WalletInfo,
} from '../types';
import { generateLocalInviteCode, normalizeInviteCode } from '../utils/inviteCode';

// ── Normalizers ─────────────────────────────────────────────────────────

const num = (v: any, fallback = 0): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const pick = (source: any, ...keys: string[]): any => {
  for (const key of keys) {
    const value = source?.[key];
    if (value !== undefined && value !== null) return value;
  }
  return undefined;
};

/**
 * The backend exposes the avatar under several names across endpoints
 * (`AvatarUrl` on matches, `ProfileImageUrl` on tournament participants).
 * Accept them all so avatars never silently disappear.
 */
const PROFILE_IMAGE_KEYS = [
  'AvatarUrl',
  'avatarUrl',
  'ProfileImageUrl',
  'profileImageUrl',
  'ProfileImage',
  'profileImage',
  'Avatar',
  'avatar',
  'image',
];

const toPlayer = (p: any, i: number): Player => ({
  id: String(pick(p, 'Id', 'id', '_id') ?? i),
  username: String(pick(p, 'Username', 'username', 'Name', 'name') ?? 'Player'),
  avatar: pick(p, ...PROFILE_IMAGE_KEYS),
  rating: pick(p, 'Rating', 'rating'),
  gamesPlayed: pick(p, 'GamesPlayed', 'gamesPlayed'),
  winRate: pick(p, 'WinRate', 'winRate'),
  isOnline: pick(p, 'IsOnline', 'isOnline') ?? true,
});

/** Player row on the shop board — same shape plus presence flags. */
const toShopPlayer = (p: any, i: number): ShopPlayer => ({
  ...toPlayer(p, i),
  openToPlay: pick(p, 'OpenToPlay', 'openToPlay', 'IsOpenToPlay', 'isOpenToPlay') ?? false,
  minutesAgo: pick(p, 'MinutesAgo', 'minutesAgo', 'LastSeenMinutes', 'lastSeenMinutes'),
  waitingForGameName: pick(p, 'WaitingForGameName', 'waitingForGameName', 'GameName', 'gameName'),
});

const toShop = (s: any, i: number): Shop => {
  const latitude = Number(pick(s, 'Latitude', 'latitude', 'Lat', 'lat'));
  const longitude = Number(pick(s, 'Longitude', 'longitude', 'Lng', 'lng', 'Lon', 'lon'));
  const distanceKm = Number(pick(s, 'DistanceKm', 'distanceKm', 'Distance', 'distance'));
  return {
    id: String(pick(s, 'Id', 'id', '_id') ?? i),
    name: String(pick(s, 'Name', 'name') ?? 'Game Shop'),
    address: pick(s, 'Address', 'address'),
    chalkmanName: pick(s, 'ChalkmanName', 'chalkmanName'),
    isOnline: pick(s, 'IsOnline', 'isOnline') ?? true,
    // 0,0 is in the Atlantic — treat it as "no coordinates supplied".
    ...(Number.isFinite(latitude) && latitude !== 0 ? { latitude } : {}),
    ...(Number.isFinite(longitude) && longitude !== 0 ? { longitude } : {}),
    city: pick(s, 'City', 'city', 'Town', 'town'),
    ...(Number.isFinite(distanceKm) && distanceKm >= 0 ? { distanceKm } : {}),
    playerCount: pick(s, 'PlayerCount', 'playerCount', 'PlayersHere', 'playersHere'),
    hasLiveMatches: pick(s, 'HasLiveMatches', 'hasLiveMatches', 'LiveMatches', 'liveMatches'),
    phone: pick(s, 'Phone', 'phone', 'PhoneNumber', 'phoneNumber'),
  };
};

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

/** One row of the live shop board. */
export const toShopMatchSummary = (m: any): ShopMatchSummary => {
  const series = m?.Series ?? m?.series ?? {};
  const stake = toStake(m?.Stake ?? m?.stake);
  const players: Player[] = (m?.Players ?? m?.players ?? []).map(toPlayer);
  const playerIds = (m?.PlayerIds ?? m?.playerIds ?? players.map(player => player.id)).map(String);
  return {
    id: String(m?.Id ?? m?.id ?? m?._id ?? ''),
    gameId: String(m?.GameId ?? m?.gameId ?? ''),
    gameName: String(m?.GameName ?? m?.gameName ?? 'Game'),
    mode: (m?.Mode ?? m?.mode ?? '1v1') as MatchMode,
    status: (m?.Status ?? m?.status ?? 'pending') as MatchStatus,
    isOpen: m?.IsOpen ?? m?.isOpen ?? false,
    playerIds,
    players,
    playerCount: num(m?.PlayerCount ?? m?.playerCount, playerIds.length),
    maxPlayers: num(m?.MaxPlayers ?? m?.maxPlayers, Math.max(playerIds.length, 2)),
    seriesFormat: (series.Format ?? series.format ?? 'bo1') as SeriesFormat,
    winsNeeded: num(series.WinsNeeded ?? series.winsNeeded, 1),
    currentWinsA: num(series.CurrentWinsA ?? series.currentWinsA, 0),
    currentWinsB: num(series.CurrentWinsB ?? series.currentWinsB, 0),
    stakeAmount: stake.amount,
    currency: stake.currency,
    shopId: m?.ShopId ?? m?.shopId,
    shopName: m?.ShopName ?? m?.shopName,
    inviteCode: m?.InviteCode ?? m?.inviteCode,
    createdAt: m?.CreatedAt ?? m?.createdAt ?? new Date().toISOString(),
    updatedAt: m?.UpdatedAt ?? m?.updatedAt ?? m?.StartedAt ?? m?.startedAt,
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
    body: JSON.stringify({ inviteCode: normalizeInviteCode(code) }),
  });
  return toInstantMatch(data?.match ?? data);
}

/** Load a single match (used to preview a code before joining). */
export async function fetchMatchById(matchId: string): Promise<InstantMatch> {
  const data = await request(apis.matchDetail(matchId), { method: 'GET' });
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

/**
 * Fetch players currently present in a shop (everyone checked in, whether or
 * not they are looking for a match).
 */
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
// ── Shop lounge: invite codes, presence and the live board ──────────────

/**
 * Ask the backend for a fresh invite code the caller can share.
 * Falls back to a locally generated code when the endpoint is not deployed
 * yet, so the player can still hand out a code and be joined.
 */
export async function generateInviteCode(shopId?: string): Promise<InviteCode> {
  try {
    const data = await request(apis.matchInviteCode, {
      method: 'POST',
      body: JSON.stringify(shopId ? { shopId } : {}),
    });
    const src = data?.inviteCode ?? data?.data ?? data ?? {};
    const rawCode =
      typeof src === 'string' ? src : pick(src, 'Code', 'code', 'InviteCode', 'inviteCode');
    if (rawCode) {
      return {
        code: normalizeInviteCode(String(rawCode)),
        expiresAt: pick(src, 'ExpiresAt', 'expiresAt'),
        offline: false,
      };
    }
  } catch {
    // Endpoint missing or offline — a device-generated code still works.
  }
  return { code: generateLocalInviteCode(), offline: true };
}

/**
 * Players in the shop who are open to play right now.
 * Falls back to the plain nearby list (everyone treated as open) when the
 * dedicated endpoint is not available, so the board is never empty by accident.
 */
export async function fetchOpenPlayers(shopId: string): Promise<ShopPlayer[]> {
  try {
    const data = await request(`${apis.matchOpenPlayers}?shopId=${encodeURIComponent(shopId)}`, {
      method: 'GET',
    });
    return asList(data, 'players', 'openPlayers').map(toShopPlayer);
  } catch {
    const nearby = await fetchNearbyPlayers(shopId).catch(() => []);
    return nearby.map(player => ({ ...player, openToPlay: true }));
  }
}

/** Broadcast that the caller is (or is no longer) open to play in a shop. */
export async function setOpenToPlay(shopId: string, openToPlay: boolean): Promise<boolean> {
  const data = await request(apis.matchPresence, {
    method: 'POST',
    body: JSON.stringify({ shopId, openToPlay }),
  });
  return data?.success !== false;
}

/**
 * Every match currently running (or waiting for players) in one shop.
 * Polled by the live board. Throws when the endpoint is unavailable so the
 * board can say so explicitly instead of pretending the shop is empty.
 */
export async function fetchShopLiveMatches(shopId: string): Promise<ShopMatchSummary[]> {
  const data = await request(apis.matchShopLive(shopId), { method: 'GET' });
  return asList(data, 'matches', 'liveMatches').map(toShopMatchSummary);
}

/** A single shop, with its map coordinates and on-duty chalkman. */
export async function fetchMatchShopDetail(shopId: string): Promise<Shop> {
  const data = await request(apis.matchShopDetail(shopId), { method: 'GET' });
  return toShop(data?.shop ?? data, 0);
}

/** Generic shop record lookup (used when the match shop route is missing). */
export async function fetchShopDetail(shopId: string): Promise<Shop> {
  const data = await request(apis.shopDetail(shopId), { method: 'GET' });
  return toShop(data?.shop ?? data, 0);
}

export { toInstantMatch, toPlayer, toShop, toShopPlayer, toStake };
