import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '@emotion/react';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme } from '../../../../theme';
import { createStyles } from '../../InstantMatchScreen.styles';
import { INVITE_CODE_LENGTH } from '../constants';

interface Props {
  /** The caller's own code, ready to share. Null until one is generated. */
  code: string | null;
  /** True while the backend is issuing a code. */
  generating: boolean;
  onGenerate: () => void;
  onShare: () => void;
  /** Code typed in to join somebody else's match. */
  joinCode: string;
  onChangeJoinCode: (value: string) => void;
  onJoin: () => void;
  joining: boolean;
  /** Shown in the caption so the sharer knows what the code points at. */
  gameName: string;
  shopName?: string | null;
  /** True when the code was created on-device because the API did not answer. */
  offline?: boolean;
}

/**
 * Two halves of the invite flow in one card:
 *  - generate a code for your own match and share it, and
 *  - paste somebody else's code to join their match.
 * Joining is deliberately independent of creating a match, so a player can walk
 * into a shop and jump into whatever is already running.
 */
const InviteCodeCard: React.FC<Props> = ({
  code,
  generating,
  onGenerate,
  onShare,
  joinCode,
  onChangeJoinCode,
  onJoin,
  joining,
  gameName,
  shopName,
  offline,
}) => {
  const theme = useTheme() as AppTheme;
  const styles = createStyles(theme);
  const canJoin = joinCode.trim().length >= 4 && !joining;

  return (
    <View style={styles.inviteCard}>
      <View style={styles.inviteCardHeader}>
        <Ionicons name="keypad-outline" size={13} color={theme.primary} />
        <Text style={styles.inviteCardTitle}>INVITE CODE</Text>
        <View style={styles.inviteCardSpacer} />
        {offline ? (
          <Text style={[styles.inviteCardHint, { color: theme.warning }]}>ON DEVICE</Text>
        ) : null}
      </View>

      {code ? (
        <>
          <View style={styles.codeRow}>
            <View style={styles.codeBox}>
              <Text style={styles.codeText}>{code}</Text>
            </View>
            <TouchableOpacity style={styles.shareBtn} onPress={onShare} activeOpacity={0.85}>
              <Ionicons name="share-social-outline" size={15} color="#fff" />
              <Text style={styles.shareBtnText}>SHARE</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.codeCaption}>
            Anyone with this code can join your {gameName}
            {shopName ? ` match at ${shopName}` : ' match'} — they do not need to
            create one of their own.
          </Text>
          <TouchableOpacity onPress={onGenerate} activeOpacity={0.8} disabled={generating}>
            <Text style={[styles.codeAction, { color: theme.primary }]}>
              {generating ? 'Generating…' : 'Generate a different code'}
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity
            style={[styles.generateBtn, generating && styles.inviteBtnDisabled]}
            onPress={onGenerate}
            activeOpacity={0.85}
            disabled={generating}
          >
            {generating ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="sparkles-outline" size={15} color="#fff" />
                <Text style={styles.generateBtnText}>GENERATE MY CODE</Text>
              </>
            )}
          </TouchableOpacity>
          <Text style={styles.codeCaption}>
            Get a code before you start. Share it with the players you want, or keep
            an open match running and let people walk in.
          </Text>
        </>
      )}

      <View style={styles.inviteDivider}>
        <View style={styles.inviteDividerLine} />
        <Text style={styles.inviteDividerText}>OR JOIN SOMEBODY ELSE</Text>
        <View style={styles.inviteDividerLine} />
      </View>

      <View style={styles.inviteRow}>
        <View style={styles.inviteWrap}>
          <Ionicons name="enter-outline" size={15} color={theme.primary} />
          <TextInput
            style={styles.inviteInput}
            value={joinCode}
            onChangeText={value => onChangeJoinCode(value)}
            placeholder="ENTER CODE"
            placeholderTextColor={theme.subText}
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={INVITE_CODE_LENGTH}
          />
        </View>
        <TouchableOpacity
          style={[styles.inviteBtn, !canJoin && styles.inviteBtnDisabled]}
          onPress={onJoin}
          activeOpacity={0.85}
          disabled={!canJoin}
        >
          {joining ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.inviteBtnText}>JOIN</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InviteCodeCard;
