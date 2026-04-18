import {createMMKV} from 'react-native-mmkv';

export const storage = createMMKV({
  id: 'finder-storage',
});

// ─── Favorites Storage Helpers ─────────────────────────
const FAVORITES_KEY = 'favorites_events';

export const getFavoriteIds = (): string[] => {
  try {
    const raw = storage.getString(FAVORITES_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Return empty on parse error
  }
  return [];
};

export const saveFavoriteIds = (ids: string[]): void => {
  try {
    storage.set(FAVORITES_KEY, JSON.stringify(ids));
  } catch {
    // Silently fail
  }
};

export const addFavoriteId = (id: string): string[] => {
  const current = getFavoriteIds();
  if (!current.includes(id)) {
    const updated = [...current, id];
    saveFavoriteIds(updated);
    return updated;
  }
  return current;
};

export const removeFavoriteId = (id: string): string[] => {
  const current = getFavoriteIds();
  const updated = current.filter(fid => fid !== id);
  saveFavoriteIds(updated);
  return updated;
};

export const isFavorite = (id: string): boolean => {
  return getFavoriteIds().includes(id);
};

// ─── Favorites Event Data Storage ──────────────────────
const FAVORITES_DATA_KEY = 'favorites_events_data';

export const getFavoritesData = <T>(): T[] => {
  try {
    const raw = storage.getString(FAVORITES_DATA_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Return empty on parse error
  }
  return [];
};

export const saveFavoritesData = <T>(events: T[]): void => {
  try {
    storage.set(FAVORITES_DATA_KEY, JSON.stringify(events));
  } catch {
    // Silently fail
  }
};
