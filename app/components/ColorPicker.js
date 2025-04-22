import React, { useContext } from "react";
import { View, TouchableOpacity } from "react-native";
import { ThemeContext } from "../contexts/ThemeContext";
import styles from "../styles/styles";

const ColorPicker = ({ colors, selectedColor, onSelect, isBackground = false }) => {
    const { theme } = useContext(ThemeContext);
    const borderColor = theme === "dark" ? "#fff" : "#000";

    return (
        <View style={styles.colorPickerContainer}>
            {colors.map((color) => (
                <TouchableOpacity
                    key={color}
                    onPress={() => onSelect(color)}
                    style={[
                        styles.colorOption,
                        { backgroundColor: color },
                        selectedColor === color
                            ? { borderWidth: 2, borderColor, elevation: 5 }
                            : { borderWidth: 2, borderColor: isBackground ? "#777" : "#ccc" },
                    ]}
                />
            ))}
        </View>
    );
};

export default ColorPicker;