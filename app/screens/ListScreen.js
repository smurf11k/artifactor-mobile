import React, { useState, useContext } from "react";
import { View, FlatList } from "react-native";
import { ItemsContext } from "../contexts/ItemsContext";
import { ThemeContext } from "../contexts/ThemeContext";
import ListItem from "../components/ListItem";
import DetailsDialog from "../components/DetailsDialog";
import styles from "../styles/styles";
import images from "../utils/images";

const ListScreen = ({ navigation }) => {
    const { items, deleteItem, itemBgColor } = useContext(ItemsContext);
    const { theme, backgroundColor } = useContext(ThemeContext);
    const [visible, setVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const showDialog = (item) => {
        setSelectedItem(item);
        setVisible(true);
    };

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <FlatList
                data={items}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ListItem
                        title={item.title}
                        image={
                            item.image.startsWith('file://') || item.image.startsWith('http')
                                ? { uri: item.image }
                                : images[item.image]
                        }
                        price={item.price}
                        itemBgColor={itemBgColor}
                        onPress={() => showDialog(item)}
                        onDelete={() => deleteItem(item.id)}
                    />
                )}
                contentContainerStyle={{ paddingTop: 10, paddingBottom: 10 }}
            />

            <DetailsDialog
                visible={visible}
                item={selectedItem}
                onClose={() => setVisible(false)}
                navigation={navigation}
            />
        </View>
    );
};

export default ListScreen;