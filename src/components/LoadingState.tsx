/**
 * Loading state component with animated shimmer placeholders.
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
    interpolate,
} from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 32;

const ShimmerCard: React.FC<{ delay: number }> = ({ delay }) => {
    const { colors } = useTheme();
    const shimmerValue = useSharedValue(0);

    useEffect(() => {
        const timeout = setTimeout(() => {
            shimmerValue.value = withRepeat(
                withTiming(1, { duration: 1200 }),
                -1,
                true,
            );
        }, delay);
        return () => clearTimeout(timeout);
    }, [shimmerValue, delay]);

    const shimmerStyle = useAnimatedStyle(() => ({
        opacity: interpolate(shimmerValue.value, [0, 1], [0.3, 0.7]),
    }));

    return (
        <View
            style={[
                styles.card,
                {
                    backgroundColor: colors.card,
                    borderColor: colors.cardBorder,
                },
            ]}>
            <Animated.View
                style={[
                    styles.imagePlaceholder,
                    { backgroundColor: colors.shimmer },
                    shimmerStyle,
                ]}
            />
            <View style={styles.content}>
                <Animated.View
                    style={[
                        styles.titlePlaceholder,
                        { backgroundColor: colors.shimmer },
                        shimmerStyle,
                    ]}
                />
                <Animated.View
                    style={[
                        styles.linePlaceholder,
                        { backgroundColor: colors.shimmer, width: '70%' },
                        shimmerStyle,
                    ]}
                />
                <Animated.View
                    style={[
                        styles.linePlaceholder,
                        { backgroundColor: colors.shimmer, width: '50%' },
                        shimmerStyle,
                    ]}
                />
            </View>
        </View>
    );
};

const LoadingState: React.FC = () => {
    return (
        <View style={styles.container}>
            <ShimmerCard delay={0} />
            <ShimmerCard delay={150} />
            <ShimmerCard delay={300} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    card: {
        width: CARD_WIDTH,
        borderRadius: 20,
        borderWidth: 1,
        marginBottom: 16,
        overflow: 'hidden',
    },
    imagePlaceholder: {
        height: 180,
        width: '100%',
    },
    content: {
        padding: 16,
        gap: 10,
    },
    titlePlaceholder: {
        height: 20,
        width: '85%',
        borderRadius: 8,
    },
    linePlaceholder: {
        height: 14,
        borderRadius: 6,
    },
});

export default React.memo(LoadingState);
