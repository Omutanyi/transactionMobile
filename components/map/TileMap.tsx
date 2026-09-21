// components/map/TileMap.tsx
// A map with no native dependency: it draws OpenStreetMap raster tiles as plain
// Image elements and pins the centre point. Works in Expo Go and on web with no
// API key — only the tiles' attribution, which is rendered on the map.

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  LayoutChangeEvent,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@emotion/react';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme } from '../../theme';
import { buildTileGrid, clampZoom, zoomForSpan } from './tileMath';

interface Props {
  latitude: number;
  longitude: number;
  /** Fixed zoom. When omitted it is derived from `spanKm`. */
  zoom?: number;
  /** How much ground the map should cover — used to pick a zoom level. */
  spanKm?: number;
  height?: number;
  /** Caption rendered over the map (usually the shop name). */
  label?: string;
  /** Pin colour — defaults to the theme primary. */
  markerColor?: string;
  /** Small pill in the corner, e.g. "LIVE". */
  badge?: string;
}

const ATTRIBUTION = '© OpenStreetMap';

const TileMap: React.FC<Props> = ({
  latitude,
  longitude,
  zoom,
  spanKm,
  height = 150,
  label,
  markerColor,
  badge,
}) => {
  const theme = useTheme() as AppTheme;
  const [width, setWidth] = useState(0);
  const [loadedTiles, setLoadedTiles] = useState(0);
  const [failedTiles, setFailedTiles] = useState(0);

  const resolvedZoom = clampZoom(zoom ?? zoomForSpan(spanKm ?? 1));
  const pin = markerColor ?? theme.primary;

  const hasCoordinates =
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    !(latitude === 0 && longitude === 0);

  const tiles = useMemo(
    () => (hasCoordinates ? buildTileGrid({ latitude, longitude, zoom: resolvedZoom, width, height }) : []),
    [hasCoordinates, height, latitude, longitude, resolvedZoom, width],
  );

  const handleLayout = (event: LayoutChangeEvent) => {
    const next = event.nativeEvent.layout.width;
    if (next !== width) {
      setWidth(next);
      setLoadedTiles(0);
      setFailedTiles(0);
    }
  };

  const ready = loadedTiles > 0;
  const tilesFailed = tiles.length > 0 && failedTiles >= tiles.length;

  return (
    <View
      style={[
        styles.container,
        { height, backgroundColor: theme.statCard, borderColor: theme.border },
      ]}
      onLayout={handleLayout}
    >
      {tiles.map(tile => (
        <Image
          key={tile.key}
          source={{ uri: tile.url }}
          style={{
            position: 'absolute',
            left: tile.left,
            top: tile.top,
            width: tile.size,
            height: tile.size,
          }}
          onLoad={() => setLoadedTiles(count => count + 1)}
          onError={() => setFailedTiles(count => count + 1)}
        />
      ))}

      {/* Placeholder while the first tiles stream in. */}
      {hasCoordinates && !ready && !tilesFailed && (
        <View style={styles.centreFill}>
          <ActivityIndicator size="small" color={theme.primary} />
        </View>
      )}

      {/* Offline / blocked tile server — say so instead of showing a blank box. */}
      {tilesFailed && (
        <View style={styles.centreFill}>
          <Ionicons name="cloud-offline-outline" size={22} color={theme.subText} />
          <Text style={[styles.fallbackText, { color: theme.subText }]}>
            Map tiles unavailable offline
          </Text>
        </View>
      )}

      {!hasCoordinates && (
        <View style={styles.centreFill}>
          <Ionicons name="location-outline" size={22} color={theme.subText} />
          <Text style={[styles.fallbackText, { color: theme.subText }]}>
            This shop has no map location yet
          </Text>
        </View>
      )}

      {/* Centre pin. */}
      {hasCoordinates && (
        <View style={styles.markerWrap} pointerEvents="none">
          <View style={[styles.markerHalo, { backgroundColor: pin + '33' }]}>
            <View style={[styles.markerDot, { backgroundColor: pin }]}>
              <Ionicons name="storefront" size={12} color="#fff" />
            </View>
          </View>
        </View>
      )}

      {label ? (
        <View style={styles.labelChip}>
          <Ionicons name="location" size={11} color="#fff" />
          <Text style={styles.labelText} numberOfLines={1}>
            {label}
          </Text>
        </View>
      ) : null}

      {badge ? (
        <View style={[styles.badgeChip, { backgroundColor: theme.success }]}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      ) : null}

      {hasCoordinates ? (
        <View style={styles.attribution}>
          <Text style={styles.attributionText}>{ATTRIBUTION}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  centreFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  fallbackText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  markerWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerHalo: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  labelChip: {
    position: 'absolute',
    left: 8,
    bottom: 8,
    maxWidth: '70%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9,
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.66)',
  },
  labelText: {
    color: '#fff',
    fontSize: 10.5,
    fontWeight: '800',
  },
  badgeChip: {
    position: 'absolute',
    left: 8,
    top: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  attribution: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderTopLeftRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.72)',
  },
  attributionText: {
    fontSize: 7.5,
    color: '#3a3a3a',
    fontWeight: '700',
  },
});

export default TileMap;
