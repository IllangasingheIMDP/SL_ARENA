// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ScoreUpdateScreen from './screens/LiveScoreUpdate';
import AboutScreen from './screens/AboutScreen';
import PlayerDashboard from './screens/playerDashboard';
import { RootStackParamList } from './type';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Live Score" component={ScoreUpdateScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="Player Dashboard" component={PlayerDashboard} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
