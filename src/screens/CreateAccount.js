import React, { useState } from 'react';
import { ScrollView, View, Text, Image, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import CreateAccountStyles from '../styles/createAccuntStyles';
import { authService } from '../firebase/services/authService'; // Ajusta la ruta según tu estructura

export default function CreateAccount({ navigation }) {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        // Validaciones básicas
        if (!name.trim() || !username.trim() || !email.trim() || !password.trim()) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
            return;
        }

        if (name.length > 50) {
            Alert.alert('Error', 'El nombre no puede tener más de 50 caracteres');
            return;
        }

        setLoading(true);

        try {
            const result = await authService.register(name, username, email, password);
            
            if (result.success) {
                Alert.alert('Éxito', 'Cuenta creada correctamente');
                // Navegar a Home u otra pantalla
                //navigation.navigate('Home');
            } else {
                // Manejar errores específicos de Firebase
                let errorMessage = 'Error al crear la cuenta';
                
                if (result.error.includes('email-already-in-use')) {
                    errorMessage = 'Este email ya está registrado';
                } else if (result.error.includes('weak-password')) {
                    errorMessage = 'La contraseña es demasiado débil';
                } else if (result.error.includes('invalid-email')) {
                    errorMessage = 'El formato del email no es válido';
                }
                
                Alert.alert('Error', errorMessage);
            }
        } catch (error) {
            Alert.alert('Error', 'Ocurrió un error inesperado');
            console.error('Error en registro:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUsernameChange = (text) => {
        // Validación básica para username (sin espacios)
        const filteredText = text.replace(/\s/g, '');
        setUserName(filteredText);
    };

    return (
        <ScrollView contentContainerStyle={CreateAccountStyles.container}>
            {/* Logo Section */}
            <View style={CreateAccountStyles.logoContainer}>
                <Image 
                    source={require('../assets/img/logoTW.png')} 
                    style={CreateAccountStyles.logo} 
                />
            </View>

            {/* Title */}
            <Text style={CreateAccountStyles.title}>Create your account</Text>

            {/* Form */}
            <View style={CreateAccountStyles.formContainer}>
                {/* Name Input */}
                <View style={CreateAccountStyles.inputContainer}>
                    <TextInput
                        label="Name"
                        mode="outlined"
                        value={name}
                        onChangeText={setName}
                        style={CreateAccountStyles.textInput}
                        outlineStyle={CreateAccountStyles.inputOutline}
                        theme={{
                            colors: {
                                primary: '#9e3d9c',
                                background: 'transparent',
                                text: 'white',
                                placeholder: '#71767B'
                            }
                        }}
                        maxLength={50}
                        disabled={loading}
                    />
                    <Text style={CreateAccountStyles.characterCounter}>
                        {name.length}/50
                    </Text>
                </View>

                {/* Email Input */}
                <View style={CreateAccountStyles.inputContainer}>
                    <TextInput
                        label="Email address"
                        mode="outlined"
                        value={email}
                        onChangeText={setEmail}
                        style={CreateAccountStyles.textInput}
                        outlineStyle={CreateAccountStyles.inputOutline}
                        theme={{
                            colors: {
                                primary: '#9e3d9c',
                                background: 'transparent',
                                text: 'white',
                                placeholder: '#71767B'
                            }
                        }}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        disabled={loading}
                    />
                </View>

                {/* Nickname Input */}
                <View style={CreateAccountStyles.inputContainer}>
                    <TextInput
                        label="@username"
                        mode="outlined"
                        value={username}
                        onChangeText={handleUsernameChange}
                        style={CreateAccountStyles.textInput}
                        outlineStyle={CreateAccountStyles.inputOutline}
                        theme={{
                            colors: {
                                primary: '#9e3d9c',
                                background: 'transparent',
                                text: 'white',
                                placeholder: '#71767B'
                            }
                        }}
                        autoCapitalize="none"
                        disabled={loading}
                    />
                </View>

                {/* Password Input */}
                <View style={CreateAccountStyles.inputContainer}>
                    <TextInput
                        label="password"
                        mode="outlined"
                        value={password}
                        onChangeText={setPassword}
                        style={CreateAccountStyles.textInput}
                        outlineStyle={CreateAccountStyles.inputOutline}
                        theme={{
                            colors: {
                                primary: '#9e3d9c',
                                background: 'transparent',
                                text: 'white',
                                placeholder: '#71767B'
                            }
                        }}
                        secureTextEntry
                        autoCapitalize="none"
                        disabled={loading}
                    />
                </View>

                {/* Next Button */}
                <Button
                    mode="contained"
                    style={[
                        CreateAccountStyles.nextButton,
                        loading && { opacity: 0.6 }
                    ]}
                    contentStyle={CreateAccountStyles.buttonContent}
                    labelStyle={CreateAccountStyles.nextButtonLabel}
                    onPress={handleRegister}
                    disabled={loading}
                    loading={loading}
                >
                    {loading ? 'Creating Account...' : 'Next'}
                </Button>

                {/* Back Button */}
                <Button
                    mode="contained"
                    style={[
                        CreateAccountStyles.backButton,
                        loading && { opacity: 0.6 }
                    ]}
                    contentStyle={CreateAccountStyles.buttonContent}
                    labelStyle={CreateAccountStyles.backButtonLabel}
                    onPress={() => { navigation.navigate('Main') }}
                    disabled={loading}
                >
                    Back
                </Button>
            </View>
        </ScrollView>
    );
}