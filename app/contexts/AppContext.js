import React from "react";
import { AuthProvider } from "./AuthContext";
import { ThemeProvider } from "./ThemeContext";
import { ItemsProvider } from "./ItemsContext";
import antiquesData from "../antiques/antiquesData.json";
import ThemeWrapper from "../wrappers/ThemeWrapper";

export const AppProvider = ({ children }) => (
    <AuthProvider>
        <ThemeProvider>
            <ItemsProvider initialItems={antiquesData}>
                <ThemeWrapper />
                {children}
            </ItemsProvider>
        </ThemeProvider>
    </AuthProvider>
);