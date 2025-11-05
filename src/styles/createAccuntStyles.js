import { StyleSheet } from 'react-native';
import { baseStyles} from './baseStyles';
import { theme } from './theme';

const CreateAccountStyles = StyleSheet.create({
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

    characterCounter: {
        position: 'absolute',
        right: 15,
        top: 15,
        color: theme.Colors.text.secondary,
        fontSize: theme.Typography.caption.fontSize,
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

export default CreateAccountStyles;