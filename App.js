import React, { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider } from "./app/contexts/AppContext";
import SplashScreen from "./app/screens/SplashScreen";
import * as ExpoSplashScreen from 'expo-splash-screen';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
            cacheTime: 10 * 60 * 1000,
        },
    },
});

export default function App() {
    const [appReady, setAppReady] = useState(false);
    const [splashHidden, setSplashHidden] = useState(false);

    useEffect(() => {
        async function hideNativeSplash() {
            await ExpoSplashScreen.hideAsync();
            setSplashHidden(true);
        }
        hideNativeSplash();
    }, []);

    const handleSplashEnd = async () => {
        setAppReady(true);
    };

    return (
        <QueryClientProvider client={queryClient}>
            {splashHidden && !appReady && (
                <SplashScreen onAnimationEnd={handleSplashEnd} />
            )}
            {appReady && <AppProvider />}
        </QueryClientProvider>
    );
}
