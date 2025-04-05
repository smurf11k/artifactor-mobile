import React, { useState, createContext, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, Switch, TextInput, Alert } from "react-native";
import { Button, Provider, Portal, Dialog, MD3LightTheme, MD3DarkTheme } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome as Icon } from '@expo/vector-icons';
import antiquesData from "./assets/antiquesData.json";

const ThemeContext = createContext();
const ItemsContext = createContext();
const AuthContext = createContext();

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const AuthStack = createStackNavigator();

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
                Поточний користувач: {user?.username}
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
const ScreenOne = () => {
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
            <UserInfo />
            <ThemeSwitcher />

            <Text style={[styles.title, { color: theme === "dark" ? "white" : "black" }]}>
                Виберіть акцентний колір:
            </Text>
            <ColorPicker colors={availableAccentColors} selectedColor={accentColor} onSelect={setAccentColor} />

            <Text style={[styles.title, { color: theme === "dark" ? "white" : "black" }]}>
                Виберіть колір фону елементів:
            </Text>
            <ColorPicker colors={availableBgColors} selectedColor={itemBgColor} onSelect={setItemBgColor} isBackground />
        </View>
    );
};

// Екран додавання елементів (антикваріату) до списку
const ScreenThree = () => {
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const { addItem } = useContext(ItemsContext);
    const { theme, backgroundColor } = useContext(ThemeContext);
    const borderColor = theme === "dark" ? "white" : "black";

    const handleAddItem = () => {
        if (!title.trim() || !price.trim()) {
            Alert.alert("Помилка", "Будь ласка, заповніть всі поля!");
            return;
        }
        addItem(title, price);
        setTitle("");
        setPrice("");
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
                placeholder="Ціна"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                style={[styles.input, { color: theme === "dark" ? "white" : "black", borderColor }]}
                placeholderTextColor={theme === "dark" ? "#bbb" : "#666"}
            />
            <Button mode="contained" onPress={handleAddItem}>
                Додати
            </Button>
        </View>
    );
};

// Діалог для відображення деталей антикваріату
const DetailsDialog = ({ visible, item, onClose }) => {
    const { theme } = useContext(ThemeContext);

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
                <Dialog.Actions>
                    <Button onPress={onClose}>Закрити</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
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

    // Існуючі користувачі
    const users = [
        { username: "admin", password: "admin123" },
        { username: "user", password: "user123" },
        { username: "test", password: "test123" },
    ];

    const login = (username, password) => {
        const foundUser = users.find(
            (u) => u.username === username && u.password === password
        );
        if (foundUser) {
            setIsAuthenticated(true);
            setUser(foundUser);
        } else {
            Alert.alert("Помилка", "Невірне ім'я користувача або пароль!");
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
    };

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    const backgroundColor = theme === "dark" ? "#333" : "#f5f5f5";

    const addItem = (title, price) => {
        setItems([...items, { id: Date.now().toString(), title, price, image: "antiques/default.png" }]);
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
        <Provider theme={customTheme}>
            <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
                <ItemsContext.Provider value={{ items, addItem, deleteItem, itemBgColor, setItemBgColor }}>
                    <ThemeContext.Provider value={{ theme, toggleTheme, accentColor, setAccentColor, backgroundColor }}>
                        <MainNavigator />
                    </ThemeContext.Provider>
                </ItemsContext.Provider>
            </AuthContext.Provider>
        </Provider>
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
        marginBottom: 30,
        alignItems: "center",
    },
    userInfoText: {
        fontSize: 18,
        marginBottom: 10,
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
        marginHorizontal: 10,
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
    input: { borderWidth: 1, padding: 10, width: "100%", marginBottom: 30, borderRadius: 5 },
    colorPickerContainer: { flexDirection: "row", justifyContent: "center", marginBottom: 25, paddingHorizontal: 10 },
    colorOption: { width: 40, height: 40, marginHorizontal: 5, borderRadius: 5 },
    switchContainer: { flexDirection: "row", alignItems: "center", justifyContent: "center", width: "100%", paddingVertical: 10, marginBottom: 10 },

    tabBarStyle: {
        borderTopWidth: 1,
        elevation: 8, // For Android shadow
        shadowOffset: { width: 0, height: -3 }, // For iOS shadow
        shadowRadius: 4,
        shadowColor: 'rgba(0, 0, 0, 0.1)', // This will stay consistent regardless of theme
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
});

// Завантаження зображень
const images = {
    "antiques/default.png": require("./assets/antiques/default.png"),
    "antiques/amphora.png": require("./assets/antiques/amphora.png"),
    "antiques/black-knight-helm.png": require("./assets/antiques/black-knight-helm.png"),
    "antiques/medal.png": require("./assets/antiques/medal.png"),
    "antiques/pocket-watch.png": require("./assets/antiques/pocket-watch.png"),
    "antiques/lyre.png": require("./assets/antiques/lyre.png"),
    "antiques/column-vase.png": require("./assets/antiques/column-vase.png"),
    "antiques/gem-pendant.png": require("./assets/antiques/gem-pendant.png"),
    "antiques/gladius.png": require("./assets/antiques/gladius.png"),
    "antiques/hunting-horn.png": require("./assets/antiques/hunting-horn.png"),
    "antiques/jeweled-chalice.png": require("./assets/antiques/jeweled-chalice.png"),
    "antiques/jug.png": require("./assets/antiques/jug.png"),
    "antiques/luger.png": require("./assets/antiques/luger.png"),
    "antiques/spartan-helmet.png": require("./assets/antiques/spartan-helmet.png"),
    "antiques/teapot.png": require("./assets/antiques/teapot.png"),
    "antiques/thor-hammer.png": require("./assets/antiques/thor-hammer.png"),
    "antiques/umbrella-bayonet.png": require("./assets/antiques/umbrella-bayonet.png"),
    "antiques/warlord-helmet.png": require("./assets/antiques/warlord-helmet.png"),
    "antiques/waterskin.png": require("./assets/antiques/waterskin.png"),
    "antiques/power-ring.png": require("./assets/antiques/power-ring.png"),
    "antiques/rune-sword.png": require("./assets/antiques/rune-sword.png"),
};