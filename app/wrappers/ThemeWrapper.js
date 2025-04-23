import React, { useContext } from "react";
import { Provider, MD3LightTheme, MD3DarkTheme } from "react-native-paper";
import { ThemeContext } from "../contexts/ThemeContext";
import MainNavigator from "../navigation/MainNavigator";
import AutoLogin from "../components/AutoLogin";

const ThemeWrapper = () => {
    const { theme, accentColor } = useContext(ThemeContext);

    const customTheme = {
        ...theme === "dark" ? MD3DarkTheme : MD3LightTheme,
        colors: {
            ...theme === "dark" ? MD3DarkTheme.colors : MD3LightTheme.colors,
            primary: accentColor,
            onPrimary: '#ffffff',
            accent: accentColor,
        }
    };

    return (
        <Provider theme={customTheme}>
            <AutoLogin />
            <MainNavigator />
        </Provider>
    );
};

export default ThemeWrapper;
