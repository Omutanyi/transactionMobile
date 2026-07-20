import React, { useState } from 'react';
import { useTheme } from '@emotion/react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { AppTheme } from '../../theme';
import {
  createStyles,
  getHeaderOptions,
  STORY_RING_COLORS,
} from './UserCommunity.styles';
import AppLogo from '../../components/AppLogo';

const Stack = createStackNavigator();

// ── Static data ────────────────────────────────────────────────────

interface Story {
  id: string;
  username: string;
  isOwn?: boolean;
  avatar?: any;
  ringColor?: string;
  isOnline?: boolean;
}

const STORIES: Story[] = [
  { id: 'own', username: 'Your story', isOwn: true },
  { id: '1', username: 'AceBlaze', avatar: require('../../assets/avatar.jpg'), ringColor: STORY_RING_COLORS[0], isOnline: true },
  { id: '2', username: 'NovaQueen', avatar: require('../../assets/profile.jpg'), ringColor: STORY_RING_COLORS[1], isOnline: true },
  { id: '3', username: 'ShadowX', avatar: require('../../assets/gaming.jpg'), ringColor: STORY_RING_COLORS[2], isOnline: false },
  { id: '4', username: 'KillShot', avatar: require('../../assets/icon.png'), ringColor: STORY_RING_COLORS[3], isOnline: true },
  { id: '5', username: 'PixelPunk', avatar: require('../../assets/ic_launcher.png'), ringColor: STORY_RING_COLORS[4], isOnline: false },
];

interface Post {
  id: number;
  username: string;
  verified: boolean;
  timeAgo: string;
  content: string;
  gameTag: string | null;
  hasMedia: boolean;
  mediaType?: 'image' | 'video';
  videoDuration?: string;
  likes: string;
  comments: string;
  shares: string;
  avatar: any;
  mediaImage?: any;
}

const POSTS: Post[] = [
  {
    id: 1,
    username: 'AceBlaze',
    verified: true,
    timeAgo: '2h ago',
    content: 'Clutch wins hit different at 3AM 🔥\nThat last circle was pure chaos!\nWho else grinding tonight? 💪',
    gameTag: 'PUBG MOBILE',
    hasMedia: true,
    mediaType: 'video',
    videoDuration: '0:32',
    likes: '1.2K',
    comments: '243',
    shares: '89',
    avatar: require('../../assets/avatar.jpg'),
    mediaImage: require('../../assets/gaming.jpg'),
  },
  {
    id: 2,
    username: 'NovaQueen',
    verified: true,
    timeAgo: '4h ago',
    content: 'New season, new me 💜\nPushed to Diamond I solo queue!\nNext stop: Conqueror 👑',
    gameTag: 'CALL OF DUTY: MOBILE',
    hasMedia: false,
    likes: '982',
    comments: '156',
    shares: '42',
    avatar: require('../../assets/profile.jpg'),
  },
  {
    id: 3,
    username: 'ShadowX',
    verified: false,
    timeAgo: '6h ago',
    content: 'Sometimes the squad isn\'t online...\nSo you just hit ranked alone 😤\nStill won tho 😎',
    gameTag: null,
    hasMedia: true,
    mediaType: 'image',
    likes: '547',
    comments: '98',
    shares: '31',
    avatar: require('../../assets/gaming.jpg'),
    mediaImage: require('../../assets/profile.jpg'),
  },
];

const TRENDING = [
  { id: 1, tag: '#GameNight', count: '9.8K posts' },
  { id: 2, tag: '#VictoryRoyale', count: '8.2K posts' },
  { id: 3, tag: '#ClutchMoment', count: '6.3K posts' },
  { id: 4, tag: '#RankPush', count: '5.1K posts' },
  { id: 5, tag: '#ControllerGang', count: '4.7K posts' },
  { id: 6, tag: '#NewSeason', count: '3.9K posts' },
  { id: 7, tag: '#Esports', count: '2.4K posts' },
];

const TO_FOLLOW = [
  { id: 1, username: 'KillShot', role: 'Pro Gamer', avatar: require('../../assets/avatar.jpg') },
  { id: 2, username: 'PixelPunk', role: 'Content Creator', avatar: require('../../assets/profile.jpg') },
  { id: 3, username: 'MightyRex', role: 'Streamer', avatar: require('../../assets/gaming.jpg') },
];

const FEED_TABS = ['Feed', 'Explore', 'Clips'];

// ── Content screen ─────────────────────────────────────────────────

const UserCommunityContent = () => {
  const theme = useTheme() as AppTheme;
  const styles = createStyles(theme);
  const [activeTab, setActiveTab] = useState('Feed');

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Stories ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.storiesScroll}
          contentContainerStyle={styles.storiesContent}
        >
          {STORIES.map(story => (
            <TouchableOpacity key={story.id} style={styles.storyItem} activeOpacity={0.85}>
              {story.isOwn ? (
                <View style={[styles.storyRingWrapper, styles.storyRingOwn]}>
                  <Ionicons name="person-outline" size={22} color={theme.subText} />
                  <View style={styles.storyAddBtn}>
                    <Ionicons name="add" size={11} color="#fff" />
                  </View>
                </View>
              ) : (
                <View style={[styles.storyRingWrapper, { borderColor: story.ringColor }]}>
                  <Image source={story.avatar} style={styles.storyAvatar} resizeMode="cover" />
                  {story.isOnline && <View style={styles.storyOnlineDot} />}
                </View>
              )}
              <Text style={styles.storyUsername} numberOfLines={1}>
                {story.username}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Tabs ── */}
        <View style={styles.tabsRow}>
          {FEED_TABS.map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.filterBtn} activeOpacity={0.8}>
            <Ionicons name="options-outline" size={17} color={theme.primary} />
          </TouchableOpacity>
        </View>

        {/* ── Two-column content ── */}
        <View style={styles.contentRow}>

          {/* Left: Feed posts */}
          <View style={styles.feedCol}>
            {POSTS.map(post => (
              <View key={post.id} style={styles.postCard}>

                {/* Post header */}
                <View style={styles.postHeader}>
                  <Image source={post.avatar} style={styles.postAvatar} resizeMode="cover" />
                  <View style={styles.postUserInfo}>
                    <View style={styles.postNameRow}>
                      <Text style={styles.postUsername} numberOfLines={1}>
                        {post.username}
                      </Text>
                      {post.verified && (
                        <Ionicons
                          name="checkmark-circle"
                          size={13}
                          color={theme.primary}
                          style={styles.postVerified}
                        />
                      )}
                    </View>
                    <Text style={styles.postTime}>{post.timeAgo}</Text>
                  </View>
                  <TouchableOpacity style={styles.postMenuBtn}>
                    <Ionicons name="ellipsis-horizontal" size={16} color={theme.subText} />
                  </TouchableOpacity>
                </View>

                {/* Post text */}
                <Text style={styles.postText}>{post.content}</Text>

                {/* Game tag */}
                {post.gameTag && (
                  <View style={styles.gameTagRow}>
                    <View style={styles.gameTagPill}>
                      <Ionicons name="game-controller-outline" size={10} color={theme.primary} />
                      <Text style={styles.gameTagText}>{post.gameTag}</Text>
                    </View>
                  </View>
                )}

                {/* Media */}
                {post.hasMedia && post.mediaImage && (
                  <View style={styles.postMedia}>
                    <Image
                      source={post.mediaImage}
                      style={styles.postMediaImage}
                      resizeMode="cover"
                    />
                    {post.mediaType === 'video' && (
                      <>
                        <View style={styles.playOverlay}>
                          <View style={styles.playBtn}>
                            <Ionicons name="play" size={15} color="#fff" />
                          </View>
                        </View>
                        {post.videoDuration && (
                          <View style={styles.videoDurationBadge}>
                            <Text style={styles.videoDurationText}>{post.videoDuration}</Text>
                          </View>
                        )}
                      </>
                    )}
                  </View>
                )}

                {/* Actions */}
                <View style={styles.postActions}>
                  <View style={styles.postActionsLeft}>
                    <TouchableOpacity style={styles.postAction} activeOpacity={0.75}>
                      <Ionicons name="heart-outline" size={14} color={theme.subText} />
                      <Text style={styles.postActionText}>{post.likes}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.postAction} activeOpacity={0.75}>
                      <Ionicons name="chatbubble-outline" size={14} color={theme.subText} />
                      <Text style={styles.postActionText}>{post.comments}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.postAction} activeOpacity={0.75}>
                      <Ionicons name="repeat-outline" size={14} color={theme.subText} />
                      <Text style={styles.postActionText}>{post.shares}</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity activeOpacity={0.75}>
                    <Ionicons name="paper-plane-outline" size={14} color={theme.subText} />
                  </TouchableOpacity>
                </View>

              </View>
            ))}
          </View>

          {/* Right: Sidebar */}
          <View style={styles.sidebarCol}>

            {/* Trending */}
            <View style={styles.sidebarSection}>
              <View style={styles.sidebarSectionHeader}>
                <Text style={styles.sidebarSectionTitle}>Trending</Text>
                <TouchableOpacity activeOpacity={0.8}>
                  <Text style={styles.seeAllText}>See all</Text>
                </TouchableOpacity>
              </View>
              {TRENDING.map(item => (
                <TouchableOpacity key={item.id} style={styles.trendingItem} activeOpacity={0.8}>
                  <View style={styles.trendingHashBadge}>
                    <Ionicons name="pricetag-outline" size={12} color={theme.primary} />
                  </View>
                  <View style={styles.trendingInfo}>
                    <Text style={styles.trendingTag} numberOfLines={1}>
                      {item.tag}
                    </Text>
                    <Text style={styles.trendingCount}>{item.count}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.sidebarDivider} />

            {/* Who to Follow */}
            <View style={styles.sidebarSection}>
              <View style={styles.sidebarSectionHeader}>
                <Text style={styles.sidebarSectionTitle}>Who to follow</Text>
                <TouchableOpacity activeOpacity={0.8}>
                  <Text style={styles.seeAllText}>See all</Text>
                </TouchableOpacity>
              </View>
              {TO_FOLLOW.map(user => (
                <View key={user.id} style={styles.followItem}>
                  <Image source={user.avatar} style={styles.followAvatar} resizeMode="cover" />
                  <View style={styles.followInfo}>
                    <Text style={styles.followUsername} numberOfLines={1}>{user.username}</Text>
                    <Text style={styles.followRole} numberOfLines={1}>{user.role}</Text>
                  </View>
                  <TouchableOpacity style={styles.followBtn} activeOpacity={0.85}>
                    <Text style={styles.followBtnText}>Follow</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

          </View>
        </View>

      </ScrollView>

      {/* ── FAB ── */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.85}>
        <Ionicons name="add" size={26} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

// ── Stack Navigator ────────────────────────────────────────────────

const UserCommunity = () => {
  const theme = useTheme() as AppTheme;
  const headerOpts = getHeaderOptions(theme);

  return (
    <Stack.Navigator
      screenOptions={{
        ...headerOpts,
        headerShown: true,
        headerTitle: 'Community',
        headerLeft: () => (
          <View style={{ marginLeft: 16 }}>
            <AppLogo iconOnly size="sm" />
          </View>
        ),
        headerRight: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
            <TouchableOpacity style={{ marginRight: 14 }}>
              <Ionicons name="search-outline" size={22} color={theme.text} />
            </TouchableOpacity>
            <TouchableOpacity style={{ marginRight: 14 }}>
              <View>
                <Ionicons name="notifications-outline" size={22} color={theme.text} />
                <View
                  style={{
                    position: 'absolute',
                    top: -1,
                    right: -1,
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: theme.notification,
                    borderWidth: 1.5,
                    borderColor: theme.card,
                  }}
                />
              </View>
            </TouchableOpacity>
            <Image
              source={require('../../assets/avatar.jpg')}
              style={{ width: 28, height: 28, borderRadius: 14 }}
            />
          </View>
        ),
      }}
    >
      <Stack.Screen name="Community" component={UserCommunityContent} />
    </Stack.Navigator>
  );
};

export default UserCommunity;
