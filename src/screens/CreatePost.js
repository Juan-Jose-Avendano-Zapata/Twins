import React, { useState } from "react";
import { View, Text, TextInput, Alert } from "react-native";
import { IconButton, Button } from "react-native-paper";
import { theme } from "../styles/theme";
import createPostStyles from "../styles/createPostStyles";

export default function CreatePost({ navigation }) {
    const [content, setContent] = useState("");

    // Lógica para publicar tweet
    const handlePost = () => {
        if (content.trim().length === 0) {
            Alert.alert("Error", "El mensaje no puede estar vacío.");
            return;
        }
        if (content.length > 280) {
            Alert.alert("Error", "El tweet no puede exceder los 280 caracteres.");
            return;
        }

        // Simulación de publicación
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

        console.log("Publicado:", newPost);
        Alert.alert("Publicado", "Twins compartido correctamente");
        navigation.goBack();
    };

    return (
        <View style={createPostStyles.container}>
            {/* Header */}
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
                    Publicar
                </Button>
            </View>

            {/* Campo de texto */}
            <View style={createPostStyles.inputContainer}>
                <TextInput
                    style={createPostStyles.input}
                    multiline
                    placeholder="¿Qué está pasando?"
                    placeholderTextColor={theme.Colors.text.secondary}
                    value={content}
                    onChangeText={setContent}
                    maxLength={280}
                />
            </View>

            {/* Contador de caracteres */}
            <View style={createPostStyles.actions}>
                <Text style={createPostStyles.counter}>{content.length}/280</Text>
            </View>
        </View>
    );
}
