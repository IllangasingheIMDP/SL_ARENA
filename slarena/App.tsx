import React from 'react';
import { StatusBar } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';

export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <StatusBar barStyle="light-content" />
        <AppNavigator />
      </AuthProvider>
    </PaperProvider>
  );
}
