import { request } from '../requests';
import apis from '../api';

export interface GameOption {
  /** Stable key used to track the selection in the UI. */
  id: string;
  /**
   * The identifier the API expects when creating a match / tournament.
   * Kept separate from `id` because the UI key may fall back to a slug or the
   * array index when the record has no primary key.
   */
  gameId: string;
  name: string;
  image: any;
  /** Max players supported by the game (undefined when the API omits it). */
  maxPlayers?: number;
}

/**
 * GET /game on the root API url and normalize the response into GameOption[].
 * Handles a few common response shapes ([], { games }, { data }) and falls back
 * to local images (cycled) when the API record has no image url.
 */
export async function fetchGames(fallbackImages: any[]): Promise<GameOption[]> {
  const data = await request(apis.games, { method: 'GET' });
  const list: any[] = Array.isArray(data) ? data : data?.games ?? data?.data ?? [];

  return list
    .filter((g: any) => !(g?.IsDeleted ?? g?.isDeleted) && !(g?.DeletedAt ?? g?.deletedAt))
    .map((g: any, i: number) => {
      // API returns PascalCase (Id, Name, ImageUrl); fall back to camelCase variants.
      const url =
        g?.ImageUrl ?? g?.imageUrl ?? g?.image ?? g?.icon ?? g?.thumbnail ?? g?.logo;
      const rawId = g?.Id ?? g?.ID ?? g?.gameId ?? g?.GameId ?? g?.id ?? g?._id;
      const id = String(rawId ?? g?.slug ?? g?.Name ?? g?.name ?? i);
      const name = String(g?.Name ?? g?.name ?? g?.title ?? 'Game').trim();
      const rawMax = g?.MaxPlayers ?? g?.maxPlayers ?? g?.PlayerCount ?? g?.playerCount;
      const maxPlayers = Number(rawMax);
      return {
        id,
        // The API identifier: prefer the real primary key, never the local index.
        gameId: rawId !== undefined && rawId !== null ? String(rawId) : id,
        name,
        image: url ? { uri: url } : fallbackImages[i % fallbackImages.length],
        ...(Number.isFinite(maxPlayers) && maxPlayers > 0 ? { maxPlayers } : {}),
      };
    });
}
