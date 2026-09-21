// utils/maps.ts
// Deep links and formatting helpers for the shop map.

import { Linking, Platform } from 'react-native';

/** Builds a native-maps deep link for a coordinate. */
export const buildMapsUrl = (
  latitude: number,
  longitude: number,
  label?: string,
): string => {
  const name = encodeURIComponent(label ?? `${latitude},${longitude}`);
  if (Platform.OS === 'ios') {
    return `http://maps.apple.com/?ll=${latitude},${longitude}&q=${name}`;
  }
  return `geo:${latitude},${longitude}?q=${latitude},${longitude}(${name})`;
};

/** Opens the device's map app on a shop. Resolves false when nothing can. */
export const openInMaps = async (
  latitude: number,
  longitude: number,
  label?: string,
): Promise<boolean> => {
  try {
    await Linking.openURL(buildMapsUrl(latitude, longitude, label));
    return true;
  } catch {
    return false;
  }
};

/** "450 m" / "2.4 km" — short enough for a chip. */
export const formatDistance = (distanceKm?: number): string | null => {
  if (distanceKm === undefined || !Number.isFinite(distanceKm) || distanceKm < 0) return null;
  if (distanceKm < 1) return `${Math.round(distanceKm * 1000)} m away`;
  if (distanceKm < 10) return `${distanceKm.toFixed(1)} km away`;
  return `${Math.round(distanceKm)} km away`;
};

/** "1.28442° S, 36.82002° E" — for when a shop has no readable address. */
export const formatCoordinates = (latitude: number, longitude: number): string => {
  const lat = `${Math.abs(latitude).toFixed(5)}° ${latitude >= 0 ? 'N' : 'S'}`;
  const lon = `${Math.abs(longitude).toFixed(5)}° ${longitude >= 0 ? 'E' : 'W'}`;
  return `${lat}, ${lon}`;
};

/** Straight-line distance between two points, in km (haversine). */
export const distanceBetweenKm = (
  latA: number,
  lonA: number,
  latB: number,
  lonB: number,
): number => {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(latB - latA);
  const dLon = toRad(lonB - lonA);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(latA)) * Math.cos(toRad(latB)) * Math.sin(dLon / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};
