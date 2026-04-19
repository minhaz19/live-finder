import { TICKETMASTER_API_KEY } from '@env';

export const API_CONFIG = {
  BASE_URL: 'https://app.ticketmaster.com/discovery/v2',
  API_KEY: TICKETMASTER_API_KEY,
  DEFAULT_PAGE_SIZE: 20,
  DEFAULT_SORT: 'date,asc',
} as const;