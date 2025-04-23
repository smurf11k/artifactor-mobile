import React, { useState, useContext } from "react";
import { View, FlatList, Text, Image, TouchableOpacity } from "react-native";
import { useQuery } from '@tanstack/react-query';
import { ThemeContext } from "../contexts/ThemeContext";
import { ItemsContext } from "../contexts/ItemsContext";
import { fetchUsers } from "../utils/api";
import styles from "../styles/styles";

const UsersScreen = () => {
    const { theme, backgroundColor } = useContext(ThemeContext);
    const { itemBgColor } = useContext(ItemsContext);
    const [selectedItems, setSelectedItems] = useState([]);
    const { data, isLoading, error } = useQuery({ queryKey: ['users'], queryFn: fetchUsers });

    const toggleItemSelection = (item) => {
        setSelectedItems(prev => {
            if (prev.some(selected => selected.id === item.id)) {
                return prev.filter(selected => selected.id !== item.id);
            }
            if (prev.length >= 3) return prev;
            return [...prev, item];
        });
    };

    const sortedData = data ? [...data].sort((a, b) => {
        const aSelected = selectedItems.some(item => item.id === a.id);
        const bSelected = selectedItems.some(item => item.id === b.id);
        if (aSelected && !bSelected) return -1;
        if (!aSelected && bSelected) return 1;
        return 0;
    }) : [];

    if (isLoading) return <Text>Завантаження...</Text>;
    if (error) return <Text>Помилка завантаження</Text>;

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <View style={styles.selectionInfo}>
                <Text style={[styles.title, { color: theme === "dark" ? "white" : "black" }]}>
                    Прикріплено: {selectedItems.length}/3
                </Text>
            </View>
            <FlatList
                data={sortedData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => toggleItemSelection(item)}
                        style={[
                            styles.listItem,
                            {
                                backgroundColor: itemBgColor,
                                borderColor: selectedItems.some(selected => selected.id === item.id)
                                    ? '#007AFF'
                                    : 'transparent',
                                borderWidth: 2
                            }
                        ]}
                    >
                        <Image source={{ uri: item.avatar }} style={styles.image} />
                        <View style={styles.textContainer}>
                            <Text style={styles.listText}>
                                {item.first_name} {item.last_name}
                            </Text>
                            <Text>{item.email}</Text>
                        </View>
                        {selectedItems.some(selected => selected.id === item.id) && (
                            <Text>📌</Text>
                        )}
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

export default UsersScreen;