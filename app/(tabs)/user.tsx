import { useAuth } from '@/context/authContext';
import React, { useState } from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity, StatusBar, ScrollView, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons, MaterialIcons, Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import useAppTheme, { ColorScheme } from '@/context/useAppTheme';


export default function UserProfileScreen() {
  const { user } = useAuth();
  console.log("user : ",user);
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const { isDarkMode, toggleDarkMode, colors } = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);

  return (
    <ScrollView
      style={styles.scroll}
      bounces={false}
      alwaysBounceVertical={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      <SafeAreaView style={styles.safe}>
        <LinearGradient
          colors={colors.gradients.background}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <View style={styles.avatarWrapper}>
              <Image source={{ uri: user?.picture }} style={styles.avatarImage} />
            </View>

            <Text style={styles.nameText}>{user?.name || "User"}</Text>
            <Text style={styles.emailText}>{user?.email}</Text>

            <TouchableOpacity style={styles.editProfileButton}>
              <View style={styles.editIconWrapper}>
                <MaterialCommunityIcons
                  name="account-edit"
                  size={24}
                  color={colors.textOnPrimary}
                />
              </View>
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          {/* Settings Panel */}
          <LinearGradient
            colors={colors.gradients.surface}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.gradientPanel}
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
                  trackColor={{
                    false: colors.controls.switchTrackOff,
                    true: colors.controls.switchTrackOn,
                  }}
                  thumbColor={
                    notificationsEnabled
                      ? colors.controls.switchThumbOn
                      : colors.controls.switchThumbOff
                  }
                />
              </View>

              {/* Dark Mode */}
              <View style={styles.row}>
                <View style={styles.rowLeft}>
                  <Feather name="sun" size={22} style={styles.rowIcon} />
                  <Text style={styles.rowLabel}>Dark Mode</Text>
                </View>

                <TouchableOpacity onPress={toggleDarkMode}>
                  <View style={styles.togglePill}>
                    <Feather
                      name={isDarkMode ? "moon" : "sun"}
                      size={16}
                      color={colors.text}
                    />
                  </View>
                </TouchableOpacity>
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

              {/* Refer */}
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
                <Entypo name="chevron-right" size={18} color={colors.textMuted} />
              </TouchableOpacity>

              {/* Terms */}
              <TouchableOpacity style={styles.row}>
                <View style={styles.rowLeft}>
                  <MaterialIcons
                    name="description"
                    size={22}
                    style={styles.rowIcon}
                  />
                  <Text style={styles.rowLabel}>Terms & Conditions</Text>
                </View>
                <Entypo name="chevron-right" size={18} color={colors.textMuted} />
              </TouchableOpacity>

              {/* Contact */}
              <TouchableOpacity style={styles.row}>
                <View style={styles.rowLeft}>
                  <Feather name="mail" size={22} style={styles.rowIcon} />
                  <Text style={styles.rowLabel}>Contact Us</Text>
                </View>
                <Entypo name="chevron-right" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </LinearGradient>
      </SafeAreaView>
    </ScrollView>
  );
}

const makeStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    scroll: { flex: 1, backgroundColor: colors.primary },
    safe: { flex: 1, backgroundColor: colors.primary },
    contentContainer: {
      backgroundColor: colors.bg,
      padding: 0,
      margin: 0,
    },
    headerGradient: {
      paddingTop: 60,
    },

    header: {
      alignItems: "center",
    },

    avatarWrapper: {
      width: 120,
      height: 120,
      borderRadius: 100,
      borderWidth: 3,
      borderColor: colors.border,
      overflow: "hidden",
      backgroundColor: colors.surface,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,
      shadowColor: colors.shadow,
      shadowOpacity: 0.15,
      shadowOffset: { width: 0, height: 3 },
      shadowRadius: 5,
      elevation: 4,
    },

    avatarImage: {
      width: "100%",
      height: "100%",
    },

    nameText: {
      fontSize: 24,
      fontWeight: "800",
      color: colors.textSecondary,
      marginBottom: 1,
    },
    emailText: {
      fontSize: 16,
      fontWeight: "300",
      color: colors.textSecondary,
      opacity: 0.9,
      marginBottom: 20,
    },

    editProfileButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 100,
      marginBottom: 40,
      backgroundColor: "rgba(255,255,255,0.15)",
    },
    editIconWrapper: {
      width: 30,
      height: 30,
      borderRadius: 100,
      backgroundColor: colors.surface,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 8,
    },
    editProfileText: {
      color: colors.textOnPrimary,
      fontWeight: "600",
    },

    gradientPanel: {
      flex: 1,
      paddingVertical: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },

    card: {
      width: "100%",
      paddingHorizontal: 16,
    },

    row: {
      backgroundColor: colors.card,
      borderRadius: 10,
      paddingVertical: 15,
      paddingHorizontal: 16,
      marginVertical: 6,
      flexDirection: "row",
      alignItems: "center",
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },

    rowLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },

    rowIcon: {
      marginRight: 16,
      color: colors.text,
    },

    rowLabel: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.text,
    },

    togglePill: {
      width: 48,
      height: 26,
      borderRadius: 13,
      backgroundColor: colors.backgrounds.input,
      justifyContent: "center",
      alignItems: "center",
    },
  });