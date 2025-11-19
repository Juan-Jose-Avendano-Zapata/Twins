import { StyleSheet } from 'react-native';
import { baseStyles } from './baseStyles';
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

    profilePictureContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },

    profilePictureWrapper: {
        position: 'relative',
        marginBottom: 10,
    },

    profilePicture: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#9e3d9c',
    },

    profilePicturePlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#2f3336',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#9e3d9c',
        borderStyle: 'dashed',
    },

    profilePictureText: {
        color: '#71767B',
        fontSize: 12,
        textAlign: 'center',
    },

    cameraButton: {
        position: 'absolute',
        bottom: -5,
        right: -5,
        backgroundColor: '#9e3d9c',
        margin: 0,
    },

    removePhotoButton: {
        marginTop: 5,
    },

    removePhotoButtonLabel: {
        color: '#ef4444',
        fontSize: 12,
    },
});

export default CreateAccountStyles;