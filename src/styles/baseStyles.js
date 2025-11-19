import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const baseStyles = StyleSheet.create({
    // Containers
    container: {
        flexGrow: 1,
        backgroundColor: theme.Colors.background,
        paddingHorizontal: theme.Spacing.container,
        paddingTop: 60,
        paddingBottom: 40,
    },

    // Buttons
    button: {
        borderRadius: 25,
        marginBottom: theme.Spacing.medium,
        elevation: 0,
    },

    buttonPrimary: {
        backgroundColor: theme.Colors.button.primary,
    },

    buttonSecondary: {
        backgroundColor: theme.Colors.button.secondary,
    },

    buttonContent: {
        height: 50,
    },

    buttonLabel: {
        fontWeight: theme.Typography.button.fontWeight,
        fontSize: theme.Typography.button.fontSize,
    },

    buttonLabelPrimary: {
        color: '#fff',
    },

    buttonLabelSecondary: {
        color: '#000',
    },

    // Text
    title: {
        color: theme.Colors.text.primary,
        fontSize: theme.Typography.title.fontSize,
        fontWeight: theme.Typography.title.fontWeight,
    },

    body: {
        color: theme.Colors.text.primary,
        fontSize: theme.Typography.body.fontSize,
    },

    caption: {
        color: theme.Colors.text.secondary,
        fontSize: theme.Typography.caption.fontSize,
    },

    // Inputs
    input: {
        backgroundColor: 'transparent',
        fontSize: theme.Typography.body.fontSize,
    },

    inputOutline: {
        borderRadius: 4,
        borderColor: theme.Colors.surface,
        borderWidth: 1,
        backgroundColor: 'transparent',
    },
});