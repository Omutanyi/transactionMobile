import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useTheme } from '@emotion/react';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { AppTheme } from '../../theme';
import { createStyles, getHeaderOptions } from './CreateTournament.styles';
import AppLogo from '../../components/AppLogo';
import { fetchGames } from '../../services/games';

const Stack = createStackNavigator();

type IconName = React.ComponentProps<typeof Ionicons>['name'];

// ── Static data ────────────────────────────────────────────────────

const FALLBACK_GAMES = [
  { id: 'valorant', name: 'Valorant', image: require('../../assets/avatar.jpg') },
  // { id: 'fifa', name: 'FIFA 24', image: require('../../assets/profile.jpg') },
  // { id: 'cod', name: 'Call of Duty', image: require('../../assets/gaming.jpg') },
  // { id: 'rocket', name: 'Rocket League', image: require('../../assets/icon.png') },
  // { id: 'chess', name: 'Chess', image: require('../../assets/ic_launcher.png') },
  // { id: 'pubg', name: 'PUBG Mobile', image: require('../../assets/gaming.jpg') },
];

const FALLBACK_IMAGES = FALLBACK_GAMES.map(g => g.image);

const STEPS = [
  { id: 1, label: 'GAME SELECT' },
  { id: 2, label: 'SETTINGS' },
  { id: 3, label: 'CONFIRM' },
];

const TYPES: { id: string; label: string; icon: IconName }[] = [
  { id: 'single', label: 'SINGLE\nELIMINATION', icon: 'git-branch-outline' },
  { id: 'double', label: 'DOUBLE\nELIMINATION', icon: 'git-network-outline' },
  { id: 'round', label: 'ROUND\nROBIN', icon: 'sync-outline' },
];

const PARTICIPANT_OPTIONS = [8, 16, 32, 64, 128];

const NAME_MAX = 50;
const DESC_MAX = 300;

// ── Content screen ─────────────────────────────────────────────────

const CreateTournamentContent = () => {
  const theme = useTheme() as AppTheme;
  const styles = createStyles(theme);

  const [step, setStep] = useState(1);
  const [selectedGame, setSelectedGame] = useState('valorant');
  const [name, setName] = useState('Legends Arena Cup');
  const [description, setDescription] = useState(
    'Compete against the best and prove you are the ultimate champion!'
  );
  const [type, setType] = useState('single');
  const [prize, setPrize] = useState('1000');
  const [entryFee, setEntryFee] = useState<'free' | 'premium'>('premium');
  const [participants, setParticipants] = useState(16);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [games, setGames] = useState(FALLBACK_GAMES);

  useEffect(() => {
    let active = true;
    fetchGames(FALLBACK_IMAGES)
      .then(list => {
        if (!active || !list.length) return;
        setGames(list);
        setSelectedGame(prev => (list.some(g => g.id === prev) ? prev : list[0].id));
      })
      .catch(() => { /* keep fallback games */ });
    return () => { active = false; };
  }, []);

  const gameName = games.find(g => g.id === selectedGame)?.name ?? '';
  const typeLabel = TYPES.find(t => t.id === type)?.label.replace('\n', ' ') ?? '';
  const startDate = 'Jun 15, 2025 06:00 PM';

  const cycleParticipants = () => {
    const idx = PARTICIPANT_OPTIONS.indexOf(participants);
    setParticipants(PARTICIPANT_OPTIONS[(idx + 1) % PARTICIPANT_OPTIONS.length]);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Step indicator ── */}
      <View style={styles.stepperRow}>
        {STEPS.map((s, i) => {
          const active = step >= s.id;
          return (
            <React.Fragment key={s.id}>
              {i > 0 && (
                <View style={[styles.stepConnector, step >= s.id && styles.stepConnectorActive]} />
              )}
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

      {/* ── Select Game ── */}
      <Text style={styles.sectionLabel}>SELECT GAME</Text>
      <View style={styles.gameGrid}>
        {games.map(g => {
          const active = g.id === selectedGame;
          return (
            <TouchableOpacity
              key={g.id}
              style={[styles.gameCard, active && styles.gameCardSelected]}
              onPress={() => setSelectedGame(g.id)}
              activeOpacity={0.9}
            >
              <Image source={g.image} style={styles.gameCardImage} resizeMode="cover" />
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

      {/* ── Settings form (full width) ── */}
      <View style={styles.formSection}>
        {/* Name */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>TOURNAMENT NAME</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="trophy-outline" size={15} color={theme.info} />
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={t => setName(t.slice(0, NAME_MAX))}
              placeholder="Tournament name"
              placeholderTextColor={theme.subText}
            />
          </View>
          <Text style={styles.charCount}>{name.length}/{NAME_MAX}</Text>
        </View>

        {/* Description */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>DESCRIPTION</Text>
          <View style={[styles.inputWrapper, styles.inputMultiline]}>
            <Ionicons name="document-text-outline" size={15} color={theme.info} style={{ marginTop: 9 }} />
            <TextInput
              style={[styles.input, styles.inputMultilineText]}
              value={description}
              onChangeText={t => setDescription(t.slice(0, DESC_MAX))}
              placeholder="Describe your tournament"
              placeholderTextColor={theme.subText}
              multiline
            />
          </View>
          <Text style={styles.charCount}>{description.length}/{DESC_MAX}</Text>
        </View>

        {/* Type */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>TOURNAMENT TYPE</Text>
          <View style={styles.typeRow}>
            {TYPES.map(t => {
              const active = type === t.id;
              return (
                <TouchableOpacity
                  key={t.id}
                  style={[styles.typeCard, active && styles.typeCardActive]}
                  onPress={() => setType(t.id)}
                  activeOpacity={0.85}
                >
                  <Ionicons name={t.icon} size={20} color={active ? theme.info : theme.subText} />
                  <Text style={[styles.typeLabel, active && styles.typeLabelActive]}>{t.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Prize + Entry fee */}
        <View style={[styles.halfRow, styles.fieldGroup]}>
          <View style={styles.half}>
            <Text style={styles.fieldLabel}>PRIZE POOL</Text>
            <View style={styles.inputWrapper}>
              <Text style={{ color: theme.success, fontWeight: 'bold', fontSize: 14 }}>$</Text>
              <TextInput
                style={styles.input}
                value={prize}
                onChangeText={t => setPrize(t.replace(/[^0-9]/g, ''))}
                keyboardType="number-pad"
                placeholder="0"
                placeholderTextColor={theme.subText}
              />
            </View>
          </View>
          <View style={styles.half}>
            <Text style={styles.fieldLabel}>ENTRY FEE</Text>
            <View style={styles.entryToggle}>
              <TouchableOpacity
                style={[styles.entrySeg, entryFee === 'free' && styles.entrySegActive]}
                onPress={() => setEntryFee('free')}
                activeOpacity={0.85}
              >
                <Text style={[styles.entrySegText, entryFee === 'free' && styles.entrySegTextActive]}>FREE</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.entrySeg, entryFee === 'premium' && styles.entrySegActive]}
                onPress={() => setEntryFee('premium')}
                activeOpacity={0.85}
              >
                <Text style={[styles.entrySegText, entryFee === 'premium' && styles.entrySegTextActive]}>PREMIUM</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Max participants + Start date */}
        <View style={[styles.halfRow, styles.fieldGroup]}>
          <View style={styles.half}>
            <Text style={styles.fieldLabel}>MAX PARTICIPANTS</Text>
            <TouchableOpacity style={styles.valueField} onPress={cycleParticipants} activeOpacity={0.8}>
              <Ionicons name="people-outline" size={15} color={theme.info} />
              <Text style={styles.valueText}>{participants}</Text>
              <Ionicons name="chevron-down" size={14} color={theme.subText} />
            </TouchableOpacity>
          </View>
          <View style={styles.half}>
            <Text style={styles.fieldLabel}>START DATE & TIME</Text>
            <TouchableOpacity style={styles.valueField} activeOpacity={0.8}>
              <Ionicons name="calendar-outline" size={15} color={theme.info} />
              <Text style={styles.dateText} numberOfLines={1}>{startDate}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ── Tournament Preview (collapsible) ── */}
      <TouchableOpacity
        style={styles.rulesCard}
        onPress={() => setPreviewOpen(o => !o)}
        activeOpacity={0.85}
      >
        <View style={styles.rulesIconWrap}>
          <Ionicons name="eye-outline" size={18} color={theme.info} />
        </View>
        <View style={styles.rulesTextWrap}>
          <Text style={styles.rulesTitle}>Tournament Preview</Text>
          <Text style={styles.rulesSub}>See how your tournament will appear to players</Text>
        </View>
        <Ionicons name={previewOpen ? 'chevron-up' : 'chevron-down'} size={18} color={theme.subText} />
      </TouchableOpacity>

      {previewOpen && (
        <View style={styles.previewExpand}>
          <View style={styles.previewCard}>
            <Text style={styles.previewHeaderLabel}>TOURNAMENT PREVIEW</Text>
            <View style={styles.previewTrophyWrap}>
              <Ionicons name="trophy" size={28} color={theme.info} />
            </View>
            <Text style={styles.previewTitle} numberOfLines={2}>
              {(name || 'Tournament Name').toUpperCase()}
            </Text>

            <View style={styles.previewRow}>
              <View style={styles.previewRowIcon}>
                <Ionicons name="game-controller-outline" size={13} color={theme.info} />
              </View>
              <Text style={styles.previewLabel}>Game</Text>
              <Text style={[styles.previewValue, styles.previewValueAccent]}>{gameName}</Text>
            </View>
            <View style={styles.previewRow}>
              <View style={styles.previewRowIcon}>
                <Ionicons name="git-branch-outline" size={13} color={theme.info} />
              </View>
              <Text style={styles.previewLabel}>Type</Text>
              <Text style={styles.previewValue}>{typeLabel}</Text>
            </View>
            <View style={styles.previewRow}>
              <View style={styles.previewRowIcon}>
                <Ionicons name="cash-outline" size={13} color={theme.info} />
              </View>
              <Text style={styles.previewLabel}>Prize Pool</Text>
              <Text style={[styles.previewValue, { color: theme.success }]}>${prize || '0'}</Text>
            </View>
            <View style={styles.previewRow}>
              <View style={styles.previewRowIcon}>
                <Ionicons name="card-outline" size={13} color={theme.info} />
              </View>
              <Text style={styles.previewLabel}>Entry Fee</Text>
              <Text style={styles.previewValue}>{entryFee === 'free' ? 'Free' : 'Premium'}</Text>
            </View>
            <View style={styles.previewRow}>
              <View style={styles.previewRowIcon}>
                <Ionicons name="people-outline" size={13} color={theme.info} />
              </View>
              <Text style={styles.previewLabel}>Max Participants</Text>
              <Text style={styles.previewValue}>{participants}</Text>
            </View>
            <View style={styles.previewRow}>
              <View style={styles.previewRowIcon}>
                <Ionicons name="calendar-outline" size={13} color={theme.info} />
              </View>
              <Text style={styles.previewLabel}>Start Date</Text>
              <Text style={styles.previewValue}>{startDate}</Text>
            </View>

            <View style={styles.previewDivider} />
            <Text style={styles.previewDescLabel}>DESCRIPTION</Text>
            <Text style={styles.previewDesc}>{description}</Text>
          </View>
        </View>
      )}

      {/* ── Tournament Rules ── */}
      <TouchableOpacity
        style={styles.rulesCard}
        onPress={() => setRulesOpen(o => !o)}
        activeOpacity={0.85}
      >
        <View style={styles.rulesIconWrap}>
          <Ionicons name="settings-outline" size={18} color={theme.info} />
        </View>
        <View style={styles.rulesTextWrap}>
          <Text style={styles.rulesTitle}>Tournament Rules</Text>
          <Text style={styles.rulesSub}>Set match rules, map selection, scoring system and more</Text>
        </View>
        <Ionicons name={rulesOpen ? 'chevron-up' : 'chevron-down'} size={18} color={theme.subText} />
      </TouchableOpacity>

      {rulesOpen && (
        <View style={styles.rulesExpand}>
          {['Match format & best-of', 'Map / stage selection', 'Scoring system', 'Check-in & seeding'].map(r => (
            <TouchableOpacity key={r} style={styles.ruleItem} activeOpacity={0.8}>
              <Ionicons name="ellipse-outline" size={14} color={theme.info} />
              <Text style={styles.ruleItemText}>{r}</Text>
              <Ionicons name="chevron-forward" size={14} color={theme.subText} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* ── Create button ── */}
      <TouchableOpacity style={styles.createBtn} activeOpacity={0.9}>
        <Ionicons name="trophy" size={20} color="#fff" />
        <Text style={styles.createBtnText}>CREATE TOURNAMENT</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// ── Header ─────────────────────────────────────────────────────────

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

// ── Stack Navigator ────────────────────────────────────────────────

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
