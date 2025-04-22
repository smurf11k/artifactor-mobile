import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthContext } from "../contexts/AuthContext";
import AuthNavigator from "./AuthNavigator";
import TabNavigator from "./TabNavigator";
import ItemDetailsScreen from "../screens/ItemDetailsScreen";

const Stack = createStackNavigator();

const MainNavigator = () => {
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isAuthenticated ? (
                    <Stack.Screen name="Main" component={TabNavigator} />
                ) : (
                    <Stack.Screen name="Auth" component={AuthNavigator} />
                )}
                <Stack.Screen name="ItemDetails" component={ItemDetailsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default MainNavigator;