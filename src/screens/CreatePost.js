import React, { useState } from "react";
import { View, Text, TextInput, Alert } from "react-native";
import { IconButton, Button } from "react-native-paper";
import { theme } from "../styles/theme";
import createPostStyles from "../styles/createPostStyles";

export default function CreatePost({ navigation }) {
    const [content, setContent] = useState("");

    // Logic to publish a tweet/post
    const handlePost = () => {
        if (content.trim().length === 0) {
            Alert.alert("Error", "The message cannot be empty.");
            return;
        }
        if (content.length > 280) {
            Alert.alert("Error", "The post cannot exceed 280 characters.");
            return;
        }

        // Simulated post publishing
        const newPost = {
            id: Date.now().toString(),
            name: "You",
            username: "@you",
            time: "Just now",
            content,
            comments: 0,
            retweets: 0,
            likes: 0,
        };

        console.log("Published:", newPost);
        Alert.alert("Published", "Post shared successfully");
        navigation.goBack();
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
                    placeholder="What’s happening?"
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
