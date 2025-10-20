import { StyleSheet } from 'react-native';
import { baseStyles } from './baseStyles';
import { theme } from './theme';

const mainStyles = StyleSheet.create({
    container: {
        ...baseStyles.container,
    },

    logoContainer: {
        alignItems: 'center',
        marginBottom: theme.Spacing.xlarge,
        marginTop: theme.Spacing.medium,
    },

    logo: {
        height: 50,
        width: 50,
        resizeMode: 'contain',
    },

    title: {
        ...baseStyles.title,
        marginTop: 140,
        marginBottom: 140,
    },

    buttonsContainer: {
        width: '100%',
    },

    googleButton: {
        ...baseStyles.button,
        ...baseStyles.buttonSecondary,
    },

    createAccountButton: {
        ...baseStyles.button,
        ...baseStyles.buttonPrimary,
        marginBottom: theme.Spacing.small,
    },

    buttonContent: {
        ...baseStyles.buttonContent,
    },

    googleButtonLabel: {
        ...baseStyles.buttonLabel,
        ...baseStyles.buttonLabelSecondary,
    },

    createAccountButtonLabel: {
        ...baseStyles.buttonLabel,
        ...baseStyles.buttonLabelPrimary,
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

    termsText: {
        ...baseStyles.caption,
        textAlign: 'center',
        lineHeight: 16,
    },

    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 'auto',
        paddingTop: theme.Spacing.xlarge,
    },

    loginText: {
        ...baseStyles.caption,
        fontSize: theme.Typography.body.fontSize,
    },

    loginLink: {
        color: theme.Colors.primaryLight,
        fontSize: theme.Typography.body.fontSize,
        fontWeight: 'bold',
    },
});

export default mainStyles;