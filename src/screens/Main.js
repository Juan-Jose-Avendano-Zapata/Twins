import React from 'react';
import { ScrollView, View, Text, Image } from 'react-native';
import { Button } from 'react-native-paper';
import styles from '../styles/styles';

export default function Main({ navigation }) {



    return (
        <ScrollView contentContainerStyle={styles.container}>

            {/* Logo Section */}
            <View style={styles.logoContainer}>
                <Image source={require('../assets/img/logoTW.png')} style={styles.logo} />
            </View>

            {/* Title Section */}
            <Text style={styles.title}>See what's happening in the world right now.</Text>

            {/* Buttons Section */}
            <View style={styles.buttonsContainer}>

                {/* Google Sign-In Button (Not functional)*/}
                <Button
                    mode="contained"
                    style={styles.googleButton}
                    contentStyle={styles.buttonContent}
                    labelStyle={styles.googleButtonLabel}
                    icon={require('../assets/img/googleicon.png')}
                    onPress={() => { }}
                >
                    Continue with Google
                </Button>

                {/* Divider */}
                <View style={styles.dividerContainer}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>or</Text>
                    <View style={styles.dividerLine} />
                </View>

                {/* Create Account Button */}
                <Button
                    mode="contained"
                    style={styles.createAccountButton}
                    contentStyle={styles.buttonContent}
                    labelStyle={styles.createAccountButtonLabel}
                    onPress={() => { }}
                >
                    Create account
                </Button>

                {/* Terms and Conditions Text */}
                <Text style={styles.termsText}>
                    By signing up, you agree to our Terms, Privacy Policy, and Cookie Use.
                </Text>
            </View>

            {/* Login Section */}
            <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Have an account already? </Text>
                <Text style={styles.loginLink}>Log in</Text>
            </View>
        </ScrollView>
    );
}