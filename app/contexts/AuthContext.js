import React, { createContext, useState } from "react";
import { loginUser } from "../utils/api";
import { Alert } from "react-native";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    const login = async (username, password) => {
        try {
            const data = await loginUser(username, password);
            setIsAuthenticated(true);
            setUser({ username, token: data.token });
        } catch (error) {
            Alert.alert("Помилка", "Невірне ім'я користувача або пароль!");
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};