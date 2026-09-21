import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '@emotion/react';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme } from '../../../../theme';
import { createStyles } from '../../InstantMatchScreen.styles';
import { InstantMatch } from '../../../../types';
import { formatMoney, getSeriesLabel, getWagerLabel } from '../constants';

type Styles = ReturnType<typeof createStyles>;

interface RowProps {
  label: string;
  value: string;
  styles: Styles;
}

const SummaryRow: React.FC<RowProps> = ({ label, value, styles }) => (
  <View style={styles.summaryRow}>
    <Text style={styles.summaryLabel}>{label}</Text>
    <Text style={styles.summaryValue} numberOfLines={1}>
      {value}
    </Text>
  </View>
);

interface Props {
  match: InstantMatch;
  shopName?: string;
  rematching: boolean;
  onRematch: () => void;
  onDismiss: () => void;
  /** Opens the share sheet with the match's invite code. */
  onShareCode: () => void;
}

/** Confirmation card shown after a match is created, with the rematch action. */
const MatchSummary: React.FC<Props> = ({
  match,
  shopName,
  rematching,
  onRematch,
  onDismiss,
  onShareCode,
}) => {
  const theme = useTheme() as AppTheme;
  const styles = createStyles(theme);

  const amount = match.stake.amount ?? 0;
  const wagerValue =
    match.stake.method === 'none' || amount <= 0
      ? 'No wager'
      : `${formatMoney(amount, match.stake.currency)} • ${getWagerLabel(match.stake.method)}`;

  const locationValue =
    match.location === 'shop' ? `In shop${shopName ? ` • ${shopName}` : ''}` : 'Online';

  const opponentCount = Math.max(match.playerIds.length - 1, 0);

  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryHeader}>
        <Ionicons
          name={match.isOpen ? 'radio-outline' : 'checkmark-circle'}
          size={18}
          color={theme.success}
        />
        <Text style={styles.summaryTitle}>
          {match.isOpen ? 'OPEN MATCH — WAITING FOR PLAYERS' : 'MATCH CREATED'}
        </Text>
      </View>

      <SummaryRow styles={styles} label="Game" value={match.gameName} />
      <SummaryRow
        styles={styles}
        label="Mode"
        value={match.mode === 'party' ? 'Party' : '1v1 Duel'}
      />
      <SummaryRow
        styles={styles}
        label="Series"
        value={`${getSeriesLabel(match.series.format)} • first to ${match.series.winsNeeded}`}
      />
      <SummaryRow styles={styles} label="Wager" value={wagerValue} />
      <SummaryRow styles={styles} label="Where" value={locationValue} />
      <SummaryRow
        styles={styles}
        label="Opponents"
        value={opponentCount > 0 ? `${opponentCount} confirmed` : 'None yet'}
      />

      {match.inviteCode ? (
        <>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Invite code</Text>
            <Text style={[styles.summaryValue, styles.inviteCodeValue]}>
              {match.inviteCode}
            </Text>
          </View>
          <TouchableOpacity style={styles.shareBtn} onPress={onShareCode} activeOpacity={0.85}>
            <Ionicons name="share-social-outline" size={15} color="#fff" />
            <Text style={styles.shareBtnText}>SHARE CODE</Text>
          </TouchableOpacity>
        </>
      ) : null}

      {match.location === 'shop' ? (
        <Text style={styles.codeCaption}>
          Everyone in this match is playing at{' '}
          {shopName ?? match.shopName ?? 'the same shop'} — joiners must be there too.
        </Text>
      ) : null}

      <View style={styles.summaryActions}>
        <TouchableOpacity
          style={styles.ghostBtn}
          onPress={onDismiss}
          activeOpacity={0.85}
          disabled={rematching}
        >
          <Text style={styles.ghostBtnText}>NEW MATCH</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rematchBtn}
          onPress={onRematch}
          activeOpacity={0.85}
          disabled={rematching}
        >
          {rematching ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons name="repeat" size={15} color="#fff" />
              <Text style={styles.rematchBtnText}>REMATCH</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MatchSummary;
