import React, { useState } from "react";
import {View,Text,TextInput,StyleSheet,TouchableOpacity,Pressable,StatusBar} from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from 'react-native-safe-area-context';
import * as WebBrowser from "expo-web-browser"
import * as Google from "expo-auth-session/providers/google"
import { useAuth } from "../context/authContext";
import useAppTheme from "@/context/useAppTheme";
import BackgroundTexture from "@/components/Texture/BackgroundTexture";
import type { ColorScheme } from "@/context/useAppTheme";

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
  const {toggleDarkMode, isDarkMode, colors } = useAppTheme(); 
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  
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
        colors={colors.gradients.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safe}>
          <BackgroundTexture />
          <StatusBar barStyle={colors.statusBarStyle} />

          <View style={styles.topSection}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.title}>Get Started now</Text>
              <Text style={styles.subtitle}>
                Create an account or log in to explore about our app
              </Text>
            </View>

            <View style={styles.themeToggleContainer}>
              <TouchableOpacity onPress={toggleDarkMode}>
                {isDarkMode ? (
                  <View style={styles.themeToggleDark}>
                    <Text style={styles.themeIcon}>🌙</Text>
                  </View>
                ) : (
                  <View style={styles.themeToggleLight}>
                    <Text style={styles.themeIcon}>☀️</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.card}>
            <LinearGradient
              colors={colors.gradients.surface}
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
                <Text style={styles.label}>Enter phone number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+91 xxxx-xxx-xxx"
                  placeholderTextColor={colors.textMuted}
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

              <TouchableOpacity
                style={styles.googleButton}
                onPress={handleGoogleSignIn}
              >
                <View style={styles.googleIcon}>
                  <AntDesign name="google" size={24} color={`${colors.text}`} />
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
const makeStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    gradient: {
      flex: 1,
    },
    gradient2: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 24,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
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
      marginBottom: 10,
      textAlign: "center",
      color: colors.textOnPrimary,
    },
    subtitle: {
      fontSize: 14,
      textAlign: "center",
      color: colors.textOnPrimary,
    },
    themeToggleContainer: {
      position: "absolute",
      top: 20,
      right: 24,
    },
    themeToggleLight: {
      width: 64,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.surface,
      justifyContent: "center",
      alignItems: "flex-end",
      paddingHorizontal: 5,
    },
    themeToggleDark: {
      width: 64,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.surface,
      justifyContent: "center",
      alignItems: "flex-start",
      paddingHorizontal: 5,
    },
    themeIcon: {
      fontSize: 20,
      shadowColor: colors.shadow,
      marginBottom: 2,
    },

    card: {
      flex: 1.4,
      shadowColor: colors.shadow,
      shadowOpacity: 0.12,
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
      backgroundColor: colors.primary,
    },
    tabText: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.textMuted,
    },
    tabTextActive: {
      color: colors.textOnPrimary,
    },

    fieldGroup: {
      marginBottom: 60,
    },
    label: {
      fontSize: 14,
      color: colors.text,
      marginBottom: 8,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      paddingVertical: 12,
      paddingHorizontal: 16,
      fontSize: 16,
      backgroundColor: colors.backgrounds.input,
      color: colors.text,
    },

    primaryButton: {
      backgroundColor: colors.primary,
      borderRadius: 10,
      paddingVertical: 14,
      alignItems: "center",
      marginBottom: 24,
    },
    primaryButtonText: {
      color: colors.textOnPrimary,
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
      backgroundColor: colors.divider,
    },
    dividerText: {
      marginHorizontal: 12,
      fontSize: 14,
      color: colors.textMuted,
    },

    googleButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderRadius: 10,
      paddingVertical: 12,
      backgroundColor: colors.surface,
      borderColor: colors.border,
      shadowColor: colors.shadow,
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
      marginBottom: 16,
    },
    googleIcon: {
      width: 26,
      height: 26,
      borderRadius: 13,
      // backgroundColor: "#FFFFFF",
      // borderWidth: 1,
      // borderColor: "#E0E0E0",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    googleText: {
      fontSize: 15,
      fontWeight: "500",
      color: colors.text,
    },
    secondaryButton: {
      borderRadius: 24,
      paddingVertical: 12,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },
    secondaryButtonText: {
      fontSize: 15,
      fontWeight: "500",
      color: colors.text,
    },
  });
