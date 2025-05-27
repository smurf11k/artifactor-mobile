import React, { useContext, useRef } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome as Icon } from '@expo/vector-icons';
import { ThemeContext } from "../contexts/ThemeContext";
import ListScreen from "../screens/ListScreen";
import SettingsScreen from "../screens/SettingsScreen";
import AdditionScreen from "../screens/AdditionScreen";
import UsersScreen from "../screens/UsersScreen";
import { Animated, Dimensions, View, StyleSheet } from "react-native";

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');
const TAB_WIDTH = width / 4;

const TabNavigator = () => {
    const { theme, accentColor } = useContext(ThemeContext);
    const tabOffsetValue = useRef(new Animated.Value(0)).current;

    return (
        <View style={{ flex: 1 }}>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === 'Антикваріат') {
                            iconName = 'home';
                        } else if (route.name === 'Налаштування') {
                            iconName = 'cog';
                        } else if (route.name === 'Додати') {
                            iconName = 'plus-circle';
                        } else if (route.name === 'Користувачі') {
                            iconName = 'user-circle';
                        }

                        return (
                            <Animated.View style={{
                                transform: [{
                                    scale: focused ?
                                        tabOffsetValue.interpolate({
                                            inputRange: [
                                                TAB_WIDTH * (getTabIndex(route.name) - 1),
                                                TAB_WIDTH * getTabIndex(route.name),
                                                TAB_WIDTH * (getTabIndex(route.name) + 1)
                                            ],
                                            outputRange: [1, 1.2, 1],
                                            extrapolate: 'clamp'
                                        })
                                        : 1
                                }]
                            }}>
                                <Icon
                                    name={iconName}
                                    size={size}
                                    color={color}
                                />
                            </Animated.View>
                        );
                    },
                    tabBarActiveTintColor: accentColor,
                    tabBarInactiveTintColor: theme === "dark" ? "#bbb" : "#666",
                    tabBarStyle: {
                        backgroundColor: theme === "dark" ? "#222" : "#fff",
                        borderTopWidth: 0,
                        elevation: 8,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: -2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 6,
                    },
                    headerStyle: {
                        backgroundColor: theme === "dark" ? "#222" : "#fff",
                        elevation: 0,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                        borderBottomWidth: 0,
                    },
                    headerTitleStyle: {
                        color: theme === "dark" ? "white" : "black",
                        fontWeight: 'bold',
                    },
                })}
            >
                <Tab.Screen
                    name="Антикваріат"
                    component={ListScreen}
                    options={{ headerTitle: "Антикваріат" }}
                    listeners={{
                        tabPress: () => {
                            Animated.spring(tabOffsetValue, {
                                toValue: 0,
                                useNativeDriver: true,
                            }).start();
                        },
                    }}
                />
                <Tab.Screen
                    name="Налаштування"
                    component={SettingsScreen}
                    options={{ headerTitle: "Налаштування" }}
                    listeners={{
                        tabPress: () => {
                            Animated.spring(tabOffsetValue, {
                                toValue: TAB_WIDTH,
                                useNativeDriver: true,
                            }).start();
                        },
                    }}
                />
                <Tab.Screen
                    name="Додати"
                    component={AdditionScreen}
                    options={{ headerTitle: "Додати антикваріат" }}
                    listeners={{
                        tabPress: () => {
                            Animated.spring(tabOffsetValue, {
                                toValue: TAB_WIDTH * 2,
                                useNativeDriver: true,
                            }).start();
                        },
                    }}
                />
                <Tab.Screen
                    name="Користувачі"
                    component={UsersScreen}
                    options={{ headerTitle: "Користувачі" }}
                    listeners={{
                        tabPress: () => {
                            Animated.spring(tabOffsetValue, {
                                toValue: TAB_WIDTH * 3,
                                useNativeDriver: true,
                            }).start();
                        },
                    }}
                />
            </Tab.Navigator>

            {/* Індикатор поточної таби */}
            <Animated.View
                style={[
                    styles.indicator,
                    {
                        backgroundColor: accentColor,
                        transform: [{ translateX: tabOffsetValue }],
                        width: TAB_WIDTH,
                    }
                ]}
            />
        </View>
    );
};

const getTabIndex = (routeName) => {
    switch (routeName) {
        case 'Антикваріат': return 0;
        case 'Налаштування': return 1;
        case 'Додати': return 2;
        case 'Користувачі': return 3;
        default: return 0;
    }
};

const styles = StyleSheet.create({
    indicator: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: 3,
        borderRadius: 2,
    },
});

export default TabNavigator;