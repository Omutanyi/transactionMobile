import { request } from '../requests';
import apis from '../api';
import {
  Tournament,
  TournamentDraft,
  TournamentStake,
  TournamentFormat,
  TournamentLocation,
  TournamentStatus,
  TournamentEntryMethod,
  BracketMatch,
  Shop,
  Player,
  ChalkmanOperation,
} from '../types';

// ── Normalizers ─────────────────────────────────────────────────────────

const num = (v: any, fallback = 0): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const toStake = (s: any, entryFee: number): TournamentStake => {
  const method: TournamentEntryMethod =
    (s?.Method ?? s?.method ?? (entryFee > 0 ? 'instant' : 'free')) as TournamentEntryMethod;
  return {
    amount: num(s?.Amount ?? s?.amount ?? entryFee, 0),
    currency: (s?.Currency ?? s?.currency ?? 'USD') as TournamentStake['currency'],
    method,
    escrowId: s?.EscrowId ?? s?.escrowId,
    secured: s?.Secured ?? s?.secured ?? method === 'free',
    settled: s?.Settled ?? s?.settled,
  };
};

const toBracketMatch = (m: any, i: number): BracketMatch => ({
  id: String(m?.Id ?? m?.id ?? i),
  round: num(m?.Round ?? m?.round, 0),
  slot: num(m?.Slot ?? m?.slot, i),
  playerAId: m?.PlayerAId ?? m?.playerAId,
  playerBId: m?.PlayerBId ?? m?.playerBId,
  playerAName: m?.PlayerAName ?? m?.playerAName,
  playerBName: m?.PlayerBName ?? m?.playerBName,
  scoreA: m?.ScoreA ?? m?.scoreA,
  scoreB: m?.ScoreB ?? m?.scoreB,
  winnerId: m?.WinnerId ?? m?.winnerId,
  status: (m?.Status ?? m?.status ?? 'pending') as BracketMatch['status'],
});

export const toTournament = (t: any): Tournament => {
  const entryFee = num(t?.EntryFee ?? t?.entryFee, 0);
  return {
    id: String(t?.TournamentId ?? t?.Id ?? t?.id ?? t?._id),
    name: String(t?.Name ?? t?.name ?? 'Tournament'),
    gameId: String(t?.GameId ?? t?.gameId ?? ''),
    gameName: String(t?.GameName ?? t?.gameName ?? t?.game ?? 'Unknown'),
    description: t?.Description ?? t?.description,
    format: (t?.TournamentType ?? t?.tournamentType ?? t?.format ?? 'single_elimination') as TournamentFormat,
    location: (t?.LocationType ?? t?.locationType ?? t?.location ?? 'online') as TournamentLocation,
    shopId: t?.ShopId ?? t?.shopId,
    shopName: t?.ShopName ?? t?.shopName,
    chalkmanId: t?.ChalkmanId ?? t?.chalkmanId,
    chalkmanName: t?.ChalkmanName ?? t?.chalkmanName,
    stake: toStake(t?.Stake ?? t?.stake, entryFee),
    status: (t?.Status ?? t?.status ?? 'registration') as TournamentStatus,
    prizePool: num(t?.PrizePool ?? t?.prizePool ?? t?.prize, 0),
    entryFee,
    maxParticipants: num(t?.MaxParticipants ?? t?.maxParticipants ?? t?.maxPlayers, 64),
    participantCount: num(t?.ParticipantCount ?? t?.participantCount ?? t?.players, 0),
    startDate: t?.StartDate ?? t?.startDate ?? new Date().toISOString(),
    endDate: t?.EndDate ?? t?.endDate,
    seriesFormat: t?.SeriesFormat ?? t?.seriesFormat,
    createdBy: t?.CreatedBy ?? t?.createdBy,
    image: t?.GameImage ?? t?.gameImage
      ? { uri: t?.GameImage ?? t?.gameImage }
      : t?.image,
    bracket: Array.isArray(t?.Bracket ?? t?.bracket)
      ? (t?.Bracket ?? t?.bracket).map(toBracketMatch)
      : undefined,
  };
};

// ── Tournament API ──────────────────────────────────────────────────────

/** Create a tournament (online or in-shop). */
export async function createTournament(draft: TournamentDraft): Promise<Tournament> {
  const data = await request(apis.tournaments, {
    method: 'POST',
    body: JSON.stringify(draft),
  });
  return toTournament(data);
}

/** Fetch all tournaments. */
export async function fetchTournaments(): Promise<Tournament[]> {
  const data = await request(apis.tournaments, { method: 'GET' });
  const list: any[] = Array.isArray(data) ? data : data?.data ?? data?.tournaments ?? [];
  return list.map(toTournament);
}

/** Fetch a single tournament by id. */
export async function fetchTournament(id: string | number): Promise<Tournament> {
  const data = await request(apis.tournamentDetail(id), { method: 'GET' });
  return toTournament(data);
}

/** Register the current user for a tournament, optionally posting a stake. */
export async function registerForTournament(
  id: string | number,
  stake?: TournamentStake
): Promise<Tournament> {
  const data = await request(apis.tournamentRegister(id), {
    method: 'POST',
    body: JSON.stringify(stake ? { stake } : {}),
  });
  return toTournament(data);
}

/** Secure / top-up the tournament stake (instant payment). */
export async function placeTournamentStake(
  id: string | number,
  stake: TournamentStake
): Promise<Tournament> {
  const data = await request(apis.tournamentStake(id), {
    method: 'POST',
    body: JSON.stringify(stake),
  });
  return toTournament(data);
}

/** Ask a chalkman to hold the tournament pot in escrow. */
export async function holdTournamentEscrow(
  id: string | number,
  op: ChalkmanOperation
): Promise<Tournament> {
  const data = await request(apis.tournamentEscrow(id), {
    method: 'POST',
    body: JSON.stringify({ chalkmanId: op.chalkmanId, amount: op.amount, action: 'hold' }),
  });
  return toTournament(data);
}

/** Release the escrowed pot to the winner. */
export async function releaseTournamentEscrow(
  id: string | number,
  op: ChalkmanOperation
): Promise<Tournament> {
  const data = await request(apis.tournamentEscrowRelease(id), {
    method: 'POST',
    body: JSON.stringify({ chalkmanId: op.chalkmanId, action: 'release' }),
  });
  return toTournament(data);
}

/** Refund the escrowed pot (cancelled tournament). */
export async function refundTournamentEscrow(
  id: string | number,
  op: ChalkmanOperation
): Promise<Tournament> {
  const data = await request(apis.tournamentEscrowRefund(id), {
    method: 'POST',
    body: JSON.stringify({ chalkmanId: op.chalkmanId, action: 'refund' }),
  });
  return toTournament(data);
}

/** Start the tournament (generate the bracket). */
export async function startTournament(id: string | number): Promise<Tournament> {
  const data = await request(apis.tournamentStart(id), { method: 'POST' });
  return toTournament(data);
}

/** Fetch the tournament bracket. */
export async function fetchBracket(id: string | number): Promise<BracketMatch[]> {
  const data = await request(apis.tournamentBracket(id), { method: 'GET' });
  const list: any[] = Array.isArray(data) ? data : data?.bracket ?? data?.data ?? [];
  return list.map(toBracketMatch);
}

/** Fetch game shops (for in-shop tournament selection). */
export async function fetchShops(): Promise<Shop[]> {
  const data = await request(apis.tournamentShops, { method: 'GET' });
  const list: any[] = Array.isArray(data) ? data : data?.shops ?? data?.data ?? [];
  return list.map((s: any, i: number) => ({
    id: String(s?.Id ?? s?.id ?? i),
    name: String(s?.Name ?? s?.name ?? 'Game Shop'),
    address: s?.Address ?? s?.address,
    chalkmanName: s?.ChalkmanName ?? s?.chalkmanName,
    isOnline: s?.IsOnline ?? s?.isOnline ?? true,
  }));
}

/** Fetch chalkmen available to hold a tournament pot. */
export async function fetchTournamentChalkmen(id: string | number): Promise<Player[]> {
  const data = await request(apis.tournamentChalkmen(id), { method: 'GET' });
  const list: any[] = Array.isArray(data) ? data : data?.chalkmen ?? data?.data ?? [];
  return list.map((c: any, i: number) => ({
    id: String(c?.Id ?? c?.id ?? i),
    username: String(c?.Username ?? c?.username ?? 'Chalkman'),
    avatar: c?.AvatarUrl ?? c?.avatarUrl ?? c?.avatar,
    rating: c?.Rating ?? c?.rating,
    isOnline: c?.IsOnline ?? c?.isOnline ?? true,
  }));
}
