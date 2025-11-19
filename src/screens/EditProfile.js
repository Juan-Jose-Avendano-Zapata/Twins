import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Image, Alert, Platform, PermissionsAndroid } from 'react-native';
import { TextInput, Button, IconButton } from 'react-native-paper';
import CreateAccountStyles from '../styles/createAccuntStyles';
import { authService } from '../firebase/services/authService';
import { launchImageLibrary } from "react-native-image-picker";
import { uploadMediaToCloudinary } from "../firebase/services/cloudinaryService";
import { userService } from '../firebase/services/userService';

export default function EditProfile({ navigation, route }) {
    const [name, setName] = useState('');
    const [username, setUserName] = useState('');
    const [loading, setLoading] = useState(false);
    const [profilePicture, setProfilePicture] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        loadCurrentProfile();
    }, []);

    const loadCurrentProfile = async () => {
        try {
            setLoading(true);
            const user = authService.getCurrentUser();
            if (!user) {
                Alert.alert('Error', 'User not authenticated');
                navigation.goBack();
                return;
            }

            setCurrentUser(user);

            const userProfile = await userService.getUserProfile(user.uid);
            if (userProfile.success) {
                const data = userProfile.data;
                const profile = data.profile || {};
                
                setName(profile.name || '');
                setUserName(data.username || '');
                
                if (profile.avatar && profile.avatar !== "" && profile.avatar !== "~") {
                    setProfilePicture({
                        uri: profile.avatar,
                        type: 'image/jpeg',
                        fileName: 'current-avatar.jpg'
                    });
                }
            }
        } catch (error) {
            console.error('Error loading profile:', error);
            Alert.alert('Error', 'Could not load profile data');
        } finally {
            setLoading(false);
        }
    };

    const requestAndroidPermission = async () => {
        try {
            if (Platform.OS === "android") {
                if (Platform.Version >= 33) {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
                    );
                    return granted === PermissionsAndroid.RESULTS.GRANTED;
                } else {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
                    );
                    return granted === PermissionsAndroid.RESULTS.GRANTED;
                }
            }
            return true;
        } catch (err) {
            console.warn("Error requesting permissions:", err);
            return false;
        }
    };

    const pickProfilePicture = async () => {
        if (Platform.OS === "android") {
            const hasPermission = await requestAndroidPermission();
            if (!hasPermission) {
                Alert.alert("Permissions Required", "You need to allow gallery access.");
                return;
            }
        }

        const options = {
            mediaType: "photo",
            quality: 0.8,
            includeBase64: false,
            maxWidth: 800,
            maxHeight: 800,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) return;

            if (response.errorCode) return Alert.alert("Error", response.errorMessage);

            const asset = response.assets?.[0];
            setProfilePicture({
                uri: asset.uri,
                type: asset.type,
                fileName: asset.fileName
            });
        });
    };

    const handleUpdateProfile = async () => {
        if (!name.trim() || !username.trim()) {
            Alert.alert('Error', 'Please fill all required fields');
            return;
        }

        if (name.length > 50) {
            Alert.alert('Error', 'Name cannot exceed 50 characters');
            return;
        }

        setLoading(true);

        try {
            let profilePictureUrl = "";

            // Upload new profile picture if selected
            if (profilePicture && !profilePicture.uri.startsWith('http')) {
                profilePictureUrl = await uploadMediaToCloudinary(profilePicture);
                
                if (!profilePictureUrl) {
                    setLoading(false);
                    return Alert.alert('Error', 'Error uploading profile picture');
                }
            } else if (profilePicture && profilePicture.uri.startsWith('http')) {
                profilePictureUrl = profilePicture.uri;
            }

            const updateData = {
                name: name.trim(),
                username: username.trim(),
                avatar: profilePictureUrl
            };

            const result = await authService.updateProfile(updateData);
            
            if (result.success) {
                Alert.alert('Success', 'Profile updated successfully');
                
                navigation.goBack();
            } else {
                Alert.alert('Error', result.error);
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred');
            console.error('Error updating profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUsernameChange = (text) => {
        const filteredText = text.replace(/\s/g, '');
        setUserName(filteredText);
    };

    return (
        <ScrollView contentContainerStyle={CreateAccountStyles.container}>
            <View style={CreateAccountStyles.logoContainer}>
                <Image 
                    source={require('../assets/img/logoTW.png')} 
                    style={CreateAccountStyles.logo} 
                />
            </View>

            <Text style={CreateAccountStyles.title}>Edit your profile</Text>

            <View style={CreateAccountStyles.profilePictureContainer}>
                <View style={CreateAccountStyles.profilePictureWrapper}>
                    {profilePicture ? (
                        <Image 
                            source={{ uri: profilePicture.uri }} 
                            style={CreateAccountStyles.profilePicture} 
                        />
                    ) : (
                        <View style={CreateAccountStyles.profilePicturePlaceholder}>
                            <Text style={CreateAccountStyles.profilePictureText}>
                                Add Photo
                            </Text>
                        </View>
                    )}
                    
                    <IconButton
                        icon="camera"
                        size={20}
                        style={CreateAccountStyles.cameraButton}
                        onPress={pickProfilePicture}
                        disabled={loading}
                    />
                </View>
                
                {profilePicture && (
                    <Button
                        mode="text"
                        onPress={() => setProfilePicture(null)}
                        disabled={loading}
                        style={CreateAccountStyles.removePhotoButton}
                        labelStyle={CreateAccountStyles.removePhotoButtonLabel}
                    >
                        Remove Photo
                    </Button>
                )}
            </View>

            <View style={CreateAccountStyles.formContainer}>
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

                <Button
                    mode="contained"
                    style={[
                        CreateAccountStyles.nextButton,
                        loading && { opacity: 0.6 }
                    ]}
                    contentStyle={CreateAccountStyles.buttonContent}
                    labelStyle={CreateAccountStyles.nextButtonLabel}
                    onPress={handleUpdateProfile}
                    disabled={loading}
                    loading={loading}
                >
                    {loading ? 'Updating Profile...' : 'Update Profile'}
                </Button>

                <Button
                    mode="contained"
                    style={[
                        CreateAccountStyles.backButton,
                        loading && { opacity: 0.6 }
                    ]}
                    contentStyle={CreateAccountStyles.buttonContent}
                    labelStyle={CreateAccountStyles.backButtonLabel}
                    onPress={() => navigation.goBack()}
                    disabled={loading}
                >
                    Cancel
                </Button>
            </View>
        </ScrollView>
    );
}
