import React, { useState } from "react";
import {View,Text,TextInput,StyleSheet,TouchableOpacity,Pressable,StatusBar} from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from 'react-native-safe-area-context';
import * as WebBrowser from "expo-web-browser"
import * as Google from "expo-auth-session/providers/google"
import { useAuth } from "../context/authContext";
import useAppTheme from "@/context/useAppTheme";
import BackgroundTexture from "@/components/BackgroundTexture";

type UserData = {
    name?: string;
    email?: string;
    picture?: string;
};
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [selectedTab, setSelectedTab] = useState<"login" | "signup">("login");
  const [phone, setPhone] = useState("");
  const { login } = useAuth();
  const {toggleDarkMode, isDarkMode } = useAppTheme(); 
  
  const [request, response, promptAsync] = Google.useAuthRequest({
      androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
      iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID, 
      webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID
  })

  const handleGoogleSignIn = async () => {
    try {
      await promptAsync();
      // response will update asynchronously and trigger the effect above
    } catch (e) {
      console.log("Error starting Google login:", e);
    }
  };

  React.useEffect(() => {
    handleSignInWithGoogle();
  }, [response]);
  async function handleSignInWithGoogle() {
    if (response?.type === "success") {
      const token = response.authentication?.accessToken;
      if (token) {
        const user = await getUserInfo(token);
        if (user) {
          // Tell the authContext that we are logged in
          console.log("login : ", token, " - - ", user);
          
          await login(user);
          // after this, app/_layout.tsx will see `user` and switch to (tabs)
        }
      }
    } else if (response?.type === "error") {
      console.log("Google login error:", response.error);
    }
  }
  const getUserInfo = async (token: string) => {
    try {
      const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = await res.json();
      // console.log("user :", user);
      return user; // return to handleSignInWithGoogle
    } catch (error) {
      console.log("Error fetching user info", error);
      return null;
    }
  };

  return (
    <LinearGradient
      colors={["#6315FF", "#FFCCD7"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
    <SafeAreaView style={styles.safe}>
      <BackgroundTexture></BackgroundTexture>
        <StatusBar barStyle="light-content" />
        <View style={styles.topSection}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Get Started now</Text>
            <Text style={styles.subtitle}>
              Create an account or log in to explore about our app
            </Text>
          </View>

          <View style={styles.themeToggleContainer}>
            <TouchableOpacity onPress={toggleDarkMode}>
              {
                isDarkMode ? 
                <View style={styles.themeToggleDark}>
                  <Text style={styles.themeIcon}>🌙</Text>
                </View> :
                <View style={styles.themeToggleLight}>
                  <Text style={styles.themeIcon}>☀️</Text>
                </View> 
              }
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <LinearGradient
            colors={isDarkMode ? ["#242424", "#000"] : ["#FFF", "#FFCCD7"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.gradient2}
          >
          <View style={styles.tabRow}>
            <Pressable
              style={[
                styles.tabButton,
                selectedTab === "login" && styles.tabButtonActive,
              ]}
              onPress={() => setSelectedTab("login")}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === "login" && styles.tabTextActive,
                ]}
              >
                Log In
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.tabButton,
                selectedTab === "signup" && styles.tabButtonActive,
              ]}
              onPress={() => setSelectedTab("signup")}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === "signup" && styles.tabTextActive,
                ]}
              >
                Sign Up
              </Text>
            </Pressable>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={isDarkMode ? styles.lebelDark : styles.label}>Enter phone number</Text>
            <TextInput
              style={styles.input}
              placeholder="+91 xxxx-xxx-xxx"
              placeholderTextColor="#A0A0A0"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Send OTP</Text>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
            <View style={styles.googleIcon}>
              <AntDesign name="google" size={24} color="black" />
            </View>
            <Text style={styles.googleText}>Continue with Google</Text>
          </TouchableOpacity>
          </LinearGradient>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const CARD_RADIUS = 20;
const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  gradient2: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    borderTopLeftRadius: CARD_RADIUS,
    borderTopRightRadius: CARD_RADIUS,
  },
  safe: {
    flex: 1,
  },
  topSection: {
    flex: 1,
  },
  headerTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#FFF",
  },
  themeToggleContainer: {
    position: "absolute",
    top: CARD_RADIUS,
    right: 24,
  },
  themeToggleLight: {
    width: 64,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.7)",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 5,
  },
  themeToggleDark: {
    width: 64,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 5,
  },
  themeIcon: {
    fontSize: 20,
    shadowColor: "#000",
    marginBottom: 2,
  },

  card: {
    flex: 1.4,
    // backgroundColor: "#FFF",
    // borderTopLeftRadius: CARD_RADIUS,
    // borderTopRightRadius: CARD_RADIUS,
    // paddingHorizontal: 24,
    // paddingTop: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },

  tabRow: {
    flexDirection: "row",
    marginBottom: 60,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 12,
  },
  tabButtonActive: {
    backgroundColor: "#6A4DFB",
  },
  tabRight: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#7F7F7F",
  },
  tabTextActive: {
    color: "#FFFFFF",
  },
  tabTextActiveRight: {
    color: "#000000",
  },

  fieldGroup: {
    marginBottom: 60,
  },
  label: {
    fontSize: 14,
    color: "#000",
    marginBottom: 8,
  },
  lebelDark: {
    fontSize: 14,
    color: "#6C7278",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#FFF",
    color: "#000",
  },
  inputDark: {
    borderWidth: 1,
    borderColor: "#FFF",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#FFF",
    color: "#828282",
  },
  primaryButton: {
    backgroundColor: "#6A4DFB",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 24,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#E3E3E3",
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 14,
    color: "#A0A0A0",
  },

  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  googleIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  googleText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333333",
  },
  secondaryButton: {
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333333",
  },
});
