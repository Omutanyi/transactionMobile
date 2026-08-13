import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity, TextInput,
  ActivityIndicator, Alert
} from 'react-native';
import { useTheme } from '@emotion/react';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { AppTheme } from '../../theme';
import { createStyles } from './TournamentDetails.styles';
import { request } from '../../requests';
import apis from '../../api';

const GAMING = require('../../assets/gaming.jpg');

const pad2 = (n: number) => String(n).padStart(2, '0');

const TournamentDetails = () => {
  const theme = useTheme() as AppTheme;
  const styles = createStyles(theme);
  const route = useRoute<any>();
  const t = route.params?.tournament ?? {};

  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [tournament, setTournament] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [chat, setChat] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState({ days: 2, hrs: 15, mins: 47, secs: 39 });

  const tournamentId = t.TournamentId ?? t.tournamentId ?? t.id;
  const shouldFetch = !!tournamentId;

  useEffect(() => {
    if (!shouldFetch) {
      setTournament(t);
      setLoading(false);
      return;
    }

    const fetchDetails = async () => {
      try {
        const [detailData, participantsData, chatData] = await Promise.all([
          request(apis.tournamentDetail(tournamentId), { method: 'GET' }),
          request(apis.tournamentParticipants(tournamentId), { method: 'GET' }).catch(() => []),
          request(apis.tournamentChat(tournamentId), { method: 'GET' }).catch(() => []),
        ]);
        setTournament(detailData);
        setParticipants(Array.isArray(participantsData) ? participantsData : participantsData?.data ?? []);
        setChat(Array.isArray(chatData) ? chatData : chatData?.data ?? []);
      } catch (e) {
        setTournament(t);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [shouldFetch, tournamentId]);

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

  const title: string = tournament?.Name ?? tournament?.name ?? t.name ?? 'Tournament';
  const game: string = tournament?.GameName ?? tournament?.gameName ?? t.game ?? t.GameName ?? 'Valorant';
  const prize: number = tournament?.PrizePool ?? tournament?.prizePool ?? t.prize ?? t.PrizePool ?? 5000;
  const entryFee: number = tournament?.EntryFee ?? tournament?.entryFee ?? t.entryFee ?? t.EntryFee ?? 0;
  const players: number = participants.length || (t.players ?? 0);
  const maxPlayers: number = tournament?.MaxParticipants ?? tournament?.maxParticipants ?? t.maxPlayers ?? t.MaxParticipants ?? 64;
  const image = tournament?.GameImage ? { uri: tournament.GameImage } : (tournament?.image ?? t.image ?? GAMING);
  const description: string = tournament?.Description ?? tournament?.description ?? t.description ?? '';
  const tournamentType: string = tournament?.TournamentType ?? tournament?.tournamentType ?? t.tournamentType ?? 'single_elimination';
  const status: string = tournament?.Status ?? tournament?.status ?? t.Status ?? t.status ?? 'upcoming';

  const handleRegister = async () => {
    if (!tournamentId) {
      Alert.alert('Info', 'Registration will be available for upcoming tournaments.');
      return;
    }
    setRegistering(true);
    try {
      await request(apis.tournamentRegister(tournamentId), { method: 'POST' });
      Alert.alert('Success', 'You have registered for this tournament!');
      const data = await request(apis.tournamentParticipants(tournamentId), { method: 'GET' });
      setParticipants(Array.isArray(data) ? data : data?.data ?? []);
    } catch (e: any) {
      if (e?.message?.includes('full')) {
        Alert.alert('Full', 'This tournament is already full.');
      } else {
        Alert.alert('Error', e?.message || 'Registration failed');
      }
    } finally {
      setRegistering(false);
    }
  };

  const handleSendChat = async () => {
    if (!message.trim() || !tournamentId) return;
    try {
      const sent = await request(apis.tournamentChat(tournamentId), {
        method: 'POST',
        body: JSON.stringify({ message: message.trim() }),
      });
      setChat(prev => [...prev, sent]);
      setMessage('');
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to send message');
    }
  };

  const podium = [
    { rank: '1st', prize: Math.round(prize * 0.5), color: theme.rankGold, height: 64, icon: 'trophy' as const },
    { rank: '2nd', prize: Math.round(prize * 0.3), color: theme.rankSilver, height: 50, icon: 'medal' as const },
    { rank: '3rd', prize: Math.round(prize * 0.2), color: theme.rankBronze, height: 40, icon: 'medal' as const },
  ];

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <View style={styles.hero}>
        <Image source={typeof image === 'number' ? image : image} style={styles.heroImage} resizeMode="cover" />
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

      {/* Info grid */}
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
          <Text style={styles.infoValueSmall}>{tournamentType.replace('_', ' ')}</Text>
        </View>
      </View>

      {/* Registered Players */}
      {participants.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="person-circle-outline" size={15} color={theme.info} />
              <Text style={styles.sectionTitle}>REGISTERED PLAYERS</Text>
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.playersScroll}>
            {participants.map((p: any) => (
              <View key={p.PlayerId ?? p.playerId} style={styles.playerItem}>
                <View style={styles.playerAvatarWrap}>
                  <Image
                    source={p.ProfileImageUrl ? { uri: p.ProfileImageUrl } : require('../../assets/avatar.jpg')}
                    style={styles.playerAvatar}
                  />
                </View>
                <Text style={styles.playerName} numberOfLines={1}>{p.Username ?? p.username}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Description */}
      {description ? (
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="document-text-outline" size={15} color={theme.info} />
              <Text style={styles.sectionTitle}>DESCRIPTION</Text>
            </View>
          </View>
          <View style={[styles.section, { paddingHorizontal: 16 }]}>
            <Text style={{ color: theme.subText, lineHeight: 20 }}>{description}</Text>
          </View>
        </View>
      ) : null}

      {/* Prize Distribution */}
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

      {/* Chat */}
      <View style={styles.section}>
        <View style={styles.chatTabsRow}>
          <Text style={[styles.chatTab, { color: theme.info }]}>CHAT</Text>
        </View>
        {chat.map((c: any) => (
          <View key={c.Id ?? c.id} style={styles.chatMsg}>
            <Image
              source={c.ProfileImageUrl ? { uri: c.ProfileImageUrl } : require('../../assets/avatar.jpg')}
              style={styles.chatAvatar}
            />
            <View style={styles.chatBubble}>
              <View style={styles.chatNameRow}>
                <Text style={styles.chatName}>{c.Username ?? c.username}</Text>
              </View>
              <Text style={styles.chatText}>{c.Message ?? c.message}</Text>
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
          <TouchableOpacity style={styles.chatSend} onPress={handleSendChat} activeOpacity={0.85}>
            <Ionicons name="send" size={15} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Register Now */}
      <TouchableOpacity
        style={styles.registerBtn}
        activeOpacity={0.9}
        onPress={handleRegister}
        disabled={registering}
      >
        {registering ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons name="flash" size={22} color="#fff" />
            <Text style={styles.registerBtnText}>REGISTER NOW</Text>
          </>
        )}
      </TouchableOpacity>
      <View style={styles.registerHint}>
        <Ionicons name="alert-circle" size={13} color={theme.warning} />
        <Text style={styles.registerHintText}>Hurry up! Limited slots available</Text>
      </View>
    </ScrollView>
  );
};

export default TournamentDetails;
