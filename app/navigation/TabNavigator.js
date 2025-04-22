import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome as Icon } from '@expo/vector-icons';
import { ThemeContext } from "../contexts/ThemeContext";
import ListScreen from "../screens/ListScreen";
import SettingsScreen from "../screens/SettingsScreen";
import AdditionScreen from "../screens/AdditionScreen";
import UsersScreen from "../screens/UsersScreen";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    const { theme, accentColor } = useContext(ThemeContext);

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Антикваріат') {
                        iconName = focused ? 'home' : 'home';
                    } else if (route.name === 'Налаштування') {
                        iconName = focused ? 'cog' : 'cog';
                    } else if (route.name === 'Додати') {
                        iconName = focused ? 'plus-circle' : 'plus-circle';
                    } else if (route.name === 'Користувачі') {
                        iconName = focused ? 'user-circle' : 'user-circle';
                    }

                    return <Icon name={iconName} size={size} color={color} />;
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
            />
            <Tab.Screen
                name="Налаштування"
                component={SettingsScreen}
                options={{ headerTitle: "Налаштування" }}
            />
            <Tab.Screen
                name="Додати"
                component={AdditionScreen}
                options={{ headerTitle: "Додати антикваріат" }}
            />
            <Tab.Screen
                name="Користувачі"
                component={UsersScreen}
                options={{ headerTitle: "Користувачі" }}
            />
        </Tab.Navigator>
    );
};

export default TabNavigator;