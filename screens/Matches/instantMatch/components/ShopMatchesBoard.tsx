import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '@emotion/react';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme } from '../../../../theme';
import { createStyles } from '../../InstantMatchScreen.styles';
import { ShopMatchSummary } from '../../../../types';
import { formatMoney, getSeriesLabel } from '../constants';

interface Props {
  /** Every match the backend reports for this shop. */
  matches: ShopMatchSummary[];
  loading: boolean;
  refreshing: boolean;
  /** Set when the live endpoint could not be read. */
  error?: string | null;
  /** Epoch ms of the last successful refresh — drives "updated 3s ago". */
  lastUpdated: number | null;
  onRefresh: () => void;
  /** Jump into an open match. */
  onJoin: (match: ShopMatchSummary) => void;
  /** Id of the match currently being joined, to show a spinner on that row. */
  joiningId?: string | null;
  /** Ids of matches the caller is already part of. */
  myMatchIds?: string[];
}

const AGE_TICK_MS = 5000;

const STATUS_LABELS: Record<ShopMatchSummary['status'], string> = {
  pending: 'WAITING',
  active: 'PLAYING',
  completed: 'FINISHED',
  cancelled: 'CANCELLED',
};

const describeAge = (lastUpdated: number | null, now: number): string => {
  if (!lastUpdated) return 'waiting for first update';
  const seconds = Math.max(0, Math.round((now - lastUpdated) / 1000));
  if (seconds < 3) return 'updated just now';
  if (seconds < 60) return `updated ${seconds}s ago`;
  return `updated ${Math.round(seconds / 60)}m ago`;
};

/**
 * Live board of every match in the shop. `useShopLiveMatches` polls it, so
 * players see games start, scores move and slots open without pulling to
 * refresh.
 */
const ShopMatchesBoard: React.FC<Props> = ({
  matches,
  loading,
  refreshing,
  error,
  lastUpdated,
  onRefresh,
  onJoin,
  joiningId,
  myMatchIds = [],
}) => {
  const theme = useTheme() as AppTheme;
  const styles = createStyles(theme);
  const [now, setNow] = useState(() => Date.now());

  // Keep the "updated Xs ago" label honest without re-rendering every second.
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), AGE_TICK_MS);
    return () => clearInterval(timer);
  }, []);

  const activeCount = matches.filter(match => match.status === 'active').length;
  const hasLive = activeCount > 0;

  const renderPlayers = (match: ShopMatchSummary): string => {
    if (match.players.length) {
      return match.players.map(player => player.username).join(' vs ');
    }
    if (match.playerCount > 0) {
      return `${match.playerCount} player${match.playerCount === 1 ? '' : 's'}`;
    }
    return 'Waiting for players';
  };

  return (
    <View style={styles.liveCard}>
      <View style={styles.liveHeader}>
        <View
          style={[
            styles.liveDot,
            { backgroundColor: hasLive ? theme.success : theme.subText },
          ]}
        />
        <Text style={styles.liveTitle}>LIVE IN THIS SHOP</Text>
        <View style={styles.inviteCardSpacer} />
        <TouchableOpacity onPress={onRefresh} activeOpacity={0.8} disabled={refreshing}>
          {refreshing ? (
            <ActivityIndicator size="small" color={theme.primary} />
          ) : (
            <Ionicons name="refresh-outline" size={16} color={theme.primary} />
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.liveMeta}>
        {matches.length} {matches.length === 1 ? 'match' : 'matches'} • {activeCount} playing
        {' • '}
        {describeAge(lastUpdated, now)}
      </Text>

      {loading ? (
        <View style={styles.liveLoading}>
          <ActivityIndicator size="small" color={theme.primary} />
          <Text style={styles.liveLoadingText}>Loading the shop board…</Text>
        </View>
      ) : error ? (
        <View style={styles.emptyBox}>
          <Ionicons name="cloud-offline-outline" size={16} color={theme.warning} />
          <Text style={styles.emptyText}>{error}</Text>
          <TouchableOpacity onPress={onRefresh} activeOpacity={0.8}>
            <Text style={[styles.emptyAction, { color: theme.primary }]}>RETRY</Text>
          </TouchableOpacity>
        </View>
      ) : matches.length === 0 ? (
        <View style={styles.emptyBox}>
          <Ionicons name="game-controller-outline" size={16} color={theme.subText} />
          <Text style={styles.emptyText}>
            Nothing is running here yet. Start the first match and everyone in this
            shop will see it on the board.
          </Text>
        </View>
      ) : (
        matches.map(match => {
          const mine = myMatchIds.includes(match.id);
          const statusColor =
            match.status === 'active'
              ? theme.success
              : match.status === 'pending'
                ? theme.warning
                : theme.subText;
          const wager =
            match.stakeAmount > 0 ? formatMoney(match.stakeAmount, match.currency) : 'No wager';

          return (
            <View key={match.id} style={styles.liveMatchRow}>
              <View style={styles.liveMatchTop}>
                <Text style={styles.liveMatchGame} numberOfLines={1}>
                  {match.gameName}
                </Text>
                <View style={[styles.liveBadge, { borderColor: statusColor }]}>
                  <Text style={[styles.liveBadgeText, { color: statusColor }]}>
                    {STATUS_LABELS[match.status]}
                  </Text>
                </View>
                <View style={styles.liveBadgeGhost}>
                  <Text style={styles.liveBadgeGhostText}>
                    {match.mode === 'party' ? 'PARTY' : '1V1'}
                  </Text>
                </View>
              </View>

              <Text style={styles.livePlayers} numberOfLines={1}>
                {renderPlayers(match)}
              </Text>

              <View style={styles.liveMatchBottom}>
                <View style={styles.liveFact}>
                  <Ionicons name="repeat-outline" size={12} color={theme.subText} />
                  <Text style={styles.liveFactText}>
                    {getSeriesLabel(match.seriesFormat)}
                    {match.status === 'active'
                      ? ` ${match.currentWinsA}-${match.currentWinsB}`
                      : ''}
                  </Text>
                </View>
                <View style={styles.liveFact}>
                  <Ionicons name="cash-outline" size={12} color={theme.subText} />
                  <Text style={styles.liveFactText}>{wager}</Text>
                </View>

                {mine ? (
                  <View style={[styles.liveJoinBtn, { backgroundColor: theme.primary + '22' }]}>
                    <Ionicons name="person" size={12} color={theme.primary} />
                    <Text style={[styles.liveJoinText, { color: theme.primary }]}>
                      YOUR MATCH
                    </Text>
                  </View>
                ) : match.isOpen ? (
                  <TouchableOpacity
                    style={[styles.liveJoinBtn, { backgroundColor: theme.success }]}
                    onPress={() => onJoin(match)}
                    activeOpacity={0.85}
                    disabled={joiningId === match.id}
                  >
                    {joiningId === match.id ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <>
                        <Ionicons name="flash" size={12} color="#fff" />
                        <Text style={styles.liveJoinText}>JOIN</Text>
                      </>
                    )}
                  </TouchableOpacity>
                ) : (
                  <View style={styles.liveJoinBtnGhost}>
                    <Text style={styles.liveJoinGhostText}>FULL</Text>
                  </View>
                )}
              </View>
            </View>
          );
        })
      )}
    </View>
  );
};

export default ShopMatchesBoard;
