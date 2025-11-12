import React, { useState } from 'react';
import { ScrollView, View, Text, Image, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import loginStyles from '../styles/loginStyles';
import { authService } from '../firebase/services/authService';

export default function Login({ navigation }) {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        // Validations
        if (!username.trim() || !password.trim()) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }

        setLoading(true);

        try {
            const result = await authService.login(username, password);
            
            if (result.success) {
                // Navigate to Home on successful login
                navigation.navigate('Home');
            } else {
                Alert.alert('Error', 'Faild to login: ' + result.error);
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred');
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={loginStyles.container}>
            {/* Logo Section */}
            <View style={loginStyles.logoContainer}>
                <Image 
                    source={require('../assets/img/logoTW.png')} 
                    style={loginStyles.logo} 
                />
            </View>

            {/* Title */}
            <Text style={loginStyles.title}>Login</Text>

            {/* Form */}
            <View style={loginStyles.formContainer}>
                {/* Username Input */}
                <View style={loginStyles.inputContainer}>
                    <TextInput
                        label="username"
                        mode="outlined"
                        value={username}
                        onChangeText={setUserName}
                        style={loginStyles.textInput}
                        outlineStyle={loginStyles.inputOutline}
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

                {/* Password Input */}
                <View style={loginStyles.inputContainer}>
                    <TextInput
                        label="Password"
                        mode="outlined"
                        value={password}
                        onChangeText={setPassword}
                        style={loginStyles.textInput}
                        outlineStyle={loginStyles.inputOutline}
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
                        loginStyles.nextButton,
                        loading && { opacity: 0.6 }
                    ]}
                    contentStyle={loginStyles.buttonContent}
                    labelStyle={loginStyles.nextButtonLabel}
                    onPress={handleLogin}
                    disabled={loading}
                    loading={loading}
                >
                    {loading ? 'Signing In...' : 'Next'}
                </Button>

                {/* Back Button */}
                <Button
                    mode="contained"
                    style={[
                        loginStyles.backButton,
                        loading && { opacity: 0.6 }
                    ]}
                    contentStyle={loginStyles.buttonContent}
                    labelStyle={loginStyles.backButtonLabel}
                    onPress={() => { navigation.navigate('Main')}}
                    disabled={loading}
                >
                    Back
                </Button>
            </View>
        </ScrollView>
    );
}