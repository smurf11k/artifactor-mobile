import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
export const ItemsContext = createContext();

export const ItemsProvider = ({ children, initialItems }) => {
    const [items, setItems] = useState([]);
    const [itemBgColor, setItemBgColor] = useState("#ecf0f1");
    const [sessionMode, setSessionMode] = useState(false);

    useEffect(() => {
        const loadItems = async () => {
            try {
                const storedItems = await AsyncStorage.getItem('@items');
                if (storedItems !== null && !sessionMode) {
                    setItems(JSON.parse(storedItems));
                } else {
                    setItems(initialItems);
                    if (!sessionMode) {
                        await AsyncStorage.setItem('@items', JSON.stringify(initialItems));
                    }
                }
            } catch (error) {
                console.error("Не вдалося завантажити items", error);
            }
        };

        loadItems();
    }, [sessionMode, initialItems]);

    useEffect(() => {
        const saveItems = async () => {
            try {
                if (!sessionMode) {
                    await AsyncStorage.setItem('@items', JSON.stringify(items));
                }
            } catch (error) {
                console.error("Не вдалося зберегти items до памʼяті", error);
            }
        };

        if (items.length > 0 && !sessionMode) {
            saveItems();
        }
    }, [items, sessionMode]);

    const toggleSessionMode = (value) => {
        setSessionMode(value);
    };

    const addItem = (newItem) => {
        setItems(prev => [
            ...prev,
            {
                id: Date.now().toString(),
                ...newItem,
                image: newItem.image || "default.png"
            }
        ]);
    };

    const deleteItem = (id) => {
        setItems(prev => prev.filter((item) => item.id !== id));
    };

    return (
        <ItemsContext.Provider value={{
            items,
            addItem,
            deleteItem,
            itemBgColor,
            setItemBgColor,
            sessionMode,
            toggleSessionMode
        }}>
            {children}
        </ItemsContext.Provider>
    );
};
