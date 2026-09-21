import { ImageSourcePropType } from 'react-native';

export interface Player {
  id: string;
  username: string;
  avatar?: ImageSourcePropType;
  rating?: number;
  gamesPlayed?: number;
  winRate?: number;
  isOnline?: boolean;
}

export interface Game {
  id: string;
  name: string;
  icon: ImageSourcePropType;
  description?: string;
  maxPlayers?: number;
}

export interface MatchRequest {
  id: string;
  senderId: string;
  recipientIds: string[];
  gameId: string;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  createdAt: Date;
  expiresAt: Date;
}

export interface Match {
  id: string;
  player1: Player;
  player2: Player;
  game: string;
  status: 'pending' | 'active' | 'completed';
  createdAt: Date;
  scheduledAt?: Date;
}

// ── Instant Match / Wager System ─────────────────────────────────────────

export type SeriesFormat = 'bo1' | 'bo3' | 'bo5';

export type StakeMethod =
  | 'none'         // no wager — friendly / practice match
  | 'wallet'       // stake held by the SYSTEM (in-app wallet), auto-released to the winner
  | 'instant'      // legacy alias of 'wallet' (keep for old records)
  | 'escrow'       // chalkman (shop attendant) holds the stake until the wager is settled
  | 'chalkman';    // alias for escrow, held by shop attendant

/** Where the match is being played. */
export type MatchLocation = 'online' | 'shop';

export type MatchMode = '1v1' | 'party';           // party = group / multiplayer (e.g. pool, billiards)
export type MatchStatus = 'pending' | 'active' | 'completed' | 'cancelled';

export interface StakeConfig {
  amount: number;
  currency: 'USD' | 'KES';
  method: StakeMethod;
  /** Set by backend when escrow is registered */
  escrowId?: string;
  /** Who physically/technically holds the money while the wager is open. */
  heldBy?: 'system' | 'chalkman';
  /** True once the stake is fully secured (paid or escrowed) */
  secured: boolean;
  /** True once the wager is settled and funds are released */
  settled?: boolean;
}

/** In-app wallet snapshot (used when the wager is held by the system). */
export interface WalletInfo {
  balance: number;
  currency: 'USD' | 'KES';
  /** Amount currently locked in open wagers / matches. */
  pending?: number;
}

export interface SeriesConfig {
  format: SeriesFormat;
  /** Winning player/team must reach this many match wins (auto-derived from format) */
  winsNeeded: number;
  currentWinsA: number;
  currentWinsB: number;
  /** True when the series is complete */
  isComplete: boolean;
  winner?: string;
}

export interface EscrowRecord {
  id: string;
  matchId: string;
  /** Username / id of the chalkman (shop attendant) holding the stake */
  chalkmanId: string;
  chalkmanName: string;
  amount: number;
  currency: string;
  status: 'held' | 'released' | 'refunded';
  heldAt: Date;
  releasedAt?: Date;
}

export interface InstantMatch {
  id: string;
  gameId: string;
  gameName: string;
  mode: MatchMode;
  /** participant player ids (2 for 1v1, N for party) */
  playerIds: string[];
  players: Player[];
  series: SeriesConfig;
  stake: StakeConfig;
  status: MatchStatus;
  /** Whether the match is played online or at a physical game shop. */
  location: MatchLocation;
  /** In-shop / LAN match identifier (same shop = same code) */
  shopId?: string;
  shopName?: string;
  /** True while the match is still waiting for its opponents to join. */
  isOpen?: boolean;
  inviteCode?: string;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  notificationsEnabled: boolean;
  /** For rematch: reference to the prior match this is a repeat of */
  rematchOf?: string;
}

export interface InstantMatchDraft {
  gameId: string;
  gameName: string;
  mode: MatchMode;
  /** Full participant list, including the caller. May contain only the caller
   *  when the match is created as "open" (still waiting for opponents). */
  playerIds: string[];
  seriesFormat: SeriesFormat;
  stake: StakeConfig;
  location?: MatchLocation;
  shopId?: string;
  /** True when no opponents were picked — the backend lists the match as
   *  joinable by anyone in the same shop / holding the invite code. */
  isOpen?: boolean;
  inviteCode?: string;
  notificationsEnabled: boolean;
  rematchOf?: string;
}

export interface ChalkmanOperation {
  matchId: string;
  chalkmanId: string;
  amount: number;
  action: 'hold' | 'release' | 'refund';
}

// ── Tournament System ────────────────────────────────────────────────────

export type TournamentFormat = 'single_elimination' | 'double_elimination' | 'round_robin';

export type TournamentLocation = 'online' | 'local';

export type TournamentStatus = 'draft' | 'registration' | 'active' | 'completed' | 'cancelled';

export type TournamentEntryMethod =
  | 'free'      // no entry fee
  | 'instant'   // entry fee paid immediately (in-app / wallet)
  | 'escrow';   // entry fee / prize held by the chalkman until the tournament ends

export interface TournamentStake {
  amount: number;
  currency: 'USD' | 'KES';
  method: TournamentEntryMethod;
  /** Set by backend once escrow is registered for the tournament pot */
  escrowId?: string;
  /** True once all entry fees / the pot are secured */
  secured: boolean;
  /** True once the pot is paid out to the winner */
  settled?: boolean;
}

export interface Shop {
  id: string;
  name: string;
  address?: string;
  /** Chalkman (attendant) currently on duty */
  chalkmanName?: string;
  isOnline?: boolean;
  /** Map coordinates used to draw the shop on the map (optional on older backends). */
  latitude?: number;
  longitude?: number;
  city?: string;
  /** Distance from the caller in km, when the backend knows the caller's position. */
  distanceKm?: number;
  /** Players currently checked in at the shop. */
  playerCount?: number;
  /** True while the shop is hosting at least one live match. */
  hasLiveMatches?: boolean;
  /** Contact number for the shop counter. */
  phone?: string;
}

/** A player physically present at a shop, optionally flagged as open to play. */
export interface ShopPlayer extends Player {
  /** True when the player is broadcasting that they want a match right now. */
  openToPlay?: boolean;
  /** Minutes since the player checked in / was last seen in the shop. */
  minutesAgo?: number;
  /** Game the player is waiting to play (when the backend supplies it). */
  waitingForGameName?: string;
}

/**
 * Compact view of a match taking place inside a shop, used by the live board
 * that every player in that shop polls.
 */
export interface ShopMatchSummary {
  id: string;
  gameId: string;
  gameName: string;
  mode: MatchMode;
  status: MatchStatus;
  isOpen: boolean;
  playerIds: string[];
  players: Player[];
  playerCount: number;
  maxPlayers: number;
  seriesFormat: SeriesFormat;
  winsNeeded: number;
  currentWinsA: number;
  currentWinsB: number;
  stakeAmount: number;
  currency: StakeConfig['currency'];
  shopId?: string;
  shopName?: string;
  /** Present on open matches so anyone in the shop can jump in. */
  inviteCode?: string;
  createdAt: string;
  /** When the board last saw a change — drives the "updated Xs ago" label. */
  updatedAt?: string;
}

/** A shareable invite code that lets another player join a match. */
export interface InviteCode {
  code: string;
  /** ISO timestamp after which the code stops working (backend supplied). */
  expiresAt?: string;
  /** True when the code was generated on-device because the API was unavailable. */
  offline?: boolean;
}

/** Presence ping: tells the shop that this player is available for a match. */
export interface ShopPresence {
  shopId: string;
  openToPlay: boolean;
}

/** A single match inside a tournament bracket. */
export interface BracketMatch {
  id: string;
  round: number;
  slot: number;
  playerAId?: string;
  playerBId?: string;
  playerAName?: string;
  playerBName?: string;
  scoreA?: number;
  scoreB?: number;
  winnerId?: string;
  status: 'pending' | 'active' | 'completed' | 'bye';
}

export interface Tournament {
  id: string;
  name: string;
  gameId: string;
  gameName: string;
  description?: string;
  format: TournamentFormat;
  location: TournamentLocation;
  shopId?: string;
  shopName?: string;
  /** In-shop tournaments may use a chalkman to hold the pot */
  chalkmanId?: string;
  chalkmanName?: string;
  stake: TournamentStake;
  status: TournamentStatus;
  prizePool: number;
  entryFee: number;
  maxParticipants: number;
  participantCount: number;
  startDate: string;
  endDate?: string;
  /** Optional series format used when the tournament is played as best-of */
  seriesFormat?: SeriesFormat;
  createdBy?: string;
  image?: any;
  bracket?: BracketMatch[];
}

export interface TournamentDraft {
  name: string;
  gameId: string;
  description?: string;
  format: TournamentFormat;
  location: TournamentLocation;
  shopId?: string;
  chalkmanId?: string;
  prizePool: number;
  entryFee: number;
  maxParticipants: number;
  startDate: string;
  endDate?: string;
  tournamentType: TournamentFormat;
  locationType: TournamentLocation;
  entryMethod: TournamentEntryMethod;
  stake?: TournamentStake;
  seriesFormat?: SeriesFormat;
}
