/**
 * SearchBar component with glassmorphism styling.
 * Supports keyword + city input fields.
 */

import React, { useState, useCallback } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    Text,
    StyleSheet,
    Keyboard,
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
    interpolateColor,
} from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeContext';

interface SearchBarProps {
    onSearch: (keyword: string, city: string) => void;
    initialKeyword?: string;
    initialCity?: string;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const SearchBar: React.FC<SearchBarProps> = ({
    onSearch,
    initialKeyword = '',
    initialCity = '',
}) => {
    const { colors } = useTheme();
    const [keyword, setKeyword] = useState(initialKeyword);
    const [city, setCity] = useState(initialCity);

    const buttonScale = useSharedValue(1);
    const buttonProgress = useSharedValue(0);

    const handleSearch = useCallback(() => {
        Keyboard.dismiss();
        onSearch(keyword.trim(), city.trim());
    }, [keyword, city, onSearch]);

    const handlePressIn = useCallback(() => {
        buttonScale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
        buttonProgress.value = withTiming(1, { duration: 150 });
    }, [buttonScale, buttonProgress]);

    const handlePressOut = useCallback(() => {
        buttonScale.value = withSpring(1, { damping: 15, stiffness: 300 });
        buttonProgress.value = withTiming(0, { duration: 200 });
    }, [buttonScale, buttonProgress]);

    const buttonAnimStyle = useAnimatedStyle(() => ({
        transform: [{ scale: buttonScale.value }],
        backgroundColor: interpolateColor(
            buttonProgress.value,
            [0, 1],
            [colors.primary, colors.primaryDark],
        ),
    }));

    return (
        <View style={[styles.container, { backgroundColor: colors.searchBar }]}>
            <View style={styles.inputRow}>
                <View
                    style={[
                        styles.inputContainer,
                        {
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                        },
                    ]}>
                    <Text style={styles.inputIcon}>🔍</Text>
                    <TextInput
                        style={[styles.input, { color: colors.text }]}
                        placeholder="Search events..."
                        placeholderTextColor={colors.textTertiary}
                        value={keyword}
                        onChangeText={setKeyword}
                        onSubmitEditing={handleSearch}
                        returnKeyType="search"
                        autoCorrect={false}
                    />
                </View>
            </View>

            <View style={styles.inputRow}>
                <View
                    style={[
                        styles.inputContainer,
                        {
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                        },
                    ]}>
                    <Text style={styles.inputIcon}>📍</Text>
                    <TextInput
                        style={[styles.input, { color: colors.text }]}
                        placeholder="City (e.g. New York)"
                        placeholderTextColor={colors.textTertiary}
                        value={city}
                        onChangeText={setCity}
                        onSubmitEditing={handleSearch}
                        returnKeyType="search"
                        autoCorrect={false}
                        autoCapitalize="words"
                    />
                </View>

                <AnimatedTouchable
                    onPress={handleSearch}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    style={[styles.searchButton, buttonAnimStyle]}
                    activeOpacity={1}>
                    <Text style={styles.searchButtonText}>Search</Text>
                </AnimatedTouchable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 20,
        marginHorizontal: 16,
        marginTop: 8,
        gap: 10,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 14,
        borderWidth: 1,
        paddingHorizontal: 14,
        height: 46,
    },
    inputIcon: {
        fontSize: 16,
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 15,
        fontWeight: '400',
        paddingVertical: 0,
    },
    searchButton: {
        height: 46,
        paddingHorizontal: 20,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
});

export default React.memo(SearchBar);
