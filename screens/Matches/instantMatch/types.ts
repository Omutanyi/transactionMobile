import { MatchMode, SeriesFormat } from '../../../types';

/** A game option rendered in the picker (API game + local max-player hint). */
export interface GameOption {
  /** Stable key used for the selected/highlighted state. */
  id: string;
  /** Identifier the API expects when creating the match. */
  gameId: string;
  name: string;
  image: any;
  maxPlayers: number;
}

/**
 * How the wager for a match is handled.
 * - `none`   : no money involved (friendly match)
 * - `wallet` : the stake is held by the system (in-app wallet) and released to
 *              the winner automatically — no attendant needed
 * - `escrow` : a chalkman (shop attendant) physically holds the stake
 */
export type WagerMethod = 'none' | 'wallet' | 'escrow';

export interface SeriesOption {
  id: SeriesFormat;
  label: string;
  sub: string;
  wins: number;
}

export interface ModeOption {
  id: MatchMode;
  label: string;
  sub: string;
}
