import { Stack } from 'expo-router';
import { useAuth, AuthProvider } from '../context/authContext';
import { ActivityIndicator, View } from 'react-native';
import { ThemeProvider } from '@/context/useAppTheme';

function RootNavigator() {
  const { user, loading } = useAuth();
  console.log(user);

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
        {/* {user ? ( */}
        {/*     <Stack.Screen name="(tabs)" />   // protected tab routes */}
        {/*     // <Stack.Screen name="edit-profile" /> */}
        {/*   ) : ( */}
        {/*     <Stack.Screen name="login" />    // public */}
        {/*   )} */}
        {/**/}
        {/* <Stack.Screen name="login" /> */}
        <Stack.Screen name="(tabs)" />
        {/* <Stack.Screen name="edit-profile" /> */}
        {/* <Stack.Screen name="adScreen" /> */}
        {/* <Stack.Screen name="soloScoreboard" /> */}
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
