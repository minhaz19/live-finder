/**
 * CategoryChip component for filtering events by classification.
 */

import React, { useCallback } from 'react';
import {
    ScrollView,
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    withSpring,
    useSharedValue,
} from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeContext';

const CATEGORIES = [
    { label: '🎵 Music', value: 'music' },
    { label: '⚽ Sports', value: 'sports' },
    { label: '🎭 Arts', value: 'arts' },
    { label: '🎪 Family', value: 'family' },
    { label: '🎬 Film', value: 'film' },
    { label: '😂 Comedy', value: 'comedy' },
];

interface CategoryChipProps {
    selectedCategory: string;
    onSelect: (category: string) => void;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const Chip: React.FC<{
    label: string;
    value: string;
    isActive: boolean;
    onPress: (value: string) => void;
    colors: any;
}> = ({ label, value, isActive, onPress, colors }) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = useCallback(() => {
        scale.value = withSpring(0.92, { damping: 15, stiffness: 400 });
    }, [scale]);

    const handlePressOut = useCallback(() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    }, [scale]);

    return (
        <AnimatedTouchable
            onPress={() => onPress(value)}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.8}
            style={[
                styles.chip,
                animatedStyle,
                {
                    backgroundColor: isActive
                        ? colors.chipActiveBackground
                        : colors.chipBackground,
                    borderColor: isActive ? colors.chipActiveBackground : colors.border,
                },
            ]}>
            <Text
                style={[
                    styles.chipText,
                    {
                        color: isActive ? colors.chipActiveText : colors.chipText,
                    },
                ]}>
                {label}
            </Text>
        </AnimatedTouchable>
    );
};

const CategoryChips: React.FC<CategoryChipProps> = ({
    selectedCategory,
    onSelect,
}) => {
    const { colors } = useTheme();

    const handlePress = useCallback(
        (value: string) => {
            onSelect(selectedCategory === value ? '' : value);
        },
        [selectedCategory, onSelect],
    );

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}>
                {CATEGORIES.map(cat => (
                    <Chip
                        key={cat.value}
                        label={cat.label}
                        value={cat.value}
                        isActive={selectedCategory === cat.value}
                        onPress={handlePress}
                        colors={colors}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 12,
    },
    scrollContent: {
        paddingHorizontal: 16,
        gap: 8,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 24,
        borderWidth: 1,
    },
    chipText: {
        fontSize: 13,
        fontWeight: '600',
        letterSpacing: 0.2,
    },
});

export default React.memo(CategoryChips);
