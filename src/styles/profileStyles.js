import { StyleSheet } from 'react-native';
import { baseStyles } from './baseStyles';
import { theme } from './theme';

const profileStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.Colors.background,
    },

    scrollView: {
        flex: 1,
    },

    // Header Section
    headerContainer: {
        backgroundColor: theme.Colors.background,
    },

    coverPhotoContainer: {
        position: 'relative',
        height: 150,
        backgroundColor: theme.Colors.surface,
    },

    coverPhoto: {
        width: '100%',
        height: '100%',
    },

    headerActions: {
        position: 'absolute',
        top: theme.Spacing.medium,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.Spacing.container,
    },

    // Profile Info Section
    profileInfoContainer: {
        paddingHorizontal: theme.Spacing.container,
        paddingTop: theme.Spacing.medium,
        position: 'relative',
    },

    profileImageContainer: {
        marginTop: -30,
    },

    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        borderColor: theme.Colors.background,
    },

    editProfileButton: {
        position: 'absolute',
        top: 15,
        right: theme.Spacing.container,
        backgroundColor: theme.Colors.primary,
        borderRadius: 20,
    },

    editProfileTouchable: {
        borderRadius: 20,
        paddingHorizontal: theme.Spacing.medium,
        paddingVertical: theme.Spacing.small,
        borderWidth: 1,
        borderColor: theme.Colors.surface,
    },

    editProfileText: {
        ...baseStyles.Label,
        color: theme.Colors.text.primary,
        fontWeight: 'bold',
        fontSize: 14,
    },

    userInfoContainer: {
        marginTop: theme.Spacing.medium,
    },

    userName: {
        ...baseStyles.title,
        fontSize: theme.Typography.title.fontSize - 4,
        fontWeight: 'bold',
    },

    userUsername: {
        ...baseStyles.caption,
        color: theme.Colors.text.secondary,
        marginTop: 2,
    },

    userBio: {
        ...baseStyles.body,
        marginTop: theme.Spacing.small,
        lineHeight: 20,
    },

    // Additional Info
    additionalInfoContainer: {
        marginTop: theme.Spacing.small,
    },

    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: theme.Spacing.small / 2,
    },

    infoText: {
        ...baseStyles.caption,
        color: theme.Colors.text.secondary,
        marginLeft: 4,
    },

    followStatsContainer: {
        flexDirection: 'row',
        marginTop: theme.Spacing.medium,
    },

    followStat: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: theme.Spacing.medium,
    },

    followCount: {
        ...baseStyles.body,
        fontWeight: 'bold',
        color: theme.Colors.text.primary,
    },

    followLabel: {
        ...baseStyles.caption,
        color: theme.Colors.text.secondary,
        marginLeft: 4,
    },

    feed: {
        paddingBottom: theme.Spacing.medium,
    },

    post: {
        flexDirection: 'row',
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
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },

    name: {
        ...baseStyles.body,
        fontWeight: 'bold',
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
        width: '100%',
        height: 200,
        borderRadius: 12,
        backgroundColor: theme.Colors.surface,
    },

    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: theme.Spacing.small,
        paddingRight: 30,
    },

    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    actionText: {
        ...baseStyles.caption,
        color: theme.Colors.text.secondary,
    },

    menu: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopWidth: 0.5,
        borderTopColor: theme.Colors.surface,
        backgroundColor: theme.Colors.background,
    },

    fabCreate: {
        position: 'absolute',
        right: 20,
        bottom: 80,
        backgroundColor: theme.Colors.primary,
        borderRadius: 30,
    },

    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: theme.Spacing.medium,
    },

    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: theme.Colors.surface,
    },

    dividerText: {
        color: theme.Colors.text.primary,
        marginHorizontal: theme.Spacing.small,
        fontSize: theme.Typography.body.fontSize,
    },

    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 50,
        paddingHorizontal: 20,
    },

    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 8,
    },

    emptySubtext: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    },
});

export default profileStyles;