import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@emotion/react';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { AppTheme } from '../../theme';
import { createStyles } from './InstantMatchScreen.styles';
import AppLogo from '../../components/AppLogo';
import { useInstantMatchSetup } from './instantMatch/useInstantMatchSetup';
import SectionHeader from './instantMatch/components/SectionHeader';
import SetupHero from './instantMatch/components/SetupHero';
import GamePicker from './instantMatch/components/GamePicker';
import LocationPicker from './instantMatch/components/LocationPicker';
import MatchSetup from './instantMatch/components/MatchSetup';
import WagerPicker from './instantMatch/components/WagerPicker';
import OpponentsPicker from './instantMatch/components/OpponentsPicker';
import NotificationToggle from './instantMatch/components/NotificationToggle';
import MatchSummary from './instantMatch/components/MatchSummary';

const Stack = createStackNavigator();

// ── Content ────────────────────────────────────────────────────────

const InstantMatchContent = () => {
  const theme = useTheme() as AppTheme;
  const styles = createStyles(theme);
  const setup = useInstantMatchSetup();

  const heroSummary = [
    setup.selectedGame.name,
    setup.matchMode === 'party' ? `${setup.playerCount} players` : '1v1',
    setup.seriesLabel,
    setup.location === 'shop'
      ? setup.selectedShop?.name ?? 'In shop'
      : 'Online',
    setup.wagerMethod === 'none' ? 'No wager' : `$${setup.stakeAmount}`,
  ].join('  •  ');

  const isOpenMatch = setup.selectedPlayers.length === 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <SetupHero summary={heroSummary} />

      {/* ── 1. Game ── */}
      <SectionHeader
        step={1}
        icon="game-controller-outline"
        title="SELECT GAME"
        hint={`${setup.selectedGame.maxPlayers} PLAYERS MAX`}
      />
      <GamePicker
        games={setup.games}
        selectedGameId={setup.selectedGame.id}
        onSelect={setup.selectGame}
      />

      {/* ── 2. Where ── */}
      <SectionHeader
        step={2}
        icon="location-outline"
        title="WHERE ARE YOU PLAYING"
        hint={setup.location === 'shop' ? 'IN SHOP' : 'ONLINE'}
        accent={theme.success}
      />
      <LocationPicker
        location={setup.location}
        onChangeLocation={setup.changeLocation}
        shops={setup.shops}
        shopsLoading={setup.shopsLoading}
        selectedShopId={setup.selectedShop?.id ?? null}
        onSelectShop={setup.selectShop}
      />

      {/* ── 3. Match setup ── */}
      <SectionHeader
        step={3}
        icon="git-compare-outline"
        title="MATCH SETUP"
        hint={setup.matchMode === 'party' ? `${setup.playerCount} PLAYERS` : '1V1'}
      />
      <MatchSetup
        matchMode={setup.matchMode}
        onSelectMode={setup.selectMode}
        seriesFormat={setup.seriesFormat}
        onSelectSeries={setup.setSeriesFormat}
        playerCount={setup.playerCount}
        maxPlayers={setup.maxPlayers}
        onIncrementPlayers={setup.incrementPlayers}
        onDecrementPlayers={setup.decrementPlayers}
      />

      {/* ── 4. Wager ── */}
      <SectionHeader
        step={4}
        icon="cash-outline"
        title="WAGER"
        hint={setup.wagerMethod === 'none' ? 'OPTIONAL' : `$${setup.stakeAmount}`}
        accent={theme.warning}
      />
      <WagerPicker
        method={setup.wagerMethod}
        onSelectMethod={setup.changeWagerMethod}
        amount={setup.stakeAmount}
        onChangeAmount={setup.setStakeAmount}
        currency={setup.currency}
        wallet={setup.wallet}
        chalkmen={setup.chalkmen}
        selectedChalkman={setup.selectedChalkman}
        onSelectChalkman={setup.selectChalkman}
        seriesLabel={setup.seriesLabel}
      />

      {/* ── 5. Opponents ── */}
      <SectionHeader
        step={5}
        icon="people-outline"
        title="OPPONENTS"
        hint={`${setup.selectedPlayers.length}/${setup.maxOpponents} ADDED`}
        accent={theme.info}
      />
      <OpponentsPicker
        inviteCode={setup.inviteCode}
        onChangeInviteCode={setup.setInviteCode}
        onApplyInviteCode={setup.applyInviteCode}
        applyingCode={setup.applyingCode}
        nearbyPlayers={setup.nearbyPlayers}
        nearbyLoading={setup.nearbyLoading}
        onRetryNearby={setup.loadNearby}
        selectedPlayers={setup.selectedPlayers}
        onTogglePlayer={setup.togglePlayer}
        onRemovePlayer={setup.removePlayer}
        maxOpponents={setup.maxOpponents}
        inShop={setup.location === 'shop'}
      />

      <NotificationToggle
        enabled={setup.notificationsEnabled}
        onChange={setup.setNotificationsEnabled}
      />

      {/* ── Start ── */}
      <TouchableOpacity
        style={[styles.startBtn, !setup.canStart && styles.startBtnDisabled]}
        onPress={setup.startMatch}
        activeOpacity={0.9}
        disabled={!setup.canStart || setup.creating}
      >
        {setup.creating ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons name="flash" size={20} color="#fff" />
            <Text style={styles.startBtnText}>
              {isOpenMatch ? 'START OPEN MATCH' : 'START INSTANT MATCH'}
            </Text>
          </>
        )}
      </TouchableOpacity>
      <Text style={styles.startHint}>{setup.startHint}</Text>

      {/* ── Created match ── */}
      {setup.createdMatch && (
        <MatchSummary
          match={setup.createdMatch}
          shopName={setup.selectedShop?.name}
          rematching={setup.rematching}
          onRematch={setup.rematch}
          onDismiss={setup.dismissSummary}
        />
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
        <Ionicons name="chevron-back" size={22} color={theme.text} />
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
        <Ionicons name="notifications-outline" size={20} color={theme.text} />
      </TouchableOpacity>
      <Image source={require('../../assets/avatar.jpg')} style={styles.headerAvatar} />
    </View>
  );
};

// ── Stack navigator ────────────────────────────────────────────────

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
      <Stack.Screen name="InstantMatchSetup" component={InstantMatchContent} />
    </Stack.Navigator>
  );
};

export default InstantMatchScreen;
