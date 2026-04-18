/**
 * Redux store configuration with RTK Query middleware.
 */

import { configureStore } from '@reduxjs/toolkit';
import { ticketmasterApi } from '../api/ticketmasterApi';
import eventsReducer from './eventsSlice';
import favoritesReducer from './favoritesSlice';

export const store = configureStore({
  reducer: {
    [ticketmasterApi.reducerPath]: ticketmasterApi.reducer,
    events: eventsReducer,
    favorites: favoritesReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(ticketmasterApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
