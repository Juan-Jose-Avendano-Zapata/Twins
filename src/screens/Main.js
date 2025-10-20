import React from 'react';
import { ScrollView, View, Text, Image } from 'react-native';
import { Button } from 'react-native-paper';
import mainStyles from '../styles/mainStyles';

export default function Main({ navigation }) {



    return (
        <ScrollView contentContainerStyle={mainStyles.container}>

            {/* Logo Section */}
            <View style={mainStyles.logoContainer}>
                <Image source={require('../assets/img/logoTW.png')} style={mainStyles.logo} />
            </View>

            {/* Title Section */}
            <Text style={mainStyles.title}>See what's happening in the world right now.</Text>

            {/* Buttons Section */}
            <View style={mainStyles.buttonsContainer}>

                {/* Google Sign-In Button (Not functional)*/}
                <Button
                    mode="contained"
                    style={mainStyles.googleButton}
                    contentStyle={mainStyles.buttonContent}
                    labelStyle={mainStyles.googleButtonLabel}
                    icon={require('../assets/img/googleicon.png')}
                    onPress={() => { }}
                >
                    Continue with Google
                </Button>

                {/* Divider */}
                <View style={mainStyles.dividerContainer}>
                    <View style={mainStyles.dividerLine} />
                    <Text style={mainStyles.dividerText}>or</Text>
                    <View style={mainStyles.dividerLine} />
                </View>

                {/* Create Account Button */}
                <Button
                    mode="contained"
                    style={mainStyles.createAccountButton}
                    contentStyle={mainStyles.buttonContent}
                    labelStyle={mainStyles.createAccountButtonLabel}
                    onPress={() => { }}
                >
                    Create account
                </Button>

                {/* Terms and Conditions Text */}
                <Text style={mainStyles.termsText}>
                    By signing up, you agree to our Terms, Privacy Policy, and Cookie Use.
                </Text>
            </View>

            {/* Login Section */}
            <View style={mainStyles.loginContainer}>
                <Text style={mainStyles.loginText}>Have an account already? </Text>
                <Text style={mainStyles.loginLink}>Log in</Text>
            </View>
        </ScrollView>
    );
}