/**
 * Unit tests for storage utility functions.
 */

// Mock MMKV before importing storage
jest.mock('react-native-mmkv', () => {
  const store: Record<string, string> = {};
  return {
    createMMKV: jest.fn(() => ({
      getString: jest.fn((key: string) => store[key]),
      set: jest.fn((key: string, value: string) => {
        store[key] = value;
      }),
      delete: jest.fn((key: string) => {
        delete store[key];
      }),
    })),
  };
});

import {
  getFavoriteIds,
  saveFavoriteIds,
  addFavoriteId,
  removeFavoriteId,
  isFavorite,
} from '../src/utils/storage';

describe('storage utilities', () => {
  beforeEach(() => {
    // Reset stored data between tests
    saveFavoriteIds([]);
  });

  it('should return empty array when no favorites exist', () => {
    const ids = getFavoriteIds();
    expect(Array.isArray(ids)).toBe(true);
  });

  it('should save and retrieve favorite IDs', () => {
    saveFavoriteIds(['id1', 'id2']);
    const ids = getFavoriteIds();
    expect(ids).toEqual(['id1', 'id2']);
  });

  it('should add a favorite ID', () => {
    saveFavoriteIds(['id1']);
    const result = addFavoriteId('id2');
    expect(result).toContain('id1');
    expect(result).toContain('id2');
  });

  it('should not add duplicate favorite ID', () => {
    saveFavoriteIds(['id1']);
    const result = addFavoriteId('id1');
    expect(result).toHaveLength(1);
  });

  it('should remove a favorite ID', () => {
    saveFavoriteIds(['id1', 'id2', 'id3']);
    const result = removeFavoriteId('id2');
    expect(result).toEqual(['id1', 'id3']);
  });

  it('should check if an event is a favorite', () => {
    saveFavoriteIds(['id1', 'id2']);
    expect(isFavorite('id1')).toBe(true);
    expect(isFavorite('id3')).toBe(false);
  });
});
