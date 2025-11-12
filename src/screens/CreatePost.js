import React, { useState } from "react";
import { View, Text, TextInput, Alert } from "react-native";
import { IconButton, Button } from "react-native-paper";
import { theme } from "../styles/theme";
import createPostStyles from "../styles/createPostStyles";
import { postService } from "../firebase/services/postService";

export default function CreatePost({ navigation }) {
    const [content, setContent] = useState("");

    // Logic to publish a tweet/post
    const handlePost = async () => {
        // Validate content
        if (content.trim().length === 0) {
            Alert.alert("Error", "The message cannot be empty.");
            return;
        }
        if (content.length > 280) {
            Alert.alert("Error", "The post cannot exceed 280 characters.");
            return;
        }
        
        // Create the post
        try {
            const newPost = await postService.createPost(content, "");

            if (newPost.success) {
                console.log("Published:", newPost);
                Alert.alert("Published", "Post shared successfully");
                navigation.goBack();
            } else {
                Alert.alert("Error", "Failed to share post: " + newPost.error);
            }
        } catch (error) {
            Alert.alert("Error", "Failed to share post: " + error.message);
        }
    };

    return (
        <View style={createPostStyles.container}>
            {/* HEADER */}
            <View style={createPostStyles.header}>
                <IconButton
                    icon="close"
                    size={28}
                    onPress={() => navigation.goBack()}
                />
                <Button
                    mode="contained"
                    onPress={handlePost}
                    style={createPostStyles.publishButton}
                >
                    Publish
                </Button>
            </View>

            {/* TEXT FIELD */}
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

            {/* CHARACTER COUNTER */}
            <View style={createPostStyles.actions}>
                <Text style={createPostStyles.counter}>{content.length}/280</Text>
            </View>
        </View>
    );
}