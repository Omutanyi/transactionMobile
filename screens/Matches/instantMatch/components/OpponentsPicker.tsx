import React from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '@emotion/react';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme } from '../../../../theme';
import { createStyles } from '../../InstantMatchScreen.styles';
import { Player } from '../../../../types';
import { DEFAULT_AVATAR, INVITE_CODE_LENGTH, getPlayerMeta } from '../constants';

interface Props {
  inviteCode: string;
  onChangeInviteCode: (value: string) => void;
  onApplyInviteCode: () => void;
  applyingCode: boolean;
  /** Players physically present in the selected shop. */
  nearbyPlayers: Player[];
  nearbyLoading: boolean;
  onRetryNearby: () => void;
  selectedPlayers: Player[];
  onTogglePlayer: (player: Player) => void;
  onRemovePlayer: (playerId: string) => void;
  maxOpponents: number;
  /** True when playing in a shop (the nearby list only makes sense there). */
  inShop: boolean;
}

/**
 * Opponent selection. Opponents are optional: an instant match can be created
 * "open" and filled later by whoever scans the invite code.
 */
const OpponentsPicker: React.FC<Props> = ({
  inviteCode,
  onChangeInviteCode,
  onApplyInviteCode,
  applyingCode,
  nearbyPlayers,
  nearbyLoading,
  onRetryNearby,
  selectedPlayers,
  onTogglePlayer,
  onRemovePlayer,
  maxOpponents,
  inShop,
}) => {
  const theme = useTheme() as AppTheme;
  const styles = createStyles(theme);
  const available = nearbyPlayers.filter(
    player => !selectedPlayers.some(selected => selected.id === player.id),
  );

  return (
    <>
      <View style={styles.inviteRow}>
        <View style={styles.inviteWrap}>
          <Ionicons name="keypad-outline" size={15} color={theme.primary} />
          <TextInput
            style={styles.inviteInput}
            value={inviteCode}
            onChangeText={value =>
              onChangeInviteCode(
                value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, INVITE_CODE_LENGTH),
              )
            }
            placeholder="INVITE CODE"
            placeholderTextColor={theme.subText}
            autoCapitalize="characters"
            maxLength={INVITE_CODE_LENGTH}
          />
        </View>
        <TouchableOpacity
          style={[styles.inviteBtn, (applyingCode || !inviteCode) && styles.inviteBtnDisabled]}
          onPress={onApplyInviteCode}
          activeOpacity={0.85}
          disabled={applyingCode || !inviteCode}
        >
          {applyingCode ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.inviteBtnText}>JOIN</Text>
          )}
        </TouchableOpacity>
      </View>

      {inShop && (
        <View style={styles.opponentCard}>
          <View style={styles.opponentHeader}>
            <Ionicons name="location-outline" size={12} color={theme.success} />
            <Text style={styles.opponentTitle}>IN THIS SHOP</Text>
            {!nearbyLoading && (
              <Text style={styles.opponentCount}>{available.length} available</Text>
            )}
          </View>

          {nearbyLoading ? (
            <View style={[styles.opponentHeader, { paddingVertical: 8 }]}>
              <ActivityIndicator size="small" color={theme.primary} />
              <Text style={[styles.opponentEmpty, { marginLeft: 8 }]}>
                Looking for players nearby…
              </Text>
            </View>
          ) : available.length > 0 ? (
            available.map(player => {
              const added = selectedPlayers.some(selected => selected.id === player.id);
              const full = selectedPlayers.length >= maxOpponents;
              return (
                <View key={player.id} style={styles.playerRow}>
                  <Image
                    source={
                      player.avatar ? { uri: String(player.avatar) } : DEFAULT_AVATAR
                    }
                    style={styles.playerAvatar}
                  />
                  <View style={styles.playerInfo}>
                    <Text style={styles.playerName}>{player.username}</Text>
                    <Text style={styles.playerMeta}>{getPlayerMeta(player)}</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.addBtn, added && styles.addBtnAdded]}
                    onPress={() => onTogglePlayer(player)}
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
          ) : (
            <View style={styles.opponentHeader}>
              <Text style={styles.opponentEmpty}>
                {selectedPlayers.length >= maxOpponents
                  ? 'All opponent slots are filled.'
                  : 'Nobody else is here yet — start an open match and they can join with your code.'}
              </Text>
            </View>
          )}

          {!nearbyLoading && nearbyPlayers.length === 0 && (
            <TouchableOpacity onPress={onRetryNearby} activeOpacity={0.8}>
              <Text
                style={[
                  styles.opponentEmpty,
                  { color: theme.primary, fontWeight: '800', paddingHorizontal: 4 },
                ]}
              >
                Tap to search again
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {selectedPlayers.length > 0 && (
        <View style={styles.chipRow}>
          {selectedPlayers.map(player => (
            <TouchableOpacity
              key={player.id}
              style={styles.chip}
              onPress={() => onRemovePlayer(player.id)}
              activeOpacity={0.8}
            >
              <Ionicons name="person" size={11} color={theme.primary} />
              <Text style={styles.chipText}>{player.username}</Text>
              <Ionicons name="close-circle" size={13} color={theme.primary} />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </>
  );
};

export default OpponentsPicker;
