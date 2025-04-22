import React, { useContext } from "react";
import { View, Text } from "react-native";
import { Button, Portal, Dialog } from "react-native-paper";
import { ThemeContext } from "../contexts/ThemeContext";
import styles from "../styles/styles";

const DetailsDialog = ({ visible, item, onClose, navigation }) => {
    const { theme } = useContext(ThemeContext);

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
            </Dialog>
        </Portal>
    );
};

export default DetailsDialog;