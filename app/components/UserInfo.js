import React, { useContext } from "react";
import { View, Text } from "react-native";
import { Button } from "react-native-paper";
import { AuthContext } from "../contexts/AuthContext";
import { ThemeContext } from "../contexts/ThemeContext";
import styles from "../styles/styles";

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

export default UserInfo;