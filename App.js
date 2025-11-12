import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider } from 'react-native-paper';
import Main from './src/screens/Main';
import CreateAccount from './src/screens/CreateAccount';
import Login from './src/screens/Login';
import Home from './src/screens/Home';
import Settings from './src/screens/Settings';
import CreatePost from './src/screens/CreatePost';
// import Search from './src/screens/Search'
// import Profile from './src/screens/Profile';
// import ListFollow from './src/screens/ListFollow';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider> 
      <NavigationContainer> 
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen name="Main" component = {Main} options={{ headerShown: false }}/>
          <Stack.Screen name="CreateAccount" component = {CreateAccount} options={{ headerShown: false }}/>
          <Stack.Screen name="Login" component = {Login} options={{ headerShown: false }}/>
          <Stack.Screen name="Home" component = {Home} options={{ headerShown: false }}/>
          <Stack.Screen name='Settings' component={Settings} options={{ headerShown: false }} />
          <Stack.Screen name='CreatePost' component={CreatePost} options={{ headerShown: false }} />
          {/*
          <Stack.Screen name='Profile' component={Profile} options={{ headerShown: false }} />
          <Stack.Screen name="Search" component = {Search} options={{ headerShown: false }}/>
          <Stack.Screen name='ListFollow' component={ListFollow} options={{ headerShown: false }} />
          */}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
} 