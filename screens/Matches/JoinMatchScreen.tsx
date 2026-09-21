import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@emotion/react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AppTheme } from '../../theme';
import { createStyles } from './JoinMatchScreen.styles';
import { joinByInviteCode } from '../../services/match';
import { InstantMatch } from '../../types';
import { describeApiError } from '../../utils/apiErrors';
import {
  INVITE_CODE_LENGTH,
  MIN_INVITE_CODE_LENGTH,
  normalizeInviteCode,
  shareInviteCode,
} from '../../utils/inviteCode';
import { formatMoney, getSeriesLabel, getWagerLabel } from './instantMatch/constants';

/**
 * Join a match with a code — without creating one of your own.
 *
 * This is the entry point for the second player: somebody handed them a code in
 * the shop or over a messenger, and all they need to do is paste it in.
 */
const JoinMatchScreen = () => {
  const theme = useTheme() as AppTheme;
  const styles = createStyles(theme);
  const navigation = useNavigation<any>();

  const [code, setCode] = useState('');
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [joined, setJoined] = useState<InstantMatch | null>(null);

  const normalized = normalizeInviteCode(code);
  const canJoin = normalized.length >= MIN_INVITE_CODE_LENGTH && !joining;

  const handleChangeCode = useCallback((value: string) => {
    setError(null);
    setCode(normalizeInviteCode(value));
  }, []);

  const handleJoin = useCallback(async () => {
    if (!canJoin) return;
    setJoining(true);
    setError(null);
    try {
      const match = await joinByInviteCode(normalized);
      setJoined(match);
    } catch (e) {
      setError(describeApiError(e, 'No open match was found for that code.'));
    } finally {
      setJoining(false);
    }
  }, [canJoin, normalized]);

  const handleReset = useCallback(() => {
    setJoined(null);
    setCode('');
    setError(null);
  }, []);

  const handleShare = useCallback(() => {
    if (!joined?.inviteCode) return;
    void shareInviteCode({
      code: joined.inviteCode,
      gameName: joined.gameName,
      shopName: joined.shopName,
      matchId: joined.id,
    });
  }, [joined]);

  const renderJoined = (match: InstantMatch) => {
    const stake = match.stake.amount ?? 0;
    const wager =
      match.stake.method === 'none' || stake <= 0
        ? 'No wager'
        : `${formatMoney(stake, match.stake.currency)} • ${getWagerLabel(match.stake.method)}`;

    return (
      <View style={styles.resultCard}>
        <View style={styles.resultHeader}>
          <Ionicons name="checkmark-circle" size={18} color={theme.success} />
          <Text style={styles.resultTitle}>YOU ARE IN</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Game</Text>
          <Text style={styles.rowValue}>{match.gameName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Mode</Text>
          <Text style={styles.rowValue}>
            {match.mode === 'party' ? 'Party' : '1v1 Duel'}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Series</Text>
          <Text style={styles.rowValue}>
            {getSeriesLabel(match.series.format)} • first to {match.series.winsNeeded}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Wager</Text>
          <Text style={styles.rowValue}>{wager}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Where</Text>
          <Text style={styles.rowValue}>
            {match.location === 'shop'
              ? `In shop${match.shopName ? ` • ${match.shopName}` : ''}`
              : 'Online'}
          </Text>
        </View>
        {match.inviteCode ? (
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Code</Text>
            <View style={styles.codeBadge}>
              <Text style={styles.codeBadgeText}>{match.inviteCode}</Text>
            </View>
          </View>
        ) : null}

        <View style={styles.playersRow}>
          {match.players.length > 0 ? (
            match.players.map(player => (
              <View key={player.id} style={styles.playerChip}>
                <Ionicons name="person" size={11} color={theme.primary} />
                <Text style={styles.playerName}>{player.username}</Text>
              </View>
            ))
          ) : (
            <View style={styles.playerChip}>
              <Ionicons name="hourglass-outline" size={11} color={theme.subText} />
              <Text style={styles.playerName}>Waiting for the other players</Text>
            </View>
          )}
        </View>

        {match.location === 'shop' ? (
          <Text style={styles.note}>
            This match is played at{' '}
            {match.shopName ?? 'the shop hosting it'} — be there in person, and make
            sure you are checked in at that shop.
          </Text>
        ) : null}

        <View style={styles.actions}>
          <TouchableOpacity style={styles.ghostBtn} onPress={handleReset} activeOpacity={0.85}>
            <Ionicons name="refresh-outline" size={15} color={theme.primary} />
            <Text style={styles.ghostBtnText}>ANOTHER CODE</Text>
          </TouchableOpacity>
          {match.inviteCode ? (
            <TouchableOpacity style={styles.primaryBtn} onPress={handleShare} activeOpacity={0.85}>
              <Ionicons name="share-social-outline" size={15} color="#fff" />
              <Text style={styles.primaryBtnText}>SHARE</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.85}
            >
              <Ionicons name="checkmark" size={15} color="#fff" />
              <Text style={styles.primaryBtnText}>DONE</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <Ionicons name="enter-outline" size={20} color={theme.primary} />
        </View>
        <View style={styles.heroBody}>
          <Text style={styles.heroTitle}>JOIN A MATCH</Text>
          <Text style={styles.heroSub}>
            Got a code from another player? Enter it here — you do not need to set up
            a match of your own.
          </Text>
        </View>
      </View>

      <Text style={styles.label}>INVITE CODE</Text>
      <View style={styles.inputRow}>
        <View style={styles.inputWrap}>
          <Ionicons name="keypad-outline" size={18} color={theme.primary} />
          <TextInput
            style={styles.input}
            value={code}
            onChangeText={handleChangeCode}
            placeholder="ABC123XY"
            placeholderTextColor={theme.subText}
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={INVITE_CODE_LENGTH}
            returnKeyType="go"
            onSubmitEditing={handleJoin}
          />
        </View>
        <TouchableOpacity
          style={[styles.joinBtn, !canJoin && styles.joinBtnDisabled]}
          onPress={handleJoin}
          activeOpacity={0.85}
          disabled={!canJoin}
        >
          {joining ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.joinBtnText}>JOIN</Text>
          )}
        </TouchableOpacity>
      </View>
      <Text style={styles.hint}>
        Codes are 8 characters and never contain the letters I or O, so nothing is
        misread. Ask the host to re-share if yours does not work.
      </Text>

      {error ? (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle-outline" size={16} color={theme.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {joined ? renderJoined(joined) : null}
    </ScrollView>
  );
};

export default JoinMatchScreen;
