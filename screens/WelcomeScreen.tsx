import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@emotion/react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppTheme } from '../theme';
import { createStyles } from './WelcomeScreen.styles';

interface Props {
  navigation: any;
}

interface Feature {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: (t: AppTheme) => string;
}

interface Slide {
  hero: keyof typeof Ionicons.glyphMap;
  heroColor: (t: AppTheme) => string;
  features: Feature[];
}

const SLIDES: Slide[] = [
  {
    hero: 'game-controller',
    heroColor: (t) => t.secondary,
    features: [
      { icon: 'trophy', label: 'Discover\nTournaments', color: (t) => t.secondary },
      { icon: 'flash', label: 'Challenge\nPlayers', color: (t) => t.info },
      { icon: 'cash', label: 'Win\nPrizes', color: (t) => t.rankGold },
    ],
  },
  {
    hero: 'people',
    heroColor: (t) => t.info,
    features: [
      { icon: 'chatbubbles', label: 'Join the\nCommunity', color: (t) => t.info },
      { icon: 'shield-checkmark', label: 'Fair\nMatchmaking', color: (t) => t.success },
      { icon: 'medal', label: 'Climb the\nRanks', color: (t) => t.rankGold },
    ],
  },
  {
    hero: 'rocket',
    heroColor: (t) => t.primary,
    features: [
      { icon: 'wallet', label: 'Instant\nPayouts', color: (t) => t.success },
      { icon: 'stats-chart', label: 'Track Your\nStats', color: (t) => t.primary },
      { icon: 'star', label: 'Earn\nRewards', color: (t) => t.rankGold },
    ],
  },
];

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme() as AppTheme;
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const styles = createStyles(theme, insets.top, insets.bottom);
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);

  const isLast = index === SLIDES.length - 1;

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(e.nativeEvent.contentOffset.x / width);
    if (next !== index) setIndex(next);
  };

  const handleNext = () => {
    if (isLast) {
      navigation.navigate('Signup');
    } else {
      scrollRef.current?.scrollTo({ x: width * (index + 1), animated: true });
    }
  };

  return (
    <View style={styles.container}>
      {/* Skip */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.skipBtn} onPress={() => navigation.navigate('Login')} hitSlop={10}>
          <Text style={styles.skipText}>Skip</Text>
          <Ionicons name="chevron-forward" size={18} color={theme.subText} />
        </TouchableOpacity>
      </View>

      {/* Paged slides */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        style={{ flexGrow: 0 }}
      >
        {SLIDES.map((slide, i) => (
          <View key={i} style={[styles.slide, { width }]}>
            <View style={styles.heroWrapper}>
              <View style={[styles.heroGlow, { borderColor: slide.heroColor(theme), shadowColor: slide.heroColor(theme) }]}>
                <Ionicons name={slide.hero} size={96} color={slide.heroColor(theme)} />
              </View>
            </View>

            <Text style={styles.appName}>
              Pro<Text style={{ color: theme.primary }}>Gamer</Text>
            </Text>
            <Text style={styles.tagline}>Play. Compete. Dominate.</Text>

            <View style={styles.featureRow}>
              {slide.features.map((f) => {
                const c = f.color(theme);
                return (
                  <View key={f.label} style={[styles.featureCard, { borderColor: c }]}>
                    <View style={styles.featureIconWrap}>
                      <Ionicons name={f.icon} size={34} color={c} />
                    </View>
                    <Text style={styles.featureLabel}>{f.label}</Text>
                    <View style={[styles.featureUnderline, { backgroundColor: c }]} />
                  </View>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Dots */}
      <View style={styles.dotsRow}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                width: i === index ? 22 : 9,
                backgroundColor: i === index ? theme.primary : theme.border,
              },
            ]}
          />
        ))}
      </View>

      {/* CTA */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.ctaButton} onPress={handleNext} activeOpacity={0.85}>
          <Text style={styles.ctaText}>{isLast ? 'Get Started' : 'Next'}</Text>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>

        <View style={styles.loginRow}>
          <Text style={styles.loginRowText}>Already a player? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')} hitSlop={8}>
            <Text style={styles.loginRowLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default WelcomeScreen;
