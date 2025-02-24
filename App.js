import React, { useState, createContext, useContext } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Image,
    Switch,
} from "react-native";
import antiquesData from "./assets/antiquesData.json";

const ThemeContext = createContext();

// Елемент списку антикваріату
const ListItem = ({ title, image, price, itemBgColor }) => (
    <View style={[styles.listItem, { backgroundColor: itemBgColor }]}>
        <Image source={image} style={styles.image} />
        <Text style={styles.listText}>{title}</Text>
        <Text style={styles.priceText}>${price}</Text>
    </View>
);

// Зміна теми
const ThemeSwitcher = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    return (
        <View style={styles.switchContainer}>
            <Text style={[styles.text, { color: theme === "dark" ? "white" : "black", marginRight: 20 }]}>
                {theme === "dark" ? "Темна тема" : "Світла тема"}
            </Text>
            <Switch
                value={theme === "dark"}
                onValueChange={toggleTheme}
                thumbColor={theme === "dark" ? "#f1c40f" : "#ecf0f1"}
                trackColor={{ false: "#95a5a6", true: "#f39c12" }}
            />
        </View>
    );
};

// Кнопка навігації
const NavButton = ({ title, isActive, onPress, activeColor, inactiveColor }) => (
    <TouchableOpacity
        style={[styles.button, { backgroundColor: isActive ? activeColor : inactiveColor }]}
        onPress={onPress}
    >
        <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
);

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
const ScreenOne = ({ itemBgColor }) => (
    <FlatList
        data={antiquesData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <ListItem title={item.title} image={images[item.image]} price={item.price} itemBgColor={itemBgColor} />
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
            <Text style={[styles.text, { color: theme === "dark" ? "white" : "black" }]}>Кольори активних кнопок</Text>
            <ColorPicker colors={["#3498db", "#2ecc71", "#f39c12"]} selectedColor={props.activeButtonColor} onSelect={props.setActiveButtonColor} />
            <Text style={[styles.text, { color: theme === "dark" ? "white" : "black" }]}>Кольори неактивних кнопок</Text>
            <ColorPicker colors={["#576574", "#8395a7", "#4b6584"]} selectedColor={props.inactiveButtonColor} onSelect={props.setInactiveButtonColor} />
            <Text style={[styles.text, { color: theme === "dark" ? "white" : "black" }]}>Кольори заднього фону антикваріату</Text>
            <ColorPicker colors={["#ecf0f1", "#f4e1c1", "#d6e6f2"]} selectedColor={props.itemBgColor} onSelect={props.setItemBgColor} />
        </View>
    );
};

export default function App() {
    const [activeScreen, setActiveScreen] = useState("one");
    const [theme, setTheme] = useState("light");
    const [activeButtonColor, setActiveButtonColor] = useState("#3498db");
    const [inactiveButtonColor, setInactiveButtonColor] = useState("#576574");
    const [itemBgColor, setItemBgColor] = useState("#ecf0f1");

    const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <View style={[styles.container, theme === "dark" && styles.darkTheme]}>
                <View style={styles.navBar}>
                    <NavButton title="Антикваріат" isActive={activeScreen === "one"} onPress={() => setActiveScreen("one")} activeColor={activeButtonColor} inactiveColor={inactiveButtonColor} />
                    <NavButton title="Налаштування" isActive={activeScreen === "two"} onPress={() => setActiveScreen("two")} activeColor={activeButtonColor} inactiveColor={inactiveButtonColor} />
                </View>
                <View style={styles.contentContainer}>
                    {activeScreen === "one" ? <ScreenOne itemBgColor={itemBgColor} /> : <ScreenTwo {...{ activeButtonColor, setActiveButtonColor, inactiveButtonColor, setInactiveButtonColor, itemBgColor, setItemBgColor }} />}
                </View>
            </View>
        </ThemeContext.Provider>
    );
}


// Завантаження зображень
const images = {
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

// Стилі
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
    },
    darkTheme: {
        backgroundColor: "#333",
    },
    navBar: {
        flexDirection: "row",
        marginBottom: 10,
        marginTop: 140,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginHorizontal: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
    },
    contentContainer: {
        width: "90%",
        padding: 20,
        borderRadius: 10,
        marginBottom: 100,
    },
    listItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
        marginBottom: 5,
        borderRadius: 5,
    },
    image: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    listText: {
        fontSize: 16,
        flex: 1,
    },
    priceText: {
        fontSize: 16,
        color: "green",
        fontWeight: "bold",
        paddingRight: 10,
    },
    settingsContainer: {
        alignItems: "center",
    },
    text: {
        fontSize: 18,
        marginBottom: 20,
    },
    colorPickerContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 25,
    },
    colorOption: {
        width: 40,
        height: 40,
        marginHorizontal: 5,
        borderRadius: 5,
    },
    switchContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        paddingVertical: 10,
        marginBottom: 10,
    },
});