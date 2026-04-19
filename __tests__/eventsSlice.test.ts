/**
 * Unit tests for the events Redux slice.
 */

import eventsReducer, {
  setKeyword,
  setCity,
  setSelectedCategory,
  incrementPage,
  performSearch,
  resetSearch,
} from '../src/store/eventsSlice';

describe('eventsSlice', () => {
  const initialState = {
    keyword: '',
    city: '',
    selectedCategory: '',
    currentPage: 0,
    hasSearched: false,
  };

  it('should return the initial state', () => {
    expect(eventsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should set keyword', () => {
    const state = eventsReducer(initialState, setKeyword('concert'));
    expect(state.keyword).toBe('concert');
  });

  it('should set city', () => {
    const state = eventsReducer(initialState, setCity('New York'));
    expect(state.city).toBe('New York');
  });

  it('should set selected category and reset page', () => {
    const stateWithPage = { ...initialState, currentPage: 3 };
    const state = eventsReducer(stateWithPage, setSelectedCategory('music'));
    expect(state.selectedCategory).toBe('music');
    expect(state.currentPage).toBe(0);
  });

  it('should increment page', () => {
    const state = eventsReducer(initialState, incrementPage());
    expect(state.currentPage).toBe(1);

    const state2 = eventsReducer(state, incrementPage());
    expect(state2.currentPage).toBe(2);
  });

  it('should perform search with keyword and city', () => {
    const state = eventsReducer(
      initialState,
      performSearch({ keyword: 'rock', city: 'LA' }),
    );
    expect(state.keyword).toBe('rock');
    expect(state.city).toBe('LA');
    expect(state.currentPage).toBe(0);
    expect(state.hasSearched).toBe(true);
  });

  it('should reset search to initial state', () => {
    const modifiedState = {
      keyword: 'test',
      city: 'NYC',
      selectedCategory: 'sports',
      currentPage: 5,
      hasSearched: true,
    };
    const state = eventsReducer(modifiedState, resetSearch());
    expect(state).toEqual(initialState);
  });
});
