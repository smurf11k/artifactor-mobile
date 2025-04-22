import React from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from "react-native-paper";
import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";
import MainNavigator from "./app/navigation/MainNavigator";
import { AuthProvider } from "./app/contexts/AuthContext";
import { ItemsProvider } from "./app/contexts/ItemsContext";
import { ThemeProvider, ThemeContext } from "./app/contexts/ThemeContext";
import antiquesData from "./app/antiques/antiquesData.json";

import { useContext, useEffect } from "react";
import { AuthContext } from "./app/contexts/AuthContext";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
            cacheTime: 10 * 60 * 1000,
        },
    },
});

export default function App() {
    const AutoLogin = () => {
        const { login } = useContext(AuthContext);

        useEffect(() => {
            login("eve.holt@reqres.in", "cityslicka");
        }, []);

        return null;
    };

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <ItemsProvider initialItems={antiquesData}>
                    <ThemeProvider>
                        <ThemeContext.Consumer>
                            {({ theme, accentColor }) => {
                                const customTheme = {
                                    ...theme === "dark" ? MD3DarkTheme : MD3LightTheme,
                                    colors: {
                                        ...theme === "dark" ? MD3DarkTheme.colors : MD3LightTheme.colors,
                                        primary: accentColor,
                                        onPrimary: '#ffffff',
                                        accent: accentColor,
                                    }
                                };

                                return (
                                    <Provider theme={customTheme}>
                                        {/* <AutoLogin />*/}
                                        <MainNavigator />
                                    </Provider>
                                );
                            }}
                        </ThemeContext.Consumer>
                    </ThemeProvider>
                </ItemsProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}