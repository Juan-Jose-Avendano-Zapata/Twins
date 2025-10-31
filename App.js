import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider } from 'react-native-paper';
import Main from './src/screens/Main';
import CreateAccount from './src/screens/CreateAccount';
import Login from './src/screens/Login';
import Home from './src/screens/Home';
import Profile from './src/screens/Profile';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Profile">
          <Stack.Screen name="Main" component = {Main} options={{ headerShown: false }}/>
          <Stack.Screen name="CreateAccount" component = {CreateAccount} options={{ headerShown: false }}/>
          <Stack.Screen name="Login" component = {Login} options={{ headerShown: false }}/>
          <Stack.Screen name="Home" component = {Home} options={{ headerShown: false }}/>
          <Stack.Screen name='Profile' component={Profile} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
} 