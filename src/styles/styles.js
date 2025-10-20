import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    // Estilos para Main.js (Pantalla principal)
    container: {
        flexGrow: 1,
        backgroundColor: '#111',
        paddingHorizontal: 30,
        paddingTop: 60,
        paddingBottom: 40,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
        marginTop: 20,
    },
    logo: {
        height: 50,
        width: 50,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 140,
        marginBottom: 140,
    },
    buttonsContainer: {
        width: '100%',
    },
    googleButton: {
        backgroundColor: 'white',
        borderRadius: 25,
        marginBottom: 20,
        elevation: 0,
    },
    createAccountButton: {
        backgroundColor: '#6c1f9c',
        borderRadius: 25,
        marginBottom: 15,
        elevation: 0,
    },
    buttonContent: {
        height: 50,
    },
    googleButtonLabel: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 16,
    },
    createAccountButtonLabel: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#2F3336',
    },
    dividerText: {
        color: 'white',
        marginHorizontal: 10,
        fontSize: 16,
    },
    termsText: {
        color: '#71767B',
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 16,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 'auto',
        paddingTop: 40,
    },
    loginText: {
        color: '#71767B',
        fontSize: 16,
    },
    loginLink: {
        color: '#9e3d9c',
        fontSize: 16,
        fontWeight: 'bold',
    },

    // Estilos para CreateAccount.js (Pantalla de crear cuenta)
    createAccountTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 30,
        textAlign: 'center',
    },
    formContainer: {
        width: '100%',
    },
    inputContainer: {
        marginBottom: 20,
        position: 'relative',
    },
    textInput: {
        backgroundColor: 'transparent',
        fontSize: 16,
    },
    inputOutline: {
        borderRadius: 4,
        borderColor: '#2F3336',
        borderWidth: 1,
        backgroundColor: 'transparent',
    },
    characterCounter: {
        position: 'absolute',
        right: 15,
        top: 15,
        color: '#71767B',
        fontSize: 12,
    },
    nextButton: {
        backgroundColor: '#6c1f9c',
        borderRadius: 25,
        marginTop: 20,
        elevation: 0,
    },
    nextButtonLabel: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default styles;