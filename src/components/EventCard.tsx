import React, {useCallback, useMemo} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import {useTheme} from '../theme/ThemeContext';
import type {Event} from '../types/event';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectFavoriteIds, toggleFavorite } from '../store/favoritesSlice';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 32;

interface EventCardProps {
  event: Event;
  index: number;
  onPress: (event: Event) => void;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const EventCard: React.FC<EventCardProps> = ({event, index, onPress}) => {
  const {colors} = useTheme();
  const dispatch = useAppDispatch();
  const favoriteIds = useAppSelector(selectFavoriteIds);
  const isFav = favoriteIds.includes(event.id);

  const heartScale = useSharedValue(1);

  // Get best image
  const imageUrl = useMemo(() => {
    if (!event.images?.length) {return null;}
    const preferred = event.images.find(
      img => img.ratio === '16_9' && img.width >= 640,
    );
    return preferred?.url || event.images[0]?.url || null;
  }, [event.images]);

  // Format date
  const formattedDate = useMemo(() => {
    try {
      const dateStr = event.dates?.start?.localDate;
      const timeStr = event.dates?.start?.localTime;
      if (!dateStr) {return 'Date TBA';}

      const date = new Date(dateStr + (timeStr ? `T${timeStr}` : ''));
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      };
      let formatted = date.toLocaleDateString('en-US', options);
      if (timeStr) {
        formatted +=
          ' • ' +
          date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
          });
      }
      return formatted;
    } catch {
      return 'Date TBA';
    }
  }, [event.dates]);

  // Get venue name
  const venueName = useMemo(() => {
    return event._embedded?.venues?.[0]?.name || 'Venue TBA';
  }, [event._embedded?.venues]);

  // Get city
  const cityName = useMemo(() => {
    const venue = event._embedded?.venues?.[0];
    if (venue?.city?.name) {
      return venue.state?.stateCode
        ? `${venue.city.name}, ${venue.state.stateCode}`
        : venue.city.name;
    }
    return '';
  }, [event._embedded?.venues]);

  // Get category
  const category = useMemo(() => {
    return event.classifications?.[0]?.segment?.name || '';
  }, [event.classifications]);

  const handlePress = useCallback(() => {
    onPress(event);
  }, [event, onPress]);

  const handleToggleFavorite = useCallback(() => {
    heartScale.value = withSequence(
      withSpring(1.4, {damping: 8, stiffness: 400}),
      withSpring(1, {damping: 12, stiffness: 300}),
    );
    dispatch(toggleFavorite(event));
  }, [dispatch, event, heartScale]);

  const heartAnimStyle = useAnimatedStyle(() => ({
    transform: [{scale: heartScale.value}],
  }));

  return (
    <Animated.View
      entering={FadeInDown.duration(400).delay(index * 80).springify()}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
          shadowColor: colors.shadowColor,
        },
      ]}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.9}
        style={styles.touchable}>
        {/* Image */}
        <View style={styles.imageContainer}>
          {imageUrl ? (
            <Image source={{uri: imageUrl}} style={styles.image} />
          ) : (
            <View
              style={[
                styles.imagePlaceholder,
                {backgroundColor: colors.surface},
              ]}>
              <Text style={styles.placeholderEmoji}>🎫</Text>
            </View>
          )}

          {/* Category badge */}
          {category ? (
            <View
              style={[
                styles.categoryBadge,
                {backgroundColor: colors.primary},
              ]}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>
          ) : null}

          {/* Favorite button */}
          <AnimatedTouchable
            onPress={handleToggleFavorite}
            style={[styles.favoriteButton, heartAnimStyle]}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
            activeOpacity={0.7}>
            <Text style={styles.heartIcon}>{isFav ? '❤️' : '🤍'}</Text>
          </AnimatedTouchable>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text
            style={[styles.title, {color: colors.text}]}
            numberOfLines={2}>
            {event.name}
          </Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📅</Text>
            <Text
              style={[styles.infoText, {color: colors.textSecondary}]}
              numberOfLines={1}>
              {formattedDate}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📍</Text>
            <Text
              style={[styles.infoText, {color: colors.textSecondary}]}
              numberOfLines={1}>
              {venueName}
              {cityName ? ` — ${cityName}` : ''}
            </Text>
          </View>

          {event.priceRanges?.[0] && (
            <View style={styles.priceRow}>
              <Text style={[styles.priceText, {color: colors.primary}]}>
                ${event.priceRanges[0].min?.toFixed(0)}
                {event.priceRanges[0].max
                  ? ` – $${event.priceRanges[0].max.toFixed(0)}`
                  : '+'}
              </Text>
              <Text style={[styles.priceCurrency, {color: colors.textTertiary}]}>
                {event.priceRanges[0].currency}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  touchable: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    height: 180,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderEmoji: {
    fontSize: 48,
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartIcon: {
    fontSize: 18,
  },
  content: {
    padding: 16,
    gap: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoIcon: {
    fontSize: 13,
  },
  infoText: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  priceText: {
    fontSize: 15,
    fontWeight: '800',
  },
  priceCurrency: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default React.memo(EventCard);
