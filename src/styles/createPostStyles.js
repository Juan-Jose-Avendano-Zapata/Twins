import { StyleSheet } from "react-native";
import { theme } from "./theme";

const createPostStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.Colors.background,
        padding: 16,
        paddingTop: 50,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    publishButton: {
        backgroundColor: theme.Colors.primary,
        borderRadius: 25,
        paddingHorizontal: 20,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    input: {
        flex: 1,
        color: theme.Colors.text.primary,
        fontSize: 16,
        minHeight: 100,
    },
    previewImage: {
        width: "100%",
        height: 200,
        borderRadius: 10,
        marginTop: 10,
    },
    actions: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
    },
    counter: {
        color: theme.Colors.text.secondary,
    },
});

export default createPostStyles;
