import React, { useContext, useEffect, useState } from "react";
import { Text } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolateColor, runOnJS, } from "react-native-reanimated";
import { ThemeContext } from "../contexts/ThemeContext";
import { ItemsContext } from "../contexts/ItemsContext";
import ThemeSwitcher from "../components/ThemeSwitcher";
import SessionModeSwitcher from "../components/SessionModeSwitcher";
import ColorPicker from "../components/ColorPicker";
import UserInfo from "../components/UserInfo";
import styles from "../styles/styles";

const SettingsScreen = () => {
    const { theme, accentColor, setAccentColor, backgroundColor } = useContext(ThemeContext);
    const { itemBgColor, setItemBgColor } = useContext(ItemsContext);

    const [prevBgColor, setPrevBgColor] = useState(backgroundColor);
    const progress = useSharedValue(1);

    useEffect(() => {
        if (prevBgColor === backgroundColor) return;

        progress.value = 0;
        progress.value = withTiming(1, { duration: 800 }, () => {
            runOnJS(setPrevBgColor)(backgroundColor);
        });
    }, [backgroundColor]);

    const animatedStyle = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            progress.value,
            [0, 1],
            [prevBgColor, backgroundColor]
        ),
    }));

    const availableAccentColors = ["#6750a4", "#d32f2f", "#388e3c", "#1976d2", "#fbc02d"];
    const availableBgColors = ["#ecf0f1", "#ffebcd", "#dcdcdc", "#e6e6fa", "#fffacd"];

    return (
        <Animated.View style={[styles.container, animatedStyle]}>
            <ThemeSwitcher />
            <Text style={[styles.title, { color: theme === "dark" ? "white" : "black" }]}>
                Виберіть акцентний колір:
            </Text>
            <ColorPicker colors={availableAccentColors} selectedColor={accentColor} onSelect={setAccentColor} />
            <Text style={[styles.title, { color: theme === "dark" ? "white" : "black" }]}>
                Виберіть колір фону елементів:
            </Text>
            <ColorPicker colors={availableBgColors} selectedColor={itemBgColor} onSelect={setItemBgColor} isBackground />
            <SessionModeSwitcher />
            <UserInfo />
        </Animated.View>
    );
};

export default SettingsScreen;