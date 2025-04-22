import React, { useState, useContext } from "react";
import { View, Text, TextInput, Alert } from "react-native";
import { Button } from "react-native-paper";
import { AuthContext } from "../contexts/AuthContext";
import { ThemeContext } from "../contexts/ThemeContext";
import styles from "../styles/styles";

const AuthScreen = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);
    const borderColor = theme === "dark" ? "white" : "black";

    const handleLogin = () => {
        if (!username.trim() || !password.trim()) {
            Alert.alert("Помилка", "Будь ласка, введіть ім'я користувача та пароль!");
            return;
        }
        login(username, password);
    };

    return (
        <View style={[styles.authContainer, { backgroundColor: theme === "dark" ? "#333" : "#f5f5f5" }]}>
            <Text style={[styles.authTitle, { color: theme === "dark" ? "white" : "black" }]}>Авторизація</Text>

            <TextInput
                placeholder="Ім'я користувача"
                value={username}
                onChangeText={setUsername}
                style={[styles.authInput, { color: theme === "dark" ? "white" : "black", borderColor }]}
                placeholderTextColor={theme === "dark" ? "#bbb" : "#666"}
            />
            <TextInput
                placeholder="Пароль"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={[styles.authInput, { color: theme === "dark" ? "white" : "black", borderColor }]}
                placeholderTextColor={theme === "dark" ? "#bbb" : "#666"}
            />
            <Button mode="contained" onPress={handleLogin} style={styles.authButton} >
                Увійти
            </Button>
        </View>
    );
};

export default AuthScreen;