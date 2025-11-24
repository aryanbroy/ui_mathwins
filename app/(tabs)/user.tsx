import { useAuth } from '@/context/authContext';
import React, { useState } from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity, StatusBar, ScrollView, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons, MaterialIcons, Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import useAppTheme from '@/context/useAppTheme';


export default function UserProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  const { user } = useAuth();
  const displayName = user?.name;
  const displayEmail = user?.email;
  const googleAvtar = user?.picture;

  const { isDarkMode } = useAppTheme();
  console.log("isDarkMode : ",isDarkMode);
  
  return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header / Avatar section */}
          <View style={styles.header}>
            <View style={styles.avatarWrapper}>
              <Image
                source={{ uri: googleAvtar }}
                style={styles.avatarImage}
              />
            </View>

            <Text style={styles.nameText}>{displayName}</Text>
            <Text style={styles.emailText}>{displayEmail}</Text>

            <TouchableOpacity style={styles.editProfileButton}>
              <View style={styles.editIconWrapper}>
                <MaterialCommunityIcons name="account-edit" size={24} color="#6A5AE0" />
              </View>
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          <LinearGradient
            colors={["#FFCCD7", "#6A5AE0"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.gradient}
          >
            <View style={styles.card}>
              {/* Notifications */}
              <View style={styles.row}>
                <View style={styles.rowLeft}>
                  <Feather name="bell" size={22} style={styles.rowIcon} />
                  <Text style={styles.rowLabel}>Notifications</Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{false: '#767577', true: '#81b0ff'}}
                  thumbColor={notificationsEnabled ? '#f4f3f4' : '#000'}
                  ios_backgroundColor="#3e3e3e"
                />
              </View>

              {/* Dark Mode */}
              <View style={styles.row}>
                <View style={styles.rowLeft}>
                  <Feather name="sun" size={22} style={styles.rowIcon} />
                  <Text style={styles.rowLabel}>Dark Mode</Text>
                </View>
                <View style={styles.togglePill}>
                  <Feather
                    name={isDarkMode ? "moon" : "sun"}
                    size={16}
                    color="#000"
                  />
                </View>
              </View>

              {/* Rate App */}
              <TouchableOpacity style={styles.row}>
                <View style={styles.rowLeft}>
                  <Ionicons
                    name="star"
                    size={22}
                    style={[styles.rowIcon, { color: "#FFC107" }]}
                  />
                  <Text style={styles.rowLabel}>Rate App</Text>
                </View>
              </TouchableOpacity>

              {/* Refer to earn */}
              <TouchableOpacity style={styles.row}>
                <View style={styles.rowLeft}>
                  <Feather name="share-2" size={22} style={styles.rowIcon} />
                  <Text style={styles.rowLabel}>Refer to earn</Text>
                </View>
              </TouchableOpacity>

              {/* Privacy Policy */}
              <TouchableOpacity style={styles.row}>
                <View style={styles.rowLeft}>
                  <Feather name="lock" size={22} style={styles.rowIcon} />
                  <Text style={styles.rowLabel}>Privacy Policy</Text>
                </View>
                <Entypo name="chevron-right" size={18} color="#B0B0B0" />
              </TouchableOpacity>

              {/* Terms & Conditions */}
              <TouchableOpacity style={styles.row}>
                <View style={styles.rowLeft}>
                  <MaterialIcons
                    name="description"
                    size={22}
                    style={styles.rowIcon}
                  />
                  <Text style={styles.rowLabel}>Terms & Conditions</Text>
                </View>
                <Entypo name="chevron-right" size={18} color="#B0B0B0" />
              </TouchableOpacity>

              {/* Contact Us */}
              <TouchableOpacity style={styles.row}>
                <View style={styles.rowLeft}>
                  <Feather name="mail" size={22} style={styles.rowIcon} />
                  <Text style={styles.rowLabel}>Contact Us</Text>
                </View>
                <Entypo name="chevron-right" size={18} color="#B0B0B0" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </ScrollView>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    paddingVertical: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  safe: {
    flex: 1,
    backgroundColor: "#6A5AE0",
  },
  header: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 32,
  },
  avatarWrapper: {
    width: 120,
    height: 120,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "#000",
    overflow: "hidden",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  nameText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 1,
  },
  emailText: {
    fontSize: 16,
    fontWeight: "300",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  editProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  editIconWrapper: {
    width: 30,
    height: 30,
    borderRadius: 100,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  editProfileText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  card: {
    width:"100%",
    paddingHorizontal: 16,
  },
  row: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical:15,
    paddingHorizontal: 16,
    marginVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#F0F0F0",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  rowIcon: {
    marginRight: 16,
    color: "#111111",
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111111",
  },
  togglePill: {
    width: 48,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
});

