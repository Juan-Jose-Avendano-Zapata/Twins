import React from "react";
import { View, Text } from "react-native";
import { IconButton } from "react-native-paper";
import settingsStyles from "../styles/settingsStyles";
import { theme } from "../styles/theme";

export default function Settings({ navigation }) {
  return (
    <View style={settingsStyles.container}>
      {/* HEADER */}
      <View style={settingsStyles.header}>
        <IconButton
          icon="arrow-left"
          size={28}
          onPress={() => navigation.goBack()}
        />
        <Text style={settingsStyles.title}>Configuración</Text>
        {/* Espaciador invisible para centrar el título */}
        <View style={{ width: 40 }} />
      </View>

      {/* SECCIÓN PRINCIPAL */}
      <View style={settingsStyles.content}>
        <View style={settingsStyles.option}>
          <IconButton
            icon="logout"
            size={30}
            onPress={() => navigation.navigate("Main")}
            iconColor={theme.Colors.primary}
          />
          <Text style={settingsStyles.optionText}>Cerrar sesión</Text>
        </View>
      </View>
    </View>
  );
}
