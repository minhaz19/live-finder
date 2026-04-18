import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  getFavoriteIds,
  saveFavoriteIds,
  getFavoritesData,
  saveFavoritesData,
} from '../utils/storage';
import { Event } from '../types/event';

interface FavoritesState {
  ids: string[];
  events: Event[];
}

const initialState: FavoritesState = {
  ids: getFavoriteIds(),
  events: getFavoritesData<Event>(),
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<Event>) => {
      const event = action.payload;
      const index = state.ids.indexOf(event.id);

      if (index === -1) {
        // Add to favorites
        state.ids.push(event.id);
        state.events.push(event);
      } else {
        // Remove from favorites
        state.ids.splice(index, 1);
        state.events = state.events.filter(e => e.id !== event.id);
      }

      // Persist to MMKV
      saveFavoriteIds(state.ids);
      saveFavoritesData(state.events);
    },

    removeFavorite: (state, action: PayloadAction<string>) => {
      const eventId = action.payload;
      state.ids = state.ids.filter(id => id !== eventId);
      state.events = state.events.filter(e => e.id !== eventId);

      saveFavoriteIds(state.ids);
      saveFavoritesData(state.events);
    },

    clearAllFavorites: state => {
      state.ids = [];
      state.events = [];
      saveFavoriteIds([]);
      saveFavoritesData([]);
    },
  },
});

export const { toggleFavorite, removeFavorite, clearAllFavorites } =
  favoritesSlice.actions;

// Selectors
export const selectFavoriteIds = (state: { favorites: FavoritesState }) =>
  state.favorites.ids;

export const selectFavoriteEvents = (state: { favorites: FavoritesState }) =>
  state.favorites.events;

export const selectIsFavorite = (
  state: { favorites: FavoritesState },
  id: string,
) => state.favorites.ids.includes(id);

export default favoritesSlice.reducer;
