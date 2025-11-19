import React from "react";
import { View, Text } from "react-native";
import { IconButton } from "react-native-paper";
import settingsStyles from "../styles/settingsStyles";
import { theme } from "../styles/theme";
import { authService } from "../firebase/services/authService";

export default function Settings({ navigation }) {
    const handleLogout = async () => {
        try {
            const result = await authService.logout();
            if (result.success) {
                navigation.navigate("Main");
            } else {
                Alert.alert("Error", "Failed to log out: " + result.error);
            }
        } catch (error) {
            Alert.alert("Error", "An unexpected error occurred");
            console.error("Logout error:", error);
        }
    };

    return (
        <View style={settingsStyles.container}>
            {/* HEADER */}
            <View style={settingsStyles.header}>
                <IconButton
                    icon="arrow-left"
                    size={28}
                    onPress={() => navigation.goBack()}
                />
                <Text style={settingsStyles.title}>Settings</Text>
                {/* Invisible spacer to center the title */}
                <View style={{ width: 40 }} />
            </View>

            {/* MAIN SECTION */}
            <View style={settingsStyles.content}>
                <View style={settingsStyles.option} onTouchEnd={handleLogout}>
                    <IconButton
                        icon="logout"
                        size={30}
                        iconColor={theme.Colors.primary}
                    />
                    <Text style={settingsStyles.optionText}>Log out</Text>
                </View>
            </View>
        </View>
    );
}