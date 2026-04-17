/**
 * Bottom Tab Navigator with Explore and Favorites tabs.
 */

import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme/ThemeContext';
import ExploreScreen from '../screen/ExploreScreen';
import FavoritesScreen from '../screen/FavoritesScreen';

const Tab = createBottomTabNavigator();

type TabBarIconProps = {
    focused: boolean;
    color: string;
    size: number;
};

const renderExploreTabBarIcon = ({ focused, color, size }: TabBarIconProps) => (
    <Ionicons
        name={focused ? 'compass' : 'compass-outline'}
        color={color}
        size={size}
    />
);

const renderFavoritesTabBarIcon = ({ focused, color, size }: TabBarIconProps) => (
    <Ionicons
        name={focused ? 'heart' : 'heart-outline'}
        color={color}
        size={size}
    />
);

const TabNavigator: React.FC = () => {
    const { colors } = useTheme();
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: colors.tabBar,
                    borderTopColor: colors.tabBarBorder,
                    borderTopWidth: 1,
                    height: Platform.OS === 'ios' ? 88 : 64,
                    paddingTop: 8,
                    paddingBottom: Platform.OS === 'ios' ? 28 : 10,
                    elevation: 0,
                    shadowOpacity: 0,
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textTertiary,
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                    marginTop: 4,
                },
            }}>
            <Tab.Screen
                name="Explore"
                component={ExploreScreen}
                options={{
                    tabBarIcon: renderExploreTabBarIcon,
                }}
            />
            <Tab.Screen
                name="Favorites"
                component={FavoritesScreen}
                options={{
                    tabBarIcon: renderFavoritesTabBarIcon,
                }}
            />
        </Tab.Navigator>
    );
};

export default TabNavigator;
