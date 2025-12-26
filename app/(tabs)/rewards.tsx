import BackgroundTextTexture from '@/components/Texture/BackgroundTextTexture';
import useAppTheme, { ColorScheme } from '@/context/useAppTheme';
import { HomeScreenNavigationProp } from '@/types/tabTypes';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Rewards() {
  const [ coins, setCoins ] = useState(2134);
  const [ maxCoins, setMaxCoins ] = useState(5000);
  const [ today, setToday ] = useState(5);
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);

  return (
    <LinearGradient
      colors={[colors.gradients.surface[1], colors.gradients.surface[0]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.gradient}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <SafeAreaView style={styles.safe}>
          <BackgroundTextTexture></BackgroundTextTexture>
          <View style={styles.adArea1}>
            ad here
          </View>
          <View style={styles.screen}>
            <Text style={styles.headerTitle}>YOUR REWARDS</Text>
            <Text style={styles.headerSubtitle}>Guess what you have earned !!</Text>
          </View>
          <LinearGradient
            colors={["#FFB8C4", "#9087E5"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.gradient2}
          >
            <View style={styles.box}>
              <View style={styles.streakCard}>
                <View style={styles.streakContent}>
                  <View style={styles.emojiBox}>
                    <Text style={styles.emoji}>🎉</Text>
                  </View>
                  <View style={styles.streakTextContainer}>
                    <Text style={styles.streakTitle}>
                      No Breaks, Just Progress. Keep The Streak Alive
                    </Text>
                    <View style={styles.streakProgressContainer}>
                      {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                        <View key={day} style={styles.streakDayWrapper}>
                          <View
                            style={[
                              styles.streakDay,
                              day === today && styles.streakDayActive,
                              day === today+1 && styles.streakDayNext,
                            ]}
                          >
                            <Text
                              style={[
                                styles.streakDayText,
                              ]}
                            >
                              {day}
                            </Text>
                          </View>
                          {day < 7 && <View style={styles.streakConnector} />}
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.dailyLoginCard}>
                <View style={styles.dailyLoginContent}>
                  <Text style={styles.calendarIcon}>📅</Text>
                  <Text style={styles.dailyLoginText}>DAILY LOGIN REWARD</Text>
                </View>
                <TouchableOpacity style={styles.claimButton}>
                  <Text style={styles.claimButtonText}>CLAIM</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.coinsCard}>
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBarFill, { width: `${(coins / maxCoins) * 100}%` }]} />
                </View>
                <View style={styles.coinsInfo}>
                  <Text style={styles.coinIcon}>🪙</Text>
                  <Text style={styles.coinsText}>{coins}/{maxCoins} COINS</Text>
                </View>
                <TouchableOpacity style={styles.redeemButton}>
                  <Text style={styles.redeemButtonText}>REDEEM YOUR REWARDS</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.historyButton}>
                <Text style={styles.historyButtonText}>View Reward history</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
          <View style={styles.adArea2}>
            ad here
          </View>
      </SafeAreaView>
      </ScrollView>
    </LinearGradient>
  );
}

const makeStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    gradient: {
      width: "100%",
      flex: 1,
    },
    gradient2: {
      width: "100%",
      flex: 1,
      borderRadius: 20,
      paddingHorizontal: 10,
      paddingVertical: 20,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 20,
    },
    safe: {
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
    },
    screen: {
      width: "100%",
    },
    adArea1: {
      marginBottom: 10,
      backgroundColor: "#a1a1a1",
      width: "100%",
      height: 50,
    },
    headerTitle: {
      fontSize: 30,
      fontWeight: 900,
      color: '#FFF',
      textAlign: 'center',
      marginTop: 20,
    },
    headerSubtitle: {
      fontSize: 15,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 40,
    },
    box: {
      width: "100%",
      overflow: "hidden",
      borderRadius: 20,
      // paddingHorizontal: 10,
      // backgroundColor: "#ff0000ff"
    },
    streakCard: {
      // backgroundColor: '#FFF',
      maxWidth: "100%",
      minWidth: "100%",
      marginBottom: 16,
    },
    streakContent: {
      paddingHorizontal: 10,
      paddingVertical: 20,
      borderRadius: 20,
      backgroundColor: colors.bg,
      flex: 1,
      gap: 0,
      flexDirection: 'row',
      alignItems: "center",
      justifyContent: "space-between"
    },
    emojiBox: {
      width: 50,
      // backgroundColor: "#cacaca",
    },
    emoji: {
      fontSize: 30,
    },
    streakTextContainer: {
      flex: 1,
      alignItems: "flex-end"
    },
    streakTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 16,
    },
    streakProgressContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      // justifyContent: 'space-between',
      gap: 1,
    },
    streakDayWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    streakDay: {
      width: 30,
      height: 30,
      borderRadius: "100%",
      backgroundColor: '#E5E7EB',
      alignItems: 'center',
      justifyContent: 'center',
    },
    streakDayActive: {
      backgroundColor: '#FF6B9D',
    },
    streakDayNext: {
      backgroundColor: '#FFC0CB',
    },
    streakDayText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#000',
    },
    streakDayTextActive: {
      color: '#FFF',
    },
    streakConnector: {
      width: 10,
      height: 3,
      backgroundColor: '#E5E7EB',
      marginHorizontal: 2,
    },
    dailyLoginCard: {
      // minWidth: "100%",
      borderRadius: 20,
      padding: 20,
      marginBottom: 16,
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
      backgroundColor: colors.bg,
    },
    dailyLoginContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    calendarIcon: {
      fontSize: 30,
      marginRight: 12,
    },
    dailyLoginText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
    },
    claimButton: {
      backgroundColor: '#FF6B9D',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: colors.text,
    },
    claimButtonText: {
      fontSize: 15,
      fontWeight: 700,
      color: colors.textSecondary,
    },
    coinsCard: {
      backgroundColor: colors.bg,
      borderRadius: 20,
      padding: 20,
      marginBottom: 24,
    },
    progressBarContainer: {
      height: 20,
      backgroundColor: '#E5E7EB',
      borderRadius: 10,
      overflow: 'hidden',
    },
    progressBarFill: {
      height: '100%',
      backgroundColor: '#DC2626',
      borderRadius: 10,
    },
    coinsInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginBottom: 16,
    },
    coinIcon: {
      fontSize: 15,
      marginRight: 8,
    },
    coinsText: {
      fontSize: 10,
      fontWeight: 700,
      color: '#FF6B9D',
    },
    redeemButton: {
      backgroundColor: '#FF6B9D',
      paddingVertical: 10,
      borderRadius: 12,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.text,
    },
    redeemButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#FFF',
    },
    historyButton: {
      backgroundColor: '#FF6B9D',
      paddingVertical: 10,
      paddingHorizontal: 30,
      borderRadius: 10,
      alignSelf: 'center',
      borderWidth: 2,
      borderColor: "#000",
    },
    historyButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFF',
    },
    adArea2: {
      marginTop: 10,
      backgroundColor: "#a1a1a1",
      width: "100%",
      height: 200,
    }
  });
