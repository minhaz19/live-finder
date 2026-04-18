/**
 * ErrorState component — shown on network/API failures.
 */

import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeContext';

interface ErrorStateProps {
    message?: string;
    onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({
    message = 'Something went wrong. Please check your connection and try again.',
    onRetry,
}) => {
    const { colors } = useTheme();

    const handleRetry = useCallback(() => {
        onRetry?.();
    }, [onRetry]);

    return (
        <View style={styles.container}>
            <Animated.Text entering={ZoomIn.duration(400)} style={styles.icon}>
                ⚠️
            </Animated.Text>
            <Animated.Text
                entering={FadeIn.duration(500).delay(200)}
                style={[styles.title, { color: colors.text }]}>
                Oops!
            </Animated.Text>
            <Animated.Text
                entering={FadeIn.duration(500).delay(300)}
                style={[styles.message, { color: colors.textSecondary }]}>
                {message}
            </Animated.Text>
            {onRetry && (
                <Animated.View entering={FadeIn.duration(500).delay(400)}>
                    <TouchableOpacity
                        onPress={handleRetry}
                        style={[styles.retryButton, { backgroundColor: colors.primary }]}
                        activeOpacity={0.8}>
                        <Text style={styles.retryText}>Try Again</Text>
                    </TouchableOpacity>
                </Animated.View>
            )}
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
    icon: { fontSize: 56, marginBottom: 16 },
    title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
    message: { fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
    retryButton: {
        paddingHorizontal: 28,
        paddingVertical: 14,
        borderRadius: 14,
    },
    retryText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
});

export default React.memo(ErrorState);
