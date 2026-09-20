import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@emotion/react';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme } from '../../../../theme';
import { createStyles } from '../../InstantMatchScreen.styles';
import { GameOption } from '../types';

interface Props {
  games: GameOption[];
  selectedGameId: string;
  onSelect: (game: GameOption) => void;
}

/** Horizontal, compact game carousel. */
const GamePicker: React.FC<Props> = ({ games, selectedGameId, onSelect }) => {
  const theme = useTheme() as AppTheme;
  const styles = createStyles(theme);

  if (!games.length) {
    return (
      <View style={styles.opponentCard}>
        <Text style={styles.opponentEmpty}>No games available yet.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.gamesContent}
    >
      {games.map(game => {
        const active = game.id === selectedGameId;
        return (
          <TouchableOpacity
            key={game.id}
            style={[styles.gameCard, active && styles.gameCardActive]}
            onPress={() => onSelect(game)}
            activeOpacity={0.9}
          >
            <Image source={game.image} style={styles.gameImage} resizeMode="cover" />
            <View style={styles.gameImageOverlay} />

            <View style={styles.gamePlayersPill}>
              <Text style={styles.gamePlayersText}>{game.maxPlayers}P</Text>
            </View>

            {active && (
              <View style={styles.gameCheckBadge}>
                <Ionicons name="checkmark" size={11} color="#fff" />
              </View>
            )}

            <View style={styles.gameNameBar}>
              <Text style={styles.gameName} numberOfLines={1}>{game.name}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export default GamePicker;
