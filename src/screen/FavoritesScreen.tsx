/**
 * FavoritesScreen — Displays user's saved favorite events.
 */

import React, { useCallback } from 'react';
import {
    View,
    FlatList,
    Text,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useTheme } from '../theme/ThemeContext';

import EventCard from '../components/EventCard';
import EmptyState from '../components/EmptyState';
import type { Event } from '../types/event';
import type { RootStackParamList } from '../navigation/types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { clearAllFavorites, selectFavoriteEvents } from '../store/favoritesSlice';

type NavProp = StackNavigationProp<RootStackParamList>;

const FavoritesScreen: React.FC = () => {
    const { colors, isDark, toggleTheme } = useTheme();
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<NavProp>();
    const dispatch = useAppDispatch();
    const favoriteEvents = useAppSelector(selectFavoriteEvents);

    const handleEventPress = useCallback(
        (event: Event) => {
            navigation.navigate('EventDetail', { event });
        },
        [navigation],
    );

    const handleClearAll = useCallback(() => {
        Alert.alert(
            'Clear Favorites',
            'Are you sure you want to remove all favorites?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear All',
                    style: 'destructive',
                    onPress: () => dispatch(clearAllFavorites()),
                },
            ],
        );
    }, [dispatch]);

    const renderEvent = useCallback(
        ({ item, index }: { item: Event; index: number }) => (
            <EventCard event={item} index={index} onPress={handleEventPress} />
        ),
        [handleEventPress],
    );

    const keyExtractor = useCallback((item: Event) => item.id, []);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar
                barStyle={isDark ? 'light-content' : 'dark-content'}
                backgroundColor={colors.background}
            />

            {/* Header */}
            <Animated.View
                entering={FadeIn.duration(600)}
                style={[styles.header, { paddingTop: insets.top + 12 }]}>
                <View style={styles.headerRow}>
                    <View>
                        <Text style={[styles.headerTitle, { color: colors.text }]}>
                            Favorites
                        </Text>
                        <Text
                            style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                            {favoriteEvents.length} saved event
                            {favoriteEvents.length !== 1 ? 's' : ''}
                        </Text>
                    </View>
                    <View style={styles.headerActions}>
                        {/* Clear all */}
                        {favoriteEvents.length > 0 && (
                            <TouchableOpacity
                                onPress={handleClearAll}
                                style={[
                                    styles.iconButton,
                                    { backgroundColor: colors.searchBar },
                                ]}
                                activeOpacity={0.7}>
                                <Ionicons name="trash-outline" size={18} color={colors.textSecondary} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </Animated.View>

            <FlatList
                data={favoriteEvents}
                renderItem={renderEvent}
                keyExtractor={keyExtractor}
                contentContainerStyle={[
                    styles.listContent,
                    favoriteEvents.length === 0 && styles.emptyContent,
                ]}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <EmptyState
                        icon={<Ionicons name="heart" size={64} color={colors.primary} />}
                        title="No favorites yet"
                        message="Tap the heart icon on any event to save it here for quick access."
                    />
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 12,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontSize: 15,
        fontWeight: '400',
        marginTop: 2,
    },
    headerActions: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 4,
    },
    iconButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 100,
    },
    emptyContent: {
        flexGrow: 1,
    },
});

export default FavoritesScreen;
