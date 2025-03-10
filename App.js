import React, { useState, createContext, useContext } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Image,
    Switch,
    TextInput,
} from "react-native";
import { Button, Menu, Provider, Portal, Dialog, MD3LightTheme, MD3DarkTheme } from "react-native-paper";
import antiquesData from "./assets/antiquesData.json";

const ThemeContext = createContext();

// Елемент списку антикваріату
const ListItem = ({ title, image, price, itemBgColor, onPress, onDelete }) => (
    <TouchableOpacity onPress={onPress} onLongPress={onDelete}>
        <View style={[styles.listItem, { backgroundColor: itemBgColor }]}>
            <Image source={image} style={styles.image} />
            <Text style={styles.listText}>{title}</Text>
            <Text style={styles.priceText}>${price}</Text>
            <Button onPress={onDelete} mode="contained" compact>Видалити</Button>
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
const ColorPicker = ({ colors, selectedColor, onSelect }) => (
    <View style={styles.colorPickerContainer}>
        {colors.map((color, index) => (
            <TouchableOpacity
                key={index}
                style={[styles.colorOption, { backgroundColor: color, borderWidth: selectedColor === color ? 2 : 0 }]}
                onPress={() => onSelect(color)}
            />
        ))}
    </View>
);

// Екран списку антикваріату
const ScreenOne = ({ data, itemBgColor, onDelete, onSelect }) => (
    <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <ListItem
                title={item.title}
                image={images[item.image]}
                price={item.price}
                itemBgColor={itemBgColor}
                onPress={() => onSelect(item)}
                onDelete={() => onDelete(item.id)}
            />
        )}
    />
);

// Екран налаштування
const ScreenTwo = (props) => {
    const { theme } = useContext(ThemeContext);
    return (
        <View>
            <Text style={[styles.text, { color: theme === "dark" ? "white" : "black" }]}>Налаштування</Text>
            <ThemeSwitcher />

            <Text style={[styles.text, { color: theme === "dark" ? "white" : "black" }]}>Колір акценту</Text>
            <ColorPicker colors={["#6750a4", "#3498db", "#f39c12"]} selectedColor={props.accentColor} onSelect={props.setAccentColor} />

            <Text style={[styles.text, { color: theme === "dark" ? "white" : "black" }]}>Кольори заднього фону антикваріату</Text>
            <ColorPicker colors={["#ecf0f1", "#f4e1c1", "#d6e6f2"]} selectedColor={props.itemBgColor} onSelect={props.setItemBgColor} />
        </View>
    );
};

// Екран додавання елементів (антикваріату) до списку
const ScreenThree = ({ onAdd }) => {
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const { theme } = useContext(ThemeContext);
    const borderColor = theme === "dark" ? "white" : "black";
    const [error, setError] = useState("");

    const handleAdd = () => {
        if (!title.trim() || !price.trim()) {
            setError("Будь ласка, заповніть всі поля!");
            return;
        }
        setError(""); // скидання помилки
        onAdd(title, price);
        setTitle("");
        setPrice("");
    };

    return (
        <View>
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
            {error ? <Text style={{ color: "red", marginBottom: 25 }}>{error}</Text> : null}
            <Button mode="contained" onPress={handleAdd}>Додати</Button>
        </View>
    );
};

export default function App() {
    const [activeScreen, setActiveScreen] = useState("one");
    const [theme, setTheme] = useState("light");
    const [items, setItems] = useState(antiquesData);
    const [menuVisible, setMenuVisible] = useState(false);
    const [accentColor, setAccentColor] = useState("#6750a4");
    const [itemBgColor, setItemBgColor] = useState("#ecf0f1");
    const [selectedItem, setSelectedItem] = useState(null);

    const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

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
            <ThemeContext.Provider value={{ theme, toggleTheme, accentColor, setAccentColor }}>
                <View style={[styles.container, theme === "dark" && styles.darkTheme]}>
                    <View style={styles.menuContainer}>
                        <Menu
                            visible={menuVisible}
                            onDismiss={() => setMenuVisible(false)}
                            anchor={
                                <Button onPress={() => setMenuVisible(true)} style={styles.menuButton}>Меню</Button>
                            }>
                            <Menu.Item onPress={() => { setActiveScreen("one"); setMenuVisible(false); }} title="Антикваріат" />
                            <Menu.Item onPress={() => { setActiveScreen("two"); setMenuVisible(false); }} title="Налаштування" />
                            <Menu.Item onPress={() => { setActiveScreen("three"); setMenuVisible(false); }} title="Додати" />
                        </Menu>
                    </View>
                    <View style={styles.contentContainer}>
                        {activeScreen === "one" ? (
                            <ScreenOne data={items} itemBgColor={itemBgColor} onDelete={deleteItem} onSelect={setSelectedItem} />
                        ) : activeScreen === "two" ? (
                            <ScreenTwo accentColor={accentColor} setAccentColor={setAccentColor} itemBgColor={itemBgColor} setItemBgColor={setItemBgColor} />
                        ) : (
                            <ScreenThree onAdd={addItem} />
                        )}

                        <Portal>
                            <Dialog
                                visible={!!selectedItem}
                                onDismiss={() => setSelectedItem(null)}
                                style={{ backgroundColor: theme === "dark" ? "#333" : "white" }}
                            >
                                <Dialog.Title style={{ color: theme === "dark" ? "white" : "black" }}>Деталі</Dialog.Title>
                                <Dialog.Content>
                                    {selectedItem && (
                                        <Text style={{ color: theme === "dark" ? "white" : "black" }}>
                                            {selectedItem.title} - ${selectedItem.price}
                                        </Text>
                                    )}
                                </Dialog.Content>
                                <Dialog.Actions>
                                    <Button onPress={() => setSelectedItem(null)}>Закрити</Button>
                                </Dialog.Actions>
                            </Dialog>
                        </Portal>
                    </View>
                </View>
            </ThemeContext.Provider>
        </Provider>
    );
}

// Стилі
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f5f5f5" },
    darkTheme: { backgroundColor: "#333" },
    menuContainer: { position: "absolute", top: 20, left: 10, zIndex: 10 },
    menuButton: { alignSelf: "flex-start", marginTop: 20 },
    contentContainer: { flex: 1, padding: 20, marginTop: 80 },
    listItem: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 10, marginBottom: 5, borderRadius: 5 },
    image: { width: 50, height: 50, marginRight: 10 },
    listText: { fontSize: 16, flex: 1 },
    priceText: { fontSize: 16, color: "green", fontWeight: "bold", paddingRight: 10 },
    text: { fontSize: 18, marginBottom: 12, },
    input: { borderWidth: 1, padding: 10, width: "100%", marginBottom: 30, },
    colorPickerContainer: { flexDirection: "row", justifyContent: "center", marginBottom: 25, },
    colorOption: { width: 40, height: 40, marginHorizontal: 5, borderRadius: 5, },
    switchContainer: { flexDirection: "row", alignItems: "center", justifyContent: "center", width: "100%", paddingVertical: 10, marginBottom: 10, },
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
