import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Button } from "react-native-paper";
import styles from "../styles/styles";

const ListItem = ({ title, image, price, itemBgColor, onPress, onDelete }) => (
    <TouchableOpacity onPress={onPress} onLongPress={onDelete}>
        <View style={[styles.listItem, { backgroundColor: itemBgColor }]}>
            <Image source={image} style={styles.image} />
            <Text style={styles.listText}>{title}</Text>
            <Text style={styles.priceText}>${price}</Text>
            <Button onPress={onDelete} mode="contained" compact>
                Видалити
            </Button>
        </View>
    </TouchableOpacity>
);

export default ListItem;