import type {Event} from '../types/event';

export type RootStackParamList = {
  MainTabs: undefined;
  EventDetail: {event: Event};
};

export type MainTabParamList = {
  Explore: undefined;
  Favorites: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
