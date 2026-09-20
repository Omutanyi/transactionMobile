import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import {
  InstantMatch,
  MatchLocation,
  MatchMode,
  Player,
  SeriesFormat,
  Shop,
  StakeConfig,
  WalletInfo,
} from '../../../types';
import { fetchGames } from '../../../services/games';
import {
  createInstantMatch,
  createRematch,
  fetchChalkmen,
  fetchMatchShops,
  fetchNearbyPlayers,
  fetchWallet,
  joinByInviteCode,
  notifyMatch,
} from '../../../services/match';
import { toast } from '../../../utils/ToastService';
import {
  DEFAULT_MAX_PLAYERS,
  DEFAULT_STAKE,
  FALLBACK_GAMES,
  FALLBACK_IMAGES,
  MIN_STAKE,
  getSeriesLabel,
} from './constants';
import { GameOption, WagerMethod } from './types';

const FALLBACK_OPTIONS: GameOption[] = FALLBACK_GAMES.map(game => ({ ...game }));

/**
 * Owns every piece of state and side-effect for the instant-match setup flow.
 * The screen itself only renders.
 */
export const useInstantMatchSetup = () => {
  const user = useSelector((state: RootState) => state.user);

  // ── Remote data ──────────────────────────────────────────────────
  const [games, setGames] = useState<GameOption[]>(FALLBACK_OPTIONS);
  const [shops, setShops] = useState<Shop[]>([]);
  const [shopsLoading, setShopsLoading] = useState(false);
  const [chalkmen, setChalkmen] = useState<Player[]>([]);
  const [nearbyPlayers, setNearbyPlayers] = useState<Player[]>([]);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [wallet, setWallet] = useState<WalletInfo | null>(null);

  // ── Selections ───────────────────────────────────────────────────
  const [selectedGame, setSelectedGame] = useState<GameOption>(FALLBACK_OPTIONS[0]);
  const [matchMode, setMatchMode] = useState<MatchMode>('1v1');
  const [playerCount, setPlayerCount] = useState(2);
  const [seriesFormat, setSeriesFormat] = useState<SeriesFormat>('bo3');
  const [location, setLocation] = useState<MatchLocation>('online');
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [wagerMethod, setWagerMethod] = useState<WagerMethod>('none');
  const [stakeAmount, setStakeAmount] = useState(DEFAULT_STAKE);
  const [inviteCode, setInviteCode] = useState('');
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [selectedChalkman, setSelectedChalkman] = useState<Player | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // ── Status ───────────────────────────────────────────────────────
  const [creating, setCreating] = useState(false);
  const [rematching, setRematching] = useState(false);
  const [applyingCode, setApplyingCode] = useState(false);
  const [createdMatch, setCreatedMatch] = useState<InstantMatch | null>(null);

  const maxPlayers = selectedGame.maxPlayers;
  const currency: 'USD' | 'KES' = wallet?.currency ?? 'USD';

  // ── Load games ───────────────────────────────────────────────────
  useEffect(() => {
    let active = true;
    fetchGames(FALLBACK_IMAGES)
      .then(list => {
        if (!active || !list.length) return;
        const mapped: GameOption[] = list.map(game => {
          const fallback = FALLBACK_GAMES.find(candidate => candidate.id === game.id);
          return {
            id: game.id,
            name: game.name,
            image: game.image,
            maxPlayers: game.maxPlayers ?? fallback?.maxPlayers ?? DEFAULT_MAX_PLAYERS,
          };
        });
        setGames(mapped);
        setSelectedGame(prev => mapped.find(game => game.id === prev.id) ?? mapped[0]);
      })
      .catch(() => {
        // Keep the local fallback games — the player can still set up a match.
      });
    return () => {
      active = false;
    };
  }, []);

  // ── Load the in-app wallet (needed for the in-system wager) ───────
  useEffect(() => {
    let active = true;
    fetchWallet()
      .then(info => {
        if (active) setWallet(info);
      })
      .catch(() => {
        // Wallet endpoint unavailable — the picker disables balance checks.
      });
    return () => {
      active = false;
    };
  }, []);

  // ── Load shops when playing in a shop ────────────────────────────
  useEffect(() => {
    if (location !== 'shop') return;
    let active = true;
    setShopsLoading(true);
    fetchMatchShops()
      .then(list => {
        if (!active) return;
        setShops(list);
        setSelectedShop(prev => prev ?? list[0] ?? null);
      })
      .catch(() => {
        if (active) setShops([]);
      })
      .finally(() => {
        if (active) setShopsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [location]);

  // ── Load players in the selected shop ────────────────────────────
  const loadNearby = useCallback(() => {
    if (location !== 'shop' || !selectedShop) {
      setNearbyPlayers([]);
      return;
    }
    setNearbyLoading(true);
    fetchNearbyPlayers(selectedShop.id)
      .then(list => setNearbyPlayers(list))
      .catch(() => setNearbyPlayers([]))
      .finally(() => setNearbyLoading(false));
  }, [location, selectedShop]);

  useEffect(() => {
    loadNearby();
  }, [loadNearby]);

  // ── Load chalkmen when escrow is selected ────────────────────────
  useEffect(() => {
    if (wagerMethod !== 'escrow') return;
    let active = true;
    fetchChalkmen(selectedShop?.id)
      .then(list => {
        if (!active) return;
        setChalkmen(list);
        setSelectedChalkman(prev => prev ?? list[0] ?? null);
      })
      .catch(() => {
        if (active) setChalkmen([]);
      });
    return () => {
      active = false;
    };
  }, [wagerMethod, selectedShop]);

  // ── Derived ──────────────────────────────────────────────────────
  const maxOpponents = matchMode === 'party' ? Math.max(playerCount - 1, 1) : 1;
  const stakeValue = parseInt(stakeAmount || '0', 10) || 0;
  const seriesLabel = getSeriesLabel(seriesFormat);

  const selectGame = useCallback((game: GameOption) => {
    setSelectedGame(game);
    setSelectedPlayers([]);
    if (game.maxPlayers <= 2) {
      setMatchMode('1v1');
      setPlayerCount(2);
    } else {
      setPlayerCount(prev => Math.min(Math.max(prev, 2), game.maxPlayers));
    }
  }, []);

  const selectMode = useCallback((mode: MatchMode) => {
    setMatchMode(mode);
    if (mode === '1v1') {
      setPlayerCount(2);
      setSelectedPlayers(prev => prev.slice(0, 1));
    } else {
      setPlayerCount(prev => Math.min(Math.max(prev, 2), maxPlayers));
    }
  }, [maxPlayers]);

  const incrementPlayers = useCallback(() => {
    setPlayerCount(prev => Math.min(prev + 1, maxPlayers));
  }, [maxPlayers]);

  const decrementPlayers = useCallback(() => {
    const next = Math.max(playerCount - 1, 2);
    setPlayerCount(next);
    setSelectedPlayers(selected => selected.slice(0, next - 1));
  }, [playerCount]);

  const changeLocation = useCallback((next: MatchLocation) => {
    setLocation(next);
    setSelectedPlayers([]);
    if (next === 'online') {
      setSelectedShop(null);
      setNearbyPlayers([]);
      setChalkmen([]);
      setSelectedChalkman(null);
    }
  }, []);

  const selectShop = useCallback((shop: Shop) => {
    setSelectedShop(shop);
    setSelectedPlayers([]);
    setSelectedChalkman(null);
  }, []);

  const changeWagerMethod = useCallback((method: WagerMethod) => {
    setWagerMethod(method);
    if (method === 'escrow') setStakeAmount(prev => prev || DEFAULT_STAKE);
  }, []);

  const togglePlayer = useCallback((player: Player) => {
    setSelectedPlayers(prev => {
      if (prev.some(selected => selected.id === player.id)) {
        return prev.filter(selected => selected.id !== player.id);
      }
      if (prev.length >= maxOpponents) {
        toast.error(
          `Only ${maxOpponents} opponent${maxOpponents > 1 ? 's' : ''} allowed in this match`,
        );
        return prev;
      }
      return [...prev, player];
    });
  }, [maxOpponents]);

  const removePlayer = useCallback((playerId: string) => {
    setSelectedPlayers(prev => prev.filter(player => player.id !== playerId));
  }, []);

  // ── Seat / wager validation ──────────────────────────────────────
  const validation = useMemo((): { canStart: boolean; hint: string } => {
    if (location === 'shop' && shops.length === 0) {
      return {
        canStart: false,
        hint: 'No shops found nearby — switch to Online or retry.',
      };
    }
    if (location === 'shop' && !selectedShop) {
      return { canStart: false, hint: 'Pick the shop you are playing in.' };
    }
    if (wagerMethod !== 'none' && stakeValue < MIN_STAKE) {
      return { canStart: false, hint: 'Enter a wager amount of at least $1.' };
    }
    if (wagerMethod === 'wallet' && wallet && stakeValue > wallet.balance) {
      return {
        canStart: false,
        hint: 'Your wallet balance does not cover this wager.',
      };
    }
    if (wagerMethod === 'escrow' && chalkmen.length > 0 && !selectedChalkman) {
      return { canStart: false, hint: 'Choose the chalkman holding the stake.' };
    }
    if (wagerMethod === 'escrow' && chalkmen.length === 0) {
      return {
        canStart: false,
        hint: 'No chalkman on duty — use the in-system wager instead.',
      };
    }
    return {
      canStart: true,
      hint:
        selectedPlayers.length > 0
          ? `${selectedPlayers.length} opponent${selectedPlayers.length > 1 ? 's' : ''} ready • ${seriesLabel}`
          : `Open match — anyone can join with your code • ${seriesLabel}`,
    };
  }, [
    chalkmen.length,
    location,
    selectedChalkman,
    selectedPlayers.length,
    selectedShop,
    seriesLabel,
    shops.length,
    stakeValue,
    wagerMethod,
    wallet,
  ]);

  // ── Build the request payload ────────────────────────────────────
  const buildStake = useCallback((): StakeConfig => {
    if (wagerMethod === 'none') {
      return { amount: 0, currency, method: 'none', secured: true, heldBy: 'system' };
    }
    if (wagerMethod === 'escrow') {
      return {
        amount: stakeValue,
        currency,
        method: 'escrow',
        secured: false,
        heldBy: 'chalkman',
        ...(selectedChalkman ? { escrowId: selectedChalkman.id } : {}),
      };
    }
    return {
      amount: stakeValue,
      currency,
      method: 'wallet',
      secured: false,
      heldBy: 'system',
    };
  }, [currency, selectedChalkman, stakeValue, wagerMethod]);

  // ── Start the match ──────────────────────────────────────────────
  const startMatch = useCallback(async () => {
    if (!validation.canStart) {
      toast.error(validation.hint);
      return;
    }
    setCreating(true);
    try {
      // Only the invited opponents are sent — the server adds the caller.
      const match = await createInstantMatch({
        gameId: selectedGame.id,
        gameName: selectedGame.name,
        mode: matchMode,
        playerIds: selectedPlayers.map(player => player.id),
        seriesFormat,
        stake: buildStake(),
        location,
        ...(location === 'shop' && selectedShop ? { shopId: selectedShop.id } : {}),
        isOpen: selectedPlayers.length === 0,
        ...(inviteCode ? { inviteCode } : {}),
        notificationsEnabled,
      });
      setCreatedMatch(match);

      if (notificationsEnabled) {
        notifyMatch(
          match.id,
          match.isOpen
            ? 'Open match started — share your invite code!'
            : 'Your match is ready to play!',
        ).catch(() => {
          // Notification failures must not break the created match.
        });
      }

      toast.success(
        match.isOpen ? 'Open match created — code ready!' : 'Match created!',
      );
    } catch (error: any) {
      toast.error(error?.message || 'Could not create the match');
    } finally {
      setCreating(false);
    }
  }, [
    buildStake,
    inviteCode,
    location,
    matchMode,
    notificationsEnabled,
    selectedGame.id,
    selectedGame.name,
    selectedPlayers,
    selectedShop,
    seriesFormat,
    validation,
  ]);

  // ── Join an existing match by invite code ────────────────────────
  const applyInviteCode = useCallback(async () => {
    const code = inviteCode.trim().toUpperCase();
    if (code.length < 4) {
      toast.error('Enter a valid invite code');
      return;
    }
    setApplyingCode(true);
    try {
      const match = await joinByInviteCode(code);
      setCreatedMatch(match);
      toast.success('Joined the match!');
    } catch (error: any) {
      toast.error(error?.message || 'No open match found for that code');
    } finally {
      setApplyingCode(false);
    }
  }, [inviteCode]);

  // ── Rematch ──────────────────────────────────────────────────────
  const rematch = useCallback(async () => {
    if (!createdMatch) return;
    setRematching(true);
    try {
      const next = await createRematch(createdMatch.id);
      setCreatedMatch(next);
      toast.success('Rematch ready!');
    } catch (error: any) {
      toast.error(error?.message || 'Could not create the rematch');
    } finally {
      setRematching(false);
    }
  }, [createdMatch]);

  const dismissSummary = useCallback(() => {
    setCreatedMatch(null);
  }, []);

  const selfPlayer: Player = useMemo(
    () => ({ id: 'self', username: user.username || 'You', isOnline: true }),
    [user.username],
  );

  return {
    // data
    games,
    shops,
    shopsLoading,
    chalkmen,
    nearbyPlayers,
    nearbyLoading,
    wallet,
    currency,
    selfPlayer,
    // selections
    selectedGame,
    matchMode,
    playerCount,
    seriesFormat,
    location,
    selectedShop,
    wagerMethod,
    stakeAmount,
    inviteCode,
    selectedPlayers,
    selectedChalkman,
    notificationsEnabled,
    // derived
    maxPlayers,
    maxOpponents,
    seriesLabel,
    canStart: validation.canStart,
    startHint: validation.hint,
    // status
    creating,
    rematching,
    applyingCode,
    createdMatch,
    // actions
    selectGame,
    selectMode,
    setSeriesFormat,
    changeLocation,
    selectShop,
    changeWagerMethod,
    setStakeAmount,
    setInviteCode,
    setNotificationsEnabled,
    incrementPlayers,
    decrementPlayers,
    togglePlayer,
    removePlayer,
    selectChalkman: setSelectedChalkman,
    applyInviteCode,
    startMatch,
    rematch,
    dismissSummary,
    loadNearby,
  };
};

export type InstantMatchSetup = ReturnType<typeof useInstantMatchSetup>;
