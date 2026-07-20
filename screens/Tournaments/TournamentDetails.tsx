import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useTheme } from '@emotion/react';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { AppTheme } from '../../theme';
import { createStyles } from './TournamentDetails.styles';

const GAMING = require('../../assets/gaming.jpg');

// ── Static mock data ───────────────────────────────────────────────

const REGISTERED_PLAYERS = [
  { id: 1, name: 'StormY1', rank: 'Immortal 3', avatar: require('../../assets/avatar.jpg') },
  { id: 2, name: 'ViperX', rank: 'Radiant', avatar: require('../../assets/profile.jpg') },
  { id: 3, name: 'ZedMaster', rank: 'Immortal 1', avatar: require('../../assets/gaming.jpg') },
  { id: 4, name: 'RazeMain', rank: 'Ascendant 3', avatar: require('../../assets/icon.png') },
  { id: 5, name: 'NovaAce', rank: 'Immortal 1', avatar: require('../../assets/ic_launcher.png') },
  { id: 6, name: 'DarkPhoenix', rank: 'Ascendant 2', avatar: require('../../assets/avatar.jpg') },
  { id: 7, name: 'ShadowOG', rank: 'Diamond 3', avatar: require('../../assets/profile.jpg') },
];

const RULES = [
  'All matches are Best of 1',
  'No cheating or exploits',
  'Respect all players',
  'Decisions by admin are final',
  'Check full rules for more details',
];

const CHAT = [
  { id: 1, name: 'ThunderBolt', admin: false, text: "Let's go! This tournament is gonna be 🔥", avatar: require('../../assets/avatar.jpg') },
  { id: 2, name: 'GameZone Admin', admin: true, text: 'Good luck to all participants! Have fun and play fair.', avatar: require('../../assets/ic_launcher.png') },
  { id: 3, name: 'ShadowOG', admin: false, text: "Who's ready for some intense matches?", avatar: require('../../assets/profile.jpg') },
];

const RELATED = [
  { id: 1, game: 'VALORANT', name: 'Night Cup', prize: 1000, starts: '6h', image: require('../../assets/gaming.jpg') },
  { id: 2, game: 'VALORANT', name: 'Weekly Brawl', prize: 2000, starts: '8h', image: require('../../assets/profile.jpg') },
  { id: 3, game: 'VALORANT', name: 'Clash Arena', prize: 750, starts: '12h', image: require('../../assets/avatar.jpg') },
  { id: 4, game: 'VALORANT', name: 'Radiant', prize: 3500, starts: '1d', image: require('../../assets/icon.png') },
];

const pad2 = (n: number) => String(n).padStart(2, '0');

// ── Screen ─────────────────────────────────────────────────────────

const TournamentDetails = () => {
  const theme = useTheme() as AppTheme;
  const styles = createStyles(theme);
  const route = useRoute<any>();
  const t = route.params?.tournament ?? {};

  const title: string = t.name ?? 'Pro League Championship';
  const game: string = t.game ?? 'Valorant';
  const prize: number = t.prize ?? 5000;
  const entryFee: number = t.entryFee ?? 10;
  const players: number = t.players ?? 32;
  const maxPlayers: number = t.maxPlayers ?? 64;
  const image = t.image ?? GAMING;

  const [countdown, setCountdown] = useState({ days: 2, hrs: 15, mins: 47, secs: 39 });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        let { days, hrs, mins, secs } = prev;
        if (days === 0 && hrs === 0 && mins === 0 && secs === 0) return prev;
        secs -= 1;
        if (secs < 0) { secs = 59; mins -= 1; }
        if (mins < 0) { mins = 59; hrs -= 1; }
        if (hrs < 0) { hrs = 23; days -= 1; }
        return { days, hrs, mins, secs };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const podium = [
    { rank: '1st', prize: Math.round(prize * 0.5), color: theme.rankGold, height: 64, icon: 'trophy' as const },
    { rank: '2nd', prize: Math.round(prize * 0.3), color: theme.rankSilver, height: 50, icon: 'medal' as const },
    { rank: '3rd', prize: Math.round(prize * 0.2), color: theme.rankBronze, height: 40, icon: 'medal' as const },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Hero ── */}
      <View style={styles.hero}>
        <Image source={image} style={styles.heroImage} resizeMode="cover" />
        <View style={styles.heroOverlay} />
        <View style={styles.heroContent}>
          <View>
            <View style={styles.heroGameRow}>
              <Ionicons name="game-controller" size={16} color={theme.notification} />
              <Text style={styles.heroGameName}>{game.toUpperCase()}</Text>
            </View>
            <Text style={styles.heroTitle} numberOfLines={3}>{title}</Text>
          </View>
          <View style={styles.heroBottomRow}>
            <View style={styles.liveRow}>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
              <Text style={styles.regOpenText}>Registration Open</Text>
            </View>
            <View style={styles.prizePoolWrap}>
              <Text style={styles.prizePoolLabel}>TOTAL PRIZE POOL</Text>
              <View style={styles.prizePoolRow}>
                <Text style={styles.prizePoolValue}>${prize.toLocaleString()}</Text>
                <Ionicons name="trophy" size={22} color={theme.rankGold} />
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* ── Info grid ── */}
      <View style={styles.infoGrid}>
        <View style={styles.infoCard}>
          <View style={styles.infoLabelRow}>
            <Ionicons name="pricetag-outline" size={13} color={theme.info} />
            <Text style={styles.infoLabel}>ENTRY FEE</Text>
          </View>
          <Text style={styles.infoValue}>${entryFee}</Text>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoLabelRow}>
            <Ionicons name="people-outline" size={13} color={theme.info} />
            <Text style={styles.infoLabel}>PARTICIPANTS</Text>
          </View>
          <Text style={styles.infoValue}>{players}/{maxPlayers}</Text>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoLabelRow}>
            <Ionicons name="time-outline" size={13} color={theme.info} />
            <Text style={styles.infoLabel}>START TIME</Text>
          </View>
          <View style={styles.countdownRow}>
            <Text style={styles.countdownNum}>{pad2(countdown.days)}</Text>
            <Text style={styles.countdownColon}>:</Text>
            <Text style={styles.countdownNum}>{pad2(countdown.hrs)}</Text>
            <Text style={styles.countdownColon}>:</Text>
            <Text style={styles.countdownNum}>{pad2(countdown.mins)}</Text>
            <Text style={styles.countdownColon}>:</Text>
            <Text style={styles.countdownNum}>{pad2(countdown.secs)}</Text>
          </View>
          <View style={styles.countdownUnitsRow}>
            <Text style={styles.countdownUnit}>DAYS</Text>
            <Text style={styles.countdownUnit}>HRS</Text>
            <Text style={styles.countdownUnit}>MINS</Text>
            <Text style={styles.countdownUnit}>SECS</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoLabelRow}>
            <Ionicons name="git-branch-outline" size={13} color={theme.info} />
            <Text style={styles.infoLabel}>FORMAT</Text>
          </View>
          <Text style={styles.infoValueSmall}>Single{'\n'}Elimination</Text>
        </View>
      </View>

      {/* ── Organized By ── */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="shield-checkmark-outline" size={15} color={theme.info} />
            <Text style={styles.sectionTitle}>ORGANIZED BY</Text>
          </View>
        </View>
        <View style={styles.organizerRow}>
          <View style={styles.organizerLogo}>
            <Ionicons name="business" size={22} color={theme.info} />
          </View>
          <View style={styles.organizerInfo}>
            <Text style={styles.organizerName}>GameZone Arena</Text>
            <View style={styles.organizerMetaRow}>
              <Ionicons name="star" size={11} color={theme.warning} />
              <Text style={styles.organizerRating}>4.8</Text>
              <Text style={styles.organizerReviews}>(256)</Text>
            </View>
            <Text style={styles.organizerSub}>Trusted Tournament Organizer</Text>
          </View>
          <TouchableOpacity style={styles.followBtn} activeOpacity={0.85}>
            <Text style={styles.followBtnText}>Follow</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Registered Players ── */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="person-circle-outline" size={15} color={theme.info} />
            <Text style={styles.sectionTitle}>REGISTERED PLAYERS</Text>
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.playersScroll}>
          {REGISTERED_PLAYERS.map(p => (
            <View key={p.id} style={styles.playerItem}>
              <View style={styles.playerAvatarWrap}>
                <Image source={p.avatar} style={styles.playerAvatar} />
              </View>
              <Text style={styles.playerName} numberOfLines={1}>{p.name}</Text>
              <Text style={styles.playerRank} numberOfLines={1}>{p.rank}</Text>
            </View>
          ))}
          <View style={styles.playerItem}>
            <View style={styles.morePlayers}>
              <Text style={styles.morePlayersText}>+24</Text>
            </View>
            <Text style={styles.playerRank}>More</Text>
          </View>
        </ScrollView>
      </View>

      {/* ── Tournament Bracket ── */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="git-network-outline" size={15} color={theme.info} />
            <Text style={styles.sectionTitle}>TOURNAMENT BRACKET</Text>
          </View>
          <TouchableOpacity activeOpacity={0.8}>
            <Text style={styles.linkText}>View Full Bracket</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bracketRow}>
          <View style={styles.bracketCol}>
            {[
              ['StormY1', 'ViperX'],
              ['RazeMain', 'NovaAce'],
              ['TBD', 'TBD'],
            ].map((m, i) => (
              <View key={i} style={styles.bracketMatch}>
                <View style={styles.bracketTeam}>
                  <Ionicons name="person" size={11} color={m[0] === 'TBD' ? theme.subText : theme.info} />
                  <Text style={[styles.bracketTeamName, m[0] === 'TBD' && styles.bracketTeamTbd]}>{m[0]}</Text>
                </View>
                <Text style={styles.bracketVs}>VS</Text>
                <View style={styles.bracketTeam}>
                  <Ionicons name="person" size={11} color={m[1] === 'TBD' ? theme.subText : theme.info} />
                  <Text style={[styles.bracketTeamName, m[1] === 'TBD' && styles.bracketTeamTbd]}>{m[1]}</Text>
                </View>
              </View>
            ))}
          </View>
          <View style={styles.bracketConnector}>
            <Ionicons name="chevron-forward" size={18} color={theme.border} />
          </View>
          <View style={styles.bracketWinnerBox}>
            <Text style={styles.bracketWinnerLabel}>FINALS</Text>
            <Text style={styles.bracketWinnerText}>TBD</Text>
            <Ionicons name="trophy" size={20} color={theme.rankGold} style={{ marginTop: 8 }} />
          </View>
        </View>
      </View>

      {/* ── Prize Distribution ── */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="cash-outline" size={15} color={theme.info} />
            <Text style={styles.sectionTitle}>PRIZE DISTRIBUTION</Text>
          </View>
        </View>
        <View style={styles.podiumRow}>
          {[podium[1], podium[0], podium[2]].map(p => (
            <View key={p.rank} style={styles.podiumCol}>
              <Ionicons name={p.icon} size={p.rank === '1st' ? 26 : 20} color={p.color} style={styles.podiumTrophy} />
              <View style={[styles.podiumBlock, { height: p.height, backgroundColor: p.color + '22', borderColor: p.color }]}>
                <Text style={[styles.podiumRank, { color: p.color }]}>{p.rank}</Text>
              </View>
              <Text style={styles.podiumPrize}>${p.prize.toLocaleString()}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* ── Rules ── */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="document-text-outline" size={15} color={theme.info} />
            <Text style={styles.sectionTitle}>RULES</Text>
          </View>
          <TouchableOpacity activeOpacity={0.8}>
            <Text style={styles.linkText}>View Full Rules</Text>
          </TouchableOpacity>
        </View>
        {RULES.map(r => (
          <View key={r} style={styles.ruleRow}>
            <Ionicons name="checkmark-circle" size={15} color={theme.success} />
            <Text style={styles.ruleText}>{r}</Text>
          </View>
        ))}
      </View>

      {/* ── Chat & Discussion ── */}
      <View style={styles.section}>
        <View style={styles.chatTabsRow}>
          <Text style={[styles.chatTab, { color: theme.info }]}>CHAT</Text>
          <Text style={[styles.chatTab, { color: theme.subText }]}>DISCUSSION</Text>
        </View>
        {CHAT.map(c => (
          <View key={c.id} style={styles.chatMsg}>
            <Image source={c.avatar} style={styles.chatAvatar} />
            <View style={styles.chatBubble}>
              <View style={styles.chatNameRow}>
                <Text style={styles.chatName}>{c.name}</Text>
                {c.admin && (
                  <View style={styles.adminBadge}>
                    <Text style={styles.adminBadgeText}>ADMIN</Text>
                  </View>
                )}
              </View>
              <Text style={styles.chatText}>{c.text}</Text>
            </View>
          </View>
        ))}
        <View style={styles.chatInputRow}>
          <TextInput
            style={styles.chatInput}
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
            placeholderTextColor={theme.subText}
          />
          <TouchableOpacity style={styles.chatSend} activeOpacity={0.85}>
            <Ionicons name="send" size={15} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Register Now ── */}
      <TouchableOpacity style={styles.registerBtn} activeOpacity={0.9}>
        <Ionicons name="flash" size={22} color="#fff" />
        <Text style={styles.registerBtnText}>REGISTER NOW</Text>
      </TouchableOpacity>
      <View style={styles.registerHint}>
        <Ionicons name="alert-circle" size={13} color={theme.warning} />
        <Text style={styles.registerHintText}>Hurry up! Limited slots available</Text>
      </View>

      {/* ── Related Tournaments ── */}
      <View style={styles.outerSectionRow}>
        <Text style={[styles.sectionTitle, { marginLeft: 0 }]}>RELATED TOURNAMENTS</Text>
        <TouchableOpacity activeOpacity={0.8}>
          <Text style={styles.linkText}>View All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.relatedScroll}>
        {RELATED.map(r => (
          <TouchableOpacity key={r.id} style={styles.relatedCard} activeOpacity={0.9}>
            <Image source={r.image} style={styles.relatedImage} resizeMode="cover" />
            <View style={styles.relatedBody}>
              <Text style={styles.relatedGame}>{r.game}</Text>
              <Text style={styles.relatedName} numberOfLines={1}>{r.name}</Text>
              <Text style={styles.relatedPrize}>${r.prize.toLocaleString()}</Text>
              <View style={styles.relatedMetaRow}>
                <Ionicons name="time-outline" size={9} color={theme.subText} />
                <Text style={styles.relatedMeta}>Starts in {r.starts}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ScrollView>
  );
};

export default TournamentDetails;
