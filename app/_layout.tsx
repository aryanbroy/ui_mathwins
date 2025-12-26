import { Stack } from 'expo-router';
import { useAuth, AuthProvider } from '../context/authContext';
import { ActivityIndicator, View } from 'react-native';
import { ThemeProvider } from '@/context/useAppTheme';
import { useEffect } from 'react';
// import mobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads';

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
        {/* {user ? (
          <Stack.Screen name="(tabs)" />
          // <Stack.Screen name="edit-profile" />
        ) : (
          <Stack.Screen name="login" />
        )} */}
        {/**/}
        {/* <Stack.Screen name="login" /> */}
        <Stack.Screen name="(tabs)" />
        {/* <Stack.Screen name="edit-profile" /> */}
        {/* <Stack.Screen name="adScreen" /> */}
        {/* <Stack.Screen name="rewardHistory" /> */}
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  // useEffect(()=>{
  //   mobileAds()
  //     .setRequestConfiguration({
  //       maxAdContentRating: MaxAdContentRating.PG,
  //       tagForChildDirectedTreatment: true,
  //       tagForUnderAgeOfConsent: true,
  //       testDeviceIdentifiers: ['EMULATOR'],
  //     })
  //     .then(() => {
  //       return mobileAds().initialize();
  //     })
  //     .then(() => {
  //       console.log("AdMod Initialized");
  //     })
  //     .catch((error) => {
  //       console.error("AdMod Error : ", error);
  //     });

  // },[])
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
