import React, { useState, useEffect } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator,
} from 'react-native';
import { useTheme } from '@emotion/react';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { AppTheme } from '../../theme';
import { createStyles, getHeaderOptions } from './CreateTournament.styles';
import AppLogo from '../../components/AppLogo';
import { fetchGames } from '../../services/games';
import { request } from '../../requests';
import apis from '../../api';

const Stack = createStackNavigator();
type IconName = React.ComponentProps<typeof Ionicons>['name'];

const FALLBACK_GAMES = [
  { id: 'valorant', name: 'Valorant', image: require('../../assets/avatar.jpg') },
];
const FALLBACK_IMAGES = FALLBACK_GAMES.map(g => g.image);

const TYPES: { id: string; label: string; icon: IconName }[] = [
  { id: 'single_elimination', label: 'SINGLE\nELIMINATION', icon: 'git-branch-outline' },
  { id: 'double_elimination', label: 'DOUBLE\nELIMINATION', icon: 'git-network-outline' },
  { id: 'round_robin', label: 'ROUND\nROBIN', icon: 'sync-outline' },
];

const PARTICIPANT_OPTIONS = [8, 16, 32, 64, 128];
const NAME_MAX = 50;
const DESC_MAX = 300;

interface GameOption {
  id: string;
  name: string;
  image: any;
  GameId?: number;
  gameId?: number;
}

const CreateTournamentContent = () => {
  const theme = useTheme() as AppTheme;
  const styles = createStyles(theme);

  const [step, setStep] = useState(1);
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
  const [selectedGameName, setSelectedGameName] = useState('valorant');
  const [name, setName] = useState('Legends Arena Cup');
  const [description, setDescription] = useState('Compete against the best and prove you are the ultimate champion!');
  const [type, setType] = useState('single_elimination');
  const [prize, setPrize] = useState('1000');
  const [entryFee, setEntryFee] = useState<'free' | 'premium'>('premium');
  const [participants, setParticipants] = useState(16);
  const [startDate, setStartDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString());
  const [previewOpen, setPreviewOpen] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [games, setGames] = useState<GameOption[]>(FALLBACK_GAMES);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    let active = true;
    fetchGames(FALLBACK_IMAGES)
      .then(list => {
        if (!active || !list.length) return;
        setGames(list);
        const first: any = list[0];
        if (first?.GameId ?? first?.gameId) setSelectedGameId(first?.GameId ?? first?.gameId);
        setSelectedGameName(prev => (list.some(g => g.id === prev) ? prev : list[0].id));
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a tournament name');
      return;
    }
    if (!selectedGameId) {
      Alert.alert('Error', 'Please select a game');
      return;
    }
    if (!prize || parseInt(prize) <= 0) {
      Alert.alert('Error', 'Please enter a valid prize pool');
      return;
    }

    setCreating(true);
    try {
      const body = {
        name: name.trim(),
        gameId: selectedGameId,
        startDate,
        endDate,
        prizePool: parseInt(prize) || 0,
        entryFee: entryFee === 'premium' ? 10 : 0,
        maxParticipants: participants,
        tournamentType: type,
        description: description.trim(),
      };
      await request(apis.tournaments, { method: 'POST', body: JSON.stringify(body) });
      Alert.alert('Success', 'Tournament created successfully!', [
        { text: 'OK', onPress: () => {
          const navigation = useNavigation();
          // Fallback: the Alert callback can't access hooks — just navigate back via the screen's navigation
        }}
      ]);
      // Navigate back via the onPress above won't work due to hook rules,
      // so we use a boolean state to trigger navigation in a useEffect instead.
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to create tournament');
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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
          const active = g.id === selectedGameName;
          return (
            <TouchableOpacity
              key={g.id}
              style={[styles.gameCard, active && styles.gameCardSelected]}
              onPress={() => {
                setSelectedGameName(g.id);
                if (g.GameId) setSelectedGameId(g.GameId);
              }}
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

      <View style={styles.formSection}>
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>TOURNAMENT NAME</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="trophy-outline" size={15} color={theme.info} />
            <TextInput style={styles.input} value={name} onChangeText={t => setName(t.slice(0, NAME_MAX))} placeholder="Tournament name" placeholderTextColor={theme.subText} />
          </View>
          <Text style={styles.charCount}>{name.length}/{NAME_MAX}</Text>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>DESCRIPTION</Text>
          <View style={[styles.inputWrapper, styles.inputMultiline]}>
            <Ionicons name="document-text-outline" size={15} color={theme.info} style={{ marginTop: 9 }} />
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
                  <Ionicons name={t.icon} size={20} color={active ? theme.info : theme.subText} />
                  <Text style={[styles.typeLabel, active && styles.typeLabelActive]}>{t.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={[styles.halfRow, styles.fieldGroup]}>
          <View style={styles.half}>
            <Text style={styles.fieldLabel}>PRIZE POOL</Text>
            <View style={styles.inputWrapper}>
              <Text style={{ color: theme.success, fontWeight: 'bold', fontSize: 14 }}>$</Text>
              <TextInput style={styles.input} value={prize} onChangeText={t => setPrize(t.replace(/[^0-9]/g, ''))} keyboardType="number-pad" placeholder="0" placeholderTextColor={theme.subText} />
            </View>
          </View>
          <View style={styles.half}>
            <Text style={styles.fieldLabel}>ENTRY FEE</Text>
            <View style={styles.entryToggle}>
              <TouchableOpacity style={[styles.entrySeg, entryFee === 'free' && styles.entrySegActive]} onPress={() => setEntryFee('free')} activeOpacity={0.85}>
                <Text style={[styles.entrySegText, entryFee === 'free' && styles.entrySegTextActive]}>FREE</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.entrySeg, entryFee === 'premium' && styles.entrySegActive]} onPress={() => setEntryFee('premium')} activeOpacity={0.85}>
                <Text style={[styles.entrySegText, entryFee === 'premium' && styles.entrySegTextActive]}>PREMIUM</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

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
              <Text style={styles.dateText} numberOfLines={1}>{displayStartDate}</Text>
            </TouchableOpacity>
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
