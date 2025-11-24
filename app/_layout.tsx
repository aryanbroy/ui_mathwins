import { Stack } from "expo-router";
import { useAuth, AuthProvider } from "../context/authContext";
import { ActivityIndicator, View } from "react-native";

function RootNavigator() {
  const { user, loading } = useAuth();
  console.log(user);
  
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
      <Stack screenOptions={{ headerShown: false }}>
          {user ? (
            <Stack.Screen name="(tabs)" />   // protected tab routes
          ) : (
            <Stack.Screen name="login" />    // public
          )}
          {/* <Stack.Screen name="(tabs)" /> */}
      </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
