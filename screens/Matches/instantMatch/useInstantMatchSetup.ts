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
  ShopMatchSummary,
  ShopPlayer,
  StakeConfig,
  WalletInfo,
} from '../../../types';
import { fetchGames } from '../../../services/games';
import {
  createInstantMatch,
  createRematch,
  fetchChalkmen,
  fetchMatchShopDetail,
  fetchMatchShops,
  fetchOpenPlayers,
  fetchWallet,
  generateInviteCode,
  joinByInviteCode,
  joinInstantMatch,
  notifyMatch,
  setOpenToPlay,
} from '../../../services/match';
import { toast } from '../../../utils/ToastService';
import { describeApiError } from '../../../utils/apiErrors';
import { generateLocalInviteCode, shareInviteCode } from '../../../utils/inviteCode';
import {
  DEFAULT_MAX_PLAYERS,
  DEFAULT_STAKE,
  FALLBACK_GAMES,
  FALLBACK_IMAGES,
  MIN_STAKE,
  getSeriesLabel,
} from './constants';
import { GameOption, WagerMethod } from './types';
import { useShopLiveMatches } from './useShopLiveMatches';

const FALLBACK_OPTIONS: GameOption[] = FALLBACK_GAMES.map(game => ({
  ...game,
  gameId: game.id,
}));

/**
 * Owns every piece of state and side-effect for the instant-match setup flow.
 * The screen itself only renders.
 *
 * Three ideas drive the shape of this hook:
 *  1. A player can create a match *or* join somebody else's with a code — and
 *     generating a code works even before the backend endpoint exists.
 *  2. When playing in a shop, every player in that match belongs to the same
 *     shop, so the shop is part of the draft and of every guard.
 *  3. The shop board is live: open players and running matches refresh while
 *     the screen is open.
 */
export const useInstantMatchSetup = () => {
  const user = useSelector((state: RootState) => state.user);

  // ── Remote data ──────────────────────────────────────────────────
  const [games, setGames] = useState<GameOption[]>(FALLBACK_OPTIONS);
  const [shops, setShops] = useState<Shop[]>([]);
  const [shopsLoading, setShopsLoading] = useState(false);
  const [shopDetail, setShopDetail] = useState<Shop | null>(null);
  const [chalkmen, setChalkmen] = useState<Player[]>([]);
  const [shopPlayers, setShopPlayers] = useState<ShopPlayer[]>([]);
  const [shopPlayersLoading, setShopPlayersLoading] = useState(false);
  const [shopPlayersError, setShopPlayersError] = useState<string | null>(null);
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
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [selectedChalkman, setSelectedChalkman] = useState<Player | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // ── Invite codes ─────────────────────────────────────────────────
  /** The caller's own code, generated before the match exists. */
  const [myInviteCode, setMyInviteCode] = useState<string | null>(null);
  const [inviteCodeOffline, setInviteCodeOffline] = useState(false);
  const [generatingCode, setGeneratingCode] = useState(false);
  /** A code typed in to join somebody else's match. */
  const [joinCode, setJoinCode] = useState('');

  // ── Shop presence ────────────────────────────────────────────────
  const [imOpenToPlay, setImOpenToPlay] = useState(false);

  // ── Status ───────────────────────────────────────────────────────
  const [creating, setCreating] = useState(false);
  const [rematching, setRematching] = useState(false);
  const [joining, setJoining] = useState(false);
  const [joiningMatchId, setJoiningMatchId] = useState<string | null>(null);
  const [createdMatch, setCreatedMatch] = useState<InstantMatch | null>(null);

  const inShop = location === 'shop';
  const maxPlayers = selectedGame.maxPlayers;
  const currency: 'USD' | 'KES' = wallet?.currency ?? 'USD';

  // ── Live board for the selected shop ─────────────────────────────
  const liveBoard = useShopLiveMatches(selectedShop?.id ?? null, inShop && !!selectedShop);

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
            gameId: game.gameId,
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
    if (!inShop) return;
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
  }, [inShop]);

  // ── Pull the full record for the selected shop (map coordinates) ──
  useEffect(() => {
    if (!inShop || !selectedShop) {
      setShopDetail(null);
      return;
    }
    let active = true;
    // Show what the list already gave us immediately, then refine it.
    setShopDetail(selectedShop);
    fetchMatchShopDetail(selectedShop.id)
      .then(detail => {
        if (active) setShopDetail(detail);
      })
      .catch(() => {
        // The list record is good enough — coordinates simply stay missing.
      });
    return () => {
      active = false;
    };
  }, [inShop, selectedShop]);

  // ── Players in the selected shop who are open to play ────────────
  const loadShopPlayers = useCallback(() => {
    if (!selectedShop) {
      setShopPlayers([]);
      setShopPlayersError(null);
      return;
    }
    setShopPlayersLoading(true);
    setShopPlayersError(null);
    fetchOpenPlayers(selectedShop.id)
      .then(list => setShopPlayers(list))
      .catch(error =>
        setShopPlayersError(
          describeApiError(error, 'Could not read who is in this shop right now.'),
        ),
      )
      .finally(() => setShopPlayersLoading(false));
  }, [selectedShop]);

  useEffect(() => {
    if (!inShop) {
      setShopPlayers([]);
      setShopPlayersError(null);
      return;
    }
    loadShopPlayers();
  }, [inShop, loadShopPlayers]);

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

  // Keep the shop board in sync right after this player changes presence.
  useEffect(() => {
    if (!inShop) setImOpenToPlay(false);
  }, [inShop]);

  // ── Derived ──────────────────────────────────────────────────────
  const maxOpponents = matchMode === 'party' ? Math.max(playerCount - 1, 1) : 1;
  const stakeValue = parseInt(stakeAmount || '0', 10) || 0;
  const seriesLabel = getSeriesLabel(seriesFormat);
  /** The signed-in user's id, used to keep them out of opponent lists. */
  const myPlayerId = String((user as any)?.id ?? (user as any)?._id ?? '');

  // ── Selections ───────────────────────────────────────────────────
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

  const selectMode = useCallback(
    (mode: MatchMode) => {
      setMatchMode(mode);
      if (mode === '1v1') {
        setPlayerCount(2);
        setSelectedPlayers(prev => prev.slice(0, 1));
      } else {
        setPlayerCount(prev => Math.min(Math.max(prev, 2), maxPlayers));
      }
    },
    [maxPlayers],
  );

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
      setShopDetail(null);
      setShopPlayers([]);
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

  const togglePlayer = useCallback(
    (player: Player) => {
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
    },
    [maxOpponents],
  );

  const removePlayer = useCallback((playerId: string) => {
    setSelectedPlayers(prev => prev.filter(player => player.id !== playerId));
  }, []);
// ── Seat / wager validation ──────────────────────────────────────
  const validation = useMemo((): { canStart: boolean; hint: string } => {
    if (inShop && shops.length === 0) {
      return {
        canStart: false,
        hint: 'No shops found nearby — switch to Online or retry.',
      };
    }
    if (inShop && !selectedShop) {
      return { canStart: false, hint: 'Pick the shop you are playing in.' };
    }
    if (wagerMethod !== 'none' && stakeValue < MIN_STAKE) {
      return { canStart: false, hint: 'Enter a wager amount of at least $1.' };
    }
    if (wagerMethod === 'wallet' && wallet && stakeValue > wallet.balance) {
      return { canStart: false, hint: 'Your wallet balance does not cover this wager.' };
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
    if (selectedPlayers.length > 0) {
      return {
        canStart: true,
        hint: `${selectedPlayers.length} opponent${selectedPlayers.length > 1 ? 's' : ''} ready • ${seriesLabel}`,
      };
    }
    return {
      canStart: true,
      hint: myInviteCode
        ? `Open match — share code ${myInviteCode} • ${seriesLabel}`
        : `Open match — we will generate a code for you • ${seriesLabel}`,
    };
  }, [
    chalkmen.length,
    inShop,
    myInviteCode,
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
    return { amount: stakeValue, currency, method: 'wallet', secured: false, heldBy: 'system' };
  }, [currency, selectedChalkman, stakeValue, wagerMethod]);

  // ── Invite code: generate + share ────────────────────────────────
  const generateMyCode = useCallback(async () => {
    setGeneratingCode(true);
    try {
      const issued = await generateInviteCode(selectedShop?.id);
      setMyInviteCode(issued.code);
      setInviteCodeOffline(!!issued.offline);
      if (issued.offline) {
        toast.info('Code created on this device — the match service did not answer.');
      } else {
        toast.success('Invite code ready to share');
      }
    } finally {
      setGeneratingCode(false);
    }
  }, [selectedShop]);

  const shareMyCode = useCallback(() => {
    if (!myInviteCode) {
      toast.error('Generate a code first');
      return;
    }
    void shareInviteCode({
      code: myInviteCode,
      gameName: selectedGame.name,
      shopName: selectedShop?.name,
      matchId: createdMatch?.id,
    });
  }, [createdMatch, myInviteCode, selectedGame.name, selectedShop]);

  // ── Shop presence: "I'm open to play" ────────────────────────────
  const toggleOpenToPlay = useCallback(
    async (value: boolean) => {
      if (!selectedShop) {
        toast.error('Pick a shop first');
        return;
      }
      // Optimistic: the switch should feel instant, and is reverted on failure.
      setImOpenToPlay(value);
      try {
        await setOpenToPlay(selectedShop.id, value);
        toast.success(
          value
            ? 'You are now visible to players in this shop'
            : 'You are no longer listed as open to play',
        );
        loadShopPlayers();
      } catch (error) {
        setImOpenToPlay(!value);
        toast.error(describeApiError(error, 'Could not update your availability'));
      }
    },
    [loadShopPlayers, selectedShop],
  );

  // ── Keep the caller aligned with the match's shop ────────────────
  /**
   * A match belongs to exactly one shop. When a player joins one from a
   * different shop (or while in online mode) the client adopts the match's
   * shop so the board, presence list and summary all agree with the server.
   */
  const adoptMatchShop = useCallback(
    (match: InstantMatch) => {
      if (match.location !== 'shop' || !match.shopId) return false;
      const known = shops.find(shop => shop.id === match.shopId);
      setLocation('shop');
      setShopDetail(known ?? null);
      setSelectedShop(
        known ?? { id: match.shopId, name: match.shopName ?? 'Game Shop' },
      );
      return true;
    },
    [shops],
  );

  // ── Join an existing match by invite code ────────────────────────
  const joinWithCode = useCallback(async () => {
    const code = joinCode.trim().toUpperCase();
    if (code.length < 4) {
      toast.error('Enter a valid invite code');
      return;
    }
    setJoining(true);
    try {
      const match = await joinByInviteCode(code);
      setCreatedMatch(match);
      setJoinCode('');
      const movedShops = adoptMatchShop(match);
      if (movedShops) {
        toast.success(`Joined — you are now playing at ${match.shopName ?? 'that shop'}`);
      } else {
        toast.success('Joined the match!');
      }
      liveBoard.refresh();
      loadShopPlayers();
    } catch (error) {
      toast.error(describeApiError(error, 'No open match found for that code'));
    } finally {
      setJoining(false);
    }
  }, [adoptMatchShop, joinCode, liveBoard, loadShopPlayers]);

  // ── Join an open match straight from the shop board ──────────────
  const joinOpenMatch = useCallback(
    async (match: ShopMatchSummary) => {
      if (match.shopId && selectedShop && match.shopId !== selectedShop.id) {
        toast.error('That match is running at another shop');
        return;
      }
      setJoiningMatchId(match.id);
      try {
        const joined = await joinInstantMatch(match.id);
        setCreatedMatch(joined);
        setJoinCode('');
        adoptMatchShop(joined);
        toast.success(`Joined ${match.gameName}!`);
        liveBoard.refresh();
        loadShopPlayers();
      } catch (error) {
        toast.error(describeApiError(error, 'Could not join that match'));
      } finally {
        setJoiningMatchId(null);
      }
    },
    [adoptMatchShop, liveBoard, loadShopPlayers, selectedShop],
  );

  // ── Start the match ──────────────────────────────────────────────
  const startMatch = useCallback(async () => {
    if (!validation.canStart) {
      toast.error(validation.hint);
      return;
    }
    setCreating(true);
    // Always leave the player with a shareable code, even if the API is old.
    const codeForMatch = myInviteCode ?? generateLocalInviteCode();
    if (!myInviteCode) {
      setMyInviteCode(codeForMatch);
      setInviteCodeOffline(true);
    }
    try {
      // Only the invited opponents are sent — the server adds the caller.
      const match = await createInstantMatch({
        gameId: selectedGame.gameId,
        gameName: selectedGame.name,
        mode: matchMode,
        playerIds: selectedPlayers.map(player => player.id),
        seriesFormat,
        stake: buildStake(),
        location,
        ...(inShop && selectedShop ? { shopId: selectedShop.id } : {}),
        isOpen: selectedPlayers.length === 0,
        inviteCode: codeForMatch,
        notificationsEnabled,
      });
      setCreatedMatch(match);

      // Trust the server's code if it issued a different one.
      if (match.inviteCode) {
        setMyInviteCode(match.inviteCode);
        setInviteCodeOffline(false);
      }

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

      // Everybody in the shop should see it immediately.
      liveBoard.refresh();
      loadShopPlayers();

      toast.success(
        match.isOpen ? 'Open match created — code ready!' : 'Match created!',
      );
    } catch (error) {
      toast.error(describeApiError(error, 'Could not create the match'));
    } finally {
      setCreating(false);
    }
  }, [
    buildStake,
    inShop,
    liveBoard,
    loadShopPlayers,
    matchMode,
    myInviteCode,
    notificationsEnabled,
    selectedGame.gameId,
    selectedGame.name,
    selectedPlayers,
    selectedShop,
    seriesFormat,
    validation,
  ]);

  // ── Rematch ──────────────────────────────────────────────────────
  const rematch = useCallback(async () => {
    if (!createdMatch) return;
    setRematching(true);
    try {
      const next = await createRematch(createdMatch.id);
      setCreatedMatch(next);
      if (next.inviteCode) setMyInviteCode(next.inviteCode);
      liveBoard.refresh();
      toast.success('Rematch ready!');
    } catch (error) {
      toast.error(describeApiError(error, 'Could not create the rematch'));
    } finally {
      setRematching(false);
    }
  }, [createdMatch, liveBoard]);

  const dismissSummary = useCallback(() => {
    setCreatedMatch(null);
  }, []);

  const selfPlayer: Player = useMemo(
    () => ({ id: 'self', username: user.username || 'You', isOnline: true }),
    [user.username],
  );

  /** The shop's open players, with the caller removed (they are not an opponent). */
  const openPlayers = useMemo(
    () => shopPlayers.filter(player => !myPlayerId || player.id !== myPlayerId),
    [myPlayerId, shopPlayers],
  );

  return {
    // data
    games,
    shops,
    shopsLoading,
    shop: shopDetail ?? selectedShop,
    chalkmen,
    shopPlayers,
    openPlayers,
    shopPlayersLoading,
    shopPlayersError,
    wallet,
    currency,
    selfPlayer,
    myPlayerId,
    // selections
    selectedGame,
    matchMode,
    playerCount,
    seriesFormat,
    location,
    inShop,
    selectedShop,
    wagerMethod,
    stakeAmount,
    selectedPlayers,
    selectedChalkman,
    notificationsEnabled,
    // invite codes
    myInviteCode,
    inviteCodeOffline,
    generatingCode,
    joinCode,
    imOpenToPlay,
    // derived
    maxPlayers,
    maxOpponents,
    seriesLabel,
    canStart: validation.canStart,
    startHint: validation.hint,
    // shop live board
    liveMatches: liveBoard.matches,
    liveBoardLoading: liveBoard.loading,
    liveBoardRefreshing: liveBoard.refreshing,
    liveBoardError: liveBoard.error,
    liveBoardUpdatedAt: liveBoard.lastUpdated,
    hasLiveMatches: liveBoard.hasLiveMatches,
    refreshLiveBoard: liveBoard.refresh,
    joinOpenMatch,
    joiningMatchId,
    // status
    creating,
    rematching,
    joining,
    createdMatch,
    // actions
    selectGame,
    selectMode,
    setSeriesFormat,
    changeLocation,
    selectShop,
    changeWagerMethod,
    setStakeAmount,
    setJoinCode,
    setNotificationsEnabled,
    incrementPlayers,
    decrementPlayers,
    togglePlayer,
    removePlayer,
    selectChalkman: setSelectedChalkman,
    generateMyCode,
    shareMyCode,
    joinWithCode,
    toggleOpenToPlay,
    refreshShopPlayers: loadShopPlayers,
    startMatch,
    rematch,
    dismissSummary,
  };
};

export type InstantMatchSetup = ReturnType<typeof useInstantMatchSetup>;
