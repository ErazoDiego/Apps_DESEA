import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { GameProvider } from './src/context/GameContext';
import HomeScreen from './src/screens/HomeScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import ModeSelectScreen from './src/screens/ModeSelectScreen';
import GameScreen from './src/screens/GameScreen';
import SavedCardsScreen from './src/screens/SavedCardsScreen';
import DailyLimitScreen from './src/screens/DailyLimitScreen';
import PaywallScreen from './src/screens/PaywallScreen';
import CustomDeckScreen from './src/screens/CustomDeckScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <GameProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: '#07000F' } }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="ModeSelect" component={ModeSelectScreen} />
          <Stack.Screen name="Game" component={GameScreen} />
          <Stack.Screen name="SavedCards" component={SavedCardsScreen} />
          <Stack.Screen name="DailyLimit" component={DailyLimitScreen} />
          <Stack.Screen name="Paywall" component={PaywallScreen} />
          <Stack.Screen name="CustomDeck" component={CustomDeckScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GameProvider>
  );
}