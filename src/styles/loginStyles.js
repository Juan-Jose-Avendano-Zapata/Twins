import { StyleSheet } from 'react-native';
import { baseStyles} from './baseStyles';
import { theme } from './theme';

const loginStyles = StyleSheet.create({
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
        fontSize: theme.Typography.subtitle.fontSize,
        marginTop: theme.Spacing.xlarge,
        marginBottom: theme.Spacing.large,
        textAlign: 'center',
    },

    formContainer: {
        width: '100%',
    },

    inputContainer: {
        marginBottom: theme.Spacing.medium,
        position: 'relative',
    },

    textInput: {
        ...baseStyles.input,
    },

    inputOutline: {
        ...baseStyles.inputOutline,
    },

    nextButton: {
        ...baseStyles.button,
        ...baseStyles.buttonPrimary,
        marginTop: theme.Spacing.medium,
    },

    backButton: {
        ...baseStyles.button,
        ...baseStyles.buttonSecondary,
        marginTop: theme.Spacing.medium,
    },

    nextButtonLabel: {
        ...baseStyles.buttonLabel,
        ...baseStyles.buttonLabelPrimary,
    },

    backButtonLabel: {
        ...baseStyles.buttonLabel,
        ...baseStyles.buttonLabelSecondary,
    },
});

export default loginStyles;