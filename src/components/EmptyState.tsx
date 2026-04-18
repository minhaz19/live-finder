/**
 * EmptyState component — shown when no events are found.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeContext';

interface EmptyStateProps {
    title?: string;
    message?: string;
    icon?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    title = 'No events found',
    message = 'Try searching with different keywords or a different city.',
    icon = '🔍',
}) => {
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            <Animated.Text entering={ZoomIn.duration(500).springify()} style={styles.icon}>
                {icon}
            </Animated.Text>
            <Animated.Text
                entering={FadeIn.duration(600).delay(200)}
                style={[styles.title, { color: colors.text }]}>
                {title}
            </Animated.Text>
            <Animated.Text
                entering={FadeIn.duration(600).delay(400)}
                style={[styles.message, { color: colors.textSecondary }]}>
                {message}
            </Animated.Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
        paddingVertical: 60,
    },
    icon: {
        fontSize: 64,
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 8,
    },
    message: {
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
    },
});

export default React.memo(EmptyState);
