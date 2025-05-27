import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from "react-native-reanimated";
import { Button } from "react-native-paper";
import styles from "../styles/styles";

const ListItem = ({ index, title, image, price, itemBgColor, onPress, onDelete }) => {
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(20);
    const scale = useSharedValue(1);

    useEffect(() => {
        const delay = index * 150;

        const timeout = setTimeout(() => {
            opacity.value = withTiming(1, { duration: 500 });
            translateY.value = withTiming(0, { duration: 500 });
        }, delay);

        return () => clearTimeout(timeout);
    }, [index]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }, { scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.95);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1);
    };

    return (
        <Animated.View style={[{ backgroundColor: itemBgColor, marginBottom: 8 }, animatedStyle]}>
            <TouchableOpacity
                style={styles.listItem}
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
            >
                <Image source={image} style={styles.image} />
                <Text style={styles.listText}>{title}</Text>
                <Text style={styles.priceText}>${price}</Text>
                <Button onPress={onDelete} mode="contained" compact>
                    Видалити
                </Button>
            </TouchableOpacity>
        </Animated.View>

    );
};

export default ListItem;