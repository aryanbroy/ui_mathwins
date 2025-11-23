import React, { useState } from "react";
import {View,Text,TextInput,StyleSheet,TouchableOpacity,Pressable,StatusBar} from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const [selectedTab, setSelectedTab] = useState<"login" | "signup">("login");
  const [phone, setPhone] = useState("");

  function loginWithGoogle(){
    console.log("Login Google");
    
  }

  return (
    <LinearGradient
      colors={["#6315FF", "#FFCCD7"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <StatusBar barStyle="light-content" />

      <SafeAreaView style={styles.safe}>
        <View style={styles.topSection}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Get Started now</Text>
            <Text style={styles.subtitle}>
              Create an account or log in to explore about our app
            </Text>
          </View>

          <View style={styles.themeToggleContainer}>
            <View style={styles.themeToggle}>
              <Text style={styles.themeIcon}>☀️</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
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

          <TouchableOpacity style={styles.googleButton} onPress={loginWithGoogle}>
            <View style={styles.googleIcon}>
              <AntDesign name="google" size={24} color="black" />
            </View>
            <Text style={styles.googleText}>Continue with Google</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const CARD_RADIUS = 20;

const styles = StyleSheet.create({
  gradient: {
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
  themeToggle: {
    width: 64,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 6,
  },
  themeIcon: {
    fontSize: 16,
  },

  card: {
    flex: 1.4,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: CARD_RADIUS,
    borderTopRightRadius: CARD_RADIUS,
    paddingHorizontal: 24,
    paddingTop: 24,
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
  input: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#000",
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
