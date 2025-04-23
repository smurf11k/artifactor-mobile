import React, { useContext } from "react";
import { View, Text, Switch } from "react-native";
import { ItemsContext } from "../contexts/ItemsContext";
import { ThemeContext } from "../contexts/ThemeContext";
import styles from "../styles/styles";

const SessionModeSwitcher = () => {
    const { sessionMode, toggleSessionMode } = useContext(ItemsContext);
    const { theme, accentColor } = useContext(ThemeContext);

    return (
        <View style={styles.switchContainer}>
            <Text style={[styles.text, { marginRight: 20, color: theme === "dark" ? "white" : "black" }]}>
                Режим "лише на поточну сесію"
            </Text>
            <Switch
                value={sessionMode}
                onValueChange={toggleSessionMode}
                thumbColor={accentColor}
                trackColor={{ false: "#95a5a6", true: accentColor }}
            />
        </View>
    );
};

export default SessionModeSwitcher;
