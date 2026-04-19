/**
 * Unit tests for the favorites Redux slice.
 */

import favoritesReducer, {
  toggleFavorite,
  removeFavorite,
  clearAllFavorites,
} from '../src/store/favoritesSlice';
import type { Event } from '../src/types/event';

// Mock MMKV storage
jest.mock('../src/utils/storage', () => ({
  getFavoriteIds: jest.fn(() => []),
  saveFavoriteIds: jest.fn(),
  getFavoritesData: jest.fn(() => []),
  saveFavoritesData: jest.fn(),
  storage: {
    getString: jest.fn(),
    set: jest.fn(),
  },
}));

const mockEvent: Event = {
  id: 'test-event-1',
  name: 'Test Concert',
  type: 'event',
  url: 'https://ticketmaster.com/event/1',
  images: [
    {
      ratio: '16_9',
      url: 'https://example.com/image.jpg',
      width: 640,
      height: 360,
      fallback: false,
    },
  ],
  dates: {
    start: {
      localDate: '2025-06-15',
      localTime: '19:00:00',
      dateTBD: false,
      dateTBA: false,
      timeTBA: false,
      noSpecificTime: false,
    },
    status: { code: 'onsale' },
  },
  classifications: [
    {
      primary: true,
      segment: { id: 'KZFzniwnSyZfZ7v7nJ', name: 'Music' },
      genre: { id: 'KnvZfZ7vAeA', name: 'Rock' },
    },
  ],
};

const mockEvent2: Event = {
  ...mockEvent,
  id: 'test-event-2',
  name: 'Test Sports Game',
};

describe('favoritesSlice', () => {
  const initialState = { ids: [], events: [] };

  it('should return the initial state', () => {
    expect(favoritesReducer(undefined, { type: 'unknown' })).toEqual(
      initialState,
    );
  });

  it('should add an event to favorites when toggled', () => {
    const state = favoritesReducer(initialState, toggleFavorite(mockEvent));
    expect(state.ids).toContain('test-event-1');
    expect(state.events).toHaveLength(1);
    expect(state.events[0].name).toBe('Test Concert');
  });

  it('should remove an event from favorites when toggled again', () => {
    const stateWithFav = {
      ids: ['test-event-1'],
      events: [mockEvent],
    };
    const state = favoritesReducer(stateWithFav, toggleFavorite(mockEvent));
    expect(state.ids).not.toContain('test-event-1');
    expect(state.events).toHaveLength(0);
  });

  it('should handle multiple favorites', () => {
    let state = favoritesReducer(initialState, toggleFavorite(mockEvent));
    state = favoritesReducer(state, toggleFavorite(mockEvent2));
    expect(state.ids).toHaveLength(2);
    expect(state.events).toHaveLength(2);
  });

  it('should remove a specific favorite by ID', () => {
    const stateWithFavs = {
      ids: ['test-event-1', 'test-event-2'],
      events: [mockEvent, mockEvent2],
    };
    const state = favoritesReducer(
      stateWithFavs,
      removeFavorite('test-event-1'),
    );
    expect(state.ids).toEqual(['test-event-2']);
    expect(state.events).toHaveLength(1);
    expect(state.events[0].id).toBe('test-event-2');
  });

  it('should clear all favorites', () => {
    const stateWithFavs = {
      ids: ['test-event-1', 'test-event-2'],
      events: [mockEvent, mockEvent2],
    };
    const state = favoritesReducer(stateWithFavs, clearAllFavorites());
    expect(state.ids).toEqual([]);
    expect(state.events).toEqual([]);
  });
});
