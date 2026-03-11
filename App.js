import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import MainNavigator from './src/navigation/MainNavigator';
import { AppDataProvider } from './src/context/AppDataContext';
import theme from './src/utils/theme';

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AppDataProvider>
          <NavigationContainer>
            <StatusBar style="light" backgroundColor="#1B5E20" />
            <MainNavigator />
          </NavigationContainer>
        </AppDataProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
