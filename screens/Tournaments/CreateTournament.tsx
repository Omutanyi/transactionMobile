import React, { useState, useEffect } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity, TextInput, ActivityIndicator,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { useTheme } from '@emotion/react';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { AppTheme } from '../../theme';
import { createStyles, getHeaderOptions } from './CreateTournament.styles';
import AppLogo from '../../components/AppLogo';
import { fetchGames } from '../../services/games';
import { fetchShops, fetchTournamentChalkmen, createTournament } from '../../services/tournament';
import DateTimePicker from '@react-native-community/datetimepicker';
import { toast } from '../../utils/ToastService';
import { describeApiError } from '../../utils/apiErrors';
import { Shop, Player, TournamentEntryMethod } from '../../types';

const Stack = createStackNavigator();
type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface GameOption {
  /** Stable key for the selected card. */
  id: string;
  /** Identifier the API expects — this is what was previously missing. */
  gameId: string;
  name: string;
  image: any;
  maxPlayers?: number;
}

const FALLBACK_GAMES: GameOption[] = [
  {
    id: 'valorant',
    gameId: 'valorant',
    name: 'Valorant',
    image: require('../../assets/avatar.jpg'),
    maxPlayers: 10,
  },
];
const FALLBACK_IMAGES = FALLBACK_GAMES.map(g => g.image);

const TYPES: { id: string; label: string; icon: IconName }[] = [
  { id: 'single_elimination', label: 'SINGLE\nELIMINATION', icon: 'git-branch-outline' },
  { id: 'double_elimination', label: 'DOUBLE\nELIMINATION', icon: 'git-network-outline' },
  { id: 'round_robin', label: 'ROUND\nROBIN', icon: 'sync-outline' },
];

const LOCATIONS: { id: string; label: string; icon: IconName }[] = [
  { id: 'online', label: 'ONLINE', icon: 'globe-outline' },
  { id: 'local', label: 'IN-SHOP', icon: 'storefront-outline' },
];

const ENTRY_METHODS: { id: TournamentEntryMethod; label: string; icon: IconName }[] = [
  { id: 'free', label: 'FREE', icon: 'gift-outline' },
  { id: 'instant', label: 'INSTANT\nPAY', icon: 'flash-outline' },
  { id: 'escrow', label: 'CHALKMAN\nESCROW', icon: 'shield-checkmark-outline' },
];

const PARTICIPANT_OPTIONS = [8, 16, 32, 64, 128];
const NAME_MAX = 50;
const DESC_MAX = 300;

const CreateTournamentContent = () => {
  const theme = useTheme() as AppTheme;
  const styles = createStyles(theme);

  const [step, setStep] = useState(1);
  // The whole game record is kept, not just its id: `gameId` is the value the
  // API needs, while `id` is only the key used for the selected state.
  const [selectedGame, setSelectedGame] = useState<GameOption>(FALLBACK_GAMES[0]);
  const [name, setName] = useState('Legends Arena Cup');
  const [description, setDescription] = useState('Compete against the best and prove you are the ultimate champion!');
  const [type, setType] = useState('single_elimination');
  const [locationType, setLocationType] = useState<'online' | 'local'>('online');
  const [prize, setPrize] = useState('1000');
  const [entryMethod, setEntryMethod] = useState<TournamentEntryMethod>('instant');
  const [entryAmount, setEntryAmount] = useState('10');
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [chalkmen, setChalkmen] = useState<Player[]>([]);
  const [selectedChalkman, setSelectedChalkman] = useState<Player | null>(null);
  const [participants, setParticipants] = useState(16);
  const [startDate, setStartDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString());
  const [previewOpen, setPreviewOpen] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [games, setGames] = useState<GameOption[]>(FALLBACK_GAMES);
  const [creating, setCreating] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  const navigation = useNavigation<any>();

  useEffect(() => {
    let active = true;
    fetchGames(FALLBACK_IMAGES)
      .then(list => {
        if (!active || !list.length) return;
        setGames(list);
        // Keep the current selection when the API still lists that game.
        setSelectedGame(prev => list.find(game => game.id === prev.id) ?? list[0]);
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (locationType !== 'local') return;
    let active = true;
    fetchShops()
      .then(list => {
        if (!active || !list.length) return;
        setShops(list);
        setSelectedShop(prev => prev ?? list[0]);
      })
      .catch(() => {});
    return () => { active = false; };
  }, [locationType]);

  useEffect(() => {
    if (entryMethod !== 'escrow' || !selectedGame?.gameId) return;
    let active = true;
    fetchTournamentChalkmen(selectedGame.gameId)
      .then(list => {
        if (!active || !list.length) return;
        setChalkmen(list);
        setSelectedChalkman(prev => prev ?? list[0]);
      })
      .catch(() => {});
    return () => { active = false; };
  }, [entryMethod, selectedGame]);

  useEffect(() => {
    // Move the stepper forward as the required fields get filled in.
    const prizeNum = parseInt(prize || '0', 10) || 0;
    const hasGame = !!selectedGame?.gameId;
    const complete = hasGame && !!name.trim() && prizeNum > 0 && participants > 0;
    const next = complete ? 3 : hasGame ? 2 : 1;
    setStep(prev => (prev === next ? prev : next));
  }, [name, participants, prize, selectedGame]);

  const handleStartDateChange = (event: any, selected?: Date) => {
    if (Platform.OS === 'android') {
      // Date picked — hide the date picker and open the time picker next.
      setShowStartPicker(false);
      if (selected) {
        const next = new Date(tempStartDate);
        next.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate());
        setTempStartDate(next);
        setShowStartTimePicker(true);
      }
    } else {
      // iOS supports the combined datetime mode in a single picker.
      if (selected) setStartDate(selected.toISOString());
    }
  };

  const handleStartTimeChange = (event: any, selected?: Date) => {
    if (Platform.OS === 'android') {
      setShowStartTimePicker(false);
    }
    if (selected) {
      const next = new Date(tempStartDate);
      next.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
      setStartDate(next.toISOString());
    }
  };

  const openStartPicker = () => {
    setTempStartDate(new Date(startDate));
    if (Platform.OS === 'android') {
      setShowStartPicker(true);
    } else {
      setShowStartPicker(true);
    }
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error('Please enter a tournament name');
      return;
    }
    if (!selectedGame?.gameId) {
      toast.error('Please select a game');
      return;
    }
    if (!prize || parseInt(prize) <= 0) {
      toast.error('Please enter a valid prize pool');
      return;
    }
    if (locationType === 'local' && !selectedShop) {
      toast.error('Please select a game shop');
      return;
    }
    if (entryMethod === 'escrow' && !selectedChalkman) {
      toast.error('Please select a chalkman to hold the pot');
      return;
    }

    setCreating(true);
    try {
      const entry = entryMethod === 'free' ? 0 : parseInt(entryAmount || '0', 10) || 0;
      const body = {
        name: name.trim(),
        gameId: selectedGame.gameId,
        startDate,
        endDate,
        prizePool: parseInt(prize) || 0,
        entryFee: entry,
        maxParticipants: participants,
        tournamentType: type,
        locationType,
        location: locationType,
        description: description.trim(),
        entryMethod,
        ...(locationType === 'local' && selectedShop ? { shopId: selectedShop.id } : {}),
        ...(entryMethod === 'escrow' && selectedChalkman ? { chalkmanId: selectedChalkman.id } : {}),
        stake: {
          amount: entry,
          currency: 'USD',
          method: entryMethod,
          secured: entryMethod === 'free',
          ...(entryMethod === 'escrow' && selectedChalkman ? { escrowId: selectedChalkman.id } : {}),
        },
      };
      await createTournament(body as any);
      toast.success('Tournament created successfully!');
      navigation.goBack();
    } catch (e: any) {
      toast.error(describeApiError(e, 'Failed to create tournament'));
    } finally {
      setCreating(false);
    }
  };

  const cycleParticipants = () => {
    const idx = PARTICIPANT_OPTIONS.indexOf(participants);
    setParticipants(PARTICIPANT_OPTIONS[(idx + 1) % PARTICIPANT_OPTIONS.length]);
  };

  const displayStartDate = new Date(startDate).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  const stringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 60%, 70%)`;
    return color;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={true}>
      <View style={styles.stepperRow}>
        {[
          { id: 1, label: 'GAME SELECT' },
          { id: 2, label: 'SETTINGS' },
          { id: 3, label: 'CONFIRM' },
        ].map((s, i) => {
          const active = step >= s.id;
          return (
            <React.Fragment key={s.id}>
              {i > 0 && <View style={[styles.stepConnector, step >= s.id && styles.stepConnectorActive]} />}
              <TouchableOpacity style={styles.step} onPress={() => setStep(s.id)} activeOpacity={0.8}>
                <View style={[styles.stepCircle, active && styles.stepCircleActive]}>
                  <Text style={[styles.stepNumber, active && styles.stepNumberActive]}>{s.id}</Text>
                </View>
                <Text style={[styles.stepLabel, active && styles.stepLabelActive]}>{s.label}</Text>
              </TouchableOpacity>
            </React.Fragment>
          );
        })}
      </View>

      <Text style={styles.sectionLabel}>SELECT GAME</Text>
      <View style={styles.gameGrid}>
        {games.map(g => {
          const active = g.id === selectedGame.id;
          const hasImage = !!g.image;
          const bgColor = stringToColor(g.id || g.name || '');
          return (
            <TouchableOpacity
              key={g.id}
              style={[styles.gameCard, active && styles.gameCardSelected]}
              onPress={() => setSelectedGame(g)}
              activeOpacity={0.9}
            >
              {hasImage ? (
                <Image source={g.image} style={styles.gameCardImage} resizeMode="cover" />
              ) : (
                <View style={[styles.gameCardImage, { backgroundColor: bgColor }]} />
              )}
              <View style={styles.gameCardOverlay}>
                <Text style={styles.gameCardName} numberOfLines={1}>{g.name}</Text>
              </View>
              <View style={[styles.gameCheck, active && styles.gameCheckActive]}>
                {active && <Ionicons name="checkmark" size={13} color="#fff" />}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.formSection}>
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>TOURNAMENT NAME</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="trophy-outline" size={15} color={theme.primary} />
            <TextInput style={styles.input} value={name} onChangeText={t => setName(t.slice(0, NAME_MAX))} placeholder="Tournament name" placeholderTextColor={theme.subText} />
          </View>
          <Text style={styles.charCount}>{name.length}/{NAME_MAX}</Text>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>DESCRIPTION</Text>
          <View style={[styles.inputWrapper, styles.inputMultiline]}>
            <Ionicons name="document-text-outline" size={15} color={theme.primary} style={{ marginTop: 9 }} />
            <TextInput style={[styles.input, styles.inputMultilineText]} value={description} onChangeText={t => setDescription(t.slice(0, DESC_MAX))} placeholder="Describe your tournament" placeholderTextColor={theme.subText} multiline />
          </View>
          <Text style={styles.charCount}>{description.length}/{DESC_MAX}</Text>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>TOURNAMENT TYPE</Text>
          <View style={styles.typeRow}>
            {TYPES.map(t => {
              const active = type === t.id;
              return (
                <TouchableOpacity key={t.id} style={[styles.typeCard, active && styles.typeCardActive]} onPress={() => setType(t.id)} activeOpacity={0.85}>
                  <Ionicons name={t.icon} size={20} color={active ? theme.primary : theme.subText} />
                  <Text style={[styles.typeLabel, active && styles.typeLabelActive]}>{t.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>HOSTING LOCATION</Text>
          <View style={styles.typeRow}>
            {LOCATIONS.map(loc => {
              const active = locationType === loc.id;
              return (
                <TouchableOpacity key={loc.id} style={[styles.typeCard, active && styles.typeCardActive]} onPress={() => setLocationType(loc.id as 'online' | 'local')} activeOpacity={0.85}>
                  <Ionicons name={loc.icon} size={20} color={active ? theme.primary : theme.subText} />
                  <Text style={[styles.typeLabel, active && styles.typeLabelActive]}>{loc.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>PRIZE POOL</Text>
          <View style={styles.inputWrapper}>
            <Text style={{ color: theme.success, fontWeight: 'bold', fontSize: 14 }}>$</Text>
            <TextInput style={styles.input} value={prize} onChangeText={t => setPrize(t.replace(/[^0-9]/g, ''))} keyboardType="number-pad" placeholder="0" placeholderTextColor={theme.subText} />
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>ENTRY / WAGER</Text>
          <View style={styles.entryMethodRow}>
            {ENTRY_METHODS.map(em => {
              const active = entryMethod === em.id;
              return (
                <TouchableOpacity
                  key={em.id}
                  style={[styles.entryMethodCard, active && styles.entryMethodCardActive]}
                  onPress={() => setEntryMethod(em.id)}
                  activeOpacity={0.85}
                >
                  <Ionicons name={em.icon} size={18} color={active ? theme.info : theme.subText} />
                  <Text style={[styles.entryMethodLabel, active && styles.entryMethodLabelActive]}>{em.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {entryMethod !== 'free' && (
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>ENTRY AMOUNT</Text>
            <View style={styles.inputWrapper}>
              <Text style={{ color: theme.success, fontWeight: 'bold', fontSize: 14 }}>$</Text>
              <TextInput style={styles.input} value={entryAmount} onChangeText={t => setEntryAmount(t.replace(/[^0-9]/g, ''))} keyboardType="number-pad" placeholder="0" placeholderTextColor={theme.subText} />
            </View>
          </View>
        )}

        {locationType === 'local' && (
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>SELECT GAME SHOP</Text>
            {shops.length > 0 ? shops.map(shop => {
              const active = selectedShop?.id === shop.id;
              return (
                <TouchableOpacity
                  key={shop.id}
                  style={[styles.shopRow, active && styles.shopRowActive]}
                  onPress={() => setSelectedShop(shop)}
                  activeOpacity={0.85}
                >
                  <View style={styles.shopIcon}>
                    <Ionicons name="storefront-outline" size={16} color={theme.primary} />
                  </View>
                  <View style={styles.shopInfo}>
                    <Text style={styles.shopName}>{shop.name}</Text>
                    <Text style={styles.shopAddress}>
                      {shop.address ?? 'On site'}{shop.chalkmanName ? ` • ${shop.chalkmanName} on duty` : ''}
                    </Text>
                  </View>
                  <Ionicons name={active ? 'checkmark-circle' : 'ellipse-outline'} size={20} color={active ? theme.primary : theme.subText} />
                </TouchableOpacity>
              );
            }) : (
              <Text style={styles.escrowDesc}>No shops available right now.</Text>
            )}
          </View>
        )}

        {entryMethod === 'escrow' && (
          <View style={styles.escrowCard}>
            <View style={styles.escrowTitleRow}>
              <Ionicons name="shield-checkmark-outline" size={14} color={theme.warning} />
              <Text style={styles.escrowTitle}>CHALKMAN ESCROW</Text>
            </View>
            <Text style={styles.escrowDesc}>
              The shop attendant (chalkman) holds the ${entryAmount || '0'} entry pot until the tournament is settled.
            </Text>
            {chalkmen.length > 0 ? chalkmen.map(cm => {
              const active = selectedChalkman?.id === cm.id;
              return (
                <TouchableOpacity key={cm.id} style={styles.selectRow} onPress={() => setSelectedChalkman(cm)} activeOpacity={0.8}>
                  <Image
                    source={cm.avatar ? { uri: String(cm.avatar) } : require('../../assets/avatar.jpg')}
                    style={styles.selectAvatar}
                  />
                  <View style={styles.selectInfo}>
                    <Text style={styles.selectName}>{cm.username}</Text>
                    <Text style={styles.selectStatus}>{active ? 'Selected • Ready to hold' : 'Available'}</Text>
                  </View>
                  <Ionicons name={active ? 'checkmark-circle' : 'ellipse-outline'} size={20} color={active ? theme.primary : theme.subText} />
                </TouchableOpacity>
              );
            }) : (
              <Text style={[styles.escrowDesc, { marginTop: 6 }]}>No chalkman available. Try again later.</Text>
            )}
          </View>
        )}

        <View style={[styles.halfRow, styles.fieldGroup]}>
          <View style={styles.half}>
              <Text style={styles.fieldLabel}>MAX PARTICIPANTS</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="people-outline" size={15} color={theme.primary} />
                <TextInput
                  style={styles.input}
                  value={String(participants)}
                  onChangeText={t => {
                    const n = parseInt(t.replace(/[^0-9]/g, ''), 10);
                    setParticipants(Number.isNaN(n) ? 0 : n);
                  }}
                  keyboardType="number-pad"
                  placeholder="0"
                  placeholderTextColor={theme.subText}
                />
              </View>
            </View>
          <View style={styles.half}>
            <Text style={styles.fieldLabel}>START DATE & TIME</Text>
            <TouchableOpacity style={styles.valueField} activeOpacity={0.8} onPress={openStartPicker}>
              <Ionicons name="calendar-outline" size={15} color={theme.primary} />
              <Text style={styles.dateText} numberOfLines={1}>{displayStartDate}</Text>
            </TouchableOpacity>

            {/* Android: pick date first, then time. iOS: combined datetime mode. */}
            {showStartPicker && (
              <DateTimePicker
                value={tempStartDate}
                mode={Platform.OS === 'ios' ? 'datetime' : 'date'}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleStartDateChange}
              />
            )}
            {showStartTimePicker && (
              <DateTimePicker
                value={tempStartDate}
                mode="time"
                display="default"
                onChange={handleStartTimeChange}
              />
            )}
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.createBtn} onPress={handleCreate} activeOpacity={0.9} disabled={creating}>
        {creating ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons name="trophy" size={20} color="#fff" />
            <Text style={styles.createBtnText}>CREATE TOURNAMENT</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const HeaderLeft = () => {
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

const HeaderRight = () => {
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

const CreateTournament = () => {
  const theme = useTheme() as AppTheme;
  const headerOpts = getHeaderOptions(theme);

  return (
    <Stack.Navigator
      screenOptions={{
        ...headerOpts,
        headerShown: true,
        headerTitle: 'Create Tournament',
        headerTitleAlign: 'center',
        headerLeft: () => <HeaderLeft />,
        headerRight: () => <HeaderRight />,
      }}
    >
      <Stack.Screen name="CreateTournamentMain" component={CreateTournamentContent} />
    </Stack.Navigator>
  );
};

export default CreateTournament;
