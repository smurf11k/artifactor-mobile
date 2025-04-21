import React, { useState, createContext, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, Switch, TextInput, Alert, ScrollView } from "react-native";
import { Button, Provider, Portal, Dialog, MD3LightTheme, MD3DarkTheme } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome as Icon } from '@expo/vector-icons';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import antiquesData from "./app/antiques/antiquesData.json";
import { launchImageLibrary } from 'react-native-image-picker';

const ThemeContext = createContext();
const ItemsContext = createContext();
const AuthContext = createContext();

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const AuthStack = createStackNavigator();

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 хвилин
            cacheTime: 10 * 60 * 1000, // 10 хвилин
        },
    },
});

// Екран авторизації
const AuthScreen = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);
    const borderColor = theme === "dark" ? "white" : "black";

    const handleLogin = () => {
        if (!username.trim() || !password.trim()) {
            Alert.alert("Помилка", "Будь ласка, введіть ім'я користувача та пароль!");
            return;
        }
        login(username, password);
    };

    return (
        <View style={[styles.authContainer, { backgroundColor: theme === "dark" ? "#333" : "#f5f5f5" }]}>
            <Text style={[styles.authTitle, { color: theme === "dark" ? "white" : "black" }]}>Авторизація</Text>

            <TextInput
                placeholder="Ім'я користувача"
                value={username}
                onChangeText={setUsername}
                style={[styles.authInput, { color: theme === "dark" ? "white" : "black", borderColor }]}
                placeholderTextColor={theme === "dark" ? "#bbb" : "#666"}
            />
            <TextInput
                placeholder="Пароль"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={[styles.authInput, { color: theme === "dark" ? "white" : "black", borderColor }]}
                placeholderTextColor={theme === "dark" ? "#bbb" : "#666"}
            />
            <Button mode="contained" onPress={handleLogin} style={styles.authButton}>
                Увійти
            </Button>
        </View>
    );
};

// Інформація про користувача
const UserInfo = () => {
    const { user, logout } = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);

    return (
        <View style={styles.userInfoContainer}>

            <Text style={[styles.userInfoText, { color: theme === "dark" ? "white" : "black" }]}>
                Поточний користувач:
            </Text>
            <Text style={[styles.usernameText, { color: theme === "dark" ? "white" : "black" }]}>
                {user?.username}
            </Text>
            <Button mode="contained" onPress={logout} style={styles.logoutButton}>
                Вийти
            </Button>
        </View>
    );
};

// Елемент списку антикваріату
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

// Зміна теми
const ThemeSwitcher = () => {
    const { theme, toggleTheme, accentColor } = useContext(ThemeContext);
    return (
        <View style={styles.switchContainer}>
            <Text style={[styles.text, { color: theme === "dark" ? "white" : "black", marginRight: 20 }]}>
                {theme === "dark" ? "Темна тема" : "Світла тема"}
            </Text>
            <Switch
                value={theme === "dark"}
                onValueChange={toggleTheme}
                thumbColor={accentColor}
                trackColor={{ false: "#95a5a6", true: accentColor }}
            />
        </View>
    );
};

// Вибір кольору
const ColorPicker = ({ colors, selectedColor, onSelect, isBackground = false }) => {
    const { theme } = useContext(ThemeContext);
    const borderColor = theme === "dark" ? "#fff" : "#000";

    return (
        <View style={styles.colorPickerContainer}>
            {colors.map((color) => (
                <TouchableOpacity
                    key={color}
                    onPress={() => onSelect(color)}
                    style={[
                        styles.colorOption,
                        { backgroundColor: color },
                        selectedColor === color
                            ? { borderWidth: 2, borderColor, elevation: 5 }
                            : { borderWidth: 2, borderColor: isBackground ? "#777" : "#ccc" },
                    ]}
                />
            ))}
        </View>
    );
};

// Екран списку антикваріату
const ScreenOne = ({ navigation }) => {
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
                        image={images[item.image]}
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

// Екран налаштування
const ScreenTwo = () => {
    const { theme, accentColor, setAccentColor, backgroundColor } = useContext(ThemeContext);
    const { itemBgColor, setItemBgColor } = useContext(ItemsContext);

    const availableAccentColors = ["#6750a4", "#d32f2f", "#388e3c", "#1976d2", "#fbc02d"];
    const availableBgColors = ["#ecf0f1", "#ffebcd", "#dcdcdc", "#e6e6fa", "#fffacd"];

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <ThemeSwitcher />

            <Text style={[styles.title, { color: theme === "dark" ? "white" : "black" }]}>
                Виберіть акцентний колір:
            </Text>
            <ColorPicker colors={availableAccentColors} selectedColor={accentColor} onSelect={setAccentColor} />

            <Text style={[styles.title, { color: theme === "dark" ? "white" : "black" }]}>
                Виберіть колір фону елементів:
            </Text>
            <ColorPicker colors={availableBgColors} selectedColor={itemBgColor} onSelect={setItemBgColor} isBackground />

            <UserInfo />
        </View>
    );
};

// Екран для додавання нового антикваріату
const ScreenThree = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState(null);
    const { addItem } = useContext(ItemsContext);
    const { theme, backgroundColor } = useContext(ThemeContext);
    const borderColor = theme === "dark" ? "white" : "black";

    const pickImage = () => {
        const options = {
            mediaType: 'photo',
            includeBase64: false,
            maxHeight: 512,
            maxWidth: 512,
            quality: 1,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.assets && response.assets[0].uri) {
                setImage(response.assets[0].uri);
            }
        });
    };

    const handleAddItem = () => {
        if (!title.trim() || !description.trim() || !price.trim()) {
            Alert.alert("Помилка", "Будь ласка, заповніть всі поля!");
            return;
        }

        addItem({
            title,
            description,
            price,
            image: image
        });

        setTitle("");
        setDescription("");
        setPrice("");
        setImage(null);
    };

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Text style={[styles.title, { color: theme === "dark" ? "white" : "black" }]}>
                Додавання нового антикваріату
            </Text>

            <TextInput
                placeholder="Назва"
                value={title}
                onChangeText={setTitle}
                style={[styles.input, { color: theme === "dark" ? "white" : "black", borderColor }]}
                placeholderTextColor={theme === "dark" ? "#bbb" : "#666"}
            />
            <TextInput
                placeholder="Опис"
                value={description}
                onChangeText={setDescription}
                style={[styles.input, { color: theme === "dark" ? "white" : "black", borderColor }]}
                placeholderTextColor={theme === "dark" ? "#bbb" : "#666"}
                multiline
            />
            <TextInput
                placeholder="Ціна"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                style={[styles.input, { color: theme === "dark" ? "white" : "black", borderColor }]}
                placeholderTextColor={theme === "dark" ? "#bbb" : "#666"}
            />

            <View style={styles.imagePickerContainer}>
                <Button mode="outlined" onPress={pickImage} style={styles.imageButton}>
                    {image ? 'Змінити зображення' : 'Вибрати зображення'}
                </Button>
                {image && (
                    <Image source={{ uri: image }} style={styles.previewImage} />
                )}
                {image && (
                    <Button
                        mode="text"
                        onPress={() => setImage(null)}
                        style={styles.removeImageButton}
                        textColor="#ff4444"
                    >
                        Видалити
                    </Button>
                )}
            </View>

            <Button mode="contained" onPress={handleAddItem} style={styles.submitButton}>
                Додати
            </Button>
        </View>
    );
};

// Завантаження користувачів з API
const fetchUsers = async () => {
    const res = await fetch("https://reqres.in/api/users?per_page=12");
    const json = await res.json();
    return json.data;
};

// Екран для відображення користувачів
const ScreenFour = () => {
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
                            <Text>
                                {item.email}
                            </Text>
                        </View>
                        {selectedItems.some(selected => selected.id === item.id) && (
                            <View>
                                <Text>📌</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

// Діалог для відображення деталей антикваріату
const DetailsDialog = ({ visible, item, onClose, navigation }) => {
    const { theme } = useContext(ThemeContext);

    const handleDetailsPress = () => {
        onClose();
        navigation.navigate('ItemDetails', { item });
    };

    return (
        <Portal>
            <Dialog
                visible={visible}
                onDismiss={onClose}
                style={theme === 'dark' ? styles.darkDialog : styles.lightDialog}
            >
                <Dialog.Title style={{ color: theme === 'dark' ? 'white' : 'black' }}>
                    Деталі антикваріату
                </Dialog.Title>
                <Dialog.Content>
                    {item && (
                        <View style={styles.dialogContent}>
                            <Text style={[styles.dialogText, { color: theme === 'dark' ? 'white' : 'black' }]}>
                                {item.title}
                            </Text>
                            <Text style={styles.dialogPrice}>${item.price}</Text>
                        </View>
                    )}
                </Dialog.Content>
                <Dialog.Actions style={{ justifyContent: 'space-between' }}>
                    <Button onPress={handleDetailsPress}>Детальніше</Button>
                    <Button onPress={onClose}>Закрити</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

const ItemDetailsScreen = ({ route, navigation }) => {
    const { item } = route.params;
    const { theme, backgroundColor } = useContext(ThemeContext);

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Icon
                        name="arrow-left"
                        size={24}
                        color={theme === 'dark' ? 'white' : 'black'}
                    />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme === 'dark' ? 'white' : 'black' }]}>
                    Деталі товару
                </Text>
            </View>

            {/* Контент */}
            <ScrollView contentContainerStyle={styles.detailsContainer}>
                <Image
                    source={images[item.image]}
                    style={styles.detailsImage}
                />

                <View style={styles.detailsContent}>
                    <Text style={[styles.detailsTitle, { color: theme === 'dark' ? 'white' : 'black' }]}>
                        {item.title}
                    </Text>

                    <Text style={[styles.detailsPrice, { color: theme === 'dark' ? 'white' : 'black' }]}>
                        Ціна: ${item.price}
                    </Text>

                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme === 'dark' ? '#bbb' : '#666' }]}>
                            Опис
                        </Text>
                        <Text style={[styles.detailsDescription, { color: theme === 'dark' ? 'white' : 'black' }]}>
                            {item.description}
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme === 'dark' ? '#bbb' : '#666' }]}>
                            Інформація
                        </Text>
                        <View style={styles.infoRow}>
                            <Text style={[styles.infoLabel, { color: theme === 'dark' ? '#bbb' : '#666' }]}>ID: {item.id}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

// Навігатор екранів
const TabNavigator = () => {
    const { theme, accentColor } = useContext(ThemeContext);

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Антикваріат') {
                        iconName = focused ? 'home' : 'home';
                    } else if (route.name === 'Налаштування') {
                        iconName = focused ? 'cog' : 'cog';
                    } else if (route.name === 'Додати') {
                        iconName = focused ? 'plus-circle' : 'plus-circle';
                    } else if (route.name === 'Користувачі') {
                        iconName = focused ? 'user-circle' : 'user-circle';
                    }

                    return <Icon name={iconName} size={size} color={color} />;
                },

                tabBarActiveTintColor: accentColor,
                tabBarInactiveTintColor: theme === "dark" ? "#bbb" : "#666",
                tabBarStyle: {
                    backgroundColor: theme === "dark" ? "#222" : "#fff",
                    borderTopWidth: 0,
                    elevation: 8,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 6,
                },
                headerStyle: {
                    backgroundColor: theme === "dark" ? "#222" : "#fff",
                    elevation: 0,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    borderBottomWidth: 0,
                },
                headerTitleStyle: {
                    color: theme === "dark" ? "white" : "black",
                    fontWeight: 'bold',
                },
            })}
        >
            <Tab.Screen
                name="Антикваріат"
                component={ScreenOne}
                options={{ headerTitle: "Антикваріат" }}
            />
            <Tab.Screen
                name="Налаштування"
                component={ScreenTwo}
                options={{ headerTitle: "Налаштування" }}
            />
            <Tab.Screen
                name="Додати"
                component={ScreenThree}
                options={{ headerTitle: "Додати антикваріат" }}
            />
            <Tab.Screen
                name="Користувачі"
                component={ScreenFour}
                options={{ headerTitle: "Користувачі" }}
            />
        </Tab.Navigator>
    );
};

// Навігатор авторизації
const AuthNavigator = () => {
    return (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="Login" component={AuthScreen} />
        </AuthStack.Navigator>
    );
};

// Головний навігатор
const MainNavigator = () => {
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isAuthenticated ? (
                    <Stack.Screen name="Main" component={TabNavigator} />
                ) : (
                    <Stack.Screen name="Auth" component={AuthNavigator} />
                )}
                <Stack.Screen name="ItemDetails" component={ItemDetailsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default function App() {
    const [items, setItems] = useState(antiquesData);
    const [itemBgColor, setItemBgColor] = useState("#ecf0f1");
    const [theme, setTheme] = useState("light");
    const [accentColor, setAccentColor] = useState("#6750a4");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    const login = async (username, password) => {
        try {
            const response = await fetch('https://reqres.in/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: username, password }),
            });

            if (!response.ok) {
                throw new Error('Помилка авторизації');
            }

            const data = await response.json();
            setIsAuthenticated(true);
            setUser({ username, token: data.token });
        } catch (error) {
            Alert.alert("Помилка", "Невірне ім'я користувача або пароль!");
        }
    };

    login('eve.holt@reqres.in', 'cityslicka');

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
    };

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    const backgroundColor = theme === "dark" ? "#333" : "#f5f5f5";

    const addItem = (title, description, price, image) => {
        setItems([...items, {
            id: Date.now().toString(),
            title,
            description,
            price,
            image: image || "antiques/default.png"
        }]);
    };

    const deleteItem = (id) => {
        setItems(items.filter((item) => item.id !== id));
    };

    const customTheme = {
        ...(theme === "light" ? MD3LightTheme : MD3DarkTheme),
        colors: {
            ...(theme === "light" ? MD3LightTheme.colors : MD3DarkTheme.colors),
            primary: accentColor,
        },
    };

    return (
        <QueryClientProvider client={queryClient}>
            <Provider theme={customTheme}>
                <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
                    <ItemsContext.Provider value={{ items, addItem, deleteItem, itemBgColor, setItemBgColor }}>
                        <ThemeContext.Provider value={{ theme, toggleTheme, accentColor, setAccentColor, backgroundColor }}>
                            <MainNavigator />
                        </ThemeContext.Provider>
                    </ItemsContext.Provider>
                </AuthContext.Provider>
            </Provider>
        </QueryClientProvider>
    );
}

// Стилі
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
    },
    authContainer: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
    },
    authTitle: {
        fontSize: 24,
        textAlign: "center",
        marginBottom: 30,
    },
    authInput: {
        borderWidth: 1,
        padding: 10,
        width: "100%",
        marginBottom: 20,
        borderRadius: 5,
    },
    authButton: {
        marginTop: 20,
    },
    userInfoContainer: {
        marginTop: 30,
        alignItems: "center",
    },
    userInfoText: {
        fontSize: 18,
        marginBottom: 10,
    },
    usernameText: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: "bold",
    },
    logoutButton: {
        marginTop: 10,
    },
    darkTheme: { backgroundColor: "#333" },
    menuContainer: { position: "absolute", top: 20, left: 10, zIndex: 10 },
    menuButton: { alignSelf: "flex-start", marginTop: 20 },
    contentContainer: { flex: 1, padding: 20, marginTop: 80, paddingHorizontal: 20 },
    listItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
        marginBottom: 5,
        borderRadius: 5,
    },
    image: { width: 50, height: 50, marginRight: 10 },
    listText: { fontSize: 16, flex: 1 },
    priceText: { fontSize: 16, color: "green", fontWeight: "bold", paddingRight: 10 },
    text: { fontSize: 18, marginBottom: 12 },
    title: {
        fontSize: 20,
        textAlign: "center",
        marginBottom: 30,
    },

    textContainer: {
        flex: 1,
        flexShrink: 1,
    },

    input: { borderWidth: 1, padding: 10, width: "100%", marginBottom: 30, borderRadius: 5 },
    colorPickerContainer: { flexDirection: "row", justifyContent: "center", marginBottom: 25, paddingHorizontal: 10 },
    colorOption: { width: 40, height: 40, marginHorizontal: 5, borderRadius: 5 },
    switchContainer: { flexDirection: "row", alignItems: "center", justifyContent: "center", width: "100%", paddingVertical: 10, marginBottom: 10 },

    tabBarStyle: {
        borderTopWidth: 1,
        elevation: 8, // For Android shadow
        shadowOffset: { width: 0, height: -3 }, // For iOS shadow
        shadowRadius: 4,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOpacity: 1,
    },
    lightDialog: {
        backgroundColor: 'white',
    },
    darkDialog: {
        backgroundColor: '#333',
    },
    dialogContent: {
        padding: 10,
    },
    dialogText: {
        fontSize: 16,
        marginBottom: 10,
    },
    dialogPrice: {
        fontSize: 16,
        color: 'green',
        fontWeight: 'bold',
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    detailsContainer: {
        paddingBottom: 20,
    },
    detailsContent: {
        paddingHorizontal: 15,
    },
    detailsImage: {
        width: '100%',
        height: 300,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    detailsTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    detailsPrice: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 20,
        color: '#2ecc71',
    },
    detailsDescription: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 20,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    infoLabel: {
        width: 80,
        fontSize: 16,
    },
    infoValue: {
        fontSize: 16,
        flex: 1,
    },

    input: {
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    imagePickerContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    imageButton: {
        marginBottom: 10,
    },
    previewImage: {
        width: 200,
        height: 200,
        borderRadius: 5,
        marginBottom: 10,
    },
    removeImageButton: {
        marginBottom: 10,
    },
    submitButton: {
        marginTop: 10,
    },
});

// Завантаження зображень
const images = {
    "default.png": require("./app/antiques/img/default.png"),
    "amphora.png": require("./app/antiques/img/amphora.png"),
    "black-knight-helm.png": require("./app/antiques/img/black-knight-helm.png"),
    "medal.png": require("./app/antiques/img/medal.png"),
    "pocket-watch.png": require("./app/antiques/img/pocket-watch.png"),
    "lyre.png": require("./app/antiques/img/lyre.png"),
    "column-vase.png": require("./app/antiques/img/column-vase.png"),
    "gem-pendant.png": require("./app/antiques/img/gem-pendant.png"),
    "gladius.png": require("./app/antiques/img/gladius.png"),
    "hunting-horn.png": require("./app/antiques/img/hunting-horn.png"),
    "jeweled-chalice.png": require("./app/antiques/img/jeweled-chalice.png"),
    "jug.png": require("./app/antiques/img/jug.png"),
    "luger.png": require("./app/antiques/img/luger.png"),
    "spartan-helmet.png": require("./app/antiques/img/spartan-helmet.png"),
    "teapot.png": require("./app/antiques/img/teapot.png"),
    "thor-hammer.png": require("./app/antiques/img/thor-hammer.png"),
    "umbrella-bayonet.png": require("./app/antiques/img/umbrella-bayonet.png"),
    "warlord-helmet.png": require("./app/antiques/img/warlord-helmet.png"),
    "waterskin.png": require("./app/antiques/img/waterskin.png"),
    "power-ring.png": require("./app/antiques/img/power-ring.png"),
    "rune-sword.png": require("./app/antiques/img/rune-sword.png"),
};