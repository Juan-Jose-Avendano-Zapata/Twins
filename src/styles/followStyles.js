import { StyleSheet } from "react-native";
import { baseStyles } from "./baseStyles";
import { theme } from "./theme";

const followStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.Colors.background,
    },

    // Header styles
    headerTitle: {
        ...baseStyles.title,
        fontSize: theme.Typography.title.fontSize - 4,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    headerSubtitle: {
        ...baseStyles.caption,
        color: theme.Colors.text.secondary,
        textAlign: 'center',
        marginTop: 2,
    },

    // Tabs styles
    tabsContainer: {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderBottomColor: theme.Colors.surface,
        backgroundColor: theme.Colors.background,
    },
    tab: {
        flex: 1,
        paddingVertical: theme.Spacing.medium,
        alignItems: 'center',
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: theme.Colors.primary,
    },
    tabText: {
        ...baseStyles.body,
        color: theme.Colors.text.secondary,
        fontSize: theme.Typography.body.fontSize,
    },
    activeTabText: {
        color: theme.Colors.primary,
        fontWeight: 'bold',
    },

    // List content
    listContent: {
        paddingTop: 10,
        paddingBottom: 80,
    },

    // User item styles
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.Spacing.container,
        paddingVertical: theme.Spacing.small,
        borderBottomWidth: 0.5,
        borderBottomColor: theme.Colors.surface,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: theme.Spacing.small,
        backgroundColor: theme.Colors.surface,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        ...baseStyles.body,
        fontWeight: 'bold',
        color: theme.Colors.text.primary,
    },
    userUsername: {
        ...baseStyles.caption,
        color: theme.Colors.text.secondary,
    },

    // Follow button styles
    followButton: {
        paddingHorizontal: theme.Spacing.medium,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: theme.Colors.primary,
        minWidth: 80,
        alignItems: 'center',
    },
    followingButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.Colors.surface,
    },
    followButtonText: {
        ...baseStyles.buttonLabel,
        color: theme.Colors.text.primary,
        fontSize: 14,
        fontWeight: 'bold',
    },
    followingButtonText: {
        color: theme.Colors.text.primary,
    },

    // Empty state
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.Spacing.large,
        marginTop: 50,
    },
    emptyText: {
        ...baseStyles.body,
        color: theme.Colors.text.secondary,
        textAlign: 'center',
    },
});

export default followStyles;