import React, { useContext } from "react";
import { View, Text, Switch } from "react-native";
import { ThemeContext } from "../contexts/ThemeContext";
import styles from "../styles/styles";

const ThemeSwitcher = () => {
    const { theme, toggleTheme, accentColor } = useContext(ThemeContext);

    return (
        <View style={styles.switchContainer}>
            <Text style={[styles.text, {
                color: theme === "dark" ? "white" : "black",
                marginRight: 20
            }]}>
                {theme === "dark" ? "Темна тема" : "Світла тема"}
            </Text>
            <Switch
                value={theme === "dark"}
                onValueChange={toggleTheme}
                thumbColor={accentColor}
                trackColor={{ false: "#95a5a6", true: accentColor }}
            />
        </View>
    );
};

export default ThemeSwitcher;