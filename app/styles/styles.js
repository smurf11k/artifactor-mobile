import { StyleSheet } from "react-native";

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
        color: '#2ecc71',
        fontWeight: 'bold',
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        elevation: 0,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        marginTop: 7,
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
        marginTop: 10,
    },
    imageWrapper: {
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 10,
        marginHorizontal: 15,
        marginBottom: 20,
        marginTop: 10,
        borderWidth: 2,
        borderColor: '#ddd',
    },
    detailsTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
        marginTop: 5,
    },
    detailsPrice: {
        fontSize: 20,
        marginBottom: 25,
    },
    priceValue: {
        color: '#2ecc71',
        fontWeight: 'bold',
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
        fontWeight: 'bold',
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

export default styles;