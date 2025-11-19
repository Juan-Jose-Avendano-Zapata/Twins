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
    },

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    // estilos para la funcionalidad "Siguiendo"
    emptyFollowing: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        marginTop: 20,
    },

    emptyFollowingTitle: {
        ...baseStyles.body,
        fontWeight: 'bold',
        color: theme.Colors.text.primary,
        textAlign: 'center',
        marginBottom: 8,
    },

    emptyFollowingText: {
        ...baseStyles.caption,
        color: theme.Colors.text.secondary,
        textAlign: 'center',
        marginBottom: 20,
    },

    exploreButton: {
        backgroundColor: theme.Colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },

    exploreButtonText: {
        ...baseStyles.caption,
        color: theme.Colors.background,
        fontWeight: 'bold',
    },

    // Estilos para estados vacíos
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        marginTop: 20,
    },

    scrollView: {
        flex: 1,
    },

    scrollViewContent: {
        flexGrow: 1,
    },

    paginationContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 10,
    },

    paginationButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: theme.Colors.primary,
        minWidth: 90,
        alignItems: "center",
    },

    paginationButtonDisabled: {
        backgroundColor: "#ccc",
    },

    paginationButtonText: {
        color: "white",
        fontWeight: "bold",
    },

    paginationButtonTextDisabled: {
        color: "#666",
    },

    paginationText: {
        color: "#666",
        fontSize: 16,
    },

    emptyFollowing: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        marginTop: 20,
    },

    emptyText: {
        ...baseStyles.body,
        fontWeight: 'bold',
        color: theme.Colors.text.primary,
        textAlign: 'center',
        marginBottom: 8,
    },

    emptyFollowingText: {
        ...baseStyles.caption,
        color: theme.Colors.text.secondary,
        textAlign: 'center',
        marginBottom: 20,
    },

    exploreButton: {
        backgroundColor: theme.Colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },

    exploreButtonText: {
        ...baseStyles.caption,
        color: theme.Colors.background,
        fontWeight: 'bold',
    },

});

export default homeStyles;