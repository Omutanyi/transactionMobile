import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@emotion/react';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme } from '../../../../theme';
import { createStyles } from '../../InstantMatchScreen.styles';
import { Shop } from '../../../../types';
import TileMap from '../../../../components/map/TileMap';
import { formatCoordinates, formatDistance, openInMaps } from '../../../../utils/maps';
import { toast } from '../../../../utils/ToastService';

interface Props {
  shop: Shop;
  /** Players checked in at the shop (from the presence board). */
  playersHere: number;
  /** Matches currently running in the shop. */
  liveMatches: number;
  /** The shop is the location selected for the match being set up. */
  selected: boolean;
  onSelect: () => void;
}

/**
 * The physical shop for an in-shop match: where it is on a map, who is on duty,
 * how many players are inside and how many games are running.
 */
const ShopLocationCard: React.FC<Props> = ({
  shop,
  playersHere,
  liveMatches,
  selected,
  onSelect,
}) => {
  const theme = useTheme() as AppTheme;
  const styles = createStyles(theme);

  const distance = formatDistance(shop.distanceKm);
  const hasCoordinates =
    shop.latitude !== undefined &&
    shop.longitude !== undefined &&
    !(shop.latitude === 0 && shop.longitude === 0);

  const handleDirections = async () => {
    if (shop.latitude === undefined || shop.longitude === undefined) return;
    const opened = await openInMaps(shop.latitude, shop.longitude, shop.name);
    if (!opened) toast.error('No map app is available on this device');
  };

  return (
    <View style={[styles.shopDetailCard, selected && styles.shopDetailCardActive]}>
      <View style={styles.shopDetailHeader}>
        <View style={styles.shopIconWrap}>
          <Ionicons name="storefront" size={15} color={theme.primary} />
        </View>
        <View style={styles.shopInfo}>
          <Text style={styles.shopName} numberOfLines={1}>{shop.name}</Text>
          <Text style={styles.shopMeta} numberOfLines={1}>
            {shop.address ?? shop.city ?? (hasCoordinates
              ? formatCoordinates(shop.latitude as number, shop.longitude as number)
              : 'Address not provided')}
            {distance ? ` • ${distance}` : ''}
          </Text>
        </View>
        <View
          style={[
            styles.shopStatusPill,
            {
              backgroundColor: (shop.isOnline === false ? theme.subText : theme.success) + '22',
              borderColor: shop.isOnline === false ? theme.subText : theme.success,
            },
          ]}
        >
          <Text
            style={[
              styles.shopStatusText,
              { color: shop.isOnline === false ? theme.subText : theme.success },
            ]}
          >
            {shop.isOnline === false ? 'CLOSED' : 'OPEN'}
          </Text>
        </View>
      </View>

      <View style={styles.mapWrap}>
        <TileMap
          latitude={shop.latitude ?? 0}
          longitude={shop.longitude ?? 0}
          spanKm={shop.distanceKm && shop.distanceKm > 0 ? shop.distanceKm : 1}
          height={148}
          label={shop.name}
          badge={liveMatches > 0 ? `${liveMatches} LIVE` : undefined}
        />
      </View>

      <View style={styles.shopFactsRow}>
        <View style={styles.shopFact}>
          <Ionicons name="people-outline" size={13} color={theme.info} />
          <Text style={styles.shopFactText}>
            {playersHere} {playersHere === 1 ? 'player' : 'players'} inside
          </Text>
        </View>
        <View style={styles.shopFact}>
          <Ionicons name="game-controller-outline" size={13} color={theme.warning} />
          <Text style={styles.shopFactText}>
            {liveMatches} {liveMatches === 1 ? 'match' : 'matches'} live
          </Text>
        </View>
        {shop.chalkmanName ? (
          <View style={styles.shopFact}>
            <Ionicons name="shield-checkmark-outline" size={13} color={theme.primary} />
            <Text style={styles.shopFactText}>{shop.chalkmanName} on duty</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.shopActions}>
        <TouchableOpacity
          style={[styles.shopActionBtn, selected && styles.shopActionBtnActive]}
          onPress={onSelect}
          activeOpacity={0.85}
        >
          <Ionicons
            name={selected ? 'checkmark-circle' : 'radio-button-off-outline'}
            size={15}
            color={selected ? '#fff' : theme.primary}
          />
          <Text style={[styles.shopActionText, selected && styles.shopActionTextActive]}>
            {selected ? 'PLAYING HERE' : 'PLAY HERE'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.shopGhostBtn, !hasCoordinates && styles.shopGhostBtnDisabled]}
          onPress={handleDirections}
          activeOpacity={0.85}
          disabled={!hasCoordinates}
        >
          <Ionicons name="navigate-outline" size={15} color={theme.info} />
          <Text style={styles.shopGhostText}>DIRECTIONS</Text>
        </TouchableOpacity>
      </View>

      {!hasCoordinates && (
        <Text style={styles.shopNote}>
          This shop has no coordinates yet — ask the backend to return
          <Text style={{ fontWeight: '900' }}> Latitude</Text> and
          <Text style={{ fontWeight: '900' }}> Longitude</Text> with the shop.
        </Text>
      )}
    </View>
  );
};

export default ShopLocationCard;
