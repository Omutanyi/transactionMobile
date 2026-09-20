import { request } from '../requests';
import apis from '../api';

export interface GameOption {
  id: string;
  name: string;
  image: any;
  /** Max players supported by the game (undefined when the API omits it). */
  maxPlayers?: number;
}

/**
 * GET /games on the root API url and normalize the response into GameOption[].
 * Handles a few common response shapes ([], { games }, { data }) and falls back
 * to local images (cycled) when the API record has no image url.
 */
export async function fetchGames(fallbackImages: any[]): Promise<GameOption[]> {
  const data = await request(apis.games, { method: 'GET' });
  console.log('Fetched games data:', data);
  const list: any[] = Array.isArray(data) ? data : data?.games ?? data?.data ?? [];

  return list
    .filter((g: any) => !(g?.IsDeleted ?? g?.isDeleted) && !(g?.DeletedAt ?? g?.deletedAt))
    .map((g: any, i: number) => {
      // API returns PascalCase (Id, Name, ImageUrl); fall back to camelCase variants.
      const url =
        g?.ImageUrl ?? g?.imageUrl ?? g?.image ?? g?.icon ?? g?.thumbnail ?? g?.logo;
      const id = g?.Id ?? g?.id ?? g?._id ?? g?.slug ?? g?.Name ?? g?.name ?? i;
      const name = String(g?.Name ?? g?.name ?? g?.title ?? 'Game').trim();
      const rawMax = g?.MaxPlayers ?? g?.maxPlayers ?? g?.PlayerCount ?? g?.playerCount;
      const maxPlayers = Number(rawMax);
      return {
        id: String(id),
        name,
        image: url ? { uri: url } : fallbackImages[i % fallbackImages.length],
        ...(Number.isFinite(maxPlayers) && maxPlayers > 0 ? { maxPlayers } : {}),
      };
    });
}
