import React from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider } from "./app/contexts/AppContext";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
            cacheTime: 10 * 60 * 1000,
        },
    },
});

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AppProvider />
        </QueryClientProvider>
    );
}
