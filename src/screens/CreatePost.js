import React, { useState } from "react";
import { View, Text, TextInput, Alert, Image, Platform, PermissionsAndroid } from "react-native";
import { IconButton, Button } from "react-native-paper";
import { theme } from "../styles/theme";
import createPostStyles from "../styles/createPostStyles";
import { postService } from "../firebase/services/postService";
import { launchImageLibrary } from "react-native-image-picker";
import { uploadMediaToCloudinary } from "../firebase/services/cloudinaryService";
import Video from "react-native-video";

export default function CreatePost({ navigation }) {
    const [content, setContent] = useState("");
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [loading, setLoading] = useState(false);

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

    const pickMedia = async () => {
        if (Platform.OS === "android") {
            const hasPermission = await requestAndroidPermission();
            if (!hasPermission) {
                Alert.alert("Permissions Required", "You must allow access to the gallery.");
                return;
            }
        }

        const options = {
            mediaType: "mixed",
            quality: 1,
            includeBase64: false,
            videoQuality: "high",
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                return;
            }

            if (response.errorCode) {
                return Alert.alert("Error", response.errorMessage);
            }

            const asset = response.assets?.[0];

            setSelectedAsset({
                uri: asset.uri,
                type: asset.type,
                fileName: asset.fileName
            });
        });
    };

    const handlePost = async () => {
        if (content.trim().length === 0) {
            return Alert.alert("Error", "The message cannot be empty.");
        }

        setLoading(true);

        let mediaUrl = "";

        try {
            if (selectedAsset) {
                mediaUrl = await uploadMediaToCloudinary(selectedAsset);

                if (!mediaUrl) {
                    setLoading(false);
                    return Alert.alert("Error", "Failed to upload the file.");
                }
            }

            const newPost = await postService.createPost(content, mediaUrl);

            if (newPost.success) {
                Alert.alert("Posted", "Post created successfully");
                navigation.goBack();
            } else {
                Alert.alert("Error", newPost.error || "Error creating post");
            }
        } catch (err) {
            Alert.alert("Error", err.message);
        }

        setLoading(false);
    };

    return (
        <View style={createPostStyles.container}>
            <View style={createPostStyles.header}>
                <IconButton
                    icon="close"
                    size={28}
                    onPress={() => navigation.goBack()}
                />
                <Button
                    mode="contained"
                    onPress={handlePost}
                    loading={loading}
                    disabled={loading}
                    style={createPostStyles.publishButton}
                >
                    Publish
                </Button>
            </View>

            <View style={createPostStyles.inputContainer}>
                <TextInput
                    style={createPostStyles.input}
                    multiline
                    placeholder="What's happening?"
                    placeholderTextColor={theme.Colors.text.secondary}
                    value={content}
                    onChangeText={setContent}
                    maxLength={280}
                />
            </View>

            {selectedAsset && (
                <View style={createPostStyles.imagePreview}>

                    {selectedAsset.type.includes("video") ? (
                        <Video
                            source={{ uri: selectedAsset.uri }}
                            style={{ width: "100%", height: 250, borderRadius: 12 }}
                            controls
                            resizeMode="cover"
                        />
                    ) : (
                        <Image
                            source={{ uri: selectedAsset.uri }}
                            style={createPostStyles.image}
                        />
                    )}

                    <IconButton
                        icon="close"
                        size={20}
                        style={createPostStyles.removeImage}
                        onPress={() => setSelectedAsset(null)}
                    />
                </View>
            )}

            <View style={createPostStyles.actions}>
                <IconButton
                    icon="image"
                    size={24}
                    onPress={pickMedia}
                    color={theme.Colors.primary}
                />
                <IconButton
                    icon="video"
                    size={24}
                    onPress={pickMedia}
                    color={theme.Colors.primary}
                />
                <Text style={createPostStyles.counter}>{content.length}/280</Text>
            </View>
        </View>
    );
}
