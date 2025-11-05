import React, { useState } from 'react';
import { ScrollView, View, Text, Image } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import CreateAccountStyles from '../styles/createAccuntStyles';

export default function CreateAccount({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [nickname, setNickName] = useState('');
    const [password, setPassword] = useState('');

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
                    />
                </View>

                {/* Nickname Input */}
                <View style={CreateAccountStyles.inputContainer}>
                    <TextInput
                        label="@Nickname"
                        mode="outlined"
                        value={nickname}
                        onChangeText={setNickName}
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
                    />
                </View>

                {/* Next Button */}
                <Button
                    mode="contained"
                    style={CreateAccountStyles.nextButton}
                    contentStyle={CreateAccountStyles.buttonContent}
                    labelStyle={CreateAccountStyles.nextButtonLabel}
                    onPress={() => { navigation.navigate('Home')}}
                >
                    Next
                </Button>

                {/* Back Button */}
                <Button
                    mode="contained"
                    style={CreateAccountStyles.backButton}
                    contentStyle={CreateAccountStyles.buttonContent}
                    labelStyle={CreateAccountStyles.backButtonLabel}
                    onPress={() => { navigation.navigate('Main')}}
                >
                    Back
                </Button>
            </View>
        </ScrollView>
    );
}