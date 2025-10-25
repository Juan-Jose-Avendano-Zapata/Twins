import { StyleSheet } from 'react-native';
import { baseStyles } from './baseStyles';
import { theme } from './theme';

const homeStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.Colors.background,
    },

    header: {
        height: 80,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 0.5,
        borderBottomColor: theme.Colors.surface,
        backgroundColor: theme.Colors.background,
        marginTop: theme.Spacing.large,
    },

    logo: {
        width: 40,
        height: 40,
        resizeMode: "contain",
    },

    tabBar: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: theme.Spacing.small,
        borderBottomWidth: 0.5,
        borderBottomColor: theme.Colors.surface,
        backgroundColor: theme.Colors.background,
    },

    tab: {
        ...baseStyles.body,
        color: theme.Colors.text.secondary,
        fontWeight: 'bold',
    },

    activeTab: {
        color: theme.Colors.text.primary,
    },

    feed: {
        paddingBottom: 120,
    },

    post: {
        flexDirection: "row",
        padding: theme.Spacing.medium,
        borderBottomWidth: 0.5,
        borderBottomColor: theme.Colors.surface,
    },

    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: theme.Spacing.small,
    },

    postContent: {
        flex: 1,
    },

    postHeader: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
    },

    name: {
        ...baseStyles.body,
        fontWeight: "bold",
    },

    username: {
        ...baseStyles.caption,
        color: theme.Colors.text.secondary,
    },

    text: {
        ...baseStyles.body,
        marginTop: 4,
    },

    postImage: {
        marginTop: theme.Spacing.small,
        width: "100%",
        height: 200,
        borderRadius: 12,
        backgroundColor: theme.Colors.surface,
    },

    actions: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: theme.Spacing.small,
        paddingRight: 30,
    },

    actionItem: {
        flexDirection: "row",
        alignItems: "center",
    },

    actionText: {
        ...baseStyles.caption,
        color: theme.Colors.text.secondary,
    },

    menu: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        borderTopWidth: 0.5,
        borderTopColor: theme.Colors.surface,
        backgroundColor: theme.Colors.background,
    },

    fabCreate: {
        position: "absolute",
        right: 20,
        bottom: 80,
        backgroundColor: theme.Colors.primary,
        borderRadius: 30,
    }
});

export default homeStyles;