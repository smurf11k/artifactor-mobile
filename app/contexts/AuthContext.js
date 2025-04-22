import React, { createContext, useState } from "react";
import { Alert } from "react-native";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    const login = async (username, password) => {
        try {
            const response = await fetch('https://reqres.in/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: username, password }),
            });

            if (!response.ok) throw new Error('Login failed');

            const data = await response.json();
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