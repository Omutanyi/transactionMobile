import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@emotion/react';
import { AppTheme } from '../../theme';

export const GAME_OPTIONS = ['All Games', 'FIFA', 'NBA', 'Fortnite', 'Valorant', 'COD', 'Chess'];

interface GameDropdownProps {
  selectedGame: string;
  onGameSelect: (game: string) => void;
}

const GameDropdown: React.FC<GameDropdownProps> = ({ selectedGame, onGameSelect }) => {
  const theme = useTheme() as AppTheme;
  const [open, setOpen] = useState(false);

  return (
    <View style={{ marginRight: 10 }}>
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 12,
          paddingVertical: 6,
          backgroundColor: theme.inputBackground,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: theme.border,
        }}
      >
        <Text style={{ color: theme.text, fontSize: 14, marginRight: 4 }}>{selectedGame}</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={16} color={theme.text} />
      </TouchableOpacity>

      {open && (
        <View
          style={{
            position: 'absolute',
            top: 40,
            right: 0,
            backgroundColor: theme.inputBackground,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: theme.border,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 5,
            zIndex: 1000,
            minWidth: 120,
          }}
        >
          {GAME_OPTIONS.map((game, index) => (
            <TouchableOpacity
              key={game}
              onPress={() => { onGameSelect(game); setOpen(false); }}
              style={{
                padding: 12,
                borderBottomWidth: index < GAME_OPTIONS.length - 1 ? 1 : 0,
                borderBottomColor: theme.border,
              }}
            >
              <Text
                style={{
                  color: selectedGame === game ? theme.primary : theme.text,
                  fontSize: 14,
                  fontWeight: selectedGame === game ? '600' : '400',
                }}
              >
                {game}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default GameDropdown;
