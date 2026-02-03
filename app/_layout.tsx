import { Stack } from 'expo-router';
import { useAuth, AuthProvider } from '../context/authContext';
import { ActivityIndicator, View, AppState, Platform } from 'react-native';
import { ThemeProvider } from '@/context/useAppTheme';
import { useEffect, useRef } from 'react';
import { loadAppOpenAd, showAppOpenAd } from '@/components/Ads/appOpen';

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
          <Stack.Screen name="(tabs)" />
        ) : (
          <Stack.Screen name="login" />
        )}
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const shownOnce = useRef(false);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    loadAppOpenAd();

    setTimeout(() => {
      // console.log('[AppOpen] cold start show');
      showAppOpenAd();
    }, 1500);

    const subscription = AppState.addEventListener('change', (state) => {
      // console.log('[AppState]', state);

      if (state === 'active') {
        setTimeout(() => {
          // console.log('[AppOpen] resume show');
          showAppOpenAd();
        }, 500);
      }
    });

    return () => subscription.remove();
  }, []);
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

