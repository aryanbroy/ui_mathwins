import { Stack } from 'expo-router';
import { useAuth, AuthProvider } from '../context/authContext';
import { ActivityIndicator, View, AppState, Platform } from 'react-native';
import { ThemeProvider } from '@/context/useAppTheme';
import { useEffect } from 'react';
import { loadAppOpenAd, showAppOpenAd } from '@/components/Ads/appOpen';
import { ConfigProvider } from '@/context/useConfig';

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { FeedbackProvider } from '@/context/useFeedback';

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="editProfile" />
          </>
        ) : (
          <Stack.Screen name="login" />
        )}
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {

  const [fontsLoaded] = useFonts({
    'Saira-SemiBold': require('../assets/fonts/saira/Saira-SemiBold.ttf'),
    'Saira-Medium': require('../assets/fonts/saira/Saira-Medium.ttf'),
    'Poppins-Medium': require('../assets/fonts/poppins/Poppins-Medium.ttf'),
    'Rubik-Bold': require('../assets/fonts/rubik/Rubik-ExtraBold.ttf'),
    'Rubik-Medium': require('../assets/fonts/rubik/Rubik-Medium.ttf'),
    'Rubik-Light': require('../assets/fonts/rubik/Rubik-Light.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    loadAppOpenAd();

    setTimeout(() => {
      showAppOpenAd();
    }, 1500);

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        setTimeout(() => {
          showAppOpenAd();
        }, 500);
      }
    });

    return () => subscription.remove();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <FeedbackProvider>
        <ConfigProvider>
          <ThemeProvider>
            <RootNavigator />
          </ThemeProvider>
        </ConfigProvider>
      </FeedbackProvider>
    </AuthProvider>
  );
}