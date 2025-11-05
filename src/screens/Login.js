import React, { useState } from 'react';
import { ScrollView, View, Text, Image } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import loginStyles from '../styles/loginStyles';

export default function Login({ navigation }) {
    const [nickname, setNickName] = useState('');
    const [password, setPassword] = useState('');

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
                {/* @Nickname Input */}
                <View style={loginStyles.inputContainer}>
                    <TextInput
                        label="@Nickname"
                        mode="outlined"
                        value={nickname}
                        onChangeText={setNickName}
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
                    />
                </View>

                {/* Next Button */}
                <Button
                    mode="contained"
                    style={loginStyles.nextButton}
                    contentStyle={loginStyles.buttonContent}
                    labelStyle={loginStyles.nextButtonLabel}
                    onPress={() => { navigation.navigate('Home')}}
                >
                    Next
                </Button>
                {/* Back Button */}
                <Button
                    mode="contained"
                    style={loginStyles.backButton}
                    contentStyle={loginStyles.buttonContent}
                    labelStyle={loginStyles.backButtonLabel}
                    onPress={() => { navigation.navigate('Main')}}
                >
                    Back
                </Button>
            </View>
        </ScrollView>
    );
}