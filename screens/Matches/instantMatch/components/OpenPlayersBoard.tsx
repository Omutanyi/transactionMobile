import React from 'react';
import { View, Text, Image, Switch, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '@emotion/react';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme } from '../../../../theme';
import { createStyles } from '../../InstantMatchScreen.styles';
import { ShopPlayer } from '../../../../types';
import { DEFAULT_AVATAR } from '../constants';

interface Props {
  /** Players in the shop who want a game right now. */
  players: ShopPlayer[];
  loading: boolean;
  /** Message shown when the board could not be loaded at all. */
  error?: string | null;
  /** Whether the caller is broadcasting themselves as available. */
  imOpenToPlay: boolean;
  onToggleOpenToPlay: (value: boolean) => void;
  /** Ids already added to the match being set up. */
  selectedIds: string[];
  onAddPlayer: (player: ShopPlayer) => void;
  maxOpponents: number;
  onRefresh: () => void;
}

/**
 * "Open to play" board for one shop. It answers the two questions a player has
 * on walking in: is anybody here, and who wants a game with me?
 */
const OpenPlayersBoard: React.FC<Props> = ({
  players,
  loading,
  error,
  imOpenToPlay,
  onToggleOpenToPlay,
  selectedIds,
  onAddPlayer,
  maxOpponents,
  onRefresh,
}) => {
  const theme = useTheme() as AppTheme;
  const styles = createStyles(theme);
  const openPlayers = players.filter(player => player.openToPlay !== false);

  const renderMeta = (player: ShopPlayer): string => {
    const bits: string[] = [];
    if (player.waitingForGameName) bits.push(`Wants ${player.waitingForGameName}`);
    if (player.rating) bits.push(`${player.rating} RP`);
    if (player.minutesAgo !== undefined && player.minutesAgo !== null) {
      bits.push(player.minutesAgo <= 1 ? 'Just arrived' : `${player.minutesAgo}m ago`);
    }
    return bits.length ? bits.join(' • ') : 'In the shop';
  };

  return (
    <View style={styles.opponentCard}>
      <View style={styles.opponentHeader}>
        <Ionicons name="radio-outline" size={12} color={theme.success} />
        <Text style={styles.opponentTitle}>OPEN TO PLAY</Text>
        {!loading && (
          <Text style={styles.opponentCount}>
            {openPlayers.length} {openPlayers.length === 1 ? 'player' : 'players'}
          </Text>
        )}
      </View>

      {/* Let the player put their own hand up. */}
      <View style={styles.presenceRow}>
        <View
          style={[
            styles.presenceIcon,
            { backgroundColor: (imOpenToPlay ? theme.success : theme.subText) + '1A' },
          ]}
        >
          <Ionicons
            name={imOpenToPlay ? 'hand-left' : 'hand-left-outline'}
            size={15}
            color={imOpenToPlay ? theme.success : theme.subText}
          />
        </View>
        <View style={styles.presenceBody}>
          <Text style={styles.presenceTitle}>I'm open to play</Text>
          <Text style={styles.presenceSub}>
            {imOpenToPlay
              ? 'Others in this shop can see you and invite you.'
              : 'Turn on so players here know you want a game.'}
          </Text>
        </View>
        <Switch
          value={imOpenToPlay}
          onValueChange={onToggleOpenToPlay}
          trackColor={{ false: theme.border, true: theme.success }}
          thumbColor="#fff"
          style={styles.switch}
        />
      </View>

      {loading ? (
        <View style={[styles.opponentHeader, { paddingVertical: 8 }]}>
          <ActivityIndicator size="small" color={theme.primary} />
          <Text style={[styles.opponentEmpty, { marginLeft: 8 }]}>
            Checking who is here…
          </Text>
        </View>
      ) : error ? (
        <View style={styles.emptyBox}>
          <Ionicons name="alert-circle-outline" size={16} color={theme.warning} />
          <Text style={styles.emptyText}>{error}</Text>
          <TouchableOpacity onPress={onRefresh} activeOpacity={0.8}>
            <Text style={[styles.emptyAction, { color: theme.primary }]}>RETRY</Text>
          </TouchableOpacity>
        </View>
      ) : openPlayers.length === 0 ? (
        <View style={styles.emptyBox}>
          <Ionicons name="person-add-outline" size={16} color={theme.subText} />
          <Text style={styles.emptyText}>
            Nobody is looking for a game yet. Flip the switch above — you will show
            up on everybody else's board in this shop.
          </Text>
        </View>
      ) : (
        openPlayers.map(player => {
          const added = selectedIds.includes(player.id);
          const full = selectedIds.length >= maxOpponents;
          return (
            <View key={player.id} style={styles.playerRow}>
              <Image
                source={player.avatar ? { uri: String(player.avatar) } : DEFAULT_AVATAR}
                style={styles.playerAvatar}
              />
              <View style={styles.playerInfo}>
                <View style={styles.playerNameRow}>
                  <Text style={styles.playerName} numberOfLines={1}>
                    {player.username}
                  </Text>
                  <View style={[styles.openTag, { borderColor: theme.success }]}>
                    <Text style={[styles.openTagText, { color: theme.success }]}>OPEN</Text>
                  </View>
                </View>
                <Text style={styles.playerMeta} numberOfLines={1}>
                  {renderMeta(player)}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.addBtn, added && styles.addBtnAdded]}
                onPress={() => onAddPlayer(player)}
                activeOpacity={0.8}
                disabled={!added && full}
              >
                <Ionicons
                  name={added ? 'checkmark' : 'add'}
                  size={17}
                  color={added ? '#fff' : full ? theme.subText : theme.primary}
                />
              </TouchableOpacity>
            </View>
          );
        })
      )}

      {!loading && (
        <TouchableOpacity onPress={onRefresh} activeOpacity={0.8}>
          <Text
            style={[
              styles.opponentEmpty,
              { color: theme.primary, fontWeight: '800', paddingHorizontal: 4 },
            ]}
          >
            Tap to refresh the board
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default OpenPlayersBoard;
