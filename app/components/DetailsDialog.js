import React, { useContext, useEffect } from "react";
import { View, Text } from "react-native";
import { Button, Portal, Dialog } from "react-native-paper";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, Easing } from "react-native-reanimated";
import { ThemeContext } from "../contexts/ThemeContext";
import styles from "../styles/styles";

const DetailsDialog = ({ visible, item, onClose, navigation }) => {
    const { theme } = useContext(ThemeContext);

    const opacity = useSharedValue(0);
    const translateY = useSharedValue(30);
    const scale = useSharedValue(0.8);

    useEffect(() => {
        if (visible) {
            opacity.value = withTiming(1, { duration: 300 });
            translateY.value = withSpring(0, { damping: 12, stiffness: 90 });
            scale.value = withSpring(1, { damping: 12, stiffness: 90 });
        } else {
            opacity.value = withTiming(0, { duration: 200 });
            translateY.value = withTiming(30, { duration: 200, easing: Easing.out(Easing.quad) });
            scale.value = withTiming(0.8, { duration: 200 });
        }
    }, [visible]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [
            { translateY: translateY.value },
            { scale: scale.value },
        ],
    }));

    const handleDetailsPress = () => {
        onClose();
        navigation.navigate('ItemDetails', { item });
    };

    return (
        <Portal>
            <Dialog
                visible={visible}
                onDismiss={onClose}
                style={theme === 'dark' ? styles.darkDialog : styles.lightDialog}
            >
                <Animated.View style={animatedStyle}>
                    <Dialog.Title style={{ color: theme === 'dark' ? 'white' : 'black' }}>
                        Деталі антикваріату
                    </Dialog.Title>
                    <Dialog.Content>
                        {item && (
                            <View style={styles.dialogContent}>
                                <Text style={[styles.dialogText, { color: theme === 'dark' ? 'white' : 'black' }]}>
                                    {item.title}
                                </Text>
                                <Text style={styles.dialogPrice}>${item.price}</Text>
                            </View>
                        )}
                    </Dialog.Content>
                    <Dialog.Actions style={{ justifyContent: 'space-between' }}>
                        <Button onPress={handleDetailsPress}>Детальніше</Button>
                        <Button onPress={onClose}>Закрити</Button>
                    </Dialog.Actions>
                </Animated.View>
            </Dialog>
        </Portal>
    );
};

export default DetailsDialog;