import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@emotion/react';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme } from '../../../../theme';
import { createStyles } from '../../InstantMatchScreen.styles';
import { Player } from '../../../../types';

interface Props {
  players: Player[];
  maxOpponents: number;
  onRemove: (playerId: string) => void;
  /** True when the match is at a shop (changes the empty-state wording). */
  inShop: boolean;
  /** Name of the selected shop, used in the can't-join-elsewhere hint. */
  shopName?: string | null;
}

/**
 * Who is already in the match being set up. An empty list is a first-class
 * state, not an error: it means the match will be created *open*, and the
 * invite code (or the shop board) brings opponents in.
 */
const SelectedOpponents: React.FC<Props> = ({
  players,
  maxOpponents,
  onRemove,
  inShop,
  shopName,
}) => {
  const theme = useTheme() as AppTheme;
  const styles = createStyles(theme);

  return (
    <View style={styles.opponentCard}>
      <View style={styles.opponentHeader}>
        <Ionicons name="people-outline" size={12} color={theme.info} />
        <Text style={styles.opponentTitle}>IN THIS MATCH</Text>
        <Text style={styles.opponentCount}>
          {players.length}/{maxOpponents}
        </Text>
      </View>

      {players.length === 0 ? (
        <Text style={styles.opponentEmpty}>
          {inShop
            ? `Nobody added yet — your code is enough. Anyone in ${
                shopName ?? 'this shop'
              } can join, and they must be playing here too.`
            : 'Nobody added yet — the match is created open and anyone holding your code can join.'}
        </Text>
      ) : (
        <View style={styles.chipRow}>
          {players.map(player => (
            <TouchableOpacity
              key={player.id}
              style={styles.chip}
              onPress={() => onRemove(player.id)}
              activeOpacity={0.8}
            >
              <Ionicons name="person" size={11} color={theme.primary} />
              <Text style={styles.chipText}>{player.username}</Text>
              <Ionicons name="close-circle" size={13} color={theme.primary} />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default SelectedOpponents;
