import { useEffect } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";

export default function OAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/user");
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Signing you in...</Text>
    </View>
  );
}
