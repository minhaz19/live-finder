// API Response
export interface EventSearchResponse {
  _embedded?: {
    events: Event[];
  };
  _links?: {
    self: { href: string };
    next?: { href: string };
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

export interface EventDateTime {
  localDate: string;
  localTime?: string;
  dateTime?: string;
  dateTBD: boolean;
  dateTBA: boolean;
  timeTBA: boolean;
  noSpecificTime: boolean;
}

export interface EventDates {
  start: EventDateTime;
  timezone?: string;
  status: {
    code: string;
  };
}

// Search Params 
export interface EventSearchParams {
  keyword?: string;
  city?: string;
  classificationName?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface EventImage {
  ratio: string;
  url: string;
  width: number;
  height: number;
  fallback: boolean;
}

export interface Classification {
  primary: boolean;
  segment?: {
    id: string;
    name: string;
  };
  genre?: {
    id: string;
    name: string;
  };
  subGenre?: {
    id: string;
    name: string;
  };
}

export interface PriceRange {
  type: string;
  currency: string;
  min: number;
  max: number;
}

export interface Venue {
  id: string;
  name: string;
  type: string;
  url?: string;
  locale?: string;
  postalCode?: string;
  timezone?: string;
  city?: {
    name: string;
  };
  state?: {
    name: string;
    stateCode: string;
  };
  country?: {
    name: string;
    countryCode: string;
  };
  address?: {
    line1: string;
    line2?: string;
  };
  location?: {
    longitude: string;
    latitude: string;
  };
}

export interface Attraction {
  id: string;
  name: string;
  type: string;
  url?: string;
  images?: EventImage[];
}

export interface Event {
  id: string;
  name: string;
  type: string;
  url: string;
  locale?: string;
  description?: string;
  info?: string;
  pleaseNote?: string;
  images: EventImage[];
  dates: EventDates;
  classifications?: Classification[];
  priceRanges?: PriceRange[];
  _embedded?: {
    venues?: Venue[];
    attractions?: Attraction[];
  };
}

export interface EventDetailResponse extends Event {}