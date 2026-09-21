import { Ionicons } from '@expo/vector-icons';
import { Player, StakeMethod } from '../../../types';
import { ModeOption, SeriesOption, WagerMethod } from './types';

export type IconName = React.ComponentProps<typeof Ionicons>['name'];

// ── Fallback games (used until GET /game responds) ─────────────────────
export interface FallbackGame {
  id: string;
  name: string;
  image: any;
  maxPlayers: number;
}

export const FALLBACK_GAMES: FallbackGame[] = [
  { id: 'chess', name: 'Chess', image: require('../../../assets/gaming.jpg'), maxPlayers: 2 },
  { id: 'fifa', name: 'FIFA 24', image: require('../../../assets/profile.jpg'), maxPlayers: 2 },
  { id: 'pool', name: 'Pool', image: require('../../../assets/gaming.jpg'), maxPlayers: 8 },
  { id: 'rocket', name: 'Rocket League', image: require('../../../assets/icon.png'), maxPlayers: 4 },
  { id: 'valorant', name: 'Valorant', image: require('../../../assets/avatar.jpg'), maxPlayers: 10 },
  { id: 'cod', name: 'Call of Duty', image: require('../../../assets/gaming.jpg'), maxPlayers: 10 },
];

export const FALLBACK_IMAGES = FALLBACK_GAMES.map(g => g.image);

export const DEFAULT_AVATAR = require('../../../assets/avatar.jpg');

/** Max players for a game id we only know from the API. */
export const DEFAULT_MAX_PLAYERS = 2;

// ── Series formats ─────────────────────────────────────────────────────
export const SERIES_OPTIONS: SeriesOption[] = [
  { id: 'bo1', label: 'BO1', sub: '1 game', wins: 1 },
  { id: 'bo3', label: 'BO3', sub: 'First to 2', wins: 2 },
  { id: 'bo5', label: 'BO5', sub: 'First to 3', wins: 3 },
];

// ── Match modes ────────────────────────────────────────────────────────
export const MODE_OPTIONS: ModeOption[] = [
  { id: '1v1', label: '1v1 Duel', sub: 'Two players' },
  { id: 'party', label: 'Party', sub: 'Group session' },
];

// ── Wager methods ──────────────────────────────────────────────────────
export interface WagerOption {
  id: WagerMethod;
  label: string;
  sub: string;
  icon: IconName;
  color: string;
}

/** Build the wager options using the active theme's accent colours. */
export const buildWagerOptions = (colors: {
  success: string;
  info: string;
  warning: string;
}): WagerOption[] => [
  {
    id: 'none',
    label: 'No Wager',
    sub: 'Play for fun',
    icon: 'happy-outline',
    color: colors.info,
  },
  {
    id: 'wallet',
    label: 'In-System',
    sub: 'Held in app',
    icon: 'wallet-outline',
    color: colors.success,
  },
  {
    id: 'escrow',
    label: 'Chalkman',
    sub: 'Attendant holds',
    icon: 'shield-checkmark-outline',
    color: colors.warning,
  },
];

export const QUICK_AMOUNTS = [5, 10, 20, 50, 100];

// ── Validation limits ──────────────────────────────────────────────────
// The invite-code helpers live in utils so the match service can use them too.
export { INVITE_CODE_LENGTH } from '../../../utils/inviteCode';
export const MIN_STAKE = 1;
export const MAX_STAKE = 100000;
export const DEFAULT_STAKE = '20';

// ── Helpers ────────────────────────────────────────────────────────────

export const getSeriesOption = (format: string): SeriesOption =>
  SERIES_OPTIONS.find(s => s.id === format) ?? SERIES_OPTIONS[0];

export const getWinsNeeded = (format: string): number => getSeriesOption(format).wins;

export const getSeriesLabel = (format: string): string => getSeriesOption(format).label;

export const getPlayerMeta = (player: Player): string => {
  const rank = player.rating ? `${player.rating} RP` : 'Unranked';
  const status = player.isOnline === false ? 'Offline' : 'Online';
  return `${rank} • ${status}`;
};

/** Human label for the wager method shown in the summary. */
export const getWagerLabel = (method: StakeMethod): string => {
  if (method === 'none') return 'No wager';
  if (method === 'wallet' || method === 'instant') return 'Held in system';
  return 'Chalkman escrow';
};

export const formatMoney = (amount: number, currency = 'USD'): string => {
  const symbol = currency === 'KES' ? 'KSh ' : '$';
  return `${symbol}${amount}`;
};
