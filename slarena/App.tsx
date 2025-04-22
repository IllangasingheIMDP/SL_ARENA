import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';

type RootStackParamList={
  Home:undefined,
  Login:undefined,
  Register:undefined,
  Dashboard:undefined,
}

const Stack = createStackNavigator<RootStackParamList>();
export default function App(){
  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Welcome' }} />
          <Stack.Screen name="Login" component={() => null} />
        <Stack.Screen name="Register" component={() => null} />
        <Stack.Screen name="Dashboard" component={() => null} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}
