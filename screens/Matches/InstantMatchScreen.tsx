import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { useTheme } from '@emotion/react';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { AppTheme } from '../../theme';
import { createStyles } from './InstantMatchScreen.styles';
import AppLogo from '../../components/AppLogo';
import { fetchGames } from '../../services/games';
import {
  createInstantMatch,
  fetchChalkmen,
  fetchNearbyPlayers,
  createRematch,
  notifyMatch,
} from '../../services/match';
import { toast } from '../../utils/ToastService';
import {
  SeriesFormat,
  StakeMethod,
  MatchMode,
  Player,
  InstantMatch,
} from '../../types';

const Stack = createStackNavigator();
type IconName = React.ComponentProps<typeof Ionicons>['name'];

// ── Static data ────────────────────────────────────────────────────

const FALLBACK_GAMES = [
  { id: 'chess', name: 'Chess', image: require('../../assets/gaming.jpg'), maxPlayers: 2 },
  { id: 'pool', name: 'Pool', image: require('../../assets/gaming.jpg'), maxPlayers: 8 },
  { id: 'valorant', name: 'Valorant', image: require('../../assets/avatar.jpg'), maxPlayers: 10 },
  { id: 'cod', name: 'Call of Duty', image: require('../../assets/gaming.jpg'), maxPlayers: 10 },
  { id: 'fifa', name: 'FIFA 24', image: require('../../assets/profile.jpg'), maxPlayers: 2 },
  { id: 'rocket', name: 'Rocket League', image: require('../../assets/icon.png'), maxPlayers: 4 },
  { id: 'pubg', name: 'PUBG Mobile', image: require('../../assets/gaming.jpg'), maxPlayers: 4 },
];

const FALLBACK_IMAGES = FALLBACK_GAMES.map(g => g.image);

const SERIES_OPTIONS: { id: SeriesFormat; label: string; sub: string; wins: number }[] = [
  { id: 'bo1', label: 'BO1', sub: '1 game', wins: 1 },
  { id: 'bo3', label: 'BO3', sub: 'Best of 3', wins: 2 },
  { id: 'bo5', label: 'BO5', sub: 'Best of 5', wins: 3 },
];

const STAKE_METHODS: { id: StakeMethod; label: string; sub: string; icon: IconName; color: string }[] = [
  { id: 'instant', label: 'Instant Pay', sub: 'Pay now, win & get paid', icon: 'flash', color: '#34C759' },
  { id: 'escrow', label: 'Chalkman Escrow', sub: 'Attendant holds stake', icon: 'shield-checkmark', color: '#FF9500' },
];

const QUICK_AMOUNTS = [5, 10, 20, 50, 100];

const DEFAULT_AVATAR = require('../../assets/avatar.jpg');

interface GameOption {
  id: string;
  name: string;
  image: any;
  maxPlayers: number;
}

// ── Helper functions ──────────────────────────────────────────────

const pad2 = (n: number) => String(n).padStart(2, '0');

const getWinsNeeded = (format: SeriesFormat): number => {
  const opt = SERIES_OPTIONS.find(s => s.id === format);
  return opt?.wins ?? 1;
};

const getSeriesLabel = (format: SeriesFormat): string => {
  const opt = SERIES_OPTIONS.find(s => s.id === format);
  return opt?.label ?? 'BO1';
};

const getPlayerMeta = (p: Player): string => {
  const rank = p.rating ? `${p.rating} RP` : 'Unranked';
  const status = p.isOnline === false ? 'Offline' : 'Online';
  return `${rank} • ${status}`;
};

// ── Content screen ─────────────────────────────────────────────────

const InstantMatchContent = () => {
  const theme = useTheme() as AppTheme;
  const styles = createStyles(theme);
  const navigation = useNavigation<any>();

  const [games, setGames] = useState<GameOption[]>(FALLBACK_GAMES);
  const [selectedGameId, setSelectedGameId] = useState('chess');
  const [selectedGame, setSelectedGame] = useState<GameOption>(FALLBACK_GAMES[0]);

  const [matchMode, setMatchMode] = useState<MatchMode>('1v1');
  const [playerCount, setPlayerCount] = useState(2);

  const [seriesFormat, setSeriesFormat] = useState<SeriesFormat>('bo3');

  const [stakeMethod, setStakeMethod] = useState<StakeMethod>('instant');
  const [stakeAmount, setStakeAmount] = useState('20');

  const [inviteCode, setInviteCode] = useState('');
  const [nearbyPlayers, setNearbyPlayers] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);

  const [chalkmen, setChalkmen] = useState<Player[]>([]);
  const [selectedChalkman, setSelectedChalkman] = useState<Player | null>(null);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [creating, setCreating] = useState(false);
  const [createdMatch, setCreatedMatch] = useState<InstantMatch | null>(null);

  // ── Load games ───────────────────────────────────────────────────
  useEffect(() => {
    let active = true;
    fetchGames(FALLBACK_IMAGES)
      .then(list => {
        if (!active || !list.length) return;
        const mapped: GameOption[] = list.map((g, i) => {
          const fallback = FALLBACK_GAMES.find(f => f.id === g.id);
          return {
            id: g.id,
            name: g.name,
            image: g.image,
            maxPlayers: fallback?.maxPlayers ?? 2,
          };
        });
        setGames(mapped);
        if (mapped.length) handleGameSelect(mapped[0]);
      })
      .catch(() => { /* keep fallback */ });
    return () => { active = false; };
  }, []);

  // ── Load chalkmen when escrow selected ───────────────────────────
  useEffect(() => {
    if (stakeMethod !== 'escrow') return;
    let active = true;
    fetchChalkmen()
      .then(list => {
        if (!active || !list.length) return;
        setChalkmen(list);
        setSelectedChalkman(prev => prev ?? list[0]);
      })
      .catch(() => {});
    return () => { active = false; };
  }, [stakeMethod]);

  // ── Load nearby players ──────────────────────────────────────────
  useEffect(() => {
    let active = true;
    fetchNearbyPlayers()
      .then(list => {
        if (!active || !list.length) return;
        setNearbyPlayers(list.filter(p => p.id !== 'self'));
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  const handleGameSelect = useCallback((game: GameOption) => {
    setSelectedGame(game);
    setSelectedGameId(game.id);
    if (game.maxPlayers <= 2) {
      setMatchMode('1v1');
      setPlayerCount(2);
    } else {
      setMatchMode('party');
      setPlayerCount(prev => Math.min(Math.max(prev, 2), game.maxPlayers));
    }
    setSelectedPlayers([]);
  }, []);

  const cyclePlayerCount = useCallback(() => {
    if (!selectedGame) return;
    const max = selectedGame.maxPlayers;
    const next = playerCount >= max ? 2 : playerCount + 1;
    setPlayerCount(next);
    setSelectedPlayers(prev => prev.slice(0, next - 1));
  }, [playerCount, selectedGame]);

  const toggleNearbyPlayer = useCallback((player: Player) => {
    setSelectedPlayers(prev => {
      const exists = prev.some(p => p.id === player.id);
      if (exists) return prev.filter(p => p.id !== player.id);
      const maxOpponents = matchMode === 'party' ? playerCount - 1 : 1;
      if (prev.length >= maxOpponents) {
        toast.error(`Only ${maxOpponents} opponent${maxOpponents > 1 ? 's' : ''} allowed`);
        return prev;
      }
      return [...prev, player];
    });
  }, [matchMode, playerCount]);

  const removeSelectedPlayer = useCallback((playerId: string) => {
    setSelectedPlayers(prev => prev.filter(p => p.id !== playerId));
  }, []);

  const applyInviteCode = useCallback(() => {
    if (!inviteCode.trim()) {
      toast.error('Enter an invite code');
      return;
    }
    toast.success(`Invite code applied: ${inviteCode.trim().toUpperCase()}`);
  }, [inviteCode]);

  const handleStart = useCallback(async () => {
    const amount = parseInt(stakeAmount || '0', 10);
    if (!selectedGame) { toast.error('Select a game'); return; }
    if (amount <= 0) { toast.error('Enter a valid stake amount'); return; }
    if (selectedPlayers.length < (matchMode === 'party' ? playerCount - 1 : 1)) {
      toast.error(`Add ${matchMode === 'party' ? playerCount - 1 : 1} opponent(s)`);
      return;
    }
    if (stakeMethod === 'escrow' && !selectedChalkman) {
      toast.error('Select a chalkman to hold the stake');
      return;
    }

    setCreating(true);
    try {
      const leader = nearbyPlayers[0] ?? { id: 'self', username: 'You' };
      const allPlayers: Player[] = [leader, ...selectedPlayers];
      const match = await createInstantMatch({
        gameId: selectedGameId,
        gameName: selectedGame.name,
        mode: matchMode,
        playerIds: allPlayers.map(p => p.id),
        seriesFormat,
        stake: {
          amount,
          currency: 'USD',
          method: stakeMethod,
          secured: stakeMethod === 'instant',
          ...(stakeMethod === 'escrow' && selectedChalkman ? { escrowId: selectedChalkman.id } : {}),
        },
        inviteCode: inviteCode.trim() || undefined,
        notificationsEnabled,
      });
      setCreatedMatch(match);
      if (notificationsEnabled) {
        await notifyMatch(match.id, 'Match created! You will be notified when it starts.');
      }
      toast.success('Instant match created!');
    } catch (e: any) {
      toast.error(e?.message || 'Failed to create instant match');
    } finally {
      setCreating(false);
    }
  }, [
    selectedGame, selectedGameId, matchMode, playerCount,
    seriesFormat, stakeMethod, stakeAmount, inviteCode,
    notificationsEnabled, nearbyPlayers, selectedPlayers, selectedChalkman,
  ]);

  const handleRematch = useCallback(async () => {
    if (!createdMatch) return;
    setCreating(true);
    try {
      const rematch = await createRematch(createdMatch.id);
      setCreatedMatch(rematch);
      toast.success('Rematch created!');
    } catch (e: any) {
      toast.error(e?.message || 'Failed to create rematch');
    } finally {
      setCreating(false);
    }
  }, [createdMatch]);

  const selectedIndex = games.findIndex(g => g.id === selectedGameId);
  const maxOpponents = matchMode === 'party' ? playerCount - 1 : 1;
  const winsNeeded = getWinsNeeded(seriesFormat);
  const canStart = selectedPlayers.length >= maxOpponents && parseInt(stakeAmount || '0', 10) > 0;

  const participantLabel = useMemo(() => {
    if (matchMode === 'party') return `${playerCount} PLAYERS`;
    return '1V1 MATCH';
  }, [matchMode, playerCount]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Step 1: Select Game ── */}
      <View style={styles.sectionRow}>
        <View style={styles.stepBadge}><Text style={styles.stepBadgeText}>1</Text></View>
        <Ionicons name="game-controller-outline" size={15} color={theme.primary} />
        <Text style={styles.sectionTitle}>SELECT GAME</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.gamesContent}
      >
        {games.map((g, i) => {
          const active = g.id === selectedGameId;
          return (
            <TouchableOpacity
              key={g.id}
              style={[styles.gameCard, active && styles.gameCardSelected]}
              onPress={() => handleGameSelect(g)}
              activeOpacity={0.9}
            >
              <Image source={g.image} style={styles.gameImage} resizeMode="cover" />
              <View style={styles.gameImageOverlay} />
              {active && (
                <>
                  <View style={styles.selectedBadge}>
                    <Text style={styles.selectedBadgeText}>SELECTED</Text>
                  </View>
                  <Text style={styles.gameNameBarLayer}>{i + 1}</Text>
                </>
              )}
              <View style={styles.gameNameBar}>
                <Text style={styles.gameName} numberOfLines={1}>{g.name}</Text>
              </View>
              <View style={styles.maxPlayersBadge}>
                <Text style={styles.maxPlayersText}>{g.maxPlayers}P</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.dotsRow}>
        {games.map((g, i) => (
          <View key={g.id} style={[styles.dot, i === selectedIndex && styles.dotActive]} />
        ))}
      </View>

      {/* ── Step 2: Match Setup ── */}
      <View style={styles.sectionRow}>
        <View style={styles.stepBadge}><Text style={styles.stepBadgeText}>2</Text></View>
        <Ionicons name="git-compare-outline" size={15} color={theme.primary} />
        <Text style={styles.sectionTitle}>MATCH SETUP</Text>
        <View style={styles.sectionSpacer} />
        <Text style={{ fontSize: 10, color: theme.primary, fontWeight: '700' }}>{participantLabel}</Text>
      </View>

      {/* Match mode */}
      <View style={styles.selectorRow}>
        <TouchableOpacity
          style={[styles.optionCard, matchMode === '1v1' && styles.optionCardActive]}
          onPress={() => { setMatchMode('1v1'); setSelectedPlayers([]); }}
          activeOpacity={0.85}
          disabled={selectedGame.maxPlayers <= 2}
        >
          <View style={[styles.optionIconCircle, matchMode === '1v1' && styles.optionIconCircleActive]}>
            <Ionicons name="person" size={20} color={matchMode === '1v1' ? theme.primary : theme.subText} />
          </View>
          <Text style={[styles.optionLabel, matchMode !== '1v1' && styles.optionLabelMuted]}>1v1 Duel</Text>
          <Text style={[styles.optionSub, matchMode === '1v1' && styles.optionSubActive]}>2 players</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionCard, matchMode === 'party' && styles.optionCardActive]}
          onPress={() => { setMatchMode('party'); setPlayerCount(Math.min(2, selectedGame.maxPlayers)); }}
          activeOpacity={0.85}
          disabled={selectedGame.maxPlayers <= 2}
        >
          <View style={[styles.optionIconCircle, matchMode === 'party' && styles.optionIconCircleActive]}>
            <Ionicons name="people" size={20} color={matchMode === 'party' ? theme.primary : theme.subText} />
          </View>
          <Text style={[styles.optionLabel, matchMode !== 'party' && styles.optionLabelMuted]}>Party</Text>
          <Text style={[styles.optionSub, matchMode === 'party' && styles.optionSubActive]}>Group of friends</Text>
        </TouchableOpacity>
      </View>

      {/* Player count (party only) */}
      {matchMode === 'party' && (
        <View style={{ ...styles.selectorRow, marginTop: 10 }}>
          <TouchableOpacity
            style={styles.optionCard}
            onPress={cyclePlayerCount}
            activeOpacity={0.85}
          >
            <View style={styles.optionIconCircle}>
              <Ionicons name="people-circle" size={20} color={theme.primary} />
            </View>
            <Text style={styles.optionLabel}>PLAYERS</Text>
            <Text style={[styles.optionSub, styles.optionSubActive]}>{playerCount} players (max {selectedGame.maxPlayers})</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Series format */}
      <View style={styles.sectionRow}>
        <Ionicons name="trophy-outline" size={15} color={theme.primary} />
        <Text style={styles.sectionTitle}>SERIES FORMAT</Text>
      </View>
      <View style={styles.selectorRow}>
        {SERIES_OPTIONS.map(so => {
          const active = seriesFormat === so.id;
          return (
            <TouchableOpacity
              key={so.id}
              style={[styles.optionCard, active && styles.optionCardActive]}
              onPress={() => setSeriesFormat(so.id)}
              activeOpacity={0.85}
            >
              <Text style={[styles.optionLabel, active && styles.optionSubActive, { fontSize: 14 }]}>{so.label}</Text>
              <Text style={[styles.optionSub, active && styles.optionSubActive]}>{so.sub} • {so.wins} wins</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Step 3: Stake & Wager ── */}
      <View style={styles.sectionRow}>
        <View style={styles.stepBadge}><Text style={styles.stepBadgeText}>3</Text></View>
        <Ionicons name="cash-outline" size={15} color={theme.primary} />
        <Text style={styles.sectionTitle}>STAKE & WAGER</Text>
      </View>

      <View style={styles.selectorRow}>
        {STAKE_METHODS.map(sm => {
          const active = stakeMethod === sm.id;
          return (
            <TouchableOpacity
              key={sm.id}
              style={[styles.optionCard, active && { borderColor: sm.color, backgroundColor: sm.color + '14' }]}
              onPress={() => setStakeMethod(sm.id)}
              activeOpacity={0.85}
            >
              <View style={[styles.optionIconCircle, active && { backgroundColor: sm.color + '26' }]}>
                <Ionicons name={sm.icon} size={20} color={active ? sm.color : theme.subText} />
              </View>
              <Text style={[styles.optionLabel, active && { color: sm.color }]}>{sm.label}</Text>
              <Text style={[styles.optionSub, active && { color: sm.color }]} numberOfLines={1}>{sm.sub}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Amount */}
      <View style={{ ...styles.amountRow, marginTop: 10 }}>
        <View style={styles.amountInputWrap}>
          <Text style={styles.amountCurrency}>$</Text>
          <TextInput
            style={styles.amountInput}
            value={stakeAmount}
            onChangeText={t => setStakeAmount(t.replace(/[^0-9]/g, ''))}
            keyboardType="number-pad"
            placeholder="0"
            placeholderTextColor={theme.subText}
          />
        </View>
        {QUICK_AMOUNTS.map(qa => {
          const active = parseInt(stakeAmount || '0', 10) === qa;
          return (
            <TouchableOpacity
              key={qa}
              style={[styles.quickAmount, active && styles.quickAmountActive]}
              onPress={() => setStakeAmount(String(qa))}
              activeOpacity={0.85}
            >
              <Text style={[styles.quickAmountText, active && styles.quickAmountTextActive]}>${qa}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Escrow / chalkman selection */}
      {stakeMethod === 'escrow' && (
        <View style={styles.escrowCard}>
          <View style={styles.escrowTitleRow}>
            <Ionicons name="shield-checkmark-outline" size={15} color={theme.warning} />
            <Text style={styles.escrowTitle}>CHALKMAN ESCROW</Text>
          </View>
          <Text style={styles.escrowDesc}>
            The shop attendant (chalkman) will hold the <Text style={{ fontWeight: 'bold', color: theme.warning }}>${stakeAmount || '0'}</Text> until the {getSeriesLabel(seriesFormat)} series is settled.
          </Text>
          {chalkmen.length > 0 ? (
            chalkmen.map(cm => {
              const active = selectedChalkman?.id === cm.id;
              return (
                <TouchableOpacity
                  key={cm.id}
                  style={[styles.chalkmanRow, active && { backgroundColor: theme.primary + '10' }]}
                  onPress={() => setSelectedChalkman(cm)}
                  activeOpacity={0.8}
                >
                  <Image source={cm.avatar ? { uri: String(cm.avatar) } : DEFAULT_AVATAR} style={styles.chalkmanAvatar} />
                  <View style={styles.chalkmanInfo}>
                    <Text style={styles.chalkmanName}>{cm.username}</Text>
                    <Text style={styles.chalkmanStatus}>{active ? 'Selected • Ready to hold' : 'Available'}</Text>
                  </View>
                  <Ionicons name={active ? 'checkmark-circle' : 'ellipse-outline'} size={22} color={active ? theme.primary : theme.subText} />
                </TouchableOpacity>
              );
            })
          ) : (
            <Text style={{ ...styles.escrowDesc, marginTop: 8 }}>No chalkman available. Try again later.</Text>
          )}
        </View>
      )}

      {/* ── Step 4: Opponents ── */}
      <View style={styles.sectionRow}>
        <View style={styles.stepBadge}><Text style={styles.stepBadgeText}>4</Text></View>
        <Ionicons name="people-outline" size={15} color={theme.primary} />
        <Text style={styles.sectionTitle}>OPPONENTS</Text>
        <View style={styles.sectionSpacer} />
        <Text style={{ fontSize: 10, color: theme.primary, fontWeight: '700' }}>{selectedPlayers.length}/{maxOpponents} added</Text>
      </View>

      {/* Invite code */}
      <View style={styles.inviteRow}>
        <View style={styles.inviteInputWrap}>
          <Ionicons name="keypad-outline" size={16} color={theme.primary} />
          <TextInput
            style={styles.inviteInput}
            value={inviteCode}
            onChangeText={t => setInviteCode(t.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8))}
            placeholder="INVITE CODE"
            placeholderTextColor={theme.subText}
            autoCapitalize="characters"
          />
        </View>
        <TouchableOpacity style={styles.inviteBtn} onPress={applyInviteCode} activeOpacity={0.85}>
          <Text style={styles.inviteBtnText}>APPLY</Text>
        </TouchableOpacity>
      </View>

      {/* Nearby players */}
      {nearbyPlayers.length > 0 && (
        <View style={styles.nearbyCard}>
          <View style={styles.nearbyHeader}>
            <Ionicons name="location-outline" size={13} color={theme.success} />
            <Text style={styles.nearbyTitle}>IN THIS SHOP</Text>
            <Text style={styles.nearbyCount}>{nearbyPlayers.length} online</Text>
          </View>
          {nearbyPlayers.map(p => {
            const added = selectedPlayers.some(sp => sp.id === p.id);
            return (
              <View key={p.id} style={styles.playerRow}>
                <Image source={p.avatar ? { uri: String(p.avatar) } : DEFAULT_AVATAR} style={styles.playerAvatar} />
                <View style={styles.playerInfo}>
                  <Text style={styles.playerName}>{p.username}</Text>
                  <Text style={styles.playerMeta}>{getPlayerMeta(p)}</Text>
                </View>
                <TouchableOpacity
                  style={[styles.addBtn, added && styles.addBtnAdded]}
                  onPress={() => toggleNearbyPlayer(p)}
                  activeOpacity={0.8}
                >
                  <Ionicons name={added ? 'checkmark' : 'add'} size={18} color={added ? '#fff' : theme.primary} />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      )}

      {/* Selected players chips */}
      {selectedPlayers.length > 0 && (
        <View style={styles.selectedPlayersRow}>
          {selectedPlayers.map(p => (
            <TouchableOpacity key={p.id} style={styles.playerChip} onPress={() => removeSelectedPlayer(p.id)} activeOpacity={0.8}>
              <Ionicons name="person" size={12} color={theme.primary} />
              <Text style={styles.playerChipText}>{p.username}</Text>
              <Ionicons name="close-circle" size={14} color={theme.primary} style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Info box */}
      <View style={styles.infoBox}>
        <Ionicons name="information-circle-outline" size={16} color={theme.info} />
        <Text style={styles.infoText}>
          Players in the same shop are matched instantly. To repeat - tap "Rematch" after a completed series.
        </Text>
      </View>

      {/* ── Notifications ── */}
      <View style={styles.notifRow}>
        <View style={styles.notifIconWrap}>
          <Ionicons name="notifications-outline" size={20} color={theme.info} />
        </View>
        <View style={styles.notifTextWrap}>
          <Text style={styles.notifTitle}>PHONE NOTIFICATIONS</Text>
          <Text style={styles.notifSub}>Get notified during the match and rematches</Text>
        </View>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{ false: theme.border, true: theme.info }}
          thumbColor="#fff"
          style={styles.switch}
        />
      </View>

      {/* ── Start button ── */}
      <TouchableOpacity
        style={[styles.startBtn, !canStart && styles.startBtnDisabled]}
        onPress={handleStart}
        activeOpacity={0.9}
        disabled={!canStart || creating}
      >
        {creating ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons name="flash" size={22} color="#fff" />
            <Text style={styles.startBtnText}>START INSTANT MATCH</Text>
          </>
        )}
      </TouchableOpacity>

      {/* ── Rematch after creation ── */}
      {createdMatch && (
        <View style={styles.infoBox}>
          <Ionicons name="repeat" size={16} color={theme.success} />
          <Text style={styles.infoText}>
            Match started! Game: {createdMatch.gameName} • {getSeriesLabel(createdMatch.series.format)} • ${createdMatch.stake.amount}
          </Text>
          <TouchableOpacity style={styles.inviteBtn} onPress={handleRematch} activeOpacity={0.85} disabled={creating}>
            <Text style={styles.inviteBtnText}>REMATCH</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

// ── Header ─────────────────────────────────────────────────────────

const InstantMatchHeaderLeft = () => {
  const theme = useTheme() as AppTheme;
  const styles = createStyles(theme);
  const navigation = useNavigation<any>();

  const handleBack = () => {
    const parent = navigation.getParent();
    if (parent && parent.canGoBack()) parent.goBack();
    else if (navigation.canGoBack()) navigation.goBack();
  };

  return (
    <View style={styles.headerLeftRow}>
      <TouchableOpacity style={styles.headerBackBtn} onPress={handleBack} activeOpacity={0.7}>
        <Ionicons name="chevron-back" size={24} color={theme.text} />
      </TouchableOpacity>
      <AppLogo iconOnly size="sm" />
    </View>
  );
};

const InstantMatchHeaderRight = () => {
  const theme = useTheme() as AppTheme;
  const styles = createStyles(theme);
  return (
    <View style={styles.headerRightRow}>
      <TouchableOpacity activeOpacity={0.7}>
        <Ionicons name="notifications-outline" size={22} color={theme.text} />
      </TouchableOpacity>
      <Image source={require('../../assets/avatar.jpg')} style={styles.headerAvatar} />
    </View>
  );
};

// ── Stack Navigator ────────────────────────────────────────────────

const InstantMatchScreen = () => {
  const theme = useTheme() as AppTheme;
  const styles = createStyles(theme);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: theme.card },
        headerTintColor: theme.text,
        headerTitleAlign: 'center',
        headerTitle: () => (
          <Text style={styles.headerTitleText}>
            INSTANT <Text style={styles.headerTitleAccent}>MATCH</Text>
          </Text>
        ),
        headerLeft: () => <InstantMatchHeaderLeft />,
        headerRight: () => <InstantMatchHeaderRight />,
      }}
    >
      <Stack.Screen name="InstantMatch" component={InstantMatchContent} />
    </Stack.Navigator>
  );
};

export default InstantMatchScreen;
