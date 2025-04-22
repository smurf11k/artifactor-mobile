import React, { useState, useContext } from "react";
import { View, Text, TextInput, Image, Alert } from "react-native";
import { Button } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import { ItemsContext } from "../contexts/ItemsContext";
import { ThemeContext } from "../contexts/ThemeContext";
import styles from "../styles/styles";

import * as FileSystem from 'expo-file-system';

const AdditionScreen = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState(null);
    const { addItem } = useContext(ItemsContext);
    const { theme, backgroundColor } = useContext(ThemeContext);
    const borderColor = theme === "dark" ? "white" : "black";


    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            const sourceUri = result.assets[0].uri;
            const filename = sourceUri.split('/').pop();
            const dest = FileSystem.documentDirectory + filename;

            try {
                await FileSystem.copyAsync({ from: sourceUri, to: dest });
                setImage(dest);
            } catch (error) {
                console.error("Image saving failed:", error);
            }
        }
    };


    const handleAddItem = () => {
        if (!title.trim() || !description.trim() || !price.trim()) {
            Alert.alert("Помилка", "Будь ласка заповніть всі поля!");
            return;
        }

        addItem({ title, description, price, image });
        setTitle("");
        setDescription("");
        setPrice("");
        setImage(null);
    };

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Text style={[styles.title, { color: theme === "dark" ? "white" : "black" }]}>
                Додавання нового антикваріату
            </Text>
            <TextInput
                placeholder="Назва"
                value={title}
                onChangeText={setTitle}
                style={[styles.input, { color: theme === "dark" ? "white" : "black", borderColor }]}
                placeholderTextColor={theme === "dark" ? "#bbb" : "#666"}
            />
            <TextInput
                placeholder="Опис"
                value={description}
                onChangeText={setDescription}
                style={[styles.input, { color: theme === "dark" ? "white" : "black", borderColor }]}
                placeholderTextColor={theme === "dark" ? "#bbb" : "#666"}
                multiline
            />
            <TextInput
                placeholder="Ціна"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                style={[styles.input, { color: theme === "dark" ? "white" : "black", borderColor }]}
                placeholderTextColor={theme === "dark" ? "#bbb" : "#666"}
            />
            <View style={styles.imagePickerContainer}>
                <Button mode="outlined" onPress={pickImage} style={styles.imageButton}>
                    {image ? 'Змінити зображення' : 'Вибрати зображення'}
                </Button>
                {image && (
                    <>
                        <Image source={{ uri: image }} style={styles.previewImage} />
                        <Button
                            mode="text"
                            onPress={() => setImage(null)}
                            style={styles.removeImageButton}
                            textColor="#ff4444"
                        >
                            Видалити
                        </Button>
                    </>
                )}
            </View>
            <Button mode="contained" onPress={handleAddItem} style={styles.submitButton}>
                Додати
            </Button>
        </View>
    );
};

export default AdditionScreen;