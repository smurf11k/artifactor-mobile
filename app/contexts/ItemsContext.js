import React, { createContext, useState } from "react";

export const ItemsContext = createContext();

export const ItemsProvider = ({ children, initialItems }) => {
    const [items, setItems] = useState(initialItems);
    const [itemBgColor, setItemBgColor] = useState("#ecf0f1");

    const addItem = (newItem) => {
        setItems([...items, {
            id: Date.now().toString(),
            ...newItem,
            image: newItem.image || "default.png"
        }]);
    };

    const deleteItem = (id) => {
        setItems(items.filter((item) => item.id !== id));
    };

    return (
        <ItemsContext.Provider value={{ items, addItem, deleteItem, itemBgColor, setItemBgColor }}>
            {children}
        </ItemsContext.Provider>
    );
};