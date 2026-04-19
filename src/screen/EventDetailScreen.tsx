/**
 * EventDetailScreen — Comprehensive event details with map, description, and buy link.
 */

import React, { useMemo, useCallback } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Linking,
    StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, SlideInRight } from 'react-native-reanimated';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useTheme } from '../theme/ThemeContext';
import type { RootStackParamList } from '../navigation/types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectFavoriteIds, toggleFavorite } from '../store/favoritesSlice';
import { useGetEventDetailsQuery } from '../api/ticketmasterApi';

type DetailRoute = RouteProp<RootStackParamList, 'EventDetail'>;

const EventDetailScreen: React.FC = () => {
    const { colors, isDark } = useTheme();
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const route = useRoute<DetailRoute>();
    const dispatch = useAppDispatch();
    const { event: passedEvent } = route.params;

    // Fetch fresh details
    const { data: freshEvent } = useGetEventDetailsQuery(passedEvent.id);
    const event = freshEvent || passedEvent;

    const favoriteIds = useAppSelector(selectFavoriteIds);
    const isFav = favoriteIds.includes(event.id);

    // Best image
    const imageUrl = useMemo(() => {
        if (!event.images?.length) { return null; }
        const best = event.images.find(
            img => img.ratio === '16_9' && img.width >= 1024,
        );
        return best?.url || event.images[0]?.url;
    }, [event.images]);

    // Venue details
    const venue = event._embedded?.venues?.[0];
    const venueName = venue?.name || 'Venue TBA';
    const venueAddress = venue?.address?.line1 || '';
    const venueCity = venue?.city?.name || '';
    const venueState = venue?.state?.stateCode || '';
    const fullLocation = [venueAddress, venueCity, venueState]
        .filter(Boolean)
        .join(', ');

    // Map coordinates
    const latitude = venue?.location?.latitude
        ? parseFloat(venue.location.latitude)
        : null;
    const longitude = venue?.location?.longitude
        ? parseFloat(venue.location.longitude)
        : null;
    const hasCoordinates =
        latitude !== null && longitude !== null && !isNaN(latitude) && !isNaN(longitude);

    // Formatted date
    const formattedDate = useMemo(() => {
        try {
            const dateStr = event.dates?.start?.localDate;
            const timeStr = event.dates?.start?.localTime;
            if (!dateStr) { return 'Date TBA'; }
            const date = new Date(dateStr + (timeStr ? `T${timeStr}` : ''));
            const datePart = date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
            const timePart = timeStr
                ? date.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                })
                : '';
            return timePart ? `${datePart} at ${timePart}` : datePart;
        } catch {
            return 'Date TBA';
        }
    }, [event.dates]);

    // Category
    const category = event.classifications?.[0]?.segment?.name || '';
    const genre = event.classifications?.[0]?.genre?.name || '';

    // Price
    const priceRange = event.priceRanges?.[0];

    const handleBuyTickets = useCallback(() => {
        if (event.url) {
            Linking.openURL(event.url).catch(() => { });
        }
    }, [event.url]);

    const handleToggleFavorite = useCallback(() => {
        dispatch(toggleFavorite(event));
    }, [dispatch, event]);

    const handleBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar
                barStyle="light-content"
                backgroundColor="transparent"
                translucent
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                bounces={true}
                contentContainerStyle={styles.scrollContent}>
                {/* Hero Image */}
                <View style={styles.heroContainer}>
                    {imageUrl ? (
                        <Image source={{ uri: imageUrl }} style={styles.heroImage} />
                    ) : (
                        <View
                            style={[styles.heroPlaceholder, { backgroundColor: colors.card }]}>
                            <Ionicons
                                name="ticket-outline"
                                size={64}
                                color={colors.textTertiary}
                            />
                        </View>
                    )}
                    <View style={styles.heroOverlay} />

                    {/* Back button */}
                    <TouchableOpacity
                        onPress={handleBack}
                        style={[styles.backButton, { top: insets.top + 8 }]}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <Ionicons name="arrow-back" size={22} color="#FFF" />
                    </TouchableOpacity>

                    {/* Favorite button */}
                    <TouchableOpacity
                        onPress={handleToggleFavorite}
                        style={[styles.heroFavButton, { top: insets.top + 8 }]}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <Ionicons
                            name={isFav ? 'heart' : 'heart-outline'}
                            size={20}
                            color={isFav ? '#FF4D6D' : '#FFFFFF'}
                        />
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <View style={[styles.contentContainer, { backgroundColor: colors.background }]}>
                    {/* Title & Category */}
                    <Animated.View entering={FadeInDown.duration(500).delay(100)}>
                        {category ? (
                            <View
                                style={[styles.categoryPill, { backgroundColor: colors.primary }]}>
                                <Text style={styles.categoryPillText}>
                                    {category}
                                    {genre ? ` • ${genre}` : ''}
                                </Text>
                            </View>
                        ) : null}

                        <Text style={[styles.title, { color: colors.text }]}>
                            {event.name}
                        </Text>
                    </Animated.View>

                    {/* Date & Venue Info Cards */}
                    <Animated.View
                        entering={FadeInDown.duration(500).delay(200)}
                        style={styles.infoCards}>
                        <View
                            style={[
                                styles.infoCard,
                                { backgroundColor: colors.card, borderColor: colors.cardBorder },
                            ]}>
                            <Ionicons
                                name="calendar-outline"
                                size={22}
                                color={colors.primary}
                                style={styles.infoCardIcon}
                            />
                            <View style={styles.infoCardContent}>
                                <Text style={[styles.infoCardLabel, { color: colors.textTertiary }]}>
                                    Date & Time
                                </Text>
                                <Text style={[styles.infoCardValue, { color: colors.text }]}>
                                    {formattedDate}
                                </Text>
                            </View>
                        </View>

                        <View
                            style={[
                                styles.infoCard,
                                { backgroundColor: colors.card, borderColor: colors.cardBorder },
                            ]}>
                            <Ionicons
                                name="location-outline"
                                size={22}
                                color={colors.primary}
                                style={styles.infoCardIcon}
                            />
                            <View style={styles.infoCardContent}>
                                <Text style={[styles.infoCardLabel, { color: colors.textTertiary }]}>
                                    Venue
                                </Text>
                                <Text style={[styles.infoCardValue, { color: colors.text }]}>
                                    {venueName}
                                </Text>
                                {fullLocation ? (
                                    <Text
                                        style={[
                                            styles.infoCardSub,
                                            { color: colors.textSecondary },
                                        ]}>
                                        {fullLocation}
                                    </Text>
                                ) : null}
                            </View>
                        </View>

                        {priceRange && (
                            <View
                                style={[
                                    styles.infoCard,
                                    { backgroundColor: colors.card, borderColor: colors.cardBorder },
                                ]}>
                                <Ionicons
                                    name="cash-outline"
                                    size={22}
                                    color={colors.primary}
                                    style={styles.infoCardIcon}
                                />
                                <View style={styles.infoCardContent}>
                                    <Text
                                        style={[styles.infoCardLabel, { color: colors.textTertiary }]}>
                                        Price Range
                                    </Text>
                                    <Text style={[styles.infoCardValue, { color: colors.primary }]}>
                                        ${priceRange.min?.toFixed(0)} – $
                                        {priceRange.max?.toFixed(0)} {priceRange.currency}
                                    </Text>
                                </View>
                            </View>
                        )}
                    </Animated.View>

                    {/* Description / Info */}
                    {(event.info || event.description || event.pleaseNote) && (
                        <Animated.View
                            entering={FadeInDown.duration(500).delay(300)}
                            style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>
                                About
                            </Text>
                            <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>
                                {event.info || event.description || ''}
                            </Text>
                            {event.pleaseNote && (
                                <View
                                    style={[
                                        styles.noteBox,
                                        { backgroundColor: colors.card, borderColor: colors.warning },
                                    ]}>
                                    <Ionicons
                                        name="information-circle-outline"
                                        size={18}
                                        color={colors.warning}
                                        style={styles.noteIcon}
                                    />
                                    <Text style={[styles.noteText, { color: colors.textSecondary }]}>
                                        {event.pleaseNote}
                                    </Text>
                                </View>
                            )}
                        </Animated.View>
                    )}

                    {/* Attractions */}
                    {event._embedded?.attractions && event._embedded.attractions.length > 0 && (
                        <Animated.View
                            entering={FadeInDown.duration(500).delay(350)}
                            style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>
                                Performers
                            </Text>
                            <View style={styles.attractionsList}>
                                {event._embedded.attractions.map((attr: any) => (
                                    <View
                                        key={attr.id}
                                        style={[
                                            styles.attractionChip,
                                            {
                                                backgroundColor: colors.card,
                                                borderColor: colors.cardBorder,
                                            },
                                        ]}>
                                        <View style={styles.attractionContent}>
                                            <Ionicons
                                                name="mic-outline"
                                                size={14}
                                                color={colors.primary}
                                            />
                                            <Text style={[styles.attractionName, { color: colors.text }]}> 
                                                {attr.name}
                                            </Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </Animated.View>
                    )}

                    {/* Map */}
                    {hasCoordinates && (
                        <Animated.View
                            entering={FadeInDown.duration(500).delay(400)}
                            style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>
                                Location
                            </Text>
                            <View
                                style={[
                                    styles.mapContainer,
                                    { borderColor: colors.cardBorder },
                                ]}>
                                <MapView
                                    style={styles.map}
                                    initialRegion={{
                                        latitude: latitude!,
                                        longitude: longitude!,
                                        latitudeDelta: 0.01,
                                        longitudeDelta: 0.01,
                                    }}
                                    scrollEnabled={false}
                                    zoomEnabled={false}
                                    userInterfaceStyle={isDark ? 'dark' : 'light'}>
                                    <Marker
                                        coordinate={{
                                            latitude: latitude!,
                                            longitude: longitude!,
                                        }}
                                        title={venueName}
                                        description={fullLocation}
                                    />
                                </MapView>
                            </View>
                        </Animated.View>
                    )}
                </View>
            </ScrollView>

            {/* Bottom Buy Button */}
            {event.url && (
                <Animated.View
                    entering={SlideInRight.duration(600).delay(500)}
                    style={[
                        styles.bottomBar,
                        {
                            backgroundColor: colors.background,
                            borderTopColor: colors.border,
                            paddingBottom: Math.max(insets.bottom, 16),
                        },
                    ]}>
                    <View style={styles.bottomContent}>
                        {priceRange && (
                            <View>
                                <Text style={[styles.bottomLabel, { color: colors.textTertiary }]}>
                                    From
                                </Text>
                                <Text style={[styles.bottomPrice, { color: colors.text }]}>
                                    ${priceRange.min?.toFixed(0)} {priceRange.currency}
                                </Text>
                            </View>
                        )}
                        <TouchableOpacity
                            onPress={handleBuyTickets}
                            style={[styles.buyButton, { backgroundColor: colors.primary }]}
                            activeOpacity={0.85}>
                            <View style={styles.buyButtonContent}>
                                <Ionicons name="ticket-outline" size={18} color="#FFF" />
                                <Text style={styles.buyButtonText}>Buy Tickets</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingBottom: 100 },
    heroContainer: { height: 320, position: 'relative' },
    heroImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    heroPlaceholder: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    backButton: {
        position: 'absolute',
        left: 16,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroFavButton: {
        position: 'absolute',
        right: 16,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    contentContainer: {
        marginTop: -24,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 24,
        paddingHorizontal: 20,
    },
    categoryPill: {
        alignSelf: 'flex-start',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 12,
    },
    categoryPillText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    title: { fontSize: 26, fontWeight: '800', lineHeight: 32, letterSpacing: -0.3 },
    infoCards: { marginTop: 20, gap: 12 },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        gap: 12,
    },
    infoCardIcon: { marginTop: 2 },
    infoCardContent: { flex: 1, gap: 2 },
    infoCardLabel: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
    infoCardValue: { fontSize: 16, fontWeight: '600' },
    infoCardSub: { fontSize: 13, marginTop: 2 },
    section: { marginTop: 28 },
    sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
    descriptionText: { fontSize: 15, lineHeight: 24 },
    noteBox: {
        flexDirection: 'row',
        padding: 14,
        borderRadius: 12,
        borderLeftWidth: 3,
        marginTop: 12,
        gap: 10,
    },
    noteIcon: { marginTop: 1 },
    noteText: { flex: 1, fontSize: 13, lineHeight: 20 },
    attractionsList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    attractionChip: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
    },
    attractionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    attractionName: { fontSize: 14, fontWeight: '600' },
    mapContainer: {
        height: 200,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
    },
    map: { width: '100%', height: '100%' },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopWidth: 1,
        paddingTop: 12,
        paddingHorizontal: 20,
    },
    bottomContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    bottomLabel: { fontSize: 12, fontWeight: '500' },
    bottomPrice: { fontSize: 20, fontWeight: '800' },
    buyButton: {
        paddingHorizontal: 28,
        paddingVertical: 16,
        borderRadius: 16,
    },
    buyButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    buyButtonText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
});

export default EventDetailScreen;
