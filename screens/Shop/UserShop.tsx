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
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme } from '../../theme';
import {
  createStyles,
  BADGE_COLORS,
  BadgeKey,
} from './UserShop.styles';
import AppLogo from '../../components/AppLogo';

const Stack = createStackNavigator();

// ── Static data ────────────────────────────────────────────────────

interface Category {
  id: string;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
}

const CATEGORIES: Category[] = [
  { id: 'all', label: 'All', icon: 'apps-outline' },
  { id: 'headsets', label: 'Headsets', icon: 'headset-outline' },
  { id: 'controllers', label: 'Controllers', icon: 'game-controller-outline' },
  { id: 'mousepads', label: 'Mousepads', icon: 'tablet-landscape-outline' },
  { id: 'apparel', label: 'Apparel', icon: 'shirt-outline' },
];

interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  badge?: BadgeKey;
  stock?: number;
  image: any;
  specs?: string[];
}

const TOP_PICKS: Product[] = [
  {
    id: 1,
    name: 'RGB Quantum 600 Gaming Headset',
    brand: 'HyperX',
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.6,
    reviews: 1200,
    badge: 'LIMITED',
    stock: 6,
    image: require('../../assets/gaming.jpg'),
  },
  {
    id: 2,
    name: 'UltraLight Pro Gaming Mouse',
    brand: 'Logitech G',
    price: 49.99,
    originalPrice: 69.99,
    rating: 4.8,
    reviews: 2300,
    badge: 'DEAL',
    stock: 10,
    image: require('../../assets/avatar.jpg'),
  },
  {
    id: 3,
    name: 'Xbox Elite Series 2 Controller',
    brand: 'Xbox',
    price: 139.99,
    originalPrice: 179.99,
    rating: 4.7,
    reviews: 890,
    badge: 'LIMITED',
    stock: 4,
    image: require('../../assets/profile.jpg'),
  },
];

const FEATURED: Product[] = [
  {
    id: 4,
    name: 'Arctis Nova Pro Wireless',
    brand: 'SteelSeries',
    price: 299.99,
    originalPrice: 349.99,
    rating: 4.9,
    reviews: 1100,
    badge: 'NEW',
    specs: ['360° Audio', 'ANC', 'Wireless'],
    image: require('../../assets/avatar.jpg'),
  },
  {
    id: 5,
    name: 'DualSense Edge Wireless Controller',
    brand: 'PlayStation',
    price: 199.99,
    originalPrice: 239.99,
    rating: 4.8,
    reviews: 148,
    badge: 'BESTSELLER',
    specs: ['Custom Triggers', 'Paddles', 'Swappable'],
    image: require('../../assets/profile.jpg'),
  },
];

// ── Helpers ────────────────────────────────────────────────────────

const formatCount = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);

const pad2 = (n: number) => String(n).padStart(2, '0');

// ── Content screen ─────────────────────────────────────────────────

const UserShopContent = () => {
  const theme = useTheme() as AppTheme;
  const styles = createStyles(theme);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [countdown, setCountdown] = useState({ hrs: 2, mins: 15, secs: 47 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        let { hrs, mins, secs } = prev;
        secs -= 1;
        if (secs < 0) { secs = 59; mins -= 1; }
        if (mins < 0) { mins = 59; hrs -= 1; }
        if (hrs < 0) return prev;
        return { hrs, mins, secs };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    return (
      <>
        {Array.from({ length: full }).map((_, i) => (
          <Ionicons key={`f${i}`} name="star" size={10} color={theme.warning} />
        ))}
        {half && <Ionicons name="star-half" size={10} color={theme.warning} />}
        {Array.from({ length: empty }).map((_, i) => (
          <Ionicons key={`e${i}`} name="star-outline" size={10} color={theme.subText} />
        ))}
      </>
    );
  };

  const renderCard = (product: Product, isTopPick: boolean) => {
    const bc = product.badge ? BADGE_COLORS[product.badge] : null;
    return (
      <TouchableOpacity
        key={product.id}
        style={isTopPick ? styles.topPickCard : styles.featuredCard}
        activeOpacity={0.92}
      >
        {/* Image */}
        <View style={isTopPick ? styles.topPickImageWrapper : styles.featuredImageWrapper}>
          <Image
            source={product.image}
            style={isTopPick ? styles.topPickImage : styles.featuredImage}
            resizeMode="cover"
          />
          <View style={styles.cardBadgeRow}>
            {bc ? (
              <View
                style={[
                  styles.productBadge,
                  { backgroundColor: bc.bg, borderColor: bc.border },
                ]}
              >
                <Text style={[styles.productBadgeText, { color: bc.text }]}>
                  {product.badge}
                </Text>
              </View>
            ) : (
              <View />
            )}
            <TouchableOpacity style={styles.wishlistBtn} activeOpacity={0.8}>
              <Ionicons name="heart-outline" size={13} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Body */}
        <View style={styles.cardBody}>
          <Text style={styles.productBrand}>{product.brand}</Text>
          <Text style={styles.productName} numberOfLines={2}>
            {product.name}
          </Text>

          <View style={styles.starsRow}>
            {renderStars(product.rating)}
            <Text style={styles.starRatingText}>{product.rating}</Text>
            <Text style={styles.reviewCountText}>({formatCount(product.reviews)})</Text>
          </View>

          {product.specs && (
            <View style={styles.specsRow}>
              {product.specs.map(s => (
                <View key={s} style={styles.specPill}>
                  <Text style={styles.specText}>{s}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.priceRow}>
            <Text style={styles.priceNew}>${product.price.toFixed(2)}</Text>
            <Text style={styles.priceOld}>${product.originalPrice.toFixed(2)}</Text>
          </View>

          {product.stock !== undefined && product.stock <= 10 && (
            <Text style={styles.stockText}>● Only {product.stock} left!</Text>
          )}

          <TouchableOpacity style={styles.addToCartBtn} activeOpacity={0.85}>
            <Ionicons name="cart-outline" size={14} color="#fff" />
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Search bar ── */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={theme.subText} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for gear, brands..."
            placeholderTextColor={theme.subText}
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity activeOpacity={0.8}>
            <Ionicons name="scan-outline" size={18} color={theme.subText} />
          </TouchableOpacity>
        </View>

        {/* ── Category chips ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContent}
        >
          {CATEGORIES.map(cat => {
            const active = activeCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setActiveCategory(cat.id)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={cat.icon}
                  size={13}
                  color={active ? '#fff' : theme.subText}
                />
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── Hero banner ── */}
        <View style={styles.heroBanner}>
          <Image
            source={require('../../assets/gaming.jpg')}
            style={styles.heroCharImg}
            resizeMode="cover"
          />
          <View style={styles.heroImgOverlay} />

          {/* Left content */}
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>LEVEL UP{'\n'}YOUR GEAR</Text>
            <Text style={styles.heroOffer}>20% OFF SITEWIDE</Text>
            <View style={styles.heroCodeRow}>
              <Text style={styles.heroCodeLabel}>Use code:</Text>
              <View style={styles.heroCodeBadge}>
                <Text style={styles.heroCodeText}>GAMER20</Text>
              </View>
            </View>
          </View>

          {/* Right: badge + countdown */}
          <View style={styles.heroRight}>
            <View style={styles.heroTimeBadge}>
              <Text style={styles.heroTimeBadgeText}>LIMITED TIME</Text>
            </View>
            <View style={styles.heroCountdownBox}>
              <Text style={styles.heroCountdownText}>
                {pad2(countdown.hrs)} : {pad2(countdown.mins)} : {pad2(countdown.secs)}
              </Text>
            </View>
          </View>

          {/* Pagination dots */}
          <View style={styles.heroDots}>
            <View style={[styles.heroDot, styles.heroDotActive]} />
            <View style={styles.heroDot} />
            <View style={styles.heroDot} />
          </View>
        </View>

        {/* ── Top Picks ── */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="flash" size={18} color={theme.warning} />
            <Text style={styles.sectionTitle}>Top Picks</Text>
          </View>
          <TouchableOpacity style={styles.viewAllRow} activeOpacity={0.8}>
            <Text style={styles.viewAllText}>View All</Text>
            <Ionicons name="chevron-forward" size={14} color={theme.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.topPicksScroll}
        >
          {TOP_PICKS.map(p => renderCard(p, true))}
        </ScrollView>

        {/* ── Featured Products ── */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="ribbon" size={18} color={theme.rankGold} />
            <Text style={styles.sectionTitle}>Featured Products</Text>
          </View>
          <TouchableOpacity style={styles.viewAllRow} activeOpacity={0.8}>
            <Text style={styles.viewAllText}>View All</Text>
            <Ionicons name="chevron-forward" size={14} color={theme.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.featuredGrid}>
          {FEATURED.map(p => renderCard(p, false))}
        </View>

      </ScrollView>
    </View>
  );
};

// ── Stack Navigator ────────────────────────────────────────────────

const UserShop = () => {
  const theme = useTheme() as AppTheme;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: theme.card },
        headerTitle: () => (
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
            <Text style={{ color: theme.info }}>ProGamer</Text>
            <Text style={{ color: theme.text }}> Shop</Text>
          </Text>
        ),
        headerLeft: () => (
          <View style={{ marginLeft: 16 }}>
            <AppLogo iconOnly size="sm" />
          </View>
        ),
        headerRight: () => (
          <TouchableOpacity style={{ marginRight: 16 }} activeOpacity={0.8}>
            <View>
              <Ionicons name="cart-outline" size={26} color={theme.text} />
              <View
                style={{
                  position: 'absolute',
                  top: -4,
                  right: -7,
                  backgroundColor: theme.secondary,
                  borderRadius: 8,
                  minWidth: 16,
                  height: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 3,
                }}
              >
                <Text style={{ color: '#fff', fontSize: 9, fontWeight: 'bold' }}>3</Text>
              </View>
            </View>
          </TouchableOpacity>
        ),
        headerTintColor: theme.text,
      }}
    >
      <Stack.Screen name="ShopMain" component={UserShopContent} />
    </Stack.Navigator>
  );
};

export default UserShop;
