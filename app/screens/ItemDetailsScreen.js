import React, { useContext } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { FontAwesome as Icon } from '@expo/vector-icons';
import { ThemeContext } from "../contexts/ThemeContext";
import styles from "../styles/styles";
import images from "../utils/images";

const ItemDetailsScreen = ({ route, navigation }) => {
    const { item } = route.params;
    const { theme, backgroundColor } = useContext(ThemeContext);

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="chevron-left" size={20} color={theme === 'dark' ? 'white' : 'black'} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme === 'dark' ? 'white' : 'black' }]}>
                    Деталі антикваріату
                </Text>
            </View>

            <ScrollView contentContainerStyle={styles.detailsContainer}>
                <View style={styles.imageWrapper}>
                    <Image
                        source={
                            typeof item.image === 'string' &&
                                (item.image.startsWith('http') || item.image.startsWith('file://'))
                                ? { uri: item.image }
                                : images[item.image]
                        }
                        style={styles.detailsImage}
                    />
                </View>
                <View style={styles.detailsContent}>
                    <Text style={[styles.detailsTitle, { color: theme === 'dark' ? 'white' : 'black' }]}>
                        {item.title}
                    </Text>
                    <Text style={[styles.detailsPrice, { color: theme === 'dark' ? 'white' : 'black' }]}>
                        Ціна: <Text style={styles.priceValue}>${item.price}</Text>
                    </Text>
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme === 'dark' ? 'white' : 'black' }]}>
                            Опис
                        </Text>
                        <Text style={[styles.detailsDescription, { color: theme === 'dark' ? 'white' : 'black' }]}>
                            {item.description}
                        </Text>
                    </View>
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme === 'dark' ? 'white' : 'black' }]}>
                            Додаткова інформація
                        </Text>
                        <View style={styles.infoRow}>
                            <Text style={[styles.infoLabel, { color: theme === 'dark' ? 'white' : 'black' }]}>
                                ID: {item.id}
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default ItemDetailsScreen;