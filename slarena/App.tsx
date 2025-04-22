// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ScoreUpdateScreen from './screens/LiveScoreUpdate'; // adjust the path if needed

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Live Score" component={ScoreUpdateScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
