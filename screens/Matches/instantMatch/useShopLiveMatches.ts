import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { ShopMatchSummary } from '../../../types';
import { fetchShopLiveMatches } from '../../../services/match';
import { describeApiError } from '../../../utils/apiErrors';

/** How often the shop board is refreshed while the screen is open. */
export const SHOP_LIVE_POLL_MS = 8000;

export interface ShopLiveBoard {
  matches: ShopMatchSummary[];
  /** First load for the current shop. */
  loading: boolean;
  /** A manual or background refresh is in flight. */
  refreshing: boolean;
  error: string | null;
  /** Epoch ms of the last successful read — drives "updated Xs ago". */
  lastUpdated: number | null;
  /** True when at least one match is being played right now. */
  hasLiveMatches: boolean;
  refresh: () => void;
}

type LoadMode = 'initial' | 'poll' | 'manual';

/**
 * Keeps the shop's live board up to date.
 *
 * Polling (rather than a socket) is deliberate: it works with the REST backend
 * that already exists, survives flaky lounge wifi, and stops entirely while the
 * app is backgrounded so it costs nothing when nobody is looking.
 */
export const useShopLiveMatches = (
  shopId: string | null | undefined,
  enabled: boolean,
): ShopLiveBoard => {
  const [matches, setMatches] = useState<ShopMatchSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  const mounted = useRef(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(
    () => () => {
      mounted.current = false;
    },
    [],
  );

  const load = useCallback(
    async (mode: LoadMode) => {
      if (!enabled || !shopId) return;
      if (mode === 'initial') setLoading(true);
      if (mode === 'manual') setRefreshing(true);
      try {
        const list = await fetchShopLiveMatches(shopId);
        if (!mounted.current) return;
        setMatches(list);
        setError(null);
        setLastUpdated(Date.now());
      } catch (e) {
        if (!mounted.current) return;
        // Keep the previous list on a failed poll — a stale board beats a blank
        // one when the wifi drops mid-match.
        setError(describeApiError(e, 'The live board is unavailable right now.'));
      } finally {
        if (!mounted.current) return;
        setLoading(false);
        setRefreshing(false);
      }
    },
    [enabled, shopId],
  );

  // Reset and load whenever the shop changes.
  useEffect(() => {
    if (!enabled || !shopId) {
      setMatches([]);
      setError(null);
      setLastUpdated(null);
      setLoading(false);
      return;
    }
    load('initial');
  }, [enabled, load, shopId]);

  // Poll only while the screen is mounted and the app is in the foreground.
  useEffect(() => {
    if (!enabled || !shopId) return;

    const start = () => {
      if (intervalRef.current) return;
      intervalRef.current = setInterval(() => {
        load('poll');
      }, SHOP_LIVE_POLL_MS);
    };
    const stop = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    start();
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        load('poll');
        start();
      } else {
        stop();
      }
    });

    return () => {
      stop();
      subscription.remove();
    };
  }, [enabled, load, shopId]);

  const refresh = useCallback(() => {
    load('manual');
  }, [load]);

  return {
    matches,
    loading,
    refreshing,
    error,
    lastUpdated,
    hasLiveMatches: matches.some(match => match.status === 'active'),
    refresh,
  };
};
