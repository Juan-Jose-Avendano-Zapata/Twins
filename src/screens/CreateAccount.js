import React, { useState } from 'react';
import { ScrollView, View, Text, Image } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import CreateAccountStyles from '../styles/createAccuntStyles';

export default function CreateAccount({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');

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

                {/* Phone/Email Input */}
                <View style={CreateAccountStyles.inputContainer}>
                    <TextInput
                        label="Phone number or email address"
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

                {/* Date of Birth Input */}
                <View style={CreateAccountStyles.inputContainer}>
                    <TextInput
                        label="Date of birth"
                        mode="outlined"
                        value={dateOfBirth}
                        onChangeText={setDateOfBirth}
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
                    onPress={() => {}}
                >
                    Next
                </Button>
            </View>
        </ScrollView>
    );
}