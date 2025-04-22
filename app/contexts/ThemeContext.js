import React, { createContext, useState } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState("light");
    const [accentColor, setAccentColor] = useState("#6750a4");

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    const backgroundColor = theme === "dark" ? "#333" : "#f5f5f5";

    return (
        <ThemeContext.Provider
            value={{ theme, toggleTheme, accentColor, setAccentColor, backgroundColor }}
        >
            {children}
        </ThemeContext.Provider>
    );
};