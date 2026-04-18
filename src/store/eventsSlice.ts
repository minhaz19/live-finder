import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EventsState {
  keyword: string;
  city: string;
  selectedCategory: string;
  currentPage: number;
  hasSearched: boolean;
}

const initialState: EventsState = {
  keyword: '',
  city: '',
  selectedCategory: '',
  currentPage: 0,
  hasSearched: false,
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setKeyword: (state, action: PayloadAction<string>) => {
      state.keyword = action.payload;
    },
    setCity: (state, action: PayloadAction<string>) => {
      state.city = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
      state.currentPage = 0;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    incrementPage: state => {
      state.currentPage += 1;
    },
    performSearch: (
      state,
      action: PayloadAction<{ keyword: string; city: string }>,
    ) => {
      state.keyword = action.payload.keyword;
      state.city = action.payload.city;
      state.currentPage = 0;
      state.hasSearched = true;
    },
    resetSearch: state => {
      state.keyword = '';
      state.city = '';
      state.selectedCategory = '';
      state.currentPage = 0;
      state.hasSearched = false;
    },
  },
});

export const {
  setKeyword,
  setCity,
  setSelectedCategory,
  setCurrentPage,
  incrementPage,
  performSearch,
  resetSearch,
} = eventsSlice.actions;

// Selectors
export const selectSearchState = (state: { events: EventsState }) =>
  state.events;
export const selectKeyword = (state: { events: EventsState }) =>
  state.events.keyword;
export const selectCity = (state: { events: EventsState }) => state.events.city;
export const selectCategory = (state: { events: EventsState }) =>
  state.events.selectedCategory;
export const selectCurrentPage = (state: { events: EventsState }) =>
  state.events.currentPage;
export const selectHasSearched = (state: { events: EventsState }) =>
  state.events.hasSearched;

export default eventsSlice.reducer;
