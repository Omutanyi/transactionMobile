import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@emotion/react';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme } from '../../../../theme';
import { createStyles } from '../../InstantMatchScreen.styles';
import { MatchMode, SeriesFormat } from '../../../../types';
import { MODE_OPTIONS, SERIES_OPTIONS } from '../constants';

interface Props {
  matchMode: MatchMode;
  onSelectMode: (mode: MatchMode) => void;
  seriesFormat: SeriesFormat;
  onSelectSeries: (format: SeriesFormat) => void;
  playerCount: number;
  maxPlayers: number;
  onIncrementPlayers: () => void;
  onDecrementPlayers: () => void;
}

const MODE_ICONS: Record<MatchMode, React.ComponentProps<typeof Ionicons>['name']> = {
  '1v1': 'person',
  party: 'people',
};

/** Match mode, party size and series format controls. */
const MatchSetup: React.FC<Props> = ({
  matchMode,
  onSelectMode,
  seriesFormat,
  onSelectSeries,
  playerCount,
  maxPlayers,
  onIncrementPlayers,
  onDecrementPlayers,
}) => {
  const theme = useTheme() as AppTheme;
  const styles = createStyles(theme);
  const partyAvailable = maxPlayers > 2;

  return (
    <>
      <View style={styles.optionRow}>
        {MODE_OPTIONS.map(option => {
          const active = matchMode === option.id;
          const disabled = option.id === 'party' && !partyAvailable;
          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                active && styles.optionCardActive,
                disabled && styles.optionCardDisabled,
              ]}
              onPress={() => !disabled && onSelectMode(option.id)}
              activeOpacity={disabled ? 1 : 0.85}
              disabled={disabled}
            >
              <View
                style={[
                  styles.optionIcon,
                  active && { backgroundColor: theme.primary + '26' },
                ]}
              >
                <Ionicons
                  name={MODE_ICONS[option.id]}
                  size={18}
                  color={active ? theme.primary : theme.subText}
                />
              </View>
              <View style={styles.optionBody}>
                <Text
                  style={[
                    styles.optionLabel,
                    !active && styles.optionLabelMuted,
                  ]}
                >
                  {option.label}
                </Text>
                <Text
                  style={[
                    styles.optionSub,
                    active && styles.optionSubActive,
                  ]}
                  numberOfLines={1}
                >
                  {option.id === 'party' && partyAvailable
                    ? `Up to ${maxPlayers}`
                    : option.sub}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {matchMode === 'party' && (
        <View style={styles.stepperCard}>
          <Text style={styles.stepperLabel}>PLAYERS</Text>
          <TouchableOpacity
            style={styles.stepperBtn}
            onPress={onDecrementPlayers}
            activeOpacity={0.8}
            disabled={playerCount <= 2}
          >
            <Ionicons
              name="remove"
              size={16}
              color={playerCount <= 2 ? theme.subText : theme.primary}
            />
          </TouchableOpacity>
          <View style={styles.stepperValue}>
            <Text style={styles.stepperValueText}>{playerCount}</Text>
          </View>
          <TouchableOpacity
            style={styles.stepperBtn}
            onPress={onIncrementPlayers}
            activeOpacity={0.8}
            disabled={playerCount >= maxPlayers}
          >
            <Ionicons
              name="add"
              size={16}
              color={playerCount >= maxPlayers ? theme.subText : theme.primary}
            />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.pillRow}>
        {SERIES_OPTIONS.map(option => {
          const active = seriesFormat === option.id;
          return (
            <TouchableOpacity
              key={option.id}
              style={[styles.pill, active && styles.pillActive]}
              onPress={() => onSelectSeries(option.id)}
              activeOpacity={0.85}
            >
              <Text style={[styles.pillText, active && styles.pillTextActive]}>
                {option.label}
              </Text>
              <Text style={styles.pillSub}>{option.sub}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
};

export default MatchSetup;
