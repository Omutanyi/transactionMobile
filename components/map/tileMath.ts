// components/map/tileMath.ts
// Slippy-map maths for the dependency-free map view. Everything here is pure so
// it can be unit-tested without a renderer.

export const TILE_SIZE = 256;
export const MIN_ZOOM = 1;
export const MAX_ZOOM = 19;

/** Clamps a zoom level into the range the tile servers serve. */
export const clampZoom = (zoom: number): number =>
  Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(zoom)));

/** Fractional tile x for a longitude at a zoom level. */
export const lonToTileX = (longitude: number, zoom: number): number =>
  ((longitude + 180) / 360) * 2 ** zoom;

/** Fractional tile y for a latitude at a zoom level (Web Mercator). */
export const latToTileY = (latitude: number, zoom: number): number => {
  const radians = (latitude * Math.PI) / 180;
  return ((1 - Math.log(Math.tan(radians) + 1 / Math.cos(radians)) / Math.PI) / 2) * 2 ** zoom;
};

/** Longitude at the centre of a tile column. */
export const tileXToLon = (tileX: number, zoom: number): number =>
  (tileX / 2 ** zoom) * 360 - 180;

/** Latitude at the centre of a tile row. */
export const tileYToLat = (tileY: number, zoom: number): number => {
  const n = Math.PI - (2 * Math.PI * tileY) / 2 ** zoom;
  return (180 / Math.PI) * Math.atan(Math.sinh(n));
};

export const tileUrl = (x: number, y: number, zoom: number): string =>
  `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`;

export interface MapTile {
  /** Stable key: `zoom/x/y`. */
  key: string;
  url: string;
  x: number;
  y: number;
  /** Position inside the viewport, in pixels. */
  left: number;
  top: number;
  size: number;
}

export interface TileGridOptions {
  latitude: number;
  longitude: number;
  zoom: number;
  width: number;
  height: number;
  tileSize?: number;
}

/**
 * Every tile needed to cover a `width × height` viewport centred on a point,
 * already positioned, so the map can be drawn with plain `Image` elements.
 */
export const buildTileGrid = ({
  latitude,
  longitude,
  zoom,
  width,
  height,
  tileSize = TILE_SIZE,
}: TileGridOptions): MapTile[] => {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return [];
  if (width <= 0 || height <= 0) return [];

  const safeZoom = clampZoom(zoom);
  const maxTile = 2 ** safeZoom - 1;

  // Centre of the viewport in pixels, in world coordinates.
  const centreX = lonToTileX(longitude, safeZoom) * tileSize;
  const centreY = latToTileY(latitude, safeZoom) * tileSize;

  const firstCol = Math.floor((centreX - width / 2) / tileSize);
  const lastCol = Math.floor((centreX + width / 2) / tileSize);
  const firstRow = Math.floor((centreY - height / 2) / tileSize);
  const lastRow = Math.floor((centreY + height / 2) / tileSize);

  const tiles: MapTile[] = [];
  for (let col = firstCol; col <= lastCol; col += 1) {
    for (let row = firstRow; row <= lastRow; row += 1) {
      // Wrapping in x; rows outside the world are simply dropped.
      if (row < 0 || row > maxTile) continue;
      const wrappedCol = ((col % (maxTile + 1)) + (maxTile + 1)) % (maxTile + 1);
      tiles.push({
        key: `${safeZoom}/${wrappedCol}/${row}`,
        url: tileUrl(wrappedCol, row, safeZoom),
        x: wrappedCol,
        y: row,
        left: col * tileSize - centreX + width / 2,
        top: row * tileSize - centreY + height / 2,
        size: tileSize,
      });
    }
  }
  return tiles;
};

/**
 * Chooses a zoom level that keeps a shop and its surroundings readable on a
 * small phone map. Closer shops get a tighter zoom.
 */
export const zoomForSpan = (spanKm: number): number => {
  if (!Number.isFinite(spanKm) || spanKm <= 0) return 16;
  if (spanKm < 0.4) return 17;
  if (spanKm < 1) return 16;
  if (spanKm < 3) return 15;
  if (spanKm < 8) return 14;
  return 13;
};
