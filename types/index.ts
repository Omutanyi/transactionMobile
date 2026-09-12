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
  | 'instant'      // player pays/deposits stake immediately (in-app / mobile payment)
  | 'escrow'       // chalkman (shop attendant) holds the stake until the wager is settled
  | 'chalkman';    // alias for escrow, held by shop attendant

export type MatchMode = '1v1' | 'party';           // party = group / multiplayer (e.g. pool, billiards)
export type MatchStatus = 'pending' | 'active' | 'completed' | 'cancelled';

export interface StakeConfig {
  amount: number;
  currency: 'USD' | 'KES';
  method: StakeMethod;
  /** Set by backend when escrow is registered */
  escrowId?: string;
  /** True once the stake is fully secured (paid or escrowed) */
  secured: boolean;
  /** True once the wager is settled and funds are released */
  settled?: boolean;
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
  /** In-shop / LAN match identifier (same shop = same code) */
  shopId?: string;
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
  playerIds: string[];
  seriesFormat: SeriesFormat;
  stake: StakeConfig;
  shopId?: string;
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
