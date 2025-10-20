import React, { useState } from 'react';
import { ScrollView, View, Text, Image } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import styles from '../styles/styles';

export default function CreateAccount({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Logo Section */}
            <View style={styles.logoContainer}>
                <Image 
                    source={require('../assets/img/logoTW.png')} 
                    style={styles.logo} 
                />
            </View>

            {/* Title */}
            <Text style={styles.createAccountTitle}>Create your account</Text>

            {/* Form */}
            <View style={styles.formContainer}>
                {/* Name Input */}
                <View style={styles.inputContainer}>
                    <TextInput
                        label="Name"
                        mode="outlined"
                        value={name}
                        onChangeText={setName}
                        style={styles.textInput}
                        outlineStyle={styles.inputOutline}
                        theme={{
                            colors: {
                                primary: '#9e3d9c',
                                background: 'transparent',
                                text: 'white',
                                placeholder: '#71767B'
                            }
                        }}
                    />
                    <Text style={styles.characterCounter}>
                        {name.length}/50
                    </Text>
                </View>

                {/* Phone/Email Input */}
                <View style={styles.inputContainer}>
                    <TextInput
                        label="Phone number or email address"
                        mode="outlined"
                        value={email}
                        onChangeText={setEmail}
                        style={styles.textInput}
                        outlineStyle={styles.inputOutline}
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
                <View style={styles.inputContainer}>
                    <TextInput
                        label="Date of birth"
                        mode="outlined"
                        value={dateOfBirth}
                        onChangeText={setDateOfBirth}
                        style={styles.textInput}
                        outlineStyle={styles.inputOutline}
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
                    style={styles.nextButton}
                    contentStyle={styles.buttonContent}
                    labelStyle={styles.nextButtonLabel}
                    onPress={() => {}}
                >
                    Next
                </Button>
            </View>
        </ScrollView>
    );
}