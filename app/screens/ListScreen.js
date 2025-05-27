import React, { useState, useContext, useEffect } from "react";
import { View, FlatList } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
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
    const opacity = useSharedValue(1);

    useEffect(() => {
        opacity.value = withTiming(0, { duration: 200 });
        setTimeout(() => {
            opacity.value = withTiming(1, { duration: 200 });
        }, 200);
    }, [backgroundColor]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    const showDialog = (item) => {
        setSelectedItem(item);
        setVisible(true);
    };

    return (
        <Animated.View style={[styles.container, { backgroundColor }, animatedStyle]}>
            <FlatList
                data={items}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                    <ListItem
                        index={index}
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
        </Animated.View>
    );
};

export default ListScreen;