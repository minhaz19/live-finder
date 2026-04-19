import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '../config/api';
import type {
  EventSearchResponse,
  EventSearchParams,
  EventDetailResponse,
} from '../types/event';

export const ticketmasterApi = createApi({
  reducerPath: 'ticketmasterApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.BASE_URL,
  }),
  endpoints: builder => ({
    searchEvents: builder.query<EventSearchResponse, EventSearchParams>({
      query: params => {
        const queryParams: Record<string, string> = {
          apikey: API_CONFIG.API_KEY,
          size: String(params.size || API_CONFIG.DEFAULT_PAGE_SIZE),
          page: String(params.page || 0),
          sort: params.sort || API_CONFIG.DEFAULT_SORT,
        };

        if (params.keyword) {
          queryParams.keyword = params.keyword;
        }
        if (params.city) {
          queryParams.city = params.city;
        }
        if (params.classificationName) {
          queryParams.classificationName = params.classificationName;
        }

        return {
          url: '/events.json',
          params: queryParams,
        };
      },
      // Merge paginated results for infinite scroll
      serializeQueryArgs: ({ queryArgs }) => {
        const { page, ...rest } = queryArgs;
        return rest;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 0) {
          return newItems;
        }
        if (currentCache._embedded?.events && newItems._embedded?.events) {
          return {
            ...newItems,
            _embedded: {
              events: [
                ...currentCache._embedded.events,
                ...newItems._embedded.events,
              ],
            },
          };
        }
        return newItems;
      },
      forceRefetch: ({ currentArg, previousArg }) => {
        return currentArg !== previousArg;
      },
    }),

    //Get Event Details
    getEventDetails: builder.query<EventDetailResponse, string>({
      query: eventId => ({
        url: `/events/${eventId}.json`,
        params: {
          apikey: API_CONFIG.API_KEY,
        },
      }),
    }),
  }),
});

export const { useSearchEventsQuery, useGetEventDetailsQuery } =
  ticketmasterApi;
