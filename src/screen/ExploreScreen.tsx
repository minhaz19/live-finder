import React, { useCallback, useMemo } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    StatusBar,
    Text,
    RefreshControl,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../theme/ThemeContext';
import { useSearchEventsQuery } from '../api/ticketmasterApi';
import {
    selectSearchState,
    performSearch,
    setSelectedCategory,
    incrementPage,
} from '../store/eventsSlice';
import SearchBar from '../components/SearchBar';
import CategoryChips from '../components/CategoryChip';
import EventCard from '../components/EventCard';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import type { Event } from '../types/event';
import type { RootStackParamList } from '../navigation/types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import Ionicons from '@react-native-vector-icons/ionicons';

type NavProp = StackNavigationProp<RootStackParamList>;

const ExploreScreen: React.FC = () => {
    const { colors, isDark, toggleTheme } = useTheme();
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<NavProp>();
    const dispatch = useAppDispatch();

    const { keyword, city, selectedCategory, currentPage, hasSearched } =
        useAppSelector(selectSearchState);

    // Build query params
    const queryParams = useMemo(
        () => ({
            keyword: keyword || undefined,
            city: city || undefined,
            classificationName: selectedCategory || undefined,
            page: currentPage,
            size: 20,
        }),
        [keyword, city, selectedCategory, currentPage],
    );

    const { data, isLoading, isFetching, isError, error, refetch } =
        useSearchEventsQuery(queryParams, {
            skip: !hasSearched && !selectedCategory,
        });

    const events = data?._embedded?.events || [];
    const totalPages = data?.page?.totalPages || 0;
    const hasMore = currentPage < totalPages - 1;

    const handleSearch = useCallback(
        (kw: string, ct: string) => {
            dispatch(performSearch({ keyword: kw, city: ct }));
        },
        [dispatch],
    );

    const handleCategorySelect = useCallback(
        (cat: string) => {
            dispatch(setSelectedCategory(cat));
        },
        [dispatch],
    );

    const handleEventPress = useCallback(
        (event: Event) => {
            navigation.navigate('EventDetail', { event });
        },
        [navigation],
    );

    const handleLoadMore = useCallback(() => {
        if (hasMore && !isFetching) {
            dispatch(incrementPage());
        }
    }, [hasMore, isFetching, dispatch]);

    const handleRefresh = useCallback(() => {
        refetch();
    }, [refetch]);

    const renderEvent = useCallback(
        ({ item, index }: { item: Event; index: number }) => (
            <EventCard event={item} index={index} onPress={handleEventPress} />
        ),
        [handleEventPress],
    );

    const keyExtractor = useCallback((item: Event) => item.id, []);

    const ListFooter = useCallback(() => {
        if (isFetching && currentPage > 0) {
            return (
                <View style={styles.footer}>
                    <ActivityIndicator color={colors.primary} size="small" />
                    <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                        Loading more events...
                    </Text>
                </View>
            );
        }
        return null;
    }, [isFetching, currentPage, colors]);

    const ListEmpty = useCallback(() => {
        if (isLoading) {
            return <LoadingState />;
        }
        if (isError) {
            return (
                <ErrorState
                    message={
                        (error as any)?.data?.message ||
                        'Failed to load events. Please try again.'
                    }
                    onRetry={refetch}
                />
            );
        }
        if (hasSearched || selectedCategory) {
            return <EmptyState />;
        }
        return (
            <EmptyState
                icon="🎉"
                title="Discover Events"
                message="Search for concerts, sports, shows, and more in any city around the world."
            />
        );
    }, [isLoading, isError, error, hasSearched, selectedCategory, refetch]);

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
                            Finder
                        </Text>
                        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                            Discover amazing events near you
                        </Text>
                    </View>
                    {/* Theme toggle */}
                    <TouchableOpacity
                        onPress={toggleTheme}
                        style={[styles.iconButton, { backgroundColor: colors.searchBar }]}
                        activeOpacity={0.7}>
                        <Ionicons
                            name={isDark ? 'sunny-outline' : 'moon-outline'}
                            size={20}
                            color={colors.text}
                        />
                    </TouchableOpacity>
                </View>
            </Animated.View>

            {/* Search */}
            <SearchBar
                onSearch={handleSearch}
                initialKeyword={keyword}
                initialCity={city}
            />

            {/* Categories */}
            <CategoryChips
                selectedCategory={selectedCategory}
                onSelect={handleCategorySelect}
            />

            {/* Results count */}
            {data?.page && events.length > 0 && (
                <Animated.View entering={FadeIn.duration(400)} style={styles.resultsBar}>
                    <Text style={[styles.resultsText, { color: colors.textSecondary }]}>
                        {data.page.totalElements.toLocaleString()} events found
                    </Text>
                </Animated.View>
            )}

            {/* Event List */}
            <FlatList
                data={events}
                renderItem={renderEvent}
                keyExtractor={keyExtractor}
                contentContainerStyle={[
                    styles.listContent,
                    events.length === 0 && styles.emptyListContent,
                ]}
                showsVerticalScrollIndicator={false}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={ListEmpty}
                ListFooterComponent={ListFooter}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading && hasSearched}
                        onRefresh={handleRefresh}
                        tintColor={colors.primary}
                        colors={[colors.primary]}
                    />
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 4,
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
    iconButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerSubtitle: {
        fontSize: 15,
        fontWeight: '400',
        marginTop: 2,
    },
    resultsBar: {
        paddingHorizontal: 20,
        paddingTop: 14,
        paddingBottom: 4,
    },
    resultsText: {
        fontSize: 13,
        fontWeight: '600',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 100,
    },
    emptyListContent: {
        flexGrow: 1,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 20,
    },
    footerText: {
        fontSize: 13,
        fontWeight: '500',
    },
});

export default ExploreScreen;
